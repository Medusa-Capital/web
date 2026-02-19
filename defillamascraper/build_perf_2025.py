#!/usr/bin/env python3
"""Build 2025 month-end cumulative performance chart inputs.

Outputs:
- mapping.csv
- raw_prices_used.csv
- summary_month_end.csv
- audit_log.txt
"""

from __future__ import annotations

import csv
import json
import os
import sys
from dataclasses import dataclass
from datetime import date, datetime, time, timezone, timedelta
from typing import Dict, List, Optional, Tuple

import pandas as pd
import requests
import yfinance as yf

GLOBAL_AUDIT: List[str] = []


# ---------------------------
# Configuration
# ---------------------------
BASELINE_DATE = "2024-12-31"
MONTH_ENDS_2025 = [
    "2025-01-31",
    "2025-02-28",
    "2025-03-31",
    "2025-04-30",
    "2025-05-31",
    "2025-06-30",
    "2025-07-31",
    "2025-08-31",
    "2025-09-30",
    "2025-10-31",
    "2025-11-30",
    "2025-12-31",
]
REBALANCE_DATES = ["2025-08-12", "2025-11-08"]

TOKEN_IDS_FILE = "token_ids.json"

CRYPTO_TICKERS = ["BTC", "HYPE", "SYRUP", "META", "PUMP"]

SP_TICKERS_TRY = ["^SP500TR", "^SPXTR", "SPY"]

AUDIT_LOG_FILE = "audit_log.txt"


# ---------------------------
# Utilities
# ---------------------------

def parse_date(d: str) -> date:
    return datetime.strptime(d, "%Y-%m-%d").date()


def end_of_day_timestamp(d: date) -> int:
    dt = datetime.combine(d, time(23, 59, 59), tzinfo=timezone.utc)
    return int(dt.timestamp())


def redacted_url(full_url: str) -> str:
    # Replace the API key segment with <KEY>
    # Expected: https://pro-api.llama.fi/<KEY>/... 
    parts = full_url.split("/", 4)
    if len(parts) >= 5 and parts[2] == "pro-api.llama.fi":
        return f"{parts[0]}//{parts[2]}/<KEY>/{parts[4]}"
    return full_url


def ensure_token_ids(tokens: Dict[str, str]) -> None:
    missing = [t for t in CRYPTO_TICKERS if t not in tokens]
    if missing:
        raise ValueError(f"token_ids.json missing keys: {missing}")


def write_audit(log_lines: List[str]) -> None:
    with open(AUDIT_LOG_FILE, "w", encoding="utf-8") as f:
        for line in log_lines:
            f.write(line.rstrip("\n") + "\n")


@dataclass
class LlamaResponse:
    data: dict
    status_code: int
    url: str


class LlamaClient:
    def __init__(self, api_key: str, audit: List[str]) -> None:
        self.api_key = api_key
        self.base_url = f"https://pro-api.llama.fi/{api_key}"
        self.audit = audit

    def _log(self, message: str) -> None:
        self.audit.append(message)

    def get(self, endpoint: str, params: Optional[dict] = None) -> LlamaResponse:
        url = f"{self.base_url}{endpoint}"
        redacted = redacted_url(url)
        if params:
            self._log(f"GET {redacted} params={params}")
        else:
            self._log(f"GET {redacted}")
        resp = requests.get(url, params=params, timeout=60)
        return LlamaResponse(data=resp.json(), status_code=resp.status_code, url=redacted)

    def post(self, endpoint: str, payload: dict) -> LlamaResponse:
        url = f"{self.base_url}{endpoint}"
        redacted = redacted_url(url)
        self._log(f"POST {redacted}")
        self._log(f"POST body: {json.dumps(payload, sort_keys=True)}")
        resp = requests.post(url, json=payload, timeout=120)
        return LlamaResponse(data=resp.json(), status_code=resp.status_code, url=redacted)


# ---------------------------
# DefiLlama parsing helpers
# ---------------------------

def extract_coins_dict(resp: dict) -> dict:
    # Try common top-level keys
    if isinstance(resp, dict):
        for key in ("coins", "data"):
            if key in resp and isinstance(resp[key], dict):
                return resp[key]
    return resp if isinstance(resp, dict) else {}


def parse_current_prices(resp: dict, coin_ids: List[str], audit: List[str]) -> Dict[str, dict]:
    coins_dict = extract_coins_dict(resp)
    out: Dict[str, dict] = {}
    for coin_id in coin_ids:
        coin_info = coins_dict.get(coin_id)
        if not isinstance(coin_info, dict):
            audit.append(f"NA current price: missing coin entry for {coin_id}")
            out[coin_id] = {}
        else:
            out[coin_id] = coin_info
    return out


def parse_first_prices(resp: dict, coin_ids: List[str], audit: List[str]) -> Dict[str, dict]:
    coins_dict = extract_coins_dict(resp)
    out: Dict[str, dict] = {}
    for coin_id in coin_ids:
        coin_info = coins_dict.get(coin_id)
        if not isinstance(coin_info, dict):
            audit.append(f"NA first price: missing coin entry for {coin_id}")
            out[coin_id] = {}
        else:
            out[coin_id] = coin_info
    return out


def parse_batch_historical(resp: dict, audit: List[str]) -> Dict[str, Dict[int, Optional[float]]]:
    # Returns coin_id -> {timestamp: price}
    coins_dict = extract_coins_dict(resp)
    out: Dict[str, Dict[int, Optional[float]]] = {}
    for coin_id, payload in coins_dict.items():
        prices_map: Dict[int, Optional[float]] = {}
        if isinstance(payload, dict):
            # Possible formats: {"prices": [...]} or {"prices": {ts: price}}
            if "prices" in payload:
                prices = payload.get("prices")
                if isinstance(prices, list):
                    for item in prices:
                        if isinstance(item, dict):
                            ts = item.get("timestamp")
                            price = item.get("price")
                            if ts is not None:
                                prices_map[int(ts)] = price
                elif isinstance(prices, dict):
                    for k, v in prices.items():
                        try:
                            prices_map[int(k)] = v
                        except Exception:
                            continue
            else:
                # maybe already mapping timestamps to prices
                for k, v in payload.items():
                    try:
                        prices_map[int(k)] = v
                    except Exception:
                        continue
        elif isinstance(payload, list):
            for item in payload:
                if isinstance(item, dict):
                    ts = item.get("timestamp")
                    price = item.get("price")
                    if ts is not None:
                        prices_map[int(ts)] = price
        else:
            audit.append(f"Unrecognized batchHistorical payload for {coin_id}")
        out[coin_id] = prices_map
    return out


def parse_historical_single(resp: dict, audit: List[str]) -> Dict[str, dict]:
    coins_dict = extract_coins_dict(resp)
    out: Dict[str, dict] = {}
    for coin_id, payload in coins_dict.items():
        if isinstance(payload, dict):
            out[coin_id] = payload
        else:
            audit.append(f"Unrecognized historical payload for {coin_id}")
            out[coin_id] = {}
    return out


# ---------------------------
# S&P 500 fetch
# ---------------------------

def fetch_sp500_monthly(audit: List[str]) -> Tuple[str, Dict[Tuple[int, int], float]]:
    """Try tickers in order. Return (series_name, map of (year, month)->value)."""
    for ticker in SP_TICKERS_TRY:
        try:
            df = yf.download(
                ticker,
                start="2024-12-01",
                end="2026-01-10",
                interval="1mo",
                auto_adjust=False,
                progress=False,
            )
        except Exception as exc:
            audit.append(f"yfinance error for {ticker}: {exc}")
            continue

        if df is None or df.empty:
            audit.append(f"yfinance empty for {ticker}")
            continue

        # yfinance returns a multi-index if multiple tickers; handle single
        if isinstance(df.columns, pd.MultiIndex):
            if ticker in df.columns.levels[0]:
                df = df[ticker]

        # Determine value column
        if ticker == "SPY":
            if "Adj Close" in df.columns:
                value_col = "Adj Close"
                series_name = "SPY Adj Close"
            else:
                value_col = "Close"
                series_name = "SPY Close"
        else:
            value_col = "Close" if "Close" in df.columns else df.columns[-1]
            series_name = ticker

        # Use last available value in each month
        df = df.dropna(subset=[value_col])
        if df.empty:
            audit.append(f"yfinance no usable data for {ticker}")
            continue

        monthly = (
            df[[value_col]]
            .copy()
            .assign(year=lambda x: x.index.year, month=lambda x: x.index.month)
            .groupby(["year", "month"])  # last available in month
            .last()
        )

        values = {(int(y), int(m)): float(v[value_col]) for (y, m), v in monthly.iterrows()}

        # Log raw rows used
        used_rows = []
        for (y, m), v in values.items():
            used_rows.append(f"{y}-{m:02d}: {v}")
        audit.append(f"S&P series chosen: {series_name}")
        audit.append(f"S&P raw month values: {', '.join(used_rows)}")

        # Ensure baseline month exists
        if (2024, 12) not in values:
            audit.append(f"Baseline month missing for {ticker}; trying next ticker")
            continue

        return series_name, values

    raise RuntimeError("Failed to fetch any S&P 500 series with baseline data")


# ---------------------------
# Basket computation
# ---------------------------

def compute_basket_values(
    prices_by_date: Dict[str, Dict[str, Optional[float]]],
    audit: List[str],
) -> Dict[str, Optional[float]]:
    """Compute basket values for baseline and month-ends only."""
    baseline = parse_date(BASELINE_DATE)
    month_end_dates = [parse_date(d) for d in [BASELINE_DATE] + MONTH_ENDS_2025]
    rebalance_dates = [parse_date(d) for d in REBALANCE_DATES]

    # Units dict for active coins
    units: Dict[str, float] = {}
    basket_values: Dict[str, Optional[float]] = {}

    # Initialize at baseline
    base_prices = prices_by_date.get(BASELINE_DATE, {})
    base_hype = base_prices.get("HYPE")
    base_syrup = base_prices.get("SYRUP")
    if base_hype is None or base_syrup is None:
        audit.append("Basket baseline missing HYPE/SYRUP price; basket values set to NA")
        for d in month_end_dates:
            basket_values[d.isoformat()] = None
        return basket_values

    units["HYPE"] = (1.0 / 2.0) / base_hype
    units["SYRUP"] = (1.0 / 2.0) / base_syrup
    basket_values[BASELINE_DATE] = 1.0

    rebalance_index = 0
    rebalance_failed = False

    for d in month_end_dates[1:]:
        # Apply rebalances up to this date
        while rebalance_index < len(rebalance_dates) and rebalance_dates[rebalance_index] <= d:
            rb_date = rebalance_dates[rebalance_index]
            rb_key = rb_date.isoformat()
            rb_prices = prices_by_date.get(rb_key, {})

            # Determine active set
            if rb_key == "2025-08-12":
                active = ["HYPE", "SYRUP", "META"]
            elif rb_key == "2025-11-08":
                active = ["HYPE", "SYRUP", "META", "PUMP"]
            else:
                active = list(units.keys())

            # Compute current value using existing units
            needed_for_value = list(units.keys())
            missing_for_value = [c for c in needed_for_value if rb_prices.get(c) is None]
            if missing_for_value:
                audit.append(
                    f"Rebalance {rb_key} missing prices for {missing_for_value}; basket values set to NA from this date"
                )
                rebalance_failed = True
                units = {}
                break

            v_rb = sum(units[c] * rb_prices[c] for c in needed_for_value)

            # Update units equally among active
            missing_for_rebalance = [c for c in active if rb_prices.get(c) is None]
            if missing_for_rebalance:
                audit.append(
                    f"Rebalance {rb_key} missing prices for {missing_for_rebalance}; basket values set to NA from this date"
                )
                rebalance_failed = True
                units = {}
                break

            units = {c: (v_rb / len(active)) / rb_prices[c] for c in active}
            audit.append(f"Rebalanced on {rb_key} across {active}")
            rebalance_index += 1

        if rebalance_failed:
            basket_values[d.isoformat()] = None
            continue

        # Compute value on month-end date
        prices = prices_by_date.get(d.isoformat(), {})
        missing = [c for c in units.keys() if prices.get(c) is None]
        if missing:
            audit.append(f"Basket value {d.isoformat()} missing prices for {missing}; NA")
            basket_values[d.isoformat()] = None
        else:
            basket_values[d.isoformat()] = sum(units[c] * prices[c] for c in units.keys())

    return basket_values


# ---------------------------
# Main
# ---------------------------

def main() -> None:
    audit = GLOBAL_AUDIT
    audit.clear()

    api_key = os.getenv("DEFILLAMA_API_KEY")
    if not api_key:
        raise RuntimeError("DEFILLAMA_API_KEY env var not set")

    # Load token IDs
    if not os.path.exists(TOKEN_IDS_FILE):
        raise FileNotFoundError(f"{TOKEN_IDS_FILE} not found. Create it with DefiLlama coin IDs.")

    with open(TOKEN_IDS_FILE, "r", encoding="utf-8") as f:
        token_ids = json.load(f)

    ensure_token_ids(token_ids)

    llama = LlamaClient(api_key, audit)

    # Validate IDs with current prices
    coin_ids = [token_ids[t] for t in CRYPTO_TICKERS]
    coins_param = ",".join(coin_ids)

    current_resp = llama.get(f"/coins/prices/current/{coins_param}")
    current_info = parse_current_prices(current_resp.data, coin_ids, audit)

    first_resp = llama.get(f"/coins/prices/first/{coins_param}")
    first_info = parse_first_prices(first_resp.data, coin_ids, audit)

    # Validate META/PUMP start dates
    def parse_first_ts(info: dict) -> Optional[int]:
        if not info:
            return None
        for key in ("timestamp", "time", "date"):
            if key in info:
                try:
                    return int(info[key])
                except Exception:
                    pass
        return None

    def validate_start(ticker: str, ref_date: str) -> None:
        coin_id = token_ids[ticker]
        ts = parse_first_ts(first_info.get(coin_id, {}))
        if ts is None:
            raise RuntimeError(f"Missing first price timestamp for {ticker} ({coin_id})")
        first_dt = datetime.fromtimestamp(ts, tz=timezone.utc).date()
        ref_dt = parse_date(ref_date)
        if first_dt < (ref_dt - timedelta(days=30)):
            raise RuntimeError(
                f"{ticker} first price {first_dt.isoformat()} is far earlier than expected {ref_date}; check token id"
            )
        audit.append(f"{ticker} first price timestamp: {ts} ({first_dt.isoformat()})")

    validate_start("META", "2025-08-12")
    validate_start("PUMP", "2025-11-08")

    # Build date list (baseline + month-ends + rebalances) unique & sorted
    all_dates = [BASELINE_DATE] + MONTH_ENDS_2025 + REBALANCE_DATES
    all_dates = sorted(set(all_dates))
    if len(all_dates) != 15:
        raise RuntimeError(f"Expected 15 unique dates, got {len(all_dates)}")

    timestamps = {d: end_of_day_timestamp(parse_date(d)) for d in all_dates}

    # Batch historical prices
    batch_body = {
        "coins": {coin_id: [timestamps[d] for d in all_dates] for coin_id in coin_ids}
    }

    batch_resp = llama.post("/coins/batchHistorical", batch_body)
    batch_prices = parse_batch_historical(batch_resp.data, audit)

    # Build price table (date -> ticker -> price)
    prices_by_date: Dict[str, Dict[str, Optional[float]]] = {
        d: {t: None for t in CRYPTO_TICKERS} for d in all_dates
    }

    for ticker, coin_id in zip(CRYPTO_TICKERS, coin_ids):
        coin_prices = batch_prices.get(coin_id, {})
        for d in all_dates:
            ts = timestamps[d]
            price = coin_prices.get(ts)
            if price is None:
                audit.append(f"NA price from batchHistorical for {ticker} at {d} (ts={ts})")
            prices_by_date[d][ticker] = price

    # Fallback to single historical calls for missing prices
    for d in all_dates:
        ts = timestamps[d]
        missing_tickers = [t for t in CRYPTO_TICKERS if prices_by_date[d][t] is None]
        if not missing_tickers:
            continue
        missing_coin_ids = [token_ids[t] for t in missing_tickers]
        coins_param = ",".join(missing_coin_ids)
        resp = llama.get(f"/coins/prices/historical/{ts}/{coins_param}")
        hist_info = parse_historical_single(resp.data, audit)
        for t in missing_tickers:
            coin_id = token_ids[t]
            info = hist_info.get(coin_id, {})
            price = info.get("price") if isinstance(info, dict) else None
            if price is None:
                audit.append(f"NA price from historical for {t} at {d} (ts={ts})")
            prices_by_date[d][t] = price

    # Sanity check BTC baseline
    btc_base = prices_by_date[BASELINE_DATE]["BTC"]
    if btc_base is None or not (10000 <= btc_base < 100000):
        raise RuntimeError(
            f"BTC baseline price sanity check failed: {btc_base}. Expected tens of thousands USD."
        )

    # Build mapping.csv
    mapping_rows: List[dict] = []
    for ticker in CRYPTO_TICKERS:
        coin_id = token_ids[ticker]
        current = current_info.get(coin_id, {}) if current_info else {}
        first = first_info.get(coin_id, {}) if first_info else {}

        project_name = current.get("name") or current.get("symbol") or "NA"
        current_price = current.get("price") if isinstance(current, dict) else None
        first_ts = parse_first_ts(first)
        first_price = first.get("price") if isinstance(first, dict) else None

        if ":" in coin_id:
            chain, contract = coin_id.split(":", 1)
        else:
            chain, contract = "", ""

        proof_note = ""
        if chain in ("coingecko", "bitcoin"):
            proof_note = "non-contract id"

        mapping_rows.append(
            {
                "ticker": ticker,
                "project_name": project_name,
                "pricing_source": "DefiLlama Pro Coins API",
                "canonical_id": coin_id,
                "chain": chain,
                "contract_or_mint": contract,
                "proof_note": proof_note,
                "current_price_usd": current_price if current_price is not None else "NA",
                "first_price_timestamp": first_ts if first_ts is not None else "NA",
                "first_price_usd": first_price if first_price is not None else "NA",
            }
        )

    with open("mapping.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "ticker",
                "project_name",
                "pricing_source",
                "canonical_id",
                "chain",
                "contract_or_mint",
                "proof_note",
                "current_price_usd",
                "first_price_timestamp",
                "first_price_usd",
            ],
        )
        writer.writeheader()
        writer.writerows(mapping_rows)

    # raw_prices_used.csv
    raw_rows = []
    for d in all_dates:
        row = {
            "Date": d,
            "BTC_price_usd": prices_by_date[d]["BTC"],
            "HYPE_price_usd": prices_by_date[d]["HYPE"],
            "SYRUP_price_usd": prices_by_date[d]["SYRUP"],
            "META_price_usd": prices_by_date[d]["META"],
            "PUMP_price_usd": prices_by_date[d]["PUMP"],
        }
        raw_rows.append(row)

    raw_df = pd.DataFrame(raw_rows)
    raw_df.to_csv("raw_prices_used.csv", index=False, na_rep="NA")

    # S&P 500 monthly series
    sp_series_name, sp_month_values = fetch_sp500_monthly(audit)

    # Build summary_month_end.csv
    summary_rows = []
    baseline_month_key = (2024, 12)
    sp_baseline = sp_month_values.get(baseline_month_key)

    if sp_baseline is None:
        audit.append("S&P baseline missing; SP500 normalization set to NA")

    # Precompute BTC baseline for normalization
    btc_baseline = btc_base

    # Basket values
    basket_values = compute_basket_values(prices_by_date, audit)

    for d in [BASELINE_DATE] + MONTH_ENDS_2025:
        dt = parse_date(d)
        month_key = (dt.year, dt.month)
        sp_level = sp_month_values.get(month_key)
        if sp_level is None:
            audit.append(f"S&P value missing for {d} (month {month_key}); NA")

        if sp_level is None or sp_baseline is None:
            sp_norm = None
            sp_ret = None
        else:
            sp_norm = sp_level / sp_baseline
            sp_ret = (sp_norm - 1.0) * 100.0

        btc_price = prices_by_date[d]["BTC"]
        if btc_price is None:
            audit.append(f"BTC price missing for {d}; NA")
        if btc_price is None or btc_baseline is None:
            btc_norm = None
            btc_ret = None
        else:
            btc_norm = btc_price / btc_baseline
            btc_ret = (btc_norm - 1.0) * 100.0

        basket_val = basket_values.get(d)
        if basket_val is None:
            basket_ret = None
        else:
            basket_ret = (basket_val - 1.0) * 100.0

        summary_rows.append(
            {
                "Date": d,
                "SP500_series_name": sp_series_name,
                "SP500_level": sp_level,
                "SP500_value_norm": sp_norm,
                "SP500_cum_return_pct": sp_ret,
                "BTC_series_name": "BTC DefiLlama",
                "BTC_price_usd": btc_price,
                "BTC_value_norm": btc_norm,
                "BTC_cum_return_pct": btc_ret,
                "Basket_value_norm": basket_val,
                "Basket_cum_return_pct": basket_ret,
            }
        )

    summary_df = pd.DataFrame(summary_rows)
    summary_df.to_csv("summary_month_end.csv", index=False, na_rep="NA")

    # Final checks
    if len(raw_df) != 15:
        raise RuntimeError(f"raw_prices_used.csv must have 15 rows, got {len(raw_df)}")
    if len(summary_df) != 13:
        raise RuntimeError(f"summary_month_end.csv must have 13 rows, got {len(summary_df)}")

    write_audit(audit)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        if GLOBAL_AUDIT:
            try:
                GLOBAL_AUDIT.append(f"ERROR: {exc}")
                write_audit(GLOBAL_AUDIT)
            except Exception:
                pass
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)

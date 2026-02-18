import pandas as pd
import numpy as np
import datetime as dt
from pathlib import Path

# --- Inputs (edit if filenames differ) ---
FILES = {
    "HYPE": "HYPE_1D_tradingview_coinmarketcap (1).csv",
    "SYRUP": "SYRUP_1D_tradingview_coinmarketcap.csv",
    "META": "META_1D_tradingview_coinmarketcap.csv",
    "PUMP": "PUMP_1D_tradingview_coinmarketcap.csv",
}
DATA_DIR = Path(".")  # folder containing the CSVs

# Basket entry/rebalance dates (Option A)
BASELINE = dt.date(2024, 12, 31)   # normalize V(BASELINE)=1.0
ENTRY_SYRUP = dt.date(2025, 6, 3)
ENTRY_META  = dt.date(2025, 8, 12)
ENTRY_PUMP  = dt.date(2025, 11, 8)

MONTH_ENDS_2025 = [
    dt.date(2025,1,31), dt.date(2025,2,28), dt.date(2025,3,31), dt.date(2025,4,30),
    dt.date(2025,5,31), dt.date(2025,6,30), dt.date(2025,7,31), dt.date(2025,8,31),
    dt.date(2025,9,30), dt.date(2025,10,31), dt.date(2025,11,30), dt.date(2025,12,31),
]
REBALS = [ENTRY_SYRUP, ENTRY_META, ENTRY_PUMP]

def load_close_series(path: Path) -> pd.Series:
    df = pd.read_csv(path, sep=";", engine="python")
    df.columns = [c.strip("\ufeff") for c in df.columns]
    df["time"] = df["time"].astype(str).str.strip('"')
    df["date"] = pd.to_datetime(df["time"]).dt.date
    df["close"] = pd.to_numeric(df["close"], errors="coerce")
    df = df.dropna(subset=["close"])
    return df.set_index("date")["close"].sort_index()

def get_price(series: pd.Series, d: dt.date) -> float:
    try:
        return float(series.loc[d])
    except KeyError:
        return float("nan")

def portfolio_value(d: dt.date, units: dict, prices: dict) -> float:
    total = 0.0
    for coin, u in units.items():
        if u == 0:
            continue
        p = get_price(prices[coin], d)
        if np.isnan(p):
            return float("nan")
        total += u * p
    return total

def rebalance_equal(d: dt.date, active: list[str], units: dict, prices: dict) -> dict:
    V = portfolio_value(d, units, prices)
    n = len(active)
    new_units = {k: 0.0 for k in units.keys()}
    for c in active:
        p = get_price(prices[c], d)
        if np.isnan(p):
            raise RuntimeError(f"Missing price for {c} on {d}")
        new_units[c] = (V / n) / p
    return new_units

def units_for_date(d: dt.date, regimes: dict) -> dict:
    if d < ENTRY_SYRUP:
        return regimes["baseline"]
    elif d < ENTRY_META:
        return regimes["after_syrup"]
    elif d < ENTRY_PUMP:
        return regimes["after_meta"]
    else:
        return regimes["after_pump"]

def main():
    # Load prices
    prices = {}
    for coin, fname in FILES.items():
        p = DATA_DIR / fname
        if not p.exists():
            raise FileNotFoundError(f"Missing {p}")
        prices[coin] = load_close_series(p)

    # Baseline: only HYPE active, V=1
    hype_base = get_price(prices["HYPE"], BASELINE)
    if np.isnan(hype_base):
        raise RuntimeError(f"Missing HYPE baseline price on {BASELINE}")
    units = {"HYPE": 1.0 / hype_base, "SYRUP": 0.0, "META": 0.0, "PUMP": 0.0}

    regimes = {"baseline": units.copy()}
    # Rebalance on entry dates
    regimes["after_syrup"] = rebalance_equal(ENTRY_SYRUP, ["HYPE", "SYRUP"], regimes["baseline"], prices)
    regimes["after_meta"]  = rebalance_equal(ENTRY_META,  ["HYPE", "SYRUP", "META"], regimes["after_syrup"], prices)
    regimes["after_pump"]  = rebalance_equal(ENTRY_PUMP,  ["HYPE", "SYRUP", "META", "PUMP"], regimes["after_meta"], prices)

    # raw_prices_used.csv (baseline + month-ends + rebalance dates)
    needed = sorted(set([BASELINE] + MONTH_ENDS_2025 + REBALS))
    raw_rows = []
    for d in needed:
        raw_rows.append({
            "Date": d.isoformat(),
            "HYPE_close": get_price(prices["HYPE"], d),
            "SYRUP_close": get_price(prices["SYRUP"], d),
            "META_close": get_price(prices["META"], d),
            "PUMP_close": get_price(prices["PUMP"], d),
        })
    pd.DataFrame(raw_rows).to_csv("basket_raw_prices_used.csv", index=False)

    # basket_summary_month_end.csv (baseline + 12 month-ends)
    summary_rows = []
    for d in [BASELINE] + MONTH_ENDS_2025:
        u = units_for_date(d, regimes)
        V = portfolio_value(d, u, prices)
        summary_rows.append({
            "Date": d.isoformat(),
            "Basket_value_norm": V,
            "Basket_cum_return_pct": (V - 1.0) * 100.0
        })
    pd.DataFrame(summary_rows).to_csv("basket_summary_month_end.csv", index=False)

    print("Wrote: basket_raw_prices_used.csv, basket_summary_month_end.csv")

if __name__ == "__main__":
    main()

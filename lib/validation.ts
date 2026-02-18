import {
  parsePhoneNumberFromString,
  getCountries,
  CountryCode,
} from "libphonenumber-js";

// Convert country code to flag emoji (e.g. "ES" -> "\u{1F1EA}\u{1F1F8}")
function countryCodeToFlag(code: string): string {
  return [...code.toUpperCase()].map(
    (c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)
  ).join("");
}

// Generate country display name in Spanish
const displayNames = new Intl.DisplayNames(["es"], { type: "region" });

// Build full country list from libphonenumber-js, sorted alphabetically
// with Spain pinned to the top as default
function buildCountryList() {
  const allCodes = getCountries();
  const countries = allCodes
    .map((code) => ({
      code,
      flag: countryCodeToFlag(code),
      name: displayNames.of(code) ?? code,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  // Pin Spain to the top
  const esIndex = countries.findIndex((c) => c.code === "ES");
  if (esIndex > 0) {
    const [spain] = countries.splice(esIndex, 1);
    countries.unshift(spain);
  }

  return countries;
}

export const COUNTRIES = buildCountryList();

export const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const nameRegex = /^[\p{L}\s\-']+$/u;
  return nameRegex.test(trimmed) && /\p{L}/u.test(trimmed);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string, countryCode: CountryCode): boolean => {
  if (!phone.trim()) return true; // Phone is optional
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
  return phoneNumber?.isValid() ?? false;
};

export const formatPhoneForSubmission = (
  phone: string,
  countryCode: CountryCode
): string => {
  if (!phone.trim()) return "";
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
  return phoneNumber?.format("E.164") ?? "";
};

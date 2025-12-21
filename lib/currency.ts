export type CurrencyChoice = "usd" | "inr" | "local"

export interface CurrencyInfo {
  code: string
  symbol: string
  label: string
}

const USD: CurrencyInfo = {
  code: "USD",
  symbol: "$",
  label: "US Dollar",
}

const INR: CurrencyInfo = {
  code: "INR",
  symbol: "₹",
  label: "Indian Rupee",
}

// Very lightweight heuristic mapping from destination names to likely local currencies.
// This is intentionally simple and can be expanded over time.
const DESTINATION_CURRENCY_MAP: { match: RegExp; info: CurrencyInfo }[] = [
  { match: /paris|france|eiffel/i, info: { code: "EUR", symbol: "€", label: "Euro" } },
  { match: /london|uk|united kingdom|england/i, info: { code: "GBP", symbol: "£", label: "British Pound" } },
  { match: /bali|indonesia|jakarta/i, info: { code: "IDR", symbol: "Rp", label: "Indonesian Rupiah" } },
  { match: /tokyo|japan|osaka|kyoto/i, info: { code: "JPY", symbol: "¥", label: "Japanese Yen" } },
  { match: /dubai|uae|united arab emirates|abu dhabi/i, info: { code: "AED", symbol: "د.إ", label: "UAE Dirham" } },
  { match: /orlando|usa|united states|new york|miami|los angeles|california/i, info: USD },
  { match: /maldives|male/i, info: { code: "MVR", symbol: "Rf", label: "Maldivian Rufiyaa" } },
  { match: /swiss|switzerland|zurich|geneva/i, info: { code: "CHF", symbol: "CHF", label: "Swiss Franc" } },
  { match: /santorini|greece|athens/i, info: { code: "EUR", symbol: "€", label: "Euro" } },
  { match: /cancun|mexico|cdmx|mexico city/i, info: { code: "MXN", symbol: "$", label: "Mexican Peso" } },
  { match: /india|goa|delhi|mumbai|bangalore|bengaluru|jaipur/i, info: INR },
]

export function getBaseCurrencyInfo(choice: CurrencyChoice, destinationLabel?: string): {
  selected: CurrencyInfo
  usd: CurrencyInfo
  inr: CurrencyInfo
  local: CurrencyInfo
} {
  const local = inferLocalCurrency(destinationLabel)
  const selected =
    choice === "usd" ? USD : choice === "inr" ? INR : local

  return { selected, usd: USD, inr: INR, local }
}

export function inferLocalCurrency(destinationLabel?: string | null): CurrencyInfo {
  if (!destinationLabel) {
    return {
      code: "LOCAL",
      symbol: "¤",
      label: "Local currency",
    }
  }

  const lower = destinationLabel.toLowerCase()

  for (const { match, info } of DESTINATION_CURRENCY_MAP) {
    if (match.test(lower)) {
      return info
    }
  }

  // Fallback generic local currency when we can't confidently infer one.
  return {
    code: "LOCAL",
    symbol: "¤",
    label: "Local currency",
  }
}

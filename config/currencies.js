// prettier-ignore
export const CURRENCY_SYMBOLS = Object.freeze({
    USD: "$", EUR: "€", GBP: "£", AUD: "$", CAD: "$", CHF: "Fr", CNY: "¥", DKK: "kr", HKD: "$", INR: "₹", 
    JPY: "¥", KRW: "₩", NZD: "$", PLN: "zł", RUB: "₽", SEK: "kr", SGD: "$", THB: "฿", TRY: "₺", ZAR: "R", 
    BTC:'₿', ETH:'Ξ', USDT:'₮', USDC: "USDC"
  });

export const CRYPTO_CURRENCIES = Object.freeze(["BTC", "ETH", "USDT", "TIOX"]);

export const CURRENCIES = {
  EUR: {
    symbol: "€",
    name: "Euro",
    digits: 2,
  },
  USD: {
    symbol: "$",
    name: "US Dollar",
    digits: 2,
  },
  GBP: {
    symbol: "£",
    name: "British Pound",
    digits: 2,
  },
  CAD: {
    symbol: "$",
    name: "Canadian Dollar",
    digits: 2,
  },
  AUD: {
    symbol: "$",
    name: "Australian Dollar",
    digits: 2,
  },
  BTC: {
    symbol: "₿",
    name: "Bitcoin",
    unit: "Satoshi",
    digits: 8,
  },
  USDT: {
    symbol: "₮",
    name: "Tether",
    unit: "USDT cents",
    digits: 2,
  },
  ETH: {
    symbol: "Ξ",
    name: "Ethereum",
    unit: "gWei",
    digits: 9,
  },
  TIO: {
    symbol: "TIOx",
    name: "Trade Token",
    unit: "TIO cents(gWei)",
    digits: 9,
  },
};

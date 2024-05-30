const PAYMENT_GATEWAYS = Object.freeze([
  {
    title: "Adjustment",
    brand: "PIX",
    id: "pixAdjustment",
  },
  {
    title: "PIX Virtual Pay",
    id: "pixVirtualPay",
    brand: "PIX",
  },
  {
    title: "Bitgo",
    id: "tioMarketsBitgo",
    brand: "TIO",
  },
  {
    title: "Bitgo",
    id: "pixBitgo",
    brand: "PIX",
  },
  {
    title: "OpenPayd",
    id: "pixOpenPayd",
    brand: "PIX",
  },
  {
    title: "Adjustment",
    id: "tioMarketsAdjustment",
    brand: "TIO",
  },
  {
    title: "OpenPayd",
    id: "tioMarketsOpenPayd",
    brand: "TIO",
  },
  {
    title: "Balance Correction",
    id: "tioMarketsBalanceCorrection",
    brand: "TIO",
  },

  { id: "tioMarketsHelpToPay", title: "Tio Markets Help To Pay", brand: "TIO" },
  { id: "tioMarketsSkrill", title: "Tio Markets Skrill", brand: "TIO" },
  { id: "tioMarketsNeteller", title: "Tio Markets Neteller", brand: "TIO" },
  {
    id: "tiomarketsWireTransferEnglish",
    title: "Tiomarkets Wire Transfer English",
    brand: "TIO",
  },
  { id: "tiomarketsFasaPay", title: "Tiomarkets Fasa Pay", brand: "TIO" },
  {
    id: "tiomarketGigadatInterac",
    title: "Tiomarket Gigadat Interac",
    brand: "TIO",
  },
  { id: "tiomarketsEftPay", title: "Tiomarkets Eft Pay", brand: "TIO" },
  { id: "tiomarketsPayTrust88", title: "Tiomarkets Pay Trust88", brand: "TIO" },
  {
    id: "tiomarketsEmpGenesisUsdVisa",
    title: "Tiomarkets Emp Genesis Usd Visa",
    brand: "TIO",
  },
  {
    id: "tiomarketEmpGenesisEurVisa",
    title: "Tiomarket Emp Genesis Eur Visa",
    brand: "TIO",
  },
  {
    id: "tioMarketsEmpGenesisGbpVisa",
    title: "Tio Markets Emp Genesis Gbp Visa",
    brand: "TIO",
  },
  {
    id: "tioMarketssWireTransferArabic",
    title: "Tio Marketss Wire Transfer Arabic",
    brand: "TIO",
  },
  {
    id: "wireTransferDeTioMarkets",
    title: "Wire Transfer De Tio Markets",
    brand: "TIO",
  },
  {
    id: "wireTransferEsTioMarkets",
    title: "Wire Transfer Es Tio Markets",
    brand: "TIO",
  },
  {
    id: "wireTransferIdTioMarkets",
    title: "Wire Transfer Id Tio Markets",
    brand: "TIO",
  },
  {
    id: "wireTransferItTioMarkets",
    title: "Wire Transfer It Tio Markets",
    brand: "TIO",
  },
  {
    id: "wireTransferPlTioMarkets",
    title: "Wire Transfer Pl Tio Markets",
    brand: "TIO",
  },
  {
    id: "wireTransferPtTioMarkets",
    title: "Wire Transfer Pt Tio Markets",
    brand: "TIO",
  },
  {
    id: "wireTransferChineseTioMarkets",
    title: "Wire Transfer Chinese Tio Markets",
    brand: "TIO",
  },
  {
    id: "wireTransferThTioMarkets",
    title: "Wire Transfer Th Tio Markets",
    brand: "TIO",
  },
  {
    id: "wireTransferViTioMarkets",
    title: "Wire Transfer Vi Tio Markets",
    brand: "TIO",
  },
  {
    id: "tioMarketsEmpGenesisCzkVisa",
    title: "Tio Markets Emp Genesis Czk Visa",
    brand: "TIO",
  },
  {
    id: "tioMarketsEmpGenesisCzkMc",
    title: "Tio Markets Emp Genesis Czk Mc",
    brand: "TIO",
  },
  {
    id: "fairpayTioMarketsOnline",
    title: "Fairpay Tio Markets Online",
    brand: "TIO",
  },
  {
    id: "fairpayTioMarketsCash",
    title: "Fairpay Tio Markets Cash",
    brand: "TIO",
  },
  {
    id: "empGenesisTradextradersUsd",
    title: "Emp Genesis Tradextraders Usd",
    brand: "TIO",
  },
  {
    id: "empGenesisTradextradersEur",
    title: "Emp Genesis Tradextraders Eur",
    brand: "TIO",
  },
  {
    id: "qubePayTioMarketsZar",
    title: "Qube Pay Tio Markets Zar",
    brand: "TIO",
  },
  {
    id: "qubePayTioMarketsCzk",
    title: "Qube Pay Tio Markets Czk",
    brand: "TIO",
  },
  {
    id: "qubePayTioMarketsEur",
    title: "Qube Pay Tio Markets Eur",
    brand: "TIO",
  },
  {
    id: "qubePayTioMarketsGbp",
    title: "Qube Pay Tio Markets Gbp",
    brand: "TIO",
  },
  {
    id: "qubePayTioMarketsUsd",
    title: "Qube Pay Tio Markets Usd",
    brand: "TIO",
  },
  {
    id: "payRetailersTiomarketsLatam",
    title: "Pay Retailers Tiomarkets Latam",
    brand: "TIO",
  },
  {
    id: "tiomarketsWireTransferNl",
    title: "Tiomarkets Wire Transfer Nl",
    brand: "TIO",
  },
  {
    id: "payGate10RupeePaymentsTioMarkets",
    title: "Pay Gate10 Rupee Payments Tio Markets",
    brand: "TIO",
  },
  { id: "sepaNewTiomarkets", title: "Sepa New Tiomarkets", brand: "TIO" },
  { id: "gigadatTest", title: "Gigadat Test", brand: "TIO" },
]);

/**
 *
 * @param {"TIO" | "PIX"} brand
 * @returns
 */
export const getGatewaysForBrand = (brand) =>
  PAYMENT_GATEWAYS.filter((v) => v.brand === brand);

export const getGatewayByID = (id) => {
  return PAYMENT_GATEWAYS.find((v) => v.id === id) || {};
};

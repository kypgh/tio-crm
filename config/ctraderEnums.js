// prettier-ignore
export const CTRADER_SYMBOLS = Object.freeze([
  { id: 1, symbol: "EURUSD" }, { id: 2, symbol: "GBPUSD" }, { id: 3, symbol: "EURJPY" }, { id: 4, symbol: "USDJPY" }, { id: 5, symbol: "AUDUSD" }, { id: 6, symbol: "USDCHF" },
  { id: 7, symbol: "GBPJPY" }, { id: 8, symbol: "USDCAD" }, { id: 9, symbol: "EURGBP" }, { id: 10, symbol: "EURCHF" }, { id: 11, symbol: "AUDJPY" }, { id: 12, symbol: "NZDUSD" },
  { id: 13, symbol: "CHFJPY" }, { id: 14, symbol: "EURAUD" }, { id: 15, symbol: "CADJPY" }, { id: 16, symbol: "GBPAUD" }, { id: 17, symbol: "EURCAD" }, { id: 18, symbol: "AUDCAD" },
  { id: 19, symbol: "GBPCAD" }, { id: 20, symbol: "AUDNZD" }, { id: 21, symbol: "NZDJPY" }, { id: 22, symbol: "USDNOK" }, { id: 23, symbol: "AUDCHF" }, { id: 24, symbol: "USDMXN" },
  { id: 25, symbol: "GBPNZD" }, { id: 26, symbol: "EURNZD" }, { id: 27, symbol: "CADCHF" }, { id: 28, symbol: "USDSGD" }, { id: 29, symbol: "USDSEK" }, { id: 30, symbol: "NZDCAD" },
  { id: 31, symbol: "EURSEK" }, { id: 32, symbol: "GBPSGD" }, { id: 33, symbol: "EURNOK" }, { id: 34, symbol: "EURHUF" }, { id: 35, symbol: "USDPLN" }, { id: 36, symbol: "USDDKK" },
  { id: 37, symbol: "GBPNOK" }, { id: 38, symbol: "AUDDKK" }, { id: 39, symbol: "NZDCHF" }, { id: 40, symbol: "GBPCHF" }, { id: 41, symbol: "XAUUSD" }, { id: 42, symbol: "XAGUSD" },
  { id: 43, symbol: "USDTRY" }, { id: 44, symbol: "EURTRY" }, { id: 45, symbol: "EURHKD" }, { id: 46, symbol: "EURZAR" }, { id: 47, symbol: "SGDJPY" }, { id: 48, symbol: "USDHKD" },
  { id: 49, symbol: "USDZAR" }, { id: 50, symbol: "EURMXN" }, { id: 51, symbol: "EURPLN" }, { id: 52, symbol: "GBPZAR" }, { id: 53, symbol: "NZDSGD" }, { id: 54, symbol: "USDHUF" },
  { id: 55, symbol: "EURCZK" }, { id: 56, symbol: "USDCZK" }, { id: 57, symbol: "EURDKK" }, { id: 58, symbol: "EURRUB" }, { id: 59, symbol: "USDRUB" }, { id: 60, symbol: "USDCNH" },
  { id: 61, symbol: "GBPSEK" }, { id: 62, symbol: "GBPPLN" }, { id: 63, symbol: "AUDSEK" }, { id: 64, symbol: "AUDSGD" }, { id: 65, symbol: "AUDZAR" }, { id: 66, symbol: "CADDKK" },
  { id: 67, symbol: "CADHKD" }, { id: 68, symbol: "CADMXN" }, { id: 69, symbol: "CADNOK" }, { id: 70, symbol: "CADSEK" }, { id: 71, symbol: "CADSGD" }, { id: 72, symbol: "CHFNOK" },
  { id: 73, symbol: "CHFPLN" }, { id: 74, symbol: "CHFSEK" }, { id: 75, symbol: "CHFSGD" }, { id: 76, symbol: "CHFZAR" }, { id: 77, symbol: "DKKNOK" }, { id: 78, symbol: "DKKSEK" },
  { id: 79, symbol: "EURCNH" }, { id: 80, symbol: "EURILS" }, { id: 81, symbol: "EURRON" }, { id: 82, symbol: "EURSGD" }, { id: 83, symbol: "GBPDKK" }, { id: 84, symbol: "GBPTRY" },
  { id: 85, symbol: "HKDJPY" }, { id: 86, symbol: "NOKJPY" }, { id: 87, symbol: "NOKSEK" }, { id: 88, symbol: "NZDSEK" }, { id: 89, symbol: "TRYJPY" }, { id: 90, symbol: "USDRON" },
  { id: 91, symbol: "USDTHB" }, { id: 92, symbol: "XAGEUR" }, { id: 93, symbol: "XAUEUR" }, { id: 94, symbol: "XPDEUR" }, { id: 95, symbol: "XPDUSD" }, { id: 96, symbol: "XPTEUR" },
  { id: 97, symbol: "XPTUSD" }, { id: 98, symbol: "ZARJPY" }, { id: 99, symbol: "WTI" }, { id: 100, symbol: "BRENT" }, { id: 101, symbol: "BTCUSD" }, { id: 102, symbol: "ETHUSD" },
  { id: 103, symbol: "USTUSD" }, { id: 204, symbol: ".AUS200" }, { id: 205, symbol: "DE40" }, { id: 206, symbol: "AUS200" }, { id: 207, symbol: "NAS" }, { id: 208, symbol: "S&P500" },
  { id: 209, symbol: "DJ" }, { id: 210, symbol: "STOXX50" }, { id: 211, symbol: "HK50" }, { id: 212, symbol: "ESP35" }, { id: 213, symbol: "UK100" }, { id: 214, symbol: "UKOIL.sp" },
  { id: 215, symbol: "USOIL.sp" }, { id: 216, symbol: "LTCUSD" }, { id: 217, symbol: "JP225", },
]);

export const CTRADER_POSITION_STATUS = Object.freeze({
  POSITION_STATUS_OPEN: "POSITION_STATUS_OPEN",
  POSITION_STATUS_CLOSED: "POSITION_STATUS_CLOSED",
  POSITION_STATUS_CREATED: "POSITION_STATUS_CREATED",
  POSITION_STATUS_ERROR: "POSITION_STATUS_ERROR",
});

export const CTRADER_ACCOUNT_TYPPES = Object.freeze({
  TIO: {
    live: {
      standard: {
        name: "standard",
        groupName: "TIO-CT_Std",
        label: "Standard",
      },
      vip: {
        name: "vip",
        groupName: "TIO-CT_VIP",
        label: "VIP",
      },
      vipblack: {
        name: "vipblack",
        groupName: "TIO-CT_VIPB",
        label: "VIP Black",
      },
    },
    demo: {
      standard: {
        name: "standard",
        groupName: "Demo-CT_Std",
        label: "Standard",
      },
      vip: {
        name: "vip",
        groupName: "Demo-CT-VIP",
        label: "VIP",
      },
      vipblack: {
        name: "vipblack",
        groupName: "Demo-CT-VIPB",
        label: "VIP Black",
      },
    },
  },
  PIX: {
    live: {
      standard: {
        name: "standard",
        groupName: "PrimeIndex-Standard",
        label: "Spread",
      },
      vip: {
        name: "vip",
        groupName: "PrimeIndex-VIP",
        label: "VIP",
      },
      vipblack: {
        name: "vipblack",
        groupName: "PrimeIndex-VIPBlack",
        label: "Prime",
      },
    },
    demo: {
      standard: {
        name: "standard",
        groupName: "Demo-PrimeIndex-STD",
        label: "Spread",
      },
      vip: {
        name: "vip",
        groupName: "Demo-PrimeIndex-VIP",
        label: "VIP",
      },
      vipblack: {
        name: "vipblack",
        groupName: "Demo-PrimeIndex-VIPBlack",
        label: "Prime",
      },
    },
  },
});

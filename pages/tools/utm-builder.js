import Link from "next/link";
import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { PageOuter, Title } from "../../components/generic";
import { useNotification } from "../../components/actionNotification/NotificationProvider";

const MainDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

const InnerDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 60px;
  max-width: 800px;
  width: 100%;
`;

const Data = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  box-shadow: 5px 5px 12px #141a1f, -5px -5px 12px #243039;
  background: #1c252c;
  box-shadow: 5px 5px 12px #141a1f, -5px -5px 12px #243039;
  padding: 10px;
  border-radius: 9px;
  color: white;
`;

const EntityLang = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  max-width: 100%;
`;

const BaseDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;

const URLP = styled.div`
  width: 60%;
  color: rgb(255 255 255 / 55%);
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
`;

const TioEntity = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 5px 5px 10px #17171d, -5px -5px 10px #262730;
    border: 1px solid rgb(255 255 255 / 10%);
    margin-bottom: 5px;
    font-weight: 900;
    padding: 5px;
    border-radius: 4px;
    transition: all 0.15s linear;
    outline: none !important;
    margin-right: 0;
    margin-left: 0;
  }

  .isActive {
    color: #ff7a05;
    background-color: #16171d;
    color: rgb(255, 87, 34);
  }

  .notActive {
    background: #1e1f26;
    color: rgb(255 255 255 / 44%);
  }
`;

const SelectionDiv1 = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;

const SelectionDiv2 = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
`;

const Select = styled.select`
  width: 100%;
  box-shadow: rgb(23, 23, 29) 5px 5px 10px, rgb(38, 39, 48) -5px -5px 10px;
  color: #ff7a05;
  height: 30px;
  cursor: pointer;
  font-size: 12px;
  background: #1c252c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  outline: hidden !important;

  option {
    color: #ff7a05;
    display: flex;
    padding: 10px 2px 1px;
  }
`;

const SelectDiv = styled.div`
  display: flex;
  max-width: 200px;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
`;

const Label = styled.p`
  width: 100%;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
`;

const PreviewDiv = styled.div`
  display: flex;
  width: 100%;
  min-height: 400px;
  border-radius: 9px;
  border: 1px solid rgb(255 122 5 / 26%);
  overflow: hidden;
  position: relative;
  background: #1c252c;
  margin-bottom: 1px;

  ::before {
    content: "PREVIEW";
    position: absolute;
    bottom: -16px;
    right: 2px;
    font-weight: 900;
    font-size: 70px;
    -webkit-text-stroke: 1px rgb(20 21 25);
    color: rgb(30 31 38 / 0%);
    opacity: 0.6;
    z-index: 10;
    text-shadow: 1px 1px 20px rgb(30 31 38 / 39%);
  }
  & iframe {
    width: 100%;
    border: none;
    overflow-y: hidden;
  }
`;

const TDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;
`;

const BtnDiv = styled.div`
  width: 33%;
  cursor: pointer;
  background: #1e1f26;
  box-shadow: 5px 5px 10px #17171d, -5px -5px 10px #262730;
  border: 1px solid rgb(255 255 255 / 10%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  color: rgb(255 255 255 / 44%);
  font-weight: 900;
  border-radius: 4px;
  transition: all 0.15s linear;
  height: 30px;
  font-size: 16px;
  outline: none !important;
  z-index: 9999;
  -webkit-text-stroke: 0.5px rgb(0 0 0 / 0%);
  text-decoration: none;
  text-shadow: 0 0 5px rgb(167 87 17 / 0%);
  a {
    color: rgb(255 255 255 / 44%);
    text-decoration: none;
    :hover {
      color: #ff7a05;
      background-color: #16171d;
    }
  }
  :hover {
    color: #ff7a05;
    background-color: #16171d;
  }
`;

const PreviewComponent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const URLSelection = styled.div`
  width: 100%;
  display: flex;
  color: var(--mainColor);
  min-height: 70px;
  padding: 15px;
  font-size: 12px;
  background: #16171d;
  box-shadow: inset 5px 5px 10px #111116, inset -5px -5px 10px #1c1d24;
  border-radius: 5px;
  position: relative;
  z-index: 295;
  border: 1px solid rgb(255 255 255 / 12%);
  max-width: 100%;
  overflow: hidden;

  p {
    color: white;
    z-index: 999999;
  }

  ::before {
    content: "URL";
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    color: #16171d;
    font-weight: 800;
    font-size: 51px;
    -webkit-text-stroke: 1px rgb(255 122 5 / 12%);
    z-index: 0;
  }
`;
const baseURL = "https://tiomarkets";
const campaign = [
  {
    baseURL: baseURL,
    campaign: "calculators",
    page: "calculators",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "bestcharts",
    page: "how-to-read-candlestick-charts",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "timesvipblack",
    page: "raw-spread-trading",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tiosignalsv2",
    page: "forex-trading-signals",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "MQL500",
    page: "MQL500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "bdaybonus",
    page: "birthday-trading-bonus",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tradestyle",
    page: "trading-styles-strategies",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tradegold",
    page: "trade-gold",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "bestcrypto",
    page: "cryptocurrency-trading-for-beginners",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "btcmentor",
    page: "invest-in-bitcoin-for-trading-mentor",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "timesvipblack",
    page: "raw-spread-trading",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "popularstocks",
    page: "popular-stocks-traded",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "bestindices",
    page: "how-to-trade-indices-on-mt5",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "bestindicator",
    page: "best-forex-indicators",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "bestrisk",
    page: "15-risk-management-tips-forex-trading",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "beststrategy",
    page: "best-trading-strategy-educational-video",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "bestbroker",
    page: "best-forex-broker-educational-video",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "aroll500",
    page: "aroll-vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "forexbonusfb",
    page: "forexbonus-fb",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tecnicasdetrading500",
    page: "tecnicasdetrading-vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "fxdailyinfo500",
    page: "fxdailyinfo-vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "forexfactory500",
    page: "forexfactory-vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tradingview500",
    page: "tradingview-vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "fxempire500",
    page: "fxempire-vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "fxstreet500",
    page: "fxstreet-vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "babypips500",
    page: "babypips-vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "technicalpanel",
    page: "register",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "ebook",
    page: "forex-ebook",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "linktree",
    page: "",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "technicalanalysis",
    page: "technical-analysis",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "vip500",
    page: "vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "fxempire",
    page: "register",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tiosignals",
    page: "tiosignals",
    isGuerilla: false,
  },
  {
    baseURL: "https://clients.tiomarkets.com",
    campaign: "bdayemailexisting",
    page: "login",
    isGuerilla: true,
  },
  {
    baseURL: baseURL,
    campaign: "bdayemailnew",
    page: "register",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "referafriend",
    page: "refer-a-friend",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tioxoffer",
    page: "tioxoffer",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "rprttsla",
    page: "instruments?id=TSLA",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "rprtaapl",
    page: "instruments?id=AAPL",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "rprtgoldusd",
    page: "instruments?id=GOLDUSD",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "rprtusoil",
    page: "instruments?id=USOIL",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "rprtbtcusd",
    page: "instruments?id=BTCUSD",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "rprtusdjpy",
    page: "instruments?id=USDJPY",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "rprteurusd",
    page: "instruments?id=EURUSD",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "arollstocks",
    page: "arollstocks",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "arollbonus01",
    page: "arollbonus",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "btc",
    page: "btc",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "cma",
    page: "register",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "vip1000",
    page: "vip1000",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "analysis",
    page: "analysis",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "partners",
    page: "partners",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "nodepositbonus",
    page: "nodepositbonus",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "optimizefx500",
    page: "optimizefx-vip500",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "1monthcommissionfree",
    page: "1month-commission-free",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "allyoucantrade",
    page: "all-you-can-trade-buffet",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "becomeapartner",
    page: "forex-partners",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "birthdaybonus",
    page: "birthday-bonus",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "blackfriday",
    page: "black-friday",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "brand",
    page: "",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "broker1",
    page: "register",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "broker2",
    page: "register",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "broker3",
    page: "register",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "broker4",
    page: "register",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "cashrebate",
    page: "cash-rebate",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "cashrebateb",
    page: "cash-rebate-b",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "changemybroker",
    page: "change-my-broker",
    isGuerilla: false,
  },
  {
    baseURL: "https://tradesforprofit.com",
    campaign: "dax",
    page: "",
    isGuerilla: true,
  },
  {
    baseURL: baseURL,
    campaign: "demo",
    page: "demo",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "digitalsponsorship",
    page: "digital-sponsorship",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "t2t",
    page: "forex-beginners",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "forexbonus",
    page: "forexbonus",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "forexpartner",
    page: "forex-partners",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "forexfactorybonus",
    page: "forexfactorybonus",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "fxinquarantine",
    page: "fx-in-quarantine",
    isGuerilla: false,
  },
  {
    baseURL: "https://www.fxpremiere.com",
    campaign: "fxpremiere",
    page: "",
    isGuerilla: true,
  },
  {
    baseURL: "https://fxpremieresignals.com",
    campaign: "fxpremieresignals",
    page: "",
    isGuerilla: true,
  },
  {
    baseURL: baseURL,
    campaign: "leadbranded",
    page: "register",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "learntotrade",
    page: "learn-to-trade",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "stocks",
    page: "trade-stocks",
    isGuerilla: false,
  },
  {
    baseURL: "https://zerocosttrading.com",
    campaign: "mmo",
    page: "",
    isGuerilla: true,
  },
  {
    baseURL: "https://moneymanager4u.com",
    campaign: "mm4u",
    page: "",
    isGuerilla: true,
  },
  {
    baseURL: baseURL,
    campaign: "naira",
    page: "naira",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "nfp",
    page: "nfp",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "notanothercompetition",
    page: "not-another-competition",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "pamm",
    page: "pamm",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "platforms",
    page: "platforms",
    isGuerilla: false,
  },
  {
    baseURL: "https://primeindexsignals.com",
    campaign: "primeindexsignals",
    page: "",
    isGuerilla: true,
  },
  {
    baseURL: "https://profittradings.com",
    campaign: "profittrading",
    page: "",
    isGuerilla: true,
  },
  {
    baseURL: baseURL,
    campaign: "rawspreadtrading",
    page: "raw-spread-trading",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "signatureoffer",
    page: "signature-offer",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "slashyourcosts",
    page: "trade-more-for-less",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "stocksthatmakecents",
    page: "stocks-that-make-cents",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "subscription",
    page: "subscription-trading",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "supercharge",
    page: "trade-fx",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "technicaltrading",
    page: "technical-trading",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tioshield",
    page: "reverse-your-bad-trades",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tioxoffer",
    page: "signature-offer",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "times25",
    page: "timesbonus",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tradeforcheap",
    page: "trade-for-cheap",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "tradeforex",
    page: "forex-trading",
    isGuerilla: false,
  },
  {
    baseURL: "https://tradexsignals.com",
    campaign: "tradex",
    page: "",
    isGuerilla: true,
  },
  {
    baseURL: baseURL,
    campaign: "uselections",
    page: "us-elections",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "vipblack",
    page: "raw-spread-trading",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "vipblack2",
    page: "raw-spreads",
    isGuerilla: false,
  },
  {
    baseURL: baseURL,
    campaign: "webinars",
    page: "webinars",
    isGuerilla: false,
  },
  {
    baseURL: "https://whattheforex.com",
    campaign: "wtf",
    page: "",
    isGuerilla: true,
  },
];

const language = [
  {
    valLang: "ar",
    fullLang: "Arabic",
  },
  { valLang: "cz", fullLang: "Czech" },
  { valLang: "de", fullLang: "German" },
  { valLang: "en", fullLang: "English" },
  { valLang: "es", fullLang: "Spanish" },
  { valLang: "fr", fullLang: "French" },
  { valLang: "hu", fullLang: "Hungarian" },
  { valLang: "id", fullLang: "Indonesian" },
  { valLang: "it", fullLang: "Italian" },
  { valLang: "ms", fullLang: "Malay" },
  { valLang: "nl", fullLang: "Dutch" },
  { valLang: "ph", fullLang: "Tagalog" },
  { valLang: "pl", fullLang: "Polish" },
  { valLang: "pt", fullLang: "Portuguese" },
  { valLang: "pt", fullLang: "Portuguese" },
  { valLang: "sk", fullLang: "Slovakian" },
  { valLang: "th", fullLang: "Thai" },
  { valLang: "vi", fullLang: "Vietnamese" },
  { valLang: "zh-hans", fullLang: "Chinese" },
  { valLang: "zh-tw", fullLang: "Taiwanese" },
];

const source = [
  "adroll",
  "babypips",
  "bing",
  "blog",
  "dianomi",
  "email",
  "email automation",
  "facebook",
  "financemagnates",
  "forexfactory",
  "forexlive",
  "fxdailyinfo",
  "fxstreet",
  "google",
  "google B",
  "google Fanaka",
  "hithermann",
  "homepagemodal",
  "instagram",
  "instascrape",
  "investing.com",
  "linkedIn",
  "mediabuy",
  "mql500",
  "myFXBook",
  "propellarads",
  "quora",
  "renatodecarolis",
  "sms",
  "tecnicasdetrading",
  "tj",
  "tradeio",
  "tradingview",
  "trustpilot",
  "Twitter",
  "YouTube",
];

const terms = [
  { valueTerm: "BN_AR", fullTerm: "Banner (AR)" },
  { valueTerm: "BN_DE", fullTerm: "Banner (DE)" },
  { valueTerm: "BN_EN", fullTerm: "Banner (EN)" },
  { valueTerm: "BN_ES", fullTerm: "Banner (ES)" },
  { valueTerm: "BN_MY", fullTerm: "Banner (MY)" },
  { valueTerm: "BN_PT", fullTerm: "Banner (PT)" },
  { valueTerm: "BN_TC", fullTerm: "Banner (TC)" },
  { valueTerm: "BN_TH", fullTerm: "Banner (TH)" },
  { valueTerm: "BN_UK", fullTerm: "Banner (UK)" },
  { valueTerm: "BN_VI", fullTerm: "Banner (VI)" },
  { valueTerm: "CA_AR", fullTerm: "Carousel (AR)" },
  { valueTerm: "CA_DE", fullTerm: "Carousel (DE)" },
  { valueTerm: "CA_EN", fullTerm: "Carousel (EN)" },
  { valueTerm: "CA_ES", fullTerm: "Carousel (ES)" },
  { valueTerm: "CA_MY", fullTerm: "Carousel (MY)" },
  { valueTerm: "CA_PT", fullTerm: "Carousel (PT)" },
  { valueTerm: "CA_TC", fullTerm: "Carousel (TC)" },
  { valueTerm: "CA_TH", fullTerm: "Carousel (TH)" },
  { valueTerm: "CA_UK", fullTerm: "Carousel (UK)" },
  { valueTerm: "CA_VI", fullTerm: "Carousel (VI)" },
  { valueTerm: "DS_AR", fullTerm: "Display (AR)" },
  { valueTerm: "DS_DE", fullTerm: "Display (DE)" },
  { valueTerm: "DS_EN", fullTerm: "Display (EN)" },
  { valueTerm: "DS_ES", fullTerm: "Display (ES)" },
  { valueTerm: "DS_MY", fullTerm: "Display (MY)" },
  { valueTerm: "DS_PT", fullTerm: "Display (PT)" },
  { valueTerm: "DS_TC", fullTerm: "Display (TC)" },
  { valueTerm: "DS_TH", fullTerm: "Display (TH)" },
  { valueTerm: "DS_UK", fullTerm: "Display (UK)" },
  { valueTerm: "DS_VI", fullTerm: "Display (VI)" },
  { valueTerm: "DY_AR", fullTerm: "Dynamic (AR)" },
  { valueTerm: "DY_DE", fullTerm: "Dynamic (DE)" },
  { valueTerm: "DY_EN", fullTerm: "Dynamic (EN)" },
  { valueTerm: "DY_ES", fullTerm: "Dynamic (ES)" },
  { valueTerm: "DY_MY", fullTerm: "Dynamic (MY)" },
  { valueTerm: "DY_PT", fullTerm: "Dynamic (PT)" },
  { valueTerm: "DY_TC", fullTerm: "Dynamic (TC)" },
  { valueTerm: "DY_TH", fullTerm: "Dynamic (TH)" },
  { valueTerm: "DY_UK", fullTerm: "Dynamic (UK)" },
  { valueTerm: "DY_VI", fullTerm: "Dynamic (VI)" },
  { valueTerm: "IE_AR", fullTerm: "Instant Experience (AR)" },
  { valueTerm: "IE_DE", fullTerm: "Instant Experience (DE)" },
  { valueTerm: "IE_EN", fullTerm: "Instant Experience (EN)" },
  { valueTerm: "IE_ES", fullTerm: "Instant Experience (ES)" },
  { valueTerm: "IE_MY", fullTerm: "Instant Experience (MY)" },
  { valueTerm: "IE_PT", fullTerm: "Instant Experience (PT)" },
  { valueTerm: "IE_TC", fullTerm: "Instant Experience (TC)" },
  { valueTerm: "IE_TH", fullTerm: "Instant Experience (TH)" },
  { valueTerm: "IE_UK", fullTerm: "Instant Experience (UK)" },
  { valueTerm: "IE_VI", fullTerm: "Instant Experience (VI)" },
  { valueTerm: "LS_UK", fullTerm: "Sitelink (UK)" },
  { valueTerm: "SE_AR", fullTerm: "Search (AR)" },
  { valueTerm: "SE_CZ", fullTerm: "Search (CZ)" },
  { valueTerm: "SE_DE", fullTerm: "Search (DE)" },
  { valueTerm: "SE_EN", fullTerm: "Search (EN)" },
  { valueTerm: "SE_ES", fullTerm: "Search (ES)" },
  { valueTerm: "SE_MY", fullTerm: "Search (MY)" },
  { valueTerm: "SE_NL", fullTerm: "Search (NL)" },
  { valueTerm: "SE_PT", fullTerm: "Search (PT)" },
  { valueTerm: "SE_TC", fullTerm: "Search (TC)" },
  { valueTerm: "SE_TH", fullTerm: "Search (TH)" },
  { valueTerm: "SE_UK", fullTerm: "Search (UK)" },
  { valueTerm: "SE_VI", fullTerm: "Search (VI)" },
  { valueTerm: "SL_AR", fullTerm: "Sitelink (AR)" },
  { valueTerm: "SL_CZ", fullTerm: "Sitelink (CZ)" },
  { valueTerm: "SL_DE", fullTerm: "Sitelink (DE)" },
  { valueTerm: "SL_EN", fullTerm: "Sitelink (EN)" },
  { valueTerm: "SL_ES", fullTerm: "Sitelink (ES)" },
  { valueTerm: "SL_MY", fullTerm: "Sitelink (MY)" },
  { valueTerm: "SL_NL", fullTerm: "Sitelink (NL)" },
  { valueTerm: "SL_PT", fullTerm: "Sitelink (PT)" },
  { valueTerm: "SL_TC", fullTerm: "Sitelink (TC)" },
  { valueTerm: "SL_TH", fullTerm: "Sitelink (TH)" },
  { valueTerm: "SL_VI", fullTerm: "Sitelink (VI)" },
  { valueTerm: "ST_AR", fullTerm: "Stories (AR)" },
  { valueTerm: "ST_DE", fullTerm: "Stories (DE)" },
  { valueTerm: "ST_EN", fullTerm: "Stories (EN)" },
  { valueTerm: "ST_ES", fullTerm: "Stories (ES)" },
  { valueTerm: "ST_MY", fullTerm: "Stories (MY)" },
  { valueTerm: "ST_PT", fullTerm: "Stories (PT)" },
  { valueTerm: "ST_TC", fullTerm: "Stories (TC)" },
  { valueTerm: "ST_TH", fullTerm: "Stories (TH)" },
  { valueTerm: "ST_UK", fullTerm: "Stories (UK)" },
  { valueTerm: "ST_VI", fullTerm: "Stories (VI)" },
  { valueTerm: "VD_AR", fullTerm: "Video (AR)" },
  { valueTerm: "VD_DE", fullTerm: "Video (DE)" },
  { valueTerm: "VD_EN", fullTerm: "Video (EN)" },
  { valueTerm: "VD_ES", fullTerm: "Video (ES)" },
  { valueTerm: "VD_MY", fullTerm: "Video (MY)" },
  { valueTerm: "VD_PT", fullTerm: "Video (PT)" },
  { valueTerm: "VD_TC", fullTerm: "Video (TC)" },
  { valueTerm: "VD_TH", fullTerm: "Video (TH)" },
  { valueTerm: "VD_UK", fullTerm: "Video (UK)" },
  { valueTerm: "VD_VI", fullTerm: "Video (VI)" },
];

const cont = [
  "ad1",
  "ad2",
  "ad3",
  "ad4",
  "ad5",
  "ad6",
  "ad7",
  "ad8",
  "ad9",
  "ad10",
  "ad11",
  "carousel 1",
  "carousel 2",
  "carousel 3",
  "carousel 4",
  "carousel 5",
  "dynamic 1",
  "dynamic 2",
  "dynamic 3",
  "dynamic 4",
  "dynamic 5",
  "email 1",
  "email 2",
  "email 3",
  "email 4",
  "instantexperience 1",
  "instantexperience 2",
  "instantexperience 3",
  "instantexperience 4",
  "instantexperience 5",
  "stories 1",
  "stories 2",
  "stories 3",
  "stories 4",
  "stories 5",
];

const medium = [
  { valueMed: "adroll", fullMedium: "adroll" },
  { valueMed: "alldevices", fullMedium: "alldevices" },
  { valueMed: "desktop", fullMedium: "desktop" },
  { valueMed: "display", fullMedium: "display" },
  { valueMed: "edax", fullMedium: "Email DAX" },
  { valueMed: "emm4u", fullMedium: "Email MoneyManager" },
  { valueMed: "epis", fullMedium: "Email PrimeIndexSignals" },
  { valueMed: "eprofittradings", fullMedium: "Email ProfitTradings" },
  { valueMed: "etradex", fullMedium: "Email TradeX" },
  { valueMed: "ewtf", fullMedium: "Email WTF" },
  { valueMed: "mobile", fullMedium: "mobile" },
  { valueMed: "native", fullMedium: "native" },
  { valueMed: "rt", fullMedium: "rt" },
  { valueMed: "search", fullMedium: "search" },
  { valueMed: "video", fullMedium: "video" },
  { valueMed: "remarketing", fullMedium: "remarketing" },
];

const UtmBuilder = () => {
  const [selectTioEntity, setSelectTioEntity] = useState(1);

  const actionNotification = useNotification();

  const [campaignStringyfiedObj, setCampaignStringyfiedOnj] = useState(
    JSON.stringify("")
  );
  const [base, setBase] = useState("");
  const [langUtm, setLangUtm] = useState("en");
  const [page, setPage] = useState("");
  const [entity, setEntity] = useState(".com");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmTerms, setUtmTerms] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [isGuerilla, setIsGuerilla] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  function onCampaingClick(e) {
    setCampaignStringyfiedOnj(e.target.value);
  }

  useEffect(() => {
    const parsed = JSON.parse(campaignStringyfiedObj);
    setBase(parsed.baseURL);
    setUtmCampaign(parsed.campaign);
    setPage(parsed.page);
    setIsGuerilla(parsed.isGuerilla);
  }, [campaignStringyfiedObj]);

  useEffect(() => {
    setOutputUrl(
      `${base}${entity}/${langUtm}/${
        page && `${page}`
      }?utm_campaign=${utmCampaign?.replaceAll(" ", "")}${
        utmSource && `&utm_source=${utmSource.replaceAll(" ", "")}`
      }${utmTerms && `&utm_term=${utmTerms.replaceAll(" ", "")}`}${
        utmContent && `&utm_content=${utmContent.replaceAll(" ", "")}`
      }${utmMedium && `&utm_medium=${utmMedium.replaceAll(" ", "")}`}`
    );
  }, [
    base,
    utmCampaign,
    page,
    langUtm,
    utmSource,
    utmTerms,
    utmContent,
    utmMedium,
    entity,
  ]);

  useEffect(() => {
    if (isGuerilla) setEntity("");
  }, [isGuerilla]);

  const handleClear = () => {
    setBase("");
    setLangUtm("");
    setPage("");
    setEntity("");
    setUtmCampaign("");
    setUtmSource("");
    setUtmTerms("");
    setUtmContent("");
    setUtmMedium("");
    setOutputUrl("");
    setIsGuerilla(false);
    setIsPreview(false);
  };

  // Preview / visit / clear / copy button

  return (
    <PageOuter>
      <Title>UTM Builder</Title>
      <MainDiv>
        <InnerDiv>
          <Data>
            <EntityLang>
              <BaseDiv>
                <URLP>BASE URL</URLP>
                <TioEntity>
                  <div
                    className={selectTioEntity === 1 ? "isActive" : "notActive"}
                    // onClick={tioComChange}
                    onClick={() => {
                      setSelectTioEntity(1);
                      setEntity(".com");
                    }}
                  >
                    tiomarkets.com
                  </div>
                  <div
                    className={selectTioEntity === 2 ? "isActive" : "notActive"}
                    // onClick={tioUkChange}
                    onClick={() => {
                      setSelectTioEntity(2);
                      setEntity(".uk");
                    }}
                  >
                    tiomarkets.uk
                  </div>
                  <div
                    className={selectTioEntity === 3 ? "isActive" : "notActive"}
                    // onClick={tioUkChange}
                    onClick={() => {
                      setSelectTioEntity(3);
                      setEntity(".eu");
                    }}
                  >
                    tiomarkets.eu
                  </div>
                </TioEntity>
              </BaseDiv>
              <SelectionDiv1>
                <SelectDiv>
                  <Label>CAMPAIGN</Label>
                  <Select
                    onChange={onCampaingClick}
                    value={campaignStringyfiedObj}
                  >
                    <option disabled value={JSON.stringify("")}>
                      0. Please selecet a campaign
                    </option>
                    {campaign.map((data, i) => (
                      <option key={i} value={JSON.stringify(data)}>
                        {data.campaign}
                      </option>
                    ))}
                  </Select>
                </SelectDiv>
                <SelectDiv>
                  <Label>LANGUAGE</Label>
                  <Select
                    onChange={(e) => setLangUtm(e.target.value)}
                    value={langUtm}
                  >
                    <option value={""} disabled>
                      0. Please selecet a language
                    </option>
                    {language.map((lang, i) => (
                      <option key={i} value={lang.valLang}>
                        {lang.fullLang}
                      </option>
                    ))}
                  </Select>
                </SelectDiv>
                <SelectDiv>
                  <Label>SOURCE</Label>
                  <Select
                    onChange={(e) => setUtmSource(e.target.value)}
                    value={utmSource}
                  >
                    <option disabled value={""}>
                      0. Please selecet a source
                    </option>
                    {source.map((sour, i) => (
                      <option key={i} value={sour}>
                        {sour}
                      </option>
                    ))}
                  </Select>
                </SelectDiv>
              </SelectionDiv1>
              <SelectionDiv2>
                <SelectDiv>
                  <Label>TERM</Label>
                  <Select
                    onChange={(e) => setUtmTerms(e.target.value)}
                    value={utmTerms}
                  >
                    <option value={""} disabled>
                      0. Please selecet a term
                    </option>
                    {terms.map((ter, i) => (
                      <option key={i} value={ter.valueTerm}>
                        {ter.fullTerm}
                      </option>
                    ))}
                  </Select>
                </SelectDiv>
                <SelectDiv>
                  <Label> CONTENT</Label>
                  <Select
                    onChange={(e) => setUtmContent(e.target.value)}
                    value={utmContent}
                  >
                    <option value={""} disabled>
                      0. Please selecet content
                    </option>
                    {cont.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </SelectDiv>
                <SelectDiv>
                  <Label> MEDIUM</Label>
                  <Select
                    onChange={(e) => setUtmMedium(e.target.value)}
                    value={utmMedium}
                  >
                    <option value={""} disabled>
                      0. Please selecet a medium
                    </option>
                    {medium.map((med, i) => (
                      <option key={i} value={med.valueMed}>
                        {med.fullMedium}
                      </option>
                    ))}
                  </Select>
                </SelectDiv>
              </SelectionDiv2>
            </EntityLang>
          </Data>

          <PreviewDiv>
            {isPreview ? (
              <iframe src={outputUrl} />
            ) : (
              <PreviewComponent>
                <Title>Loading</Title>
              </PreviewComponent>
            )}
          </PreviewDiv>
          <TDiv>
            <BtnDiv
              onClick={() => {
                setIsPreview(true);
                actionNotification.SUCCESS("Preview mode activated.");
              }}
            >
              PREVIEW
            </BtnDiv>
            <BtnDiv
              onClick={() => {
                if (utmCampaign === "" && utmSource === "" && utmTerms === "") {
                  actionNotification.ERROR("You haven't selected any options.");
                  return;
                } else if (utmCampaign === "" || utmSource === "") {
                  actionNotification.WARNING(
                    "You haven't picked a source and/or campaign"
                  );
                  return;
                }
                navigator.clipboard.writeText(outputUrl);
                actionNotification.SUCCESS("Copied Succesfull");
              }}
            >
              COPY
            </BtnDiv>
            <BtnDiv>
              <Link href={{ pathname: outputUrl }} passHref>
                <a target="_blank">VISIT</a>
              </Link>
            </BtnDiv>
            <BtnDiv onClick={handleClear}>CLEAR</BtnDiv>
          </TDiv>
          <URLSelection>
            <p>{outputUrl}</p>
          </URLSelection>
        </InnerDiv>
      </MainDiv>
    </PageOuter>
  );
};

export default UtmBuilder;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}

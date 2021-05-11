/**
 * CODE LICENSED UNDER THE CREATIVE COMMON BY-NC-ND LICENSE.
 * https://creativecommons.org/licenses/by-nc-nd/4.0/
 * 
 * Copyright 2021 by Baswazz
 */
 
/** @OnlyCurrentDoc */
const sheet = SpreadsheetApp.getActive();
const currency = "EUR"; // USD
const apiKey = ""; // Get your free API Key https://p.nomics.com/pricing
const autoUpdate = 15; // Minutes

// Sheet columns
const idRange = "A2:A"; // Currency ticker Column
const sheetColName = "B"; // Currency name
const sheetColPrice = "C"; // Currency price
const sheetCol1d = "D"; // Currency price change 1d
const sheetCol7d = "E"; // Currency price change 7d
const sheetCol30d = "F"; // Currency price change 30d
const sheetCol365d = "G"; // Currency price change 1 year
const sheetColYtd = "H"; // Currency price change Ytd
const sheetColMktCap = "I"; // Currency Market Cap

function onOpen() {
  // Add UI menu
  SpreadsheetApp.getUi()
    .createMenu("Crypto")
    .addItem("Update", "fetchData")
    .addItem("Install triggers", "createTimeDrivenTriggers")
    .addToUi();
}

function fetchData() {
  // Get ids from sheet
  let sheetIds = sheet.getRange(idRange).getValues();
  sheetIds = sheetIds.filter(String);

  // Fetch data
  const url =
    "https://api.nomics.com/v1/currencies/ticker?key=" +
    apiKey +
    "&ids=" +
    sheetIds.toString() +
    "&convert=" +
    currency;
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  // Add data to sheet
  sheetIds.forEach(function (sheetId, index) {
    data.forEach(function (currency) {
      if (currency.id == sheetId) {
        sheet.getRange(sheetColName + (index + 2)).setValue(currency.name);
        sheet
          .getRange(sheetColPrice + (index + 2))
          .setValue(parseFloat(currency.price));
        sheet
          .getRange(sheetCol1d + (index + 2))
          .setValue(parseFloat(currency["1d"].price_change_pct));
        sheet
          .getRange(sheetCol7d + (index + 2))
          .setValue(parseFloat(currency["7d"].price_change_pct));
        sheet
          .getRange(sheetCol30d + (index + 2))
          .setValue(parseFloat(currency["30d"].price_change_pct));
        sheet
          .getRange(sheetCol365d + (index + 2))
          .setValue(parseFloat(currency["365d"].price_change_pct));
        sheet
          .getRange(sheetColYtd + (index + 2))
          .setValue(parseFloat(currency["ytd"].price_change_pct));
        sheet
          .getRange(sheetColMktCap + (index + 2))
          .setValue(parseFloat(currency.market_cap));
      }
    });
  });
}

function createTimeDrivenTriggers() {
  // Create a time-driven triggers
  ScriptApp.newTrigger("getcoins").forSpreadsheet(sheet).onOpen().create();
  ScriptApp.newTrigger("getCoins").timeBased().everyMinutes(autoUpdate).create();
}

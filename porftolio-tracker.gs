/**
 * CODE LICENSED UNDER THE CREATIVE COMMON BY-NC-ND LICENSE.
 * https://creativecommons.org/licenses/by-nc-nd/4.0/
 *
 * Copyright 2023 by Baswazz
 */

/** @OnlyCurrentDoc */
const updateIntervalInHours = 1; // Minutes
const currency = "USD"; // USD
const apiKey = PropertiesService.getScriptProperties().getProperty("apiKey"); // Get your free API Key https://coinmarketcap.com/api/
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
const sheet = SpreadsheetApp.getActiveSheet();
const idRange = "A2:A"; // Currency symbol
const symbols = sheet
  .getRange(idRange)
  .getValues()
  .flat()
  .filter((id) => id !== "");

// Sheet columns
const sheetColName = "B"; // Currency name
const sheetColPrice = "C"; // Currency price
const sheetColPercentChange1h = "D"; // Currency price change 1h
const sheetColPercentChange24h = "E"; // Currency price change 24h
const sheetColPercentChange7d = "F"; // Currency price change 7d
const sheetColPercentChang30d = "G"; // Currency price change 30d
const sheetColPercentChang60d = "H"; // Currency price change 60d
const sheetColPercentChang90d = "I"; // Currency price change 90d
const sheetColMarketCap = "J"; // Currency Market Cap
// const sheetColMarketCapDominance = "K"; // Currency Market Cap Dominance

function onOpen() {
  // Add UI menu
  SpreadsheetApp.getUi()
    .createMenu("Crypto")
    .addItem("Update", "fetchData")
    .addItem("Install triggers", "createTimeDrivenTriggers")
    .addToUi();
}

function fetchData() {
  const headers = {
    "X-CMC_PRO_API_KEY": apiKey,
  };
  const url =
    "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=" +
    symbols +
    "&convert=" +
    currency;
  // const url = "https://sandbox-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=" + symbols + "&convert=" + currency;
  const response = UrlFetchApp.fetch(url, { headers });
  const responseContent = response.getContentText();
  const data = JSON.parse(responseContent);

  dataToSheet(data);
}

function dataToSheet(data) {
  const coins = data.data;

  for (const symbol in coins) {
    if (coins.hasOwnProperty(symbol)) {
      const coin = coins[symbol][0];
      const rowIndex = symbols.indexOf(symbol) + 2; // Adding 2 to match sheet row index

      // Write data to the corresponding row
      if (sheetColName)
        sheet.getRange(sheetColName + rowIndex).setValue(coin.name);
      if (sheetColPrice)
        sheet
          .getRange(sheetColPrice + rowIndex)
          .setValue(parseFloat(coin.quote[currency].price));
      if (sheetColPercentChange1h)
        sheet
          .getRange(sheetColPercentChange1h + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_1h));
      if (sheetColPercentChange24h)
        sheet
          .getRange(sheetColPercentChange24h + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_24h));
      if (sheetColPercentChange7d)
        sheet
          .getRange(sheetColPercentChange7d + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_7d));
      if (sheetColPercentChang30d)
        sheet
          .getRange(sheetColPercentChang30d + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_30d));
      if (sheetColPercentChang60d)
        sheet
          .getRange(sheetColPercentChang60d + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_60d));
      if (sheetColPercentChang90d)
        sheet
          .getRange(sheetColPercentChang90d + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_90d));
      if (sheetColMarketCap)
        sheet
          .getRange(sheetColMarketCap + rowIndex)
          .setValue(parseFloat(coin.quote[currency].market_cap));
      if (sheetColMarketCapDominance)
        sheet
          .getRange(sheetColMarketCapDominance + rowIndex)
          .setValue(parseFloat(coin.quote[currency].market_cap_dominance));
    }
  }
}

function createTimeDrivenTriggers() {
  ScriptApp.newTrigger("fetchData")
    .forSpreadsheet(spreadsheet)
    .onOpen()
    .create();
  ScriptApp.newTrigger("fetchData")
    .timeBased()
    .everyHours(updateIntervalInHours)
    .create();
}

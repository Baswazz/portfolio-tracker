/**
 * CODE LICENSED UNDER THE CREATIVE COMMON BY-NC-ND LICENSE.
 * https://creativecommons.org/licenses/by-nc-nd/4.0/
 *
 * Copyright 2021 by Baswazz
 */

/** @OnlyCurrentDoc */
const updateIntervalInHours = 1; // Hours
const currency = "EUR"; // USD
const apiKey = PropertiesService.getScriptProperties().getProperty("apiKey"); // Get your free API Key https://coinmarketcap.com/api/
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
const sheet = SpreadsheetApp.getActiveSheet();
const idRange = "A2:A"; // Currency symbol
const symbols = sheet
  .getRange(idRange)
  .getValues()
  .flat()
  .filter((id) => id !== "");

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
      sheet.getRange("B" + rowIndex).setValue(coin.name);
      sheet
        .getRange("C" + rowIndex)
        .setValue(parseFloat(coin.quote[currency].price));
      sheet
        .getRange("D" + rowIndex)
        .setValue(parseFloat(coin.quote[currency].percent_change_1h));
      sheet
        .getRange("E" + rowIndex)
        .setValue(parseFloat(coin.quote[currency].percent_change_24h));
      sheet
        .getRange("F" + rowIndex)
        .setValue(parseFloat(coin.quote[currency].percent_change_7d));
      sheet
        .getRange("G" + rowIndex)
        .setValue(parseFloat(coin.quote[currency].percent_change_30d));
      sheet
        .getRange("H" + rowIndex)
        .setValue(parseFloat(coin.quote[currency].percent_change_60d));
      sheet
        .getRange("I" + rowIndex)
        .setValue(parseFloat(coin.quote[currency].percent_change_90d));
      sheet
        .getRange("J" + rowIndex)
        .setValue(parseFloat(coin.quote[currency].market_cap));
      sheet
        .getRange("K" + rowIndex)
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

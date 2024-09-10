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
const sheetColSymbol = "B2:B"; // Currency symbol
const sheetColCoinName = "A";
const sheetColPrice = "D";
const sheetColPercentChange1h = "E";
const sheetColPercentChange24h = "F";
const sheetColPercentChange7d = "G";
const sheetColPercentChange30d = "H";
const sheetColPercentChange60d = "I";
const sheetColPercentChange90d = "J";
const sheetColMarketCap = "K";
const sheetColMarketCapDominance = "L";
const sheetColVolume24h = "M";
const sheetColVolumeChange24h = "N";
const symbols = sheet
  .getRange(sheetColSymbol)
  .getValues()
  .flat()
  .filter(Boolean);

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
    Accept: "application/json",
  };
  const url =
    "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=" +
    symbols.join(",") +
    "&convert=" +
    currency;

  try {
    const response = UrlFetchApp.fetch(url, { headers });
    if (response.getResponseCode() === 200) {
      const responseContent = response.getContentText();
      const data = JSON.parse(responseContent);
      dataToSheet(data);
    } else {
      Logger.log("Error: " + response.getResponseCode());
    }
  } catch (e) {
    Logger.log("Exception: " + e.toString());
  }
}

function dataToSheet(data) {
  const coins = data.data;

  for (const symbol in coins) {
    if (coins.hasOwnProperty(symbol)) {
      const coin = coins[symbol][0];
      const rowIndex = symbols.indexOf(symbol) + 2; // Adding 2 to match sheet row index

      // Write data to the corresponding row
      if (sheetColCoinName) {
        sheet.getRange(sheetColCoinName + rowIndex).setValue(coin.name);
      }
      if (sheetColPrice) {
        sheet
          .getRange(sheetColPrice + rowIndex)
          .setValue(parseFloat(coin.quote[currency].price));
      }
      if (sheetColPercentChange1h) {
        sheet
          .getRange(sheetColPercentChange1h + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_1h) / 100);
      }
      if (sheetColPercentChange24h) {
        sheet
          .getRange(sheetColPercentChange24h + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_24h) / 100);
      }
      if (sheetColPercentChange7d) {
        sheet
          .getRange(sheetColPercentChange7d + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_7d) / 100);
      }
      if (sheetColPercentChange30d) {
        sheet
          .getRange(sheetColPercentChange30d + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_30d) / 100);
      }
      if (sheetColPercentChange60d) {
        sheet
          .getRange(sheetColPercentChange60d + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_60d) / 100);
      }
      if (sheetColPercentChange90d) {
        sheet
          .getRange(sheetColPercentChange90d + rowIndex)
          .setValue(parseFloat(coin.quote[currency].percent_change_90d) / 100);
      }
      if (sheetColMarketCap) {
        sheet
          .getRange(sheetColMarketCap + rowIndex)
          .setValue(parseFloat(coin.quote[currency].market_cap));
      }
      if (sheetColMarketCapDominance) {
        sheet
          .getRange(sheetColMarketCapDominance + rowIndex)
          .setValue(
            parseFloat(coin.quote[currency].market_cap_dominance) / 100
          );
      }
      if (sheetColVolume24h) {
        sheet
          .getRange(sheetColVolume24h + rowIndex)
          .setValue(parseFloat(coin.quote[currency].volume_24h));
      }
      if (sheetColVolumeChange24h) {
        sheet
          .getRange(sheetColVolumeChange24h + rowIndex)
          .setValue(parseFloat(coin.quote[currency].volume_change_24h) / 100);
      }
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

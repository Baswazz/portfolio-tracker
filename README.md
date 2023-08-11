# Getting Started
Crypto portfolio tracker for Google Sheets.
Get your free API key from https://coinmarketcap.com/api/

## How to Install
1. Open Google Sheets.
2. Go to `Extensions` › `Apps Script`
3. Copy the content of portfolio-tracker.gs and paste it in the script editor (replace any existing content).
4. Save the script with `File` › `Save`, name it porftolio-tracker or something creative.
6. Back to your Google sheet, refresh the page, a `Crypto` menu will appear next to `Help`
7. Then go to `Project settings` and scroll to section `Scriptproperties`.
8. Add a property called `apiKey` and add your API key as the value.
9. Enter the ticker names in your Google sheet from column A2 onwards (e.g. BTC, ETH).
10. `Install triggers` can be used to update the Google sheet with the latest data.
   - Get the latest data when loading your Google sheet.
   - Updates the sheet every 1 hour.
11. Use `Update` to manually update your Google sheet with the latest data.

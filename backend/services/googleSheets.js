const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const credentialsPath = path.resolve(__dirname, "..", "credentials.json");

const hasCredentials = fs.existsSync(credentialsPath);

function loadServiceAccountCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    } catch (error) {
      console.warn("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON. Falling back to local file if available.");
    }
  }

  if (hasCredentials) {
    return credentialsPath;
  }

  return null;
}

const serviceAccountCredentials = loadServiceAccountCredentials();

let warnedMissingCredentials = false;

const auth =
  serviceAccountCredentials && typeof serviceAccountCredentials === "string"
    ? new google.auth.GoogleAuth({
        keyFile: serviceAccountCredentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
      })
    : serviceAccountCredentials
      ? new google.auth.GoogleAuth({
          credentials: serviceAccountCredentials,
          scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
        })
      : null;

async function getSalesData() {
  if (!auth || !process.env.GOOGLE_SHEET_ID) {
    if (!warnedMissingCredentials) {
      console.warn(
        "Google Sheets credentials not found. Using fallback local scores from environment values."
      );
      warnedMissingCredentials = true;
    }

    return {
      teamA: Number(process.env.FALLBACK_TEAM_A || 135),
      teamB: Number(process.env.FALLBACK_TEAM_B || 122)
    };
  }

  if (!auth) {
    if (!warnedMissingCredentials) {
      console.warn(
        "Google Sheets auth was not configured. Using fallback local scores from environment values."
      );
      warnedMissingCredentials = true;
    }

    return {
      teamA: Number(process.env.FALLBACK_TEAM_A || 135),
      teamB: Number(process.env.FALLBACK_TEAM_B || 122)
    };
  }

  const sheets = google.sheets({
    version: "v4",
    auth
  });

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID
  });

  const firstSheetTitle =
    spreadsheet.data.sheets?.[0]?.properties?.title || "Sheet1";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${firstSheetTitle}!A:D`
  });

  const rows = response.data.values || [];

  const salesByTeam = {};

  function recordTeam(teamName, salesValue) {
    if (!teamName) {
      return;
    }

    salesByTeam[teamName.trim().toLowerCase()] = Number(salesValue || 0);
  }

  // Format 1: vertical rows like Team | Sales
  for (let index = 1; index < rows.length; index += 1) {
    recordTeam(rows[index]?.[0], rows[index]?.[1]);
  }

  // Format 2: horizontal header row with team names across row 2 and scores in row 3.
  const horizontalTeamRow = rows[1] || [];
  const horizontalSalesRow = rows[2] || [];

  for (
    let columnIndex = 1;
    columnIndex < Math.max(horizontalTeamRow.length, horizontalSalesRow.length);
    columnIndex += 1
  ) {
    recordTeam(horizontalTeamRow[columnIndex], horizontalSalesRow[columnIndex]);
  }

  const teamA =
    salesByTeam["team a"] ??
    salesByTeam["teama"] ??
    Number(rows[1]?.[1] || rows[2]?.[1] || 0);

  const teamB =
    salesByTeam["team b"] ??
    salesByTeam["teamb"] ??
    Number(rows[1]?.[2] || rows[2]?.[2] || 0);

  return {
    teamA,
    teamB
  };
}

module.exports = {
  getSalesData
};

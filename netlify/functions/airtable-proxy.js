// netlify/functions/airtable-proxy.js

export async function handler(event, context) {
  try {
    const params = event.queryStringParameters || {};

    const tableName = params.table || "All Events";
    const viewName = params.view || "Grid view";

    const encodedTable = encodeURIComponent(tableName);
    const encodedView = encodeURIComponent(viewName);

    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;

    if (!baseId || !apiKey) {
      throw new Error("Airtable Base ID or API Key is missing in environment variables");
    }

    const url = `https://api.airtable.com/v0/${baseId}/${encodedTable}?view=${encodedView}`;
    console.log("Fetching Airtable URL:", url);

    // Use the built-in fetch — no import needed
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${text}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.error("Error in Airtable Proxy:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}


// netlify/functions/airtable-proxy.js

// import fetch from "node-fetch";

// export async function handler(event, context) {
//   try {
//     const params = event.queryStringParameters || {};

//     // Accept table and view from query params, provide defaults
//     const tableName = params.table || "All Events";
//     const viewName = params.view || "Grid view";

//     // Encode names for URL
//     const encodedTable = encodeURIComponent(tableName);
//     const encodedView = encodeURIComponent(viewName);

//     // Base ID and API key from environment variables
//     const baseId = process.env.AIRTABLE_BASE_ID;
//     const apiKey = process.env.AIRTABLE_API_KEY;

//     if (!baseId || !apiKey) {
//       throw new Error("Airtable Base ID or API Key is missing in environment variables");
//     }

//     const url = `https://api.airtable.com/v0/${baseId}/${encodedTable}?view=${encodedView}`;
//     console.log("Fetching Airtable URL:", url);

//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Airtable API error: ${response.status} - ${text}`);
//     }

//     const data = await response.json();

//     return {
//       statusCode: 200,
//       body: JSON.stringify(data),
//       headers: {
//         "Access-Control-Allow-Origin": "*", // allow your frontend to access
//       },
//     };
//   } catch (err) {
//     console.error("Error in Airtable Proxy:", err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: err.message }),
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//       },
//     };
//   }
// }


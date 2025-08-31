// netlify/functions/airtable-proxy.js

export async function handler(event, context) {
  const params = event.queryStringParameters;
  const viewName = params.view || "Grid view"; // fallback if nothing passed

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/app3cnkgCHioDIU3j/All%20Events?view=${encodeURIComponent(viewName)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

// netlify/functions/airtable-proxy.js

export async function handler(event, context) {
  // Get the view name passed from Webflow
  const params = event.queryStringParameters;
  const viewName = params.view || "All Events"; // default if none is sent

  const response = await fetch(
    `https://api.airtable.com/v0/appA1b2C3d4E5/All%20Events?view=${viewName}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    }
  );

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*", // lets Webflow use it
    },
  };
}

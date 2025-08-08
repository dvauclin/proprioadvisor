
export const triggerWebhook = async (data: any) => {
  console.log("ðŸŽ¯ WEBHOOK TRIGGERED - Function called!");
  console.log("ðŸ“ Input data:", data);
  
  const webhookUrl = "https://n8n.davidvauclin.fr/webhook/235febdf-0463-42fd-adb2-dbb6e1c2302d";
  
  try {
    console.log("ðŸš€ Starting webhook trigger for:", data.type);
    console.log("ðŸ”— Target URL:", webhookUrl);
    
    // Try with CORS first (better for debugging)
    console.log("ðŸ”„ Attempting CORS request...");
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    console.log("âœ… Response received!");
    console.log("ðŸ“Š Response status:", response.status);
    console.log("ðŸ“Š Response statusText:", response.statusText);
    console.log("ðŸ“Š Response type:", response.type);
    
    if (response.ok) {
      console.log("ðŸŽ‰ Webhook sent successfully for:", data.type);
      try {
        const responseText = await response.text();
        console.log("ðŸ“„ Response body:", responseText);
      } catch (textError) {
        console.log("âš ï¸ Could not read response body:", (textError as Error)?.message);
      }
    } else {
      console.warn("âš ï¸ Response not OK:", response.status, response.statusText);
    }
    
  } catch (corsError) {
    console.error("âŒ CORS request failed:", corsError);
    console.log("ðŸ”„ Fallback: Trying no-cors mode...");
    
    try {
      // Fallback to no-cors with URL parameters
      const url = new URL(webhookUrl);
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object' && data[key] !== null) {
          url.searchParams.append(key, JSON.stringify(data[key]));
        } else {
          url.searchParams.append(key, data[key]);
        }
      });
      
      console.log("ðŸ”— Final URL with params:", url.toString());
      
      const noCorsResponse = await fetch(url.toString(), {
        method: "POST",
        mode: "no-cors",
      });
      
      console.log("âœ… No-cors request sent for:", data.type);
      console.log("ðŸ“¡ No-cors response type:", noCorsResponse.type);
      
    } catch (noCorsError) {
      console.error("âŒ No-cors request also failed:", noCorsError);
      throw noCorsError;
    }
  }
};


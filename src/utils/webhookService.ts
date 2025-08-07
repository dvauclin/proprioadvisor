
export const triggerWebhook = async (data: any) => {
  console.log("🎯 WEBHOOK TRIGGERED - Function called!");
  console.log("📝 Input data:", data);
  
  const webhookUrl = "https://n8n.davidvauclin.fr/webhook/235febdf-0463-42fd-adb2-dbb6e1c2302d";
  
  try {
    console.log("🚀 Starting webhook trigger for:", data.type);
    console.log("🔗 Target URL:", webhookUrl);
    
    // Try with CORS first (better for debugging)
    console.log("🔄 Attempting CORS request...");
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    console.log("✅ Response received!");
    console.log("📊 Response status:", response.status);
    console.log("📊 Response statusText:", response.statusText);
    console.log("📊 Response type:", response.type);
    
    if (response.ok) {
      console.log("🎉 Webhook sent successfully for:", data.type);
      try {
        const responseText = await response.text();
        console.log("📄 Response body:", responseText);
      } catch (textError) {
        console.log("⚠️ Could not read response body:", (textError as Error)?.message);
      }
    } else {
      console.warn("⚠️ Response not OK:", response.status, response.statusText);
    }
    
  } catch (corsError) {
    console.error("❌ CORS request failed:", corsError);
    console.log("🔄 Fallback: Trying no-cors mode...");
    
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
      
      console.log("🔗 Final URL with params:", url.toString());
      
      const noCorsResponse = await fetch(url.toString(), {
        method: "POST",
        mode: "no-cors",
      });
      
      console.log("✅ No-cors request sent for:", data.type);
      console.log("📡 No-cors response type:", noCorsResponse.type);
      
    } catch (noCorsError) {
      console.error("❌ No-cors request also failed:", noCorsError);
      throw noCorsError;
    }
  }
};

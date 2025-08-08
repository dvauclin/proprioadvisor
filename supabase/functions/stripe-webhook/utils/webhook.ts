import { logStep } from "./logging.ts";

export const triggerWebhook = async (data: any) => {
  try {
    const webhookUrl = "https://n8n.davidvauclin.fr/webhook/235febdf-0463-42fd-adb2-dbb6e1c2302d";
    
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    logStep("Webhook triggered successfully", { type: data.type });
  } catch (error) {
    logStep("Error triggering webhook", { error: error.message });
  }
};

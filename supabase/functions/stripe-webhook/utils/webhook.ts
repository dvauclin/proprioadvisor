import { logStep } from "./logging.ts";

export const triggerWebhook = async (data: any) => {
  try {
    const webhookUrl = Deno.env.get("N8N_WEBHOOK_URL");
    if (!webhookUrl) return;

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

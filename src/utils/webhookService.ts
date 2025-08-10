
export const triggerWebhook = async (data: any) => {
  const webhookUrl =
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('N8N webhook URL not configured');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.error('Webhook trigger failed:', err);
  }
};


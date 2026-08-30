// Telegram Bot utility — server-side only
// Never import this in client components!

export interface TelegramMessage {
  name: string;
  email: string;
  message: string;
  timestamp?: string;
}

function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

export async function sendToTelegram(data: TelegramMessage): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[Telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables"
    );
    return false;
  }

  const timestamp = new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const text = [
    "🚀 *New Portfolio Message\\!*",
    "",
    `👤 *Name:* ${escapeMarkdownV2(data.name)}`,
    `📧 *Email:* ${escapeMarkdownV2(data.email)}`,
    `🕐 *Time:* ${escapeMarkdownV2(timestamp)}`,
    "",
    "💬 *Message:*",
    `${escapeMarkdownV2(data.message)}`,
    "",
    "\\-\\-\\-",
    "_Sent from your portfolio website_",
  ].join("\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "MarkdownV2",
        }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("[Telegram] API error:", result);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Telegram] Network error:", error);
    return false;
  }
}

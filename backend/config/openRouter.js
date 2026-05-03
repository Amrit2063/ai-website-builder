const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

const model = "deepseek/deepseek-chat";

export const generateResponse = async (prompt) => {
  try {
    const res = await fetch(openRouterUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4000,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: "You generate production-grade responsive websites.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || "OpenRouter request failed");
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("OpenRouter Error:", error);
    throw error;
  }
};
export const summarizeNews = async (titles: string[], language: string = "en") => {
  const prompt = `Summarize the following crypto news headlines in ${language === "fr" ? "French" : "English"}:\n${titles.join("\n")}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

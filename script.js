const form = document.getElementById('promptForm');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(output.textContent)
    .then(() => alert("✅ Prompt copied to clipboard!"));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiKey = document.getElementById('apikey').value.trim();
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value.trim();

  if (!apiKey || !category || !description) {
    alert("❌ Please fill in all fields including your API key.");
    return;
  }

  output.textContent = "⏳ Generating prompt...";

  const prompt = `You are a skilled and experienced ${category}.
I want to ${description}.
Structure your response using this prompt formula:
Persona, Context, Task, Format, Exemplar, and Tone.
Return a complete, professional-quality AI prompt I can use directly.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (result) {
      output.textContent = result;
    } else {
      output.textContent = "⚠️ No response from Gemini API. Check your key or input.";
    }

  } catch (error) {
    console.error(error);
    output.textContent = "❌ Error calling Gemini API. This might be a CORS issue if opened locally.";
  }
});


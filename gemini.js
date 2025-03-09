async function getGeminiResponse(prompt) {
    const apiKey = "YOUR_GEMINI_API_KEY";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${apiKey}`;

    const requestBody = {
        prompt: { text: prompt },
        temperature: 0.7
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log(data);
    return data.candidates[0]?.content;
}

// Example Usage
getGeminiResponse("Tell me a joke").then(console.log);

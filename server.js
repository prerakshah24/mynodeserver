<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Premanand Maharaj AI Chat</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center px-4">
  <div class="bg-white shadow-xl rounded-2xl p-6 max-w-xl w-full space-y-4">
    <h1 class="text-2xl font-bold text-center text-indigo-700">🕉️ प्रेमानंद महाराज AI संवाद</h1>
    <h2 class="text-lg text-gray-600 text-center">Premanand Maharaj AI Discussion</h2>

    <textarea
      id="question"
      rows="4"
      placeholder="अपना प्रश्न यहाँ टाइप करें... (Type your question here...)"
      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
    ></textarea>

    <button
      onclick="askAI()"
      class="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
    >
      पूछें (Ask)
    </button>

    <div
      id="answer"
      class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 min-h-[60px] text-gray-800"
    >
      <!-- Hindi Answer will appear here -->
    </div>

    <div
      id="english-answer"
      class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 min-h-[60px] text-gray-600 italic"
    >
      <!-- English Translation will appear here -->
    </div>

    <!-- ✅ Listen Button -->
    <button
      onclick="speakAnswer()"
      class="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
    >
      🔊 उत्तर सुनें (Listen to Answer)
    </button>
  </div>

  <script>
    async function askAI() {
      const question = document.getElementById('question').value;
      const answerElement = document.getElementById('answer');
      const englishAnswerElement = document.getElementById('english-answer');

      if (!question.trim()) {
        answerElement.innerText = "कृपया एक प्रश्न दर्ज करें!";
        englishAnswerElement.innerText = "Please enter a question!";
        return;
      }

      answerElement.innerText = "उत्तर आ रहा है...";
      englishAnswerElement.innerText = "Fetching response...";

      try {
        const response = await fetch('https://mynodeserver-ivk5.onrender.com/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });

        const data = await response.json();
        console.log("Server Response:", data);

        if (data.answer) {
          answerElement.innerText = `🕉️ हिंदी उत्तर: ${data.answer}`;
          const englishTranslation = await translateToEnglish(data.answer);
          englishAnswerElement.innerText = `🔹 English Translation: ${englishTranslation}`;
        } else {
          answerElement.innerText = "कोई उत्तर नहीं मिला। कृपया पुनः प्रयास करें।";
          englishAnswerElement.innerText = "No answer received. Please try again.";
        }
      } catch (error) {
        console.error("Error:", error);
        answerElement.innerText = "❌ कुछ गलत हुआ। कृपया सर्वर जांचें।";
        englishAnswerElement.innerText = "❌ Something went wrong. Please check the server.";
      }
    }

    async function translateToEnglish(hindiText) {
      try {
        const response = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(hindiText) + '&langpair=hi|en');
        const data = await response.json();
        return data.responseData.translatedText || "Translation unavailable.";
      } catch {
        return "Translation service failed.";
      }
    }

    function speakAnswer() {
      const text = document.getElementById('answer').innerText;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.pitch = 1.1;
      utterance.rate = 1;

      const voices = speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang === 'hi-IN');
      if (hindiVoice) utterance.voice = hindiVoice;

      speechSynthesis.speak(utterance);
    }

    // Ensure voices are loaded (Chrome bug fix)
    window.speechSynthesis.onvoiceschanged = () => {};
  </script>
</body>
</html>

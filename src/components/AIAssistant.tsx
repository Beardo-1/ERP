import React, { useState, useRef } from "react";

const SYSTEM_PROMPT =
  "You are an AI assistant for a Saudi ERP. Answer in Arabic and English. Be concise and helpful.";

const quickActions = [
  { label: "Show today's tasks", prompt: "What are my tasks for today?" },
  { label: "Send payment reminder", prompt: "Send a payment reminder to client X." },
  { label: "Get weather", prompt: "What's the weather in Riyadh?" },
];

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  const sendMessage = async (msg: string) => {
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    // Replace with your real AI API call
    const response = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ prompt: `${SYSTEM_PROMPT}\nUser: ${msg}` }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply || "Sorry, I couldn't answer." },
    ]);
    setLoading(false);
  };

  const handleInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    if (!recognitionRef.current) {
      // @ts-ignore
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.lang = "ar-SA";
      recognitionRef.current.onresult = (event: any) => {
        setInput(event.results[0][0].transcript);
      };
    }
    recognitionRef.current.start();
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <h2>ERP AI Assistant</h2>
      <div style={{ marginBottom: 12 }}>
        {quickActions.map((qa) => (
          <button
            key={qa.label}
            style={{ marginRight: 8, marginBottom: 8 }}
            onClick={() => handleQuickAction(qa.prompt)}
          >
            {qa.label}
          </button>
        ))}
        <button onClick={handleVoice}>🎤 Voice</button>
      </div>
      <div
        style={{
          border: "1px solid #eee",
          minHeight: 200,
          maxHeight: 300,
          overflowY: "auto",
          padding: 12,
          marginBottom: 12,
          background: "#fafafa",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <b>{msg.role === "user" ? "You" : "Assistant"}:</b> {msg.content}
          </div>
        ))}
        {loading && <div>Assistant is typing...</div>}
      </div>
      <form onSubmit={handleInput} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AIAssistant; 
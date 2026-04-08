import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are Bella, a warm and helpful AI assistant for "Casa Mia" — an Italian restaurant. 

RESTAURANT INFO:
- Name: Casa Mia Italian Restaurant
- Hours: Mon-Thu 11am-10pm, Fri-Sat 11am-11pm, Sunday 12pm-9pm
- Address: 123 Main Street, Downtown
- Phone: (555) 234-5678
- Reservations: Up to 8 people online, larger groups call us

MENU HIGHLIGHTS:
Starters: Bruschetta $9, Calamari $13, Burrata $14
Pasta: Spaghetti Carbonara $18, Penne Arrabbiata $16, Truffle Tagliatelle $24
Mains: Chicken Parmigiana $22, Branzino $28, Ribeye $38
Pizza: Margherita $16, Prosciutto $19, Truffle Mushroom $21
Desserts: Tiramisu $9, Panna Cotta $8
Drinks: Wine from $10/glass, Cocktails $13, Mocktails $8

POLICIES:
- Reservations recommended on weekends
- 15% gratuity added for groups of 6+
- Gluten-free pasta available (+$3)
- Vegan options available on request
- Free parking after 6pm in lot behind restaurant

Your personality: warm, helpful, a little charming. Keep responses concise and friendly. If someone wants to make a reservation, collect: name, date, time, party size, and any special requests. Always end reservation confirmations by saying you'll send a confirmation text.`;

const suggestedQuestions = [
  "What are your hours?",
  "Can I make a reservation?",
  "What's on the menu?",
  "Do you have vegan options?",
];

export default function RestaurantChatDemo() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ciao! 👋 I'm Bella, your assistant at Casa Mia. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showSetup, setShowSetup] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const sendMessage = async (text) => {
  const userText = text || input.trim();
  if (!userText || loading) return;

  const newMessages = [...messages, { role: "user", content: userText }];
  setMessages(newMessages);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:3001/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: newMessages, // ← send full history
  }),
});

const data = await response.json();
    const reply = data.text || "Sorry, I didn't catch that. Can you try again?";
    setMessages([...newMessages, { role: "assistant", content: reply }]);
  } catch (error) {
    setMessages([...newMessages, { role: "assistant", content: "Oops, something went wrong. Please try again!" }]);
  }
  setLoading(false);
};
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (showSetup) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 50%, #1a0a00 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        padding: "20px",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(212,175,55,0.3)",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🍝</div>
          <h1 style={{ color: "#d4af37", fontSize: "26px", marginBottom: "8px", fontWeight: "normal" }}>
            Casa Mia AI Demo
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "28px", lineHeight: "1.6" }}>
            This is a live demo of the restaurant AI assistant. Enter your Anthropic API key to activate it.
          </p>
          <input
            type="password"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "14px",
              marginBottom: "16px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
          <button
            onClick={() => apiKey && setShowSetup(false)}
            style={{
              width: "100%",
              padding: "13px",
              background: apiKey ? "linear-gradient(135deg, #d4af37, #b8902a)" : "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "8px",
              color: apiKey ? "#1a0a00" : "rgba(255,255,255,0.3)",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: apiKey ? "pointer" : "default",
              fontFamily: "'Georgia', serif",
              letterSpacing: "0.5px",
            }}
          >
            Launch Demo →
          </button>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", marginTop: "16px" }}>
            Your key is never stored or shared
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 50%, #1a0a00 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "20px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "36px", marginBottom: "6px" }}>🍝</div>
        <h1 style={{ color: "#d4af37", fontSize: "22px", margin: 0, fontWeight: "normal", letterSpacing: "1px" }}>
          Casa Mia
        </h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: "4px 0 0", letterSpacing: "2px", textTransform: "uppercase" }}>
          AI Restaurant Assistant
        </p>
      </div>

      {/* Chat window */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(212,175,55,0.2)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        {/* Messages */}
        <div style={{
          height: "400px",
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          scrollbarWidth: "none",
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #d4af37, #b8902a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  marginRight: "8px",
                  flexShrink: 0,
                  marginTop: "4px",
                }}>B</div>
              )}
              <div style={{
                maxWidth: "78%",
                padding: "11px 15px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #d4af37, #b8902a)"
                  : "rgba(255,255,255,0.07)",
                color: msg.role === "user" ? "#1a0a00" : "rgba(255,255,255,0.88)",
                fontSize: "14px",
                lineHeight: "1.55",
                border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "linear-gradient(135deg, #d4af37, #b8902a)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
              }}>B</div>
              <div style={{
                padding: "11px 15px",
                background: "rgba(255,255,255,0.07)",
                borderRadius: "18px 18px 18px 4px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: "#d4af37",
                      animation: "bounce 1.2s infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}/>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div style={{ padding: "0 16px 12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {suggestedQuestions.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} style={{
                padding: "7px 12px",
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: "20px",
                color: "#d4af37",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'Georgia', serif",
              }}>{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: "14px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          background: "rgba(0,0,0,0.2)",
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about menu, hours, reservations..."
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "11px 18px",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              fontFamily: "'Georgia', serif",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: "42px", height: "42px",
              borderRadius: "50%",
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #d4af37, #b8902a)"
                : "rgba(255,255,255,0.08)",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            {loading ? "⏳" : "➤"}
          </button>
        </div>
      </div>

      {/* Demo badge */}
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "16px", letterSpacing: "1px" }}>
        POWERED BY AI — DEMO VERSION
      </p>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

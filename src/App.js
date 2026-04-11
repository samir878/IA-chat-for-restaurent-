import { useState, useRef, useEffect } from "react";
import "./App.css";

export default function LAlsacienWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Bienvenue à L'Alsacien République ! 👋 Je suis Lola, votre assistante. Avez-vous besoin d'informations sur le menu, nos horaires ou souhaitez-vous réserver une table/salle ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const data = await response.json();
      const reply = data.text || "Désolée, je n'ai pas bien compris. Pouvez-vous répéter ?";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Oops, une erreur s'est produite. Veuillez réessayer !" }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="lalsacien-widget">
      {/* Floating Button */}
      {!isOpen && (
        <button 
          className="widget-launcher"
          onClick={() => setIsOpen(true)}
        >
          <div className="launcher-icon">💬</div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="widget-window">
          {/* Header */}
          <div className="widget-header">
            <div className="header-info">
              <span className="header-avatar">L</span>
              <div>
                <h3 className="header-title">Lola - L'Alsacien</h3>
                <span className="header-subtitle">En ligne</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="widget-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role === "user" ? "row-user" : "row-assistant"}`}>
                {msg.role === "assistant" && (
                  <div className="message-avatar">L</div>
                )}
                <div className={`message-bubble ${msg.role === "user" ? "bubble-user" : "bubble-assistant"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message-row row-assistant">
                <div className="message-avatar">L</div>
                <div className="message-bubble bubble-assistant loading-bubble">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="widget-input-area">
            <input
              type="text"
              className="widget-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Écrivez un message..."
            />
            <button 
              className={`widget-send ${input.trim() && !loading ? 'active' : ''}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

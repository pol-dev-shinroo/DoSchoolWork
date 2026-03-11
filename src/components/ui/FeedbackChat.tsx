"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Sender = "bot" | "user";
type Step = "root" | "bug_tool" | "text_input" | "submitting";

interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  options?: string[];
}

interface FeedbackPayload {
  category: string;
  tool?: string;
  message: string;
}

export default function FeedbackChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [step, setStep] = useState<Step>("root");

  const [draftData, setDraftData] = useState<Partial<FeedbackPayload>>({});

  const [honeypot, setHoneypot] = useState("");
  const [submissionsThisHour, setSubmissionsThisHour] = useState(0);
  const MAX_SUBMISSIONS_PER_HOUR = 3;
  const MAX_CHARS = 500;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll (Safe to use useEffect because it only manipulates the DOM)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WRAPPED IN useCallback to satisfy the strict React Compiler
  const startNewLoop = useCallback(() => {
    setDraftData({});
    setStep("root");
    setMessages([
      {
        id: Date.now().toString() + Math.random(),
        sender: "bot",
        text: "Hi there! 👋 What kind of feedback do you have for HisPDF?",
        options: ["🐛 Bug Report", "✨ Feature Request", "💬 General Question"],
      },
    ]);
  }, []);

  // WRAPPED IN useCallback
  const handleToggleChat = useCallback(() => {
    if (!isOpen) {
      const limits = localStorage.getItem("hispdf_feedback_limits");
      const now = Date.now();

      if (limits) {
        const { count, timestamp } = JSON.parse(limits);
        const hoursPassed = (now - timestamp) / (1000 * 60 * 60);
        if (hoursPassed > 1) {
          localStorage.setItem(
            "hispdf_feedback_limits",
            JSON.stringify({ count: 0, timestamp: now }),
          );
          setSubmissionsThisHour(0);
        } else {
          setSubmissionsThisHour(count);
        }
      } else {
        localStorage.setItem(
          "hispdf_feedback_limits",
          JSON.stringify({ count: 0, timestamp: now }),
        );
        setSubmissionsThisHour(0);
      }

      if (messages.length === 0) {
        startNewLoop();
      }
    }
    setIsOpen((prev) => !prev);
  }, [isOpen, messages.length, startNewLoop]);

  const addBotMessage = useCallback((text: string, options?: string[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        sender: "bot",
        text,
        options,
      },
    ]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), sender: "user", text },
    ]);
  }, []);

  const handleOptionClick = useCallback(
    (option: string) => {
      addUserMessage(option);

      setMessages((prev) => {
        const newArr = [...prev];
        const lastBotIndex = newArr.map((m) => m.sender).lastIndexOf("bot");
        if (lastBotIndex !== -1) {
          newArr[lastBotIndex].options = undefined;
        }
        return newArr;
      });

      if (step === "root") {
        if (option.includes("Bug")) {
          setDraftData({ category: "Bug Report" });
          setStep("bug_tool");
          setTimeout(() => {
            addBotMessage(
              "Oh no, sorry about that! Which tool were you using?",
              ["OCR PDF", "PDF Merge", "Image Resize", "Other"],
            );
          }, 400);
        } else {
          setDraftData({
            category: option.includes("Feature")
              ? "Feature Request"
              : "General",
          });
          setStep("text_input");
          setTimeout(() => {
            addBotMessage("Awesome! What's on your mind? (Type below)");
          }, 400);
        }
      } else if (step === "bug_tool") {
        setDraftData((prev) => ({ ...prev, tool: option }));
        setStep("text_input");
        setTimeout(() => {
          addBotMessage(
            "Got it. Could you briefly describe what went wrong? (Type below)",
          );
        }, 400);
      }
    },
    [step, addBotMessage, addUserMessage],
  );

  const submitToFirebase = useCallback(
    async (finalData: FeedbackPayload) => {
      if (honeypot.trim() !== "") return;

      if (submissionsThisHour >= MAX_SUBMISSIONS_PER_HOUR) {
        addBotMessage(
          "You've hit the limit for feedback submissions this hour. Please try again later!",
        );
        setStep("root");
        return;
      }

      try {
        setStep("submitting");

        const newCount = submissionsThisHour + 1;
        setSubmissionsThisHour(newCount);
        localStorage.setItem(
          "hispdf_feedback_limits",
          JSON.stringify({ count: newCount, timestamp: Date.now() }),
        );

        await addDoc(collection(db, "feedbacks"), {
          ...finalData,
          timestamp: serverTimestamp(),
        });

        addBotMessage("Thanks! Your feedback has been securely submitted. ✅", [
          "Start Over",
        ]);
        setStep("root");
      } catch (error) {
        console.error("Firebase error:", error);
        addBotMessage(
          "Oops, something went wrong on our end. Please try again later.",
        );
        setStep("root");
      }
    },
    [honeypot, submissionsThisHour, addBotMessage],
  );

  const handleTextSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim() || step !== "text_input") return;
      if (inputText.length > MAX_CHARS) return;

      const userText = inputText.trim();
      addUserMessage(userText);
      setInputText("");

      const finalData = { ...draftData, message: userText } as FeedbackPayload;

      setTimeout(() => {
        addBotMessage("Submitting your feedback...");
        submitToFirebase(finalData);
      }, 400);
    },
    [
      inputText,
      step,
      draftData,
      addUserMessage,
      addBotMessage,
      submitToFirebase,
    ],
  );

  const handleOptionClickInterceptor = useCallback(
    (option: string) => {
      if (option === "Start Over") {
        startNewLoop();
      } else {
        handleOptionClick(option);
      }
    },
    [startNewLoop, handleOptionClick],
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-[350px] h-[500px] flex flex-col rounded-3xl shadow-2xl shadow-[#355872]/20 border border-[#355872]/10 mb-4 overflow-hidden animate-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
          <div className="bg-[#355872] p-4 flex items-center justify-between text-[#F7F8F0] shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-black text-sm tracking-wider uppercase">
                HisPDF Assistant
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#F7F8F0]/30 scrollbar-thin scrollbar-thumb-[#355872]/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-[#355872] text-[#F7F8F0] rounded-tr-sm"
                      : "bg-white border border-[#355872]/10 text-[#355872] rounded-tl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.options && (
                  <div className="flex flex-col gap-2 mt-2 w-full items-start pl-2">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionClickInterceptor(opt)}
                        className="text-xs font-bold bg-[#9CD5FF]/20 text-[#355872] border border-[#9CD5FF]/50 px-3 py-2 rounded-xl hover:bg-[#9CD5FF]/40 transition-colors text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {step === "submitting" && (
              <div className="flex items-center gap-2 text-[#355872]/50 pl-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold">Sending to server...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-[#355872]/10 shrink-0">
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />
            <form
              onSubmit={handleTextSubmit}
              className="relative flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  step === "text_input"
                    ? "Type your message..."
                    : "Select an option above..."
                }
                disabled={step !== "text_input"}
                className="w-full bg-[#F7F8F0] border border-[#355872]/10 rounded-xl py-3 pl-4 pr-10 text-sm text-[#355872] focus:outline-none focus:border-[#7AAACE] disabled:opacity-50 transition-colors"
              />
              <span
                className={`absolute right-12 text-[9px] font-bold ${inputText.length > MAX_CHARS ? "text-red-500" : "text-[#355872]/40"}`}
              >
                {step === "text_input"
                  ? `${inputText.length}/${MAX_CHARS}`
                  : ""}
              </span>
              <button
                type="submit"
                disabled={
                  step !== "text_input" ||
                  !inputText.trim() ||
                  inputText.length > MAX_CHARS
                }
                className="w-10 h-10 shrink-0 bg-[#355872] text-[#F7F8F0] rounded-xl flex items-center justify-center hover:bg-[#7AAACE] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={handleToggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${isOpen ? "bg-white text-[#355872] border-2 border-[#355872]/10" : "bg-[#355872] text-[#F7F8F0] shadow-[#355872]/30"}`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}

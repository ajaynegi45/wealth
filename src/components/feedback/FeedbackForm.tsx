"use client";

import { useState } from "react";
import { submitFeedback } from "@/app/actions/feedback";
import { Send, Sparkles, AlertCircle, MessageCircle } from "lucide-react";

export function FeedbackForm() {
  const [type, setType] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError("");

    const result = await submitFeedback({ type, message });

    if (result.success) {
      setSuccess(true);
      setMessage("");
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  const feedbackTypes = [
    { id: "suggestion", label: "Suggestion", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { id: "bug", label: "Bug Report", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    { id: "mistake", label: "Mistake", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { id: "other", label: "Other", icon: MessageCircle, color: "text-tint", bg: "bg-tint/10", border: "border-tint/20" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card/40  border border-separator/30 rounded-3xl p-6 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-tint/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-3 tracking-tight">We'd love to hear from you</h2>
            <p className="text-muted-foreground text-lg">Suggest a feature, report a bug, or just tell us what you think.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-foreground">What kind of feedback is this?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {feedbackTypes.map((t) => {
                  const isSelected = type === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                        isSelected 
                          ? `${t.bg} ${t.border} ${t.color} scale-[1.02] shadow-sm` 
                          : "border-separator/20 bg-background/50 hover:bg-secondary/50 text-muted-foreground hover:scale-100"
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? t.color : "text-muted-foreground"}`} />
                      <span className={`text-sm font-medium ${isSelected ? "text-foreground" : ""}`}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="message" className="block text-sm font-semibold text-foreground">
                Your Message
              </label>
              <div className="relative group">
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us whatever you want to write about the product..."
                  className="w-full min-h-[160px] p-5 rounded-2xl bg-background/50 border border-separator/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-tint/50 focus:border-tint/50 transition-all resize-y group-hover:border-separator/50"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium flex items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Sparkles className="w-5 h-5 mr-2 shrink-0" />
                Thank you! Your feedback has been sent successfully.
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-medium text-background bg-tint hover:bg-tint/90 flex items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgb(var(--tint-rgb),0.3)] hover:shadow-[0_8px_30px_rgb(var(--tint-rgb),0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none ${isSubmitting ? "opacity-80 cursor-wait" : ""}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

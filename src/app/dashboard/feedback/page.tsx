import { Metadata } from "next";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback | Wealth App",
  description: "Share your thoughts, suggestions, and feedback to help us improve the Wealth App.",
};

export default function FeedbackPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-tint/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <h1 className="text-3xl font-heading font-bold text-foreground relative z-10 flex items-center">
          Feedback
        </h1>
        <p className="text-muted-foreground relative z-10 max-w-2xl">
          Help us build the best wealth management experience.
        </p>
      </div>

      <div className="pt-4">
        <FeedbackForm />
      </div>
    </div>
  );
}

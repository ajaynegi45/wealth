"use client";

import { formatDistanceToNow } from "date-fns";
import { Sparkles, AlertCircle, MessageCircle, User as UserIcon } from "lucide-react";

type Feedback = {
  id: number;
  type: string;
  message: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  } | null;
};

export function AdminFeedbackTable({ feedbacks }: { feedbacks: Feedback[] }) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "suggestion":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Sparkles className="w-3 h-3" />
            Suggestion
          </span>
        );
      case "bug":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertCircle className="w-3 h-3" />
            Bug Report
          </span>
        );
      case "mistake":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <AlertCircle className="w-3 h-3" />
            Mistake
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-tint/10 text-tint border border-tint/20">
            <MessageCircle className="w-3 h-3" />
            Other
          </span>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-separator/30 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-separator/30 bg-secondary/30">
          <h2 className="text-xl font-heading font-bold text-foreground">Admin Feedback Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Review all submissions from users.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-separator/30">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Message</th>
                <th className="px-6 py-4 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-separator/20">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p>No feedback submissions yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      {feedback.user ? (
                        <div>
                          <div className="font-medium text-foreground text-sm flex items-center gap-2">
                            <div className="w-6 h-6 bg-tint/10 text-tint rounded-full flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold">
                                {feedback.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            {feedback.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 ml-8">
                            {feedback.user.email}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center shrink-0">
                            <UserIcon className="w-3 h-3" />
                          </div>
                          Anonymous User
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      {getTypeBadge(feedback.type)}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap max-w-lg leading-relaxed">
                        {feedback.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
}

export function ProfileForm({ initialName, initialEmail, initialPhone }: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = name.trim() !== initialName || (phone || "").trim() !== initialPhone;

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(name, phone);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Grouped List Style for Personal Information */}
      <div className="bg-card/80 backdrop-blur-xl border border-separator/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-separator/20 bg-muted/20">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Personal Details</h2>
        </div>
        
        <div className="flex flex-col">
          {/* Name Row */}
          <div className="flex items-center px-5 py-4 border-b border-separator/20 transition-colors focus-within:bg-muted/10">
            <label htmlFor="name" className="w-1/3 text-[15px] font-medium text-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-2/3 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/50 outline-none"
              placeholder="Your full name"
            />
          </div>

          {/* Email Row (Disabled/Read-only) */}
          <div className="flex items-center px-5 py-4 border-b border-separator/20 bg-muted/5 opacity-80 cursor-not-allowed">
            <label htmlFor="email" className="w-1/3 text-[15px] font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={initialEmail}
              disabled
              className="w-2/3 bg-transparent text-[15px] text-muted-foreground outline-none cursor-not-allowed"
            />
          </div>

          {/* Phone Row */}
          <div className="flex items-center px-5 py-4 transition-colors focus-within:bg-muted/10">
            <label htmlFor="phone" className="w-1/3 text-[15px] font-medium text-foreground">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-2/3 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/50 outline-none"
              placeholder="e.g. +91 9876543210"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`flex items-center justify-center min-w-[140px] px-6 py-3 rounded-xl font-semibold text-white shadow-sm transition-all duration-200 ${
            hasChanges
              ? "bg-tint hover:bg-tint/90 hover:shadow-md cursor-pointer"
              : "bg-tint/50 cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, X, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian phone number").optional().or(z.literal("")),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password") || "";

  const passwordRules = [
    { label: "8+ characters", test: (p: string) => p.length >= 8 },
    { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "Number", test: (p: string) => /[0-9]/.test(p) },
    { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await registerUser(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-card rounded-3xl shadow-xl border border-separator/30">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Create your account</h2>
        <p className="text-foreground/70">Join Wealth and secure your legacy.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
          <input
            {...register("name")}
            type="text"
            className="flex h-11 w-full rounded-lg border border-separator/50 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2 transition-colors"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
          <input
            {...register("email")}
            type="email"
            className="flex h-11 w-full rounded-lg border border-separator/50 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2 transition-colors"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number (Optional)</label>
          <div className="flex rounded-lg border border-separator/50 bg-background focus-within:ring-2 focus-within:ring-tint focus-within:ring-offset-2 focus-within:ring-offset-background transition-colors h-11">
            <div className="flex items-center px-3 border-r border-separator/50 bg-secondary/30 text-sm text-foreground/70 rounded-l-lg">
              +91
            </div>
            <input
              {...register("phone")}
              type="tel"
              className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-foreground/50 focus-visible:outline-none"
              placeholder="9876543210"
              maxLength={10}
            />
          </div>
          {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={(e) => {
                register("password").onBlur(e);
                setIsPasswordFocused(false);
              }}
              className="flex h-11 w-full rounded-lg border border-separator/50 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2 transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Dynamic Password Rules */}
          {(isPasswordFocused || password.length > 0) && (
            <div className="mt-3 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {passwordRules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs">
                  {rule.test(password) ? (
                    <Check className="w-3 h-3 text-success" />
                  ) : (
                    <X className="w-3 h-3 text-destructive" />
                  )}
                  <span className={rule.test(password) ? "text-success" : "text-destructive"}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
          <input
            {...register("confirmPassword")}
            type={showPassword ? "text" : "password"}
            className="flex h-11 w-full rounded-lg border border-separator/50 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2 transition-colors"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-lg bg-foreground text-background font-medium text-sm shadow flex items-center justify-center hover:bg-foreground/90 transition-colors disabled:opacity-50 mt-4"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-foreground/70 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-tint font-semibold hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push("/");
        router.refresh(); // Refresh to update session state in Header
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
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Welcome Back</h2>
        <p className="text-foreground/70">Log in to view your wealth dashboard.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-foreground">Password</label>
            <Link href="#" className="text-xs text-tint hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
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
          {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-lg bg-foreground text-background font-medium text-sm shadow flex items-center justify-center hover:bg-foreground/90 transition-colors disabled:opacity-50 mt-4"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
        </button>
      </form>

      <p className="text-center text-sm text-foreground/70 mt-6">
        Don't have an account?{" "}
        <Link href="/register" className="text-tint font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

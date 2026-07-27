import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { isRateLimitError } from "@/lib/authErrors";
import { useResendCooldown } from "@/lib/useResendCooldown";
import AuthLayout from "@/components/AuthLayout";
import SEO from "@/components/SEO";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const { secondsLeft, start, isActive } = useResendCooldown(45);

  const sendResetEmail = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error && isRateLimitError(error)) {
        setRateLimited(true);
      } else {
        setRateLimited(false);
      }
    } catch (err) {
      if (isRateLimitError(err)) setRateLimited(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await sendResetEmail();
    setLoading(false);
    setSent(true);
    start(45);
  };

  const handleResend = async () => {
    if (isActive) return;
    setLoading(true);
    await sendResetEmail();
    setLoading(false);
    start(45);
  };

  return (
    <>
      <SEO title="Reset Password — FullyFundedHub" description="Reset your FullyFundedHub account password." noindex />
      <AuthLayout
        icon={Mail}
        title="Reset password"
        subtitle="We'll send you a link to reset it"
        footer={
          <Link to="/login" className="text-primary font-medium hover:underline">
            <ArrowLeft className="w-3 h-3 inline mr-1" />Back to log in
          </Link>
        }
      >
        {sent ? (
          <div className="text-center space-y-3">
            {rateLimited ? (
              <p className="text-sm text-destructive">
                You've requested this too many times recently. Please wait a few minutes before trying again.
              </p>
            ) : (
              <p className="text-sm text-foreground">
                If an account exists with that email, you'll receive a password reset link shortly. Check your spam folder if it doesn't arrive within a few minutes.
              </p>
            )}
            <button
              type="button"
              onClick={handleResend}
              disabled={loading || isActive}
              className="text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {loading ? "Sending..." : isActive ? `Resend in ${secondsLeft}s` : "Didn't get it? Resend"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        )}
      </AuthLayout>
    </>
  );
}
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const FIREBASE_ERRORS = {
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/invalid-phone-number": "Invalid phone number. Please check and try again.",
  "auth/captcha-check-failed": "Verification failed. Please refresh the page and try again.",
  "auth/quota-exceeded": "SMS limit reached. Please try again later.",
  "auth/network-request-failed": "Network error. Check your internet connection.",
  "auth/invalid-verification-code": "Invalid OTP. Please check and try again.",
  "auth/code-expired": "OTP has expired. Please request a new one.",
  "auth/billing-not-enabled": "SMS service temporarily unavailable. Please try again later.",
  "auth/missing-phone-number": "Please enter your phone number.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
};

function getErrorMessage(err) {
  if (err.code && FIREBASE_ERRORS[err.code]) {
    return FIREBASE_ERRORS[err.code];
  }
  if (err.message && err.message.includes("reCAPTCHA")) {
    return "Verification check failed. Please refresh the page and try again.";
  }
  return err.message || "Something went wrong. Please try again.";
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const { checkPhone, verifyFirebaseToken, showWelcome } = useApp();
  const router = useRouter();
  const otpRefs = useRef([]);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const setupRecaptcha = () => {
    if (recaptchaRef.current) {
      try { recaptchaRef.current.clear(); } catch {}
      recaptchaRef.current = null;
    }
    const container = document.getElementById("recaptcha-container");
    if (container) container.innerHTML = "";
    recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    return recaptchaRef.current;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const phoneCheck = await checkPhone(phone);

      if (mode === "login" && phoneCheck.is_new_user) {
        setError("No account found with this number. Please sign up first.");
        setLoading(false);
        return;
      }
      if (mode === "signup" && !phoneCheck.is_new_user) {
        setError("Account already exists with this number. Please login instead.");
        setLoading(false);
        return;
      }

      const recaptcha = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, recaptcha);
      setConfirmationResult(result);
      setStep("otp");
      setCountdown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch {}
        recaptchaRef.current = null;
      }
      setError(getErrorMessage(err));
    }
    setLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Enter the complete 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await confirmationResult.confirm(otpString);
      const firebaseToken = await result.user.getIdToken();
      const userData = await verifyFirebaseToken(
        firebaseToken,
        mode === "signup" ? name.trim() : null
      );
      const firstName = userData?.name?.split(" ")[0] || "";
      if (mode === "signup") {
        showWelcome(
          `रसोई घर में आपका स्वागत है, ${firstName}!`,
          "आपकी रसोई, हमारी ज़िम्मेदारी"
        );
      } else {
        showWelcome(
          `Welcome back, ${firstName}!`,
          "Great to see you again — happy shopping"
        );
      }
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setError("");
    try {
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch {}
        recaptchaRef.current = null;
      }
      const recaptcha = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, recaptcha);
      setConfirmationResult(result);
      setCountdown(30);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch {}
        recaptchaRef.current = null;
      }
      setError(getErrorMessage(err));
    }
    setLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep("phone");
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setConfirmationResult(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/25">
            RG
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {step === "phone"
              ? mode === "login"
                ? "Welcome Back"
                : "Create Account"
              : "Verify OTP"}
          </h1>
          <p className="text-[var(--color-text-muted)]">
            {step === "phone"
              ? mode === "login"
                ? "Sign in to your रसोई घर account"
                : "Join रसोई घर today"
              : `Enter the OTP sent to +91 ${phone}`}
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 shadow-xl shadow-black/5">
          {step === "phone" && (
            <div className="flex bg-[var(--color-surface-2)] rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === "login"
                    ? "bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === "signup"
                    ? "bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-[var(--color-text)]"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] font-medium text-base select-none">
                    +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(v);
                      setError("");
                    }}
                    required
                    placeholder="9876543210"
                    autoFocus
                    className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-[var(--color-text)] text-lg tracking-wider"
                  />
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                  Only Indian (+91) numbers are supported
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "Sending OTP..." : mode === "login" ? "Send OTP" : "Send OTP & Sign Up"}
              </button>

              <p className="text-center text-sm text-[var(--color-text-muted)]">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => switchMode("signup")} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={() => switchMode("login")} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                      Login
                    </button>
                  </>
                )}
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">
                  Enter OTP
                </label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-[var(--color-text)]"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "Verifying..." : mode === "signup" ? "Create Account" : "Sign In"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp(["", "", "", "", "", ""]);
                    setError("");
                    setConfirmationResult(null);
                  }}
                  className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                >
                  Change Number
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || loading}
                  className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline disabled:opacity-40 disabled:no-underline"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { GalleryVerticalEnd, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client';
import { signInWithGoogle } from '@/app/actions/auth';

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface SignupFormData {
  email: string;
  password: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<SignupFormData>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [shake, setShake] = useState(false);
  const [touched, setTouched] = useState<{email: boolean, password: boolean}>({email: false, password: false});

  const router = useRouter();
  const supabase = createClient();

  // Watch password for real-time strength indicator
  const password = watch('password');

  useEffect(() => {
    if (password) {
      const hasLetters = /[a-zA-Z]/.test(password);
      const hasNumbers = /[0-9]/.test(password);
      const hasBoth = hasLetters && hasNumbers;
      
      if (password.length < 6 || !hasBoth) {
        setPasswordStrength('weak');
      } else if (password.length < 10) {
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('strong');
      }
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  // Countdown timer for retry
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setTimeout(() => {
        setRetryAfter(retryAfter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (retryAfter === 0) {
      setRetryAfter(null);
      setErrorMessage(null);
    }
  }, [retryAfter]);

  // Trigger shake animation
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 650);
  };

  // Validate email in real-time
  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address (example@domain.com)";
    }
    return null;
  };

  // Validate password in real-time
  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    } else if (password.length < 6) {
      return "Password must be at least 6 characters long";
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return "Password must contain both letters and numbers";
    }
    return null;
  };

  // Handle field blur (when user leaves the field)
  const handleEmailBlur = () => {
    setTouched(prev => ({...prev, email: true}));
    const email = getValues('email');
    const emailError = validateEmail(email);
    if (emailError) {
      setFieldErrors(prev => ({...prev, email: emailError}));
      triggerShake();
    } else {
      setFieldErrors(prev => ({...prev, email: undefined}));
    }
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({...prev, password: true}));
    const password = getValues('password');
    const passwordError = validatePassword(password);
    if (passwordError) {
      setFieldErrors(prev => ({...prev, password: passwordError}));
      triggerShake();
    } else {
      setFieldErrors(prev => ({...prev, password: undefined}));
    }
  };

  // Handle input change (clears error when user starts typing)
  const handleEmailChange = () => {
    if (touched.email) {
      const email = getValues('email');
      const emailError = validateEmail(email);
      setFieldErrors(prev => ({...prev, email: emailError || undefined}));
    }
  };

  const handlePasswordChange = () => {
    if (touched.password) {
      const password = getValues('password');
      const passwordError = validatePassword(password);
      setFieldErrors(prev => ({...prev, password: passwordError || undefined}));
    }
  };

  async function handleSignup(Userdata: SignupFormData) {
    console.log("calling handleSignup");
    
    setErrorMessage(null);
    setMessage(null);
    setLoading(true);
    setRetryAfter(null);

    // Final validation on submit
    const emailError = validateEmail(Userdata.email);
    const passwordError = validatePassword(Userdata.password);

    if (emailError || passwordError) {
      setFieldErrors({
        email: emailError || undefined,
        password: passwordError || undefined
      });
      setLoading(false);
      triggerShake();
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: Userdata.email,
          password: Userdata.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limit error
        if (response.status === 429) {
          setErrorMessage(data.error);
          setRetryAfter(data.retryAfter);
          triggerShake();
        } else {
          setErrorMessage(data.error || 'Signup failed. Please try again.');
          triggerShake();
        }
        setLoading(false);
        return;
      }

      // Success - show message
      setMessage(data.message);
      setLoading(false);

    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An unexpected error occurred. Please check your connection and try again.');
      setLoading(false);
      triggerShake();
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setErrorMessage(null);
    
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in error:', err);
      setErrorMessage('Failed to sign in with Google. Please try again or use email signup.');
      setGoogleLoading(false);
      triggerShake();
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit((data) => handleSignup(data))}>
        <div className={cn("transition-all duration-200", shake && "animate-shake")}>
          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm flex items-start gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span>{errorMessage}</span>
                {retryAfter && retryAfter > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-medium">Retry in {retryAfter} seconds</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Acme Inc.</span>
              </a>
              <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
              <FieldDescription>
                Already have an account? <Link href="/login" className="hover:underline transition-all duration-200">Sign in</Link>
              </FieldDescription>
            </div>

            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email', {
                  onBlur: handleEmailBlur,
                  onChange: handleEmailChange
                })}
                disabled={loading || googleLoading}
                className={cn(
                  "transition-all duration-200",
                  "focus:ring-2 focus:ring-offset-1",
                  fieldErrors.email && "border-red-500 focus:ring-red-500"
                )}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.email}
                </p>
              )}
            </Field>

            {/* Password Field */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('password', {
                    onBlur: handlePasswordBlur,
                    onChange: handlePasswordChange
                  })}
                  disabled={loading || googleLoading}
                  className={cn(
                    "transition-all duration-200 pr-10",
                    "focus:ring-2 focus:ring-offset-1",
                    fieldErrors.password && "border-red-500 focus:ring-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && passwordStrength && (
                <div className="mt-2 animate-fade-in">
                  <div className="flex gap-1 mb-1">
                    <div className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-300",
                      passwordStrength === 'weak' ? "bg-red-500" : "bg-gray-200",
                      passwordStrength === 'medium' ? "bg-yellow-500" : "",
                      passwordStrength === 'strong' ? "bg-green-500" : ""
                    )} />
                    <div className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-300",
                      passwordStrength === 'medium' ? "bg-yellow-500" : "bg-gray-200",
                      passwordStrength === 'strong' ? "bg-green-500" : ""
                    )} />
                    <div className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-300",
                      passwordStrength === 'strong' ? "bg-green-500" : "bg-gray-200"
                    )} />
                  </div>
                  <p className={cn(
                    "text-xs transition-colors duration-200",
                    passwordStrength === 'weak' && "text-red-600",
                    passwordStrength === 'medium' && "text-yellow-600",
                    passwordStrength === 'strong' && "text-green-600"
                  )}>
                    Password strength: {passwordStrength}
                    {passwordStrength === 'weak' && " - Must have letters & numbers, 6+ characters"}
                    {passwordStrength === 'medium' && " - Good! Try 10+ characters for strong"}
                    {passwordStrength === 'strong' && " - Excellent!"}
                  </p>
                </div>
              )}
              
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.password}
                </p>
              )}
            </Field>

            {/* Submit Button */}
            <Field>
              <Button 
                type="submit" 
                disabled={loading || googleLoading || (retryAfter !== null && retryAfter > 0)}
                className="relative transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </Field>

            <FieldSeparator>Or</FieldSeparator>

            {/* Google Sign In Button */}
            <Field>
              <Button 
                variant="outline" 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="relative transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <span className="ml-2">
                  {googleLoading ? 'Signing in...' : 'Continue with Google'}
                </span>
              </Button>
            </Field>
          </FieldGroup>
        </div>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#" className="hover:underline">Terms of Service</a>{" "}
        and <a href="#" className="hover:underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

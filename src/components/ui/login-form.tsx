"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { signInWithGoogle } from '@/app/actions/auth'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({});
  const [shake, setShake] = useState(false);
  const [touched, setTouched] = useState<{email: boolean, password: boolean}>({email: false, password: false});
  
  const supabase = createClient();
  const router = useRouter();

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

  async function handleLogin(data: LoginFormData) {
    console.log("Login form submitted", data)
    setLoading(true);
    setError(null);

    // Final validation on submit
    const emailError = validateEmail(data.email);
    const passwordError = validatePassword(data.password);

    if (emailError || passwordError) {
      setFieldErrors({
        email: emailError || undefined,
        password: passwordError || undefined
      });
      setLoading(false);
      triggerShake();
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      // Provide user-friendly error messages
      let errorMessage = error.message;
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "The email or password you entered is incorrect. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email address before logging in. Check your inbox for the confirmation link.";
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Too many login attempts. Please wait a few minutes and try again.";
      }
      
      setError(errorMessage);
      setLoading(false);
      triggerShake();
    } else {
      router.push('/dashboard');
      setLoading(false);
      router.refresh();
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Failed to sign in with Google. Please try again or use email login.');
      setGoogleLoading(false);
      triggerShake();
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className={cn("transition-all duration-200", shake && "animate-shake")}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => {
            handleLogin(data);
          })}>
            <FieldGroup>
              {/* Global Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

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
                    {googleLoading ? 'Signing in...' : 'Login with Google'}
                  </span>
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline transition-all duration-200"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
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
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                  </button>
                </div>
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
                  disabled={loading || googleLoading}
                  className="relative transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary font-medium hover:underline transition-all duration-200"
                  >
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#" className="hover:underline">Terms of Service</a>{" "}
        and <a href="#" className="hover:underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

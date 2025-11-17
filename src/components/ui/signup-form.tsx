"use client";

import { GalleryVerticalEnd,Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState } from "react";
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
    formState: { errors },
  } = useForm<SignupFormData>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
 const router = useRouter();
  const supabase = createClient();
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  async function handleSignup(Userdata: SignupFormData) {
    console.log("calling handleSignup");
    
    setErrorMessage(null)
    setMessage(null)
    setLoading(true)
    setRetryAfter(null);
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
        } else {
          setErrorMessage(data.error || 'Signup failed');
        }
        setLoading(false);
        return;
      }

      // Success - show message
      setMessage(data.message);
      setLoading(false);

    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }
   async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setErrorMessage(null);
    
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in error:', err);
      setErrorMessage('Failed to sign in with Google');
      setGoogleLoading(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit((data) => handleSignup(data))}>
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
            {message}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {errorMessage}
            {retryAfter && ` Try again in ${retryAfter} seconds.`}
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
              Already have an account? <Link href="/login">Sign in</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
               {...register('email')}
              required
            />
             <div className="relative mt-4">
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="******"
        {...register('password')}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(v => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
      </button>
    </div>
          </Field>
          <Field>
             <Button type="submit" disabled={loading || googleLoading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field >
         <Button 
              variant="outline" 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
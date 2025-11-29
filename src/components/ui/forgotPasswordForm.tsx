"use client";
import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { ChevronLeftIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"

import { IndexedDiv, IndexedA, IndexedSpan, IndexedH1 } from "@/components/ui/indexed-primitives"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Assuming onSubmit and isLoading are defined elsewhere or will be added.
  // For now, let's define a placeholder onSubmit and isLoading.
  const onSubmit = (data: any) => console.log(data);
  const isLoading = false;


  return (
    <IndexedDiv className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <IndexedA
              href="/"
              className="flex items-center gap-2 self-center font-medium mb-4 justify-center"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <IndexedSpan >Acme Inc.</IndexedSpan>
            </IndexedA>
            <IndexedH1 className="text-xl font-bold">Forgot Password?</IndexedH1>
          </CardTitle>
          <CardDescription>
            Enter your email below to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message as string}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              <IndexedA href="/login" className="flex items-center justify-center gap-2"><ChevronLeftIcon className="size-4" /> Back to login</IndexedA>
            </div>
          </form>
        </CardContent>
      </Card>
    </IndexedDiv>
  )
}

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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
      const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span >Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Forgot Password?</h1>
             <FieldDescription>
              Enter your email and we'll send you instructions to reset your password
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
          </Field>
          <Field>
            <Button type="submit">Send Reset Link</Button>
          </Field>
          <FieldDescription className="text-center">
            
            <a href="/login" className="flex items-center justify-center gap-2"><ChevronLeftIcon className="size-4"/> Back to login</a>
            </FieldDescription>
        </FieldGroup>
      </form>
      
    </div>
  )
}

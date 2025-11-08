"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
interface Signup1Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
}

const Signup1 = ({
  heading = "Signup",
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
    alt: "logo",
    title: "shadcnblocks.com",
  },
  buttonText = "Create Account",
  signupText = "Already a user?",
  signupUrl = "/login",
}: Signup1Props) => {

    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <a href={logo.url}>
            <img
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-10 dark:invert"
            />
          </a>
          <form
          onSubmit={handleSubmit((data) => console.log(data))}
          className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
            <Input
              type="email"
              placeholder="Email"
              className="text-sm"
              {...register('email')}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="text-sm"
              {...register('password',{ pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ })}
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              className="text-sm"
              {...register('confirmPassword')}
              required
            />
            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </form>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{signupText}</p>
            <Link
            key={"Login"}
            href={signupUrl}
            className="text-primary font-medium hover:underline"
          >
 Login
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup1 };

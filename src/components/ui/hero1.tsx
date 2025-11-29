"use client"

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IndexedSection,
  IndexedDiv,
  IndexedH1,
  IndexedP,
  IndexedImg
} from "@/components/ui/indexed-primitives";
import { useComponentId } from "@/lib/component-id";

interface Hero1Props {
  badge?: string;
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image?: {
    src: string;
    alt: string;
    title?: string;
  };
}

const Hero1 = ({
  badge = "✨ Your Website Builder",
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  buttons = {
    primary: {
      text: "Discover all components",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "View on GitHub",
      url: "https://www.shadcnblocks.com",
    },
  },
  image = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "Hero section demo image showing interface components",
  },
}: Hero1Props) => {
  const componentId = useComponentId("Hero1")
  return (
    <IndexedSection className="py-32" id="hero" data-component-id={componentId}>
      <IndexedDiv className="container">
        <IndexedDiv className="grid items-center gap-8 lg:grid-cols-2">
          <IndexedDiv className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge variant="outline">
                {badge}
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>
            )}
            <IndexedH1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {heading}
            </IndexedH1>
            <IndexedP className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </IndexedP>
            <IndexedDiv className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </IndexedDiv>
          </IndexedDiv>
          <IndexedImg
            src={image.src}
            alt={image.alt}
            className="max-h-96 w-full rounded-md object-cover"
          />
        </IndexedDiv>
      </IndexedDiv>
    </IndexedSection>
  );
};

export { Hero1 };

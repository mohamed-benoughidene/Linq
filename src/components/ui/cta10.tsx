"use client"

import { IndexedSection, IndexedDiv, IndexedH3, IndexedP, IndexedA } from "@/components/ui/indexed-primitives"
import { Button } from "@/components/ui/button";

interface Cta10Props {
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
}

const Cta10 = ({
  heading = "Call to Action",
  description = "Build faster with our collection of pre-built blocks. Speed up your development and ship features in record time.",
  buttons = {
    primary: {
      text: "Buy Now",
      url: "https://www.shadcnblocks.com",
    },
  },
}: Cta10Props) => {
  return (
    <IndexedSection className="py-32">
      <IndexedDiv className="container">
        <IndexedDiv className="bg-accent flex w-full flex-col gap-16 overflow-hidden rounded-lg p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-12">
          <IndexedDiv className="flex-1">
            <IndexedH3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              {heading}
            </IndexedH3>
            <IndexedP className="text-muted-foreground max-w-xl lg:text-lg">
              {description}
            </IndexedP>
          </IndexedDiv>
          <IndexedDiv className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {buttons.secondary && (
              <Button variant="outline" asChild>
                <IndexedA href={buttons.secondary.url}>{buttons.secondary.text}</IndexedA>
              </Button>
            )}
            {buttons.primary && (
              <Button asChild variant="default" size="lg">
                <IndexedA href={buttons.primary.url}>{buttons.primary.text}</IndexedA>
              </Button>
            )}
          </IndexedDiv>
        </IndexedDiv>
      </IndexedDiv>
    </IndexedSection>
  );
};

export { Cta10 };

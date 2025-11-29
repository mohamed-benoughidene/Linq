"use client"

import {
  IndexedSection,
  IndexedDiv,
  IndexedFooter,
  IndexedP,
  IndexedH3,
  IndexedUl,
  IndexedLi,
  IndexedA
} from "@/components/ui/indexed-primitives"

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  logo = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
    alt: "blocks for shadcn/ui",
    title: "Shadcnblocks.com",
    url: "https://www.shadcnblocks.com",
  },
  tagline = "Components made easy.",
  menuItems = [
    {
      title: "Product",
      links: [
        { text: "Overview", url: "#" },
        { text: "Pricing", url: "#" },
        { text: "Marketplace", url: "#" },
        { text: "Features", url: "#" },
        { text: "Integrations", url: "#" },
        { text: "Pricing", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#" },
        { text: "Team", url: "#" },
        { text: "Blog", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Contact", url: "#" },
        { text: "Privacy", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help", url: "#" },
        { text: "Sales", url: "#" },
        { text: "Advertise", url: "#" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "#" },
        { text: "Instagram", url: "#" },
        { text: "LinkedIn", url: "#" },
      ],
    },
  ],
  copyright = "© 2024 Shadcnblocks.com. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: Footer2Props) => {
  return (
    <IndexedSection className="py-32">
      <IndexedDiv className="container">
        <IndexedFooter>
          <IndexedDiv className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <IndexedDiv className="col-span-2 mb-8 lg:mb-0">
              <IndexedDiv className="flex items-center gap-2 lg:justify-start">
                {
                  /*  <Logo url="https://shadcnblocks.com">
                  <LogoImage
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10 dark:invert"
                  />
                  <LogoText className="text-xl">{logo.title}</LogoText>
                </Logo> */
                }

              </IndexedDiv>
              <IndexedP className="mt-4 font-bold">{tagline}</IndexedP>
            </IndexedDiv>
            {menuItems.map((section, sectionIdx) => (
              <IndexedDiv key={sectionIdx}>
                <IndexedH3 className="mb-4 font-bold">{section.title}</IndexedH3>
                <IndexedUl className="text-muted-foreground space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <IndexedLi
                      key={linkIdx}
                      className="hover:text-primary font-medium"
                    >
                      <IndexedA href={link.url}>{link.text}</IndexedA>
                    </IndexedLi>
                  ))}
                </IndexedUl>
              </IndexedDiv>
            ))}
          </IndexedDiv>
          <IndexedDiv className="text-muted-foreground mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium md:flex-row md:items-center">
            <IndexedP>{copyright}</IndexedP>
            <IndexedUl className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <IndexedLi key={linkIdx} className="hover:text-primary underline">
                  <IndexedA href={link.url}>{link.text}</IndexedA>
                </IndexedLi>
              ))}
            </IndexedUl>
          </IndexedDiv>
        </IndexedFooter>
      </IndexedDiv>
    </IndexedSection>
  );
};

export { Footer2 };

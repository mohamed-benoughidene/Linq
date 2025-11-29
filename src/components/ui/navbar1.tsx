"use client"

import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/ui/user-nav";
import { useComponentId } from "@/lib/component-id";
import {
  IndexedSection,
  IndexedDiv,
  IndexedNav,
  IndexedA,
  IndexedImg,
  IndexedSpan,
  IndexedP
} from "@/components/ui/indexed-primitives";

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: {
    title: string;
    url: string;
    items?: {
      title: string;
      description: string;
      icon: React.ReactNode;
      url: string;
    }[];
  }[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
  user?: any;
  onLogout?: () => void;
}

const Navbar1 = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    { title: "Home", url: "#hero" },
    { title: "Features", url: "#features" },
    { title: "how it works", url: "#how-it-works" },
    { title: "Why choose us", url: "#why-choose-us" },
    { title: "Pricing", url: "#pricing" },
    { title: "Faq", url: "#faq" },
  ],
  mobileExtraLinks = [
    { name: "Press", url: "#" },
    { name: "Contact", url: "#" },
    { name: "Imprint", url: "#" },
    { name: "Sitemap", url: "#" },
  ],
  auth = {
    login: { text: "Log in", url: "/login" },
    signup: { text: "Sign up", url: "/signup" },
  },
  user,
  onLogout,
}: Navbar1Props) => {
  const componentId = useComponentId("Navbar1")
  return (
    <IndexedSection className="py-4" data-component-id={componentId}>
      <IndexedDiv className="container lg:flex lg:justify-center">
        <IndexedNav className="hidden items-center justify-between lg:flex w-full">
          <IndexedDiv className="flex items-center gap-6">
            <IndexedA href={logo.url} className="flex items-center gap-2">
              <IndexedImg className="max-h-8 dark:invert" alt={logo.alt} src={logo.src} />
              <IndexedSpan className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </IndexedSpan>
            </IndexedA>
            <IndexedDiv className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href={item.url}>
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </IndexedDiv>
          </IndexedDiv>
          <IndexedDiv className="flex gap-4 items-center">
            {user ? (
              <>
                <Button asChild variant="default" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserNav user={user} onLogout={onLogout} />
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <a href={auth.login.url}>{auth.login.text}</a>
                </Button>
                <Button asChild size="sm">
                  <a href={auth.signup.url}>{auth.signup.text}</a>
                </Button>
              </>
            )}
          </IndexedDiv>
        </IndexedNav>
        <IndexedDiv className="block lg:hidden">
          <IndexedDiv className="flex items-center justify-between">
            <IndexedA href={logo.url} className="flex items-center gap-2">
              <IndexedImg className="max-h-8 dark:invert" alt={logo.alt} src={logo.src} />
              <IndexedSpan className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </IndexedSpan>
            </IndexedA>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    <IndexedA href={logo.url} className="flex items-center gap-2">
                      <IndexedImg
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                        src={logo.src}
                      />
                      <IndexedSpan className="text-lg font-semibold tracking-tighter">
                        {logo.title}
                      </IndexedSpan>
                    </IndexedA>
                  </SheetTitle>
                </SheetHeader>
                <IndexedDiv className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => (
                      <AccordionItem
                        key={item.title}
                        value={item.title}
                        className="border-b-0"
                      >
                        <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="mt-2">
                          {item.items?.map((subItem) => (
                            <IndexedA
                              key={subItem.title}
                              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href={subItem.url}
                            >
                              {subItem.icon}
                              <IndexedDiv>
                                <IndexedDiv className="text-sm font-semibold">
                                  {subItem.title}
                                </IndexedDiv>
                                <IndexedP className="text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </IndexedP>
                              </IndexedDiv>
                            </IndexedA>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <IndexedDiv className="border-t py-4">
                    <IndexedDiv className="grid grid-cols-2 justify-start gap-2">
                      {mobileExtraLinks.map((link, idx) => (
                        <IndexedA
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                          href={link.url}
                        >
                          {link.name}
                        </IndexedA>
                      ))}
                    </IndexedDiv>
                  </IndexedDiv>
                  <IndexedDiv className="flex flex-col gap-3">
                    {user ? (
                      <>
                        <Button asChild variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full" onClick={onLogout}>
                          <IndexedSpan>Log out</IndexedSpan>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <a href={auth.login.url}>{auth.login.text}</a>
                        </Button>
                        <Button asChild>
                          <a href={auth.signup.url}>{auth.signup.text}</a>
                        </Button>
                      </>
                    )}
                  </IndexedDiv>
                </IndexedDiv>
              </SheetContent>
            </Sheet>
          </IndexedDiv>
        </IndexedDiv>
      </IndexedDiv>
    </IndexedSection>
  );
};

export { Navbar1 };

import { Navbar1 } from "@/components/ui/navbar1";
import { Hero1 } from "@/components/ui/hero1";
import { Feature17 } from "@/components/ui/feature17";
import { Pricing4 } from "@/components/ui/pricing4";
import { Cta10 } from "@/components/ui/cta10";
import { Footer2 } from "@/components/ui/footer2";
import { Faq1 } from "@/components/ui/faq1";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Transform user object to match Navbar1 expected format
  const navbarUser = user ? {
    name: user.user_metadata?.full_name || user.email?.split('@')[0],
    email: user.email,
    image: user.user_metadata?.avatar_url,
  } : null;

  return (
    <div>
      <Navbar1 user={navbarUser} onLogout={signOut} />
      <Hero1 />
      <Feature17 />
      <Pricing4 />
      <Faq1 />
      <Cta10 />
      <Footer2 />
    </div>
  );
}

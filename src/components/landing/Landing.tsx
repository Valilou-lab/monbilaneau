import { QuoteForm } from "@/components/form/QuoteForm";
import { DesktopAside } from "./DesktopAside";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { HeroTitles } from "./HeroTitles";
import { HowItWorks } from "./HowItWorks";
import { Logo } from "./Logo";
import { TrustPoints } from "./TrustPoints";

/**
 * Same chrome as Couverture Mutuelle `/devis`: logo, short title, form in a
 * colored band, then content below. Everything marked `data-hide-on-focus`
 * disappears from question 2 so the visitor stays in the funnel.
 * No outbound link in the header.
 */
export function Landing() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white text-[18px] leading-[1.55] text-foreground">
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        <main className="min-w-0 lg:flex lg:min-h-screen lg:flex-col">
          <header className="flex justify-center px-4 pb-1 pt-4">
            <Logo />
          </header>

          <div className="mx-auto w-full max-w-[640px] px-4 pb-3 pt-1 lg:max-w-[34rem]">
            <HeroTitles />
          </div>

          <section className="bg-brand-soft lg:flex-1">
            <div className="mx-auto w-full max-w-[640px] px-4 lg:max-w-[34rem] lg:px-6">
              <div id="devis" className="mx-auto w-full max-w-[560px] scroll-mt-4 pb-6 pt-3 lg:pb-10 lg:pt-6">
                <QuoteForm />
              </div>
            </div>
          </section>

          <div data-hide-on-focus className="bg-brand-soft px-4 pb-8 lg:hidden">
            <div className="mx-auto max-w-[560px]">
              <TrustPoints />
            </div>
          </div>
        </main>

        <DesktopAside />
      </div>

      <div data-hide-on-focus>
        <HowItWorks />
        <Faq />
        <FinalCta />
      </div>

      <div data-hide-on-focus className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

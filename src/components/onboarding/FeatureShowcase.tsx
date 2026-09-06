import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MegsyStar from "@/components/branding/MegsyStar";
import { getPayRegionOrGuess, setPayRegion, type PayRegion } from "@/lib/payRegion";
import { setUserLang } from "@/lib/authI18n";
import welcomeExplore from "@/assets/welcome-explore.avif.asset.json";
import welcomeCreate from "@/assets/welcome-megsy-create.jpg";
import welcomePro from "@/assets/welcome-megsy-pro.jpg";
import "@/styles/welcome-showcase.css";

type Direction = "next" | "prev";

const SCREENS = [
  {
    image: welcomeExplore.url,
    title: "Go from idea to done.",
    description: "Megsy plans, creates, and delivers the finished work.",
    alt: "Creative professional carrying work essentials through the sky",
  },
  {
    image: welcomeCreate,
    title: "Create in every format.",
    description: "Images, videos, websites, and reports—all in one place.",
    alt: "A collection of creative work arranged around the Megsy star",
  },
] as const;

const STARS = [
  { left: "10%", bottom: "12%", size: 11, delay: "0s", drift: "18px" },
  { left: "21%", bottom: "7%", size: 7, delay: ".35s", drift: "-13px" },
  { left: "34%", bottom: "13%", size: 13, delay: ".7s", drift: "20px" },
  { left: "49%", bottom: "5%", size: 8, delay: "1.05s", drift: "-18px" },
  { left: "63%", bottom: "11%", size: 12, delay: ".2s", drift: "15px" },
  { left: "76%", bottom: "8%", size: 7, delay: ".82s", drift: "-12px" },
  { left: "88%", bottom: "14%", size: 10, delay: "1.25s", drift: "10px" },
] as const;

export default function FeatureShowcase({ onFinish }: { onFinish?: () => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const touch = useRef({ x: 0, y: 0 });
  const [region] = useState<PayRegion>(() => getPayRegionOrGuess());
  const isPro = index === 2;

  useEffect(() => {
    setPayRegion(region);
    void setUserLang(region === "arab" ? "ar-eg" : "en", { syncRemote: false });
  }, [region]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyColor = document.body.style.backgroundColor;
    const previousHtmlColor = document.documentElement.style.backgroundColor;
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = isPro
      ? "hsl(var(--welcome-night))"
      : "hsl(var(--welcome-paper))";
    document.documentElement.style.backgroundColor = document.body.style.backgroundColor;
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.backgroundColor = previousBodyColor;
      document.documentElement.style.backgroundColor = previousHtmlColor;
    };
  }, [isPro]);

  const goTo = (target: number) => {
    const nextIndex = Math.max(0, Math.min(2, target));
    if (nextIndex === index) return;
    setDirection(nextIndex > index ? "next" : "prev");
    setIndex(nextIndex);
  };

  const continueFlow = () => {
    if (isPro) {
      onFinish?.();
      return;
    }
    goTo(index + 1);
  };

  const finishWithoutOffer = () => onFinish?.();

  const onTouchStart = (event: React.TouchEvent) => {
    touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const dx = event.changedTouches[0].clientX - touch.current.x;
    const dy = event.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
    goTo(dx < 0 ? index + 1 : index - 1);
  };

  return (
    <main
      dir="ltr"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`fixed inset-0 isolate h-[100dvh] w-full overflow-hidden ${
        isPro ? "bg-[hsl(var(--welcome-night))]" : "bg-[hsl(var(--welcome-paper))]"
      }`}
    >
      <h1 className="sr-only">Welcome to Megsy</h1>

      <section
        key={index}
        aria-live="polite"
        className={`flex h-full flex-col ${
          direction === "next" ? "welcome-screen-enter-next" : "welcome-screen-enter-prev"
        }`}
      >
        {isPro ? (
          <ProScreen />
        ) : (
          <IntroScreen screen={SCREENS[index]} eager={index === 0} />
        )}
      </section>

      <div
        className={`absolute inset-x-0 bottom-0 z-20 px-6 pb-[calc(20px+env(safe-area-inset-bottom))] pt-5 sm:mx-auto sm:max-w-md ${
          isPro ? "bg-[hsl(var(--welcome-night))]" : "bg-[hsl(var(--welcome-paper))]"
        }`}
      >
        <div className="mb-3 flex justify-center gap-2" aria-label={`Step ${index + 1} of 3`}>
          {[0, 1, 2].map((step) => (
            <button
              key={step}
              type="button"
              aria-label={`Go to step ${step + 1}`}
              aria-current={step === index ? "step" : undefined}
              onClick={() => goTo(step)}
              className="grid h-6 w-7 place-items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                  step === index
                    ? `w-7 ${isPro ? "bg-[hsl(var(--welcome-gold))]" : "bg-[hsl(var(--welcome-ink))]"}`
                    : `w-1.5 ${isPro ? "bg-[hsl(var(--welcome-gold)/.28)]" : "bg-[hsl(var(--welcome-ink)/.2)]"}`
                }`}
              />
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          data-plain
          onClick={continueFlow}
          className={`h-14 w-full rounded-md text-base font-bold shadow-none ${
            isPro
              ? "bg-[linear-gradient(110deg,hsl(var(--welcome-gold-deep)),hsl(var(--welcome-gold-light)),hsl(var(--welcome-gold)))] text-[hsl(var(--welcome-night))] hover:opacity-95"
              : "bg-[hsl(var(--welcome-ink))] text-[hsl(var(--welcome-paper))] hover:bg-[hsl(var(--welcome-ink)/.9)]"
          }`}
        >
          {isPro ? "Unlock Megsy Pro" : "Continue"}
          {!isPro && <ArrowRight className="size-5" />}
        </Button>

        {isPro && (
          <Button
            type="button"
            variant="ghost"
            onClick={finishWithoutOffer}
            className="mt-1 h-11 w-full text-sm text-[hsl(var(--welcome-gold-light)/.68)] hover:bg-transparent hover:text-[hsl(var(--welcome-gold-light))]"
          >
            Not now
          </Button>
        )}
      </div>

      {index > 0 && !isPro && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Back"
          onClick={() => goTo(index - 1)}
          className="absolute left-4 top-[calc(12px+env(safe-area-inset-top))] z-30 rounded-full text-[hsl(var(--welcome-ink))] hover:bg-[hsl(var(--welcome-ink)/.06)]"
        >
          <ArrowLeft className="size-5" />
        </Button>
      )}
    </main>
  );
}

function IntroScreen({
  screen,
  eager,
}: {
  screen: (typeof SCREENS)[number];
  eager: boolean;
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-36 sm:max-w-lg">
      <div className="relative h-[56dvh] min-h-[330px] max-h-[570px] w-full overflow-hidden">
        <img
          src={screen.image}
          alt={screen.alt}
          width={1024}
          height={1280}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[hsl(var(--welcome-paper))] to-transparent" />
      </div>

      <div className="relative z-10 px-7 pt-5 text-left">
        <h2 className="max-w-[330px] text-[38px] font-extrabold leading-[1.03] text-[hsl(var(--welcome-ink))] sm:text-[42px]">
          {screen.title}
        </h2>
        <p className="mt-4 max-w-[320px] text-[16px] font-medium leading-6 text-[hsl(var(--welcome-muted))]">
          {screen.description}
        </p>
      </div>
    </div>
  );
}

function ProScreen() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-md flex-col pb-44 sm:max-w-lg">
      <div className="relative h-[50dvh] min-h-[300px] max-h-[540px] w-full overflow-hidden">
        <img
          src={welcomePro}
          alt="An open black treasure box filled with golden Megsy stars"
          width={1024}
          height={1280}
          loading="eager"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[hsl(var(--welcome-night))] to-transparent" />

        {STARS.map((star, index) => (
          <MegsyStar
            key={index}
            className="welcome-rising-star absolute text-[hsl(var(--welcome-gold-light))]"
            style={
              {
                left: star.left,
                bottom: star.bottom,
                width: star.size,
                height: star.size,
                "--star-delay": star.delay,
                "--star-drift": star.drift,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="-mt-4 px-7 text-center">
        <div className="mb-3 flex items-center justify-center gap-2 text-[hsl(var(--welcome-gold-light)/.75)]">
          <MegsyStar className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold uppercase tracking-[0.16em]">UNLOCK EVERYTHING</span>
        </div>
        <h2 className="welcome-pro-title relative inline-block overflow-hidden text-[42px] font-black leading-none sm:text-[48px]">
          Megsy Pro
        </h2>
        <h3 className="mt-3 text-[27px] font-extrabold text-[hsl(var(--welcome-paper))]">Your creative treasure</h3>
        <p className="mx-auto mt-3 max-w-sm text-[14px] font-medium leading-7 text-[hsl(var(--welcome-paper)/.62)]">
          More powerful models, Megsy Computer, and bigger creations without daily limits.
        </p>
      </div>
    </div>
  );
}
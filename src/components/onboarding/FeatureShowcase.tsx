import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPayRegionOrGuess, setPayRegion, type PayRegion } from "@/lib/payRegion";
import { setUserLang } from "@/lib/authI18n";
import welcomeEditorial from "@/assets/welcome-korean-editorial.jpg";
import welcomeCreate from "@/assets/welcome-megsy-create.jpg";
import welcomePro from "@/assets/welcome-pro-natural.jpg";
import "@/styles/welcome-showcase.css";

type Direction = "next" | "prev";

const SCREENS = [
  {
    image: welcomeEditorial,
    title: "Research. Plan. Get it done.",
    description: "Megsy searches the web, thinks through every step, and delivers ready-to-use answers and documents.",
    alt: "Korean creative professional wearing silver glasses against a cloudy blue sky",
  },
  {
    image: welcomeCreate,
    title: "Create in every format.",
    description: "Make images, videos, presentations, websites, and reports with the best AI models in one place.",
    alt: "A collection of creative work arranged around the Megsy star",
  },
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
    document.body.style.backgroundColor = "hsl(var(--welcome-paper))";
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
      className="fixed inset-0 isolate h-[100dvh] w-full overflow-hidden bg-[hsl(var(--welcome-paper))]"
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
        className="absolute inset-x-0 bottom-0 z-20 bg-[hsl(var(--welcome-paper))] px-6 pb-[calc(20px+env(safe-area-inset-bottom))] pt-5 sm:mx-auto sm:max-w-md"
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
                    ? "w-7 bg-[hsl(var(--welcome-ink))]"
                    : "w-1.5 bg-[hsl(var(--welcome-ink)/.2)]"
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
          className="h-14 w-full rounded-md bg-[hsl(var(--welcome-ink))] text-base font-bold !text-[hsl(var(--welcome-paper))] shadow-none hover:bg-[hsl(var(--welcome-ink)/.9)]"
        >
          {isPro ? "Unlock Megsy Pro" : "Continue"}
          {!isPro && <ArrowRight className="size-5" />}
        </Button>

        {isPro && (
          <Button
            type="button"
            variant="ghost"
            onClick={finishWithoutOffer}
            className="mt-1 h-11 w-full text-sm text-[hsl(var(--welcome-muted))] hover:bg-transparent hover:text-[hsl(var(--welcome-ink))]"
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
          alt="Megsy Pro creative tools"
          width={1024}
          height={1280}
          loading="eager"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[hsl(var(--welcome-paper))] to-transparent" />
      </div>

      <div className="relative z-10 px-7 pt-5 text-left">
        <h2 className="text-[38px] font-extrabold leading-[1.03] text-[hsl(var(--welcome-ink))] sm:text-[42px]">
          Do more with Megsy Pro.
        </h2>
        <p className="mt-4 max-w-[330px] text-[16px] font-medium leading-6 text-[hsl(var(--welcome-muted))]">
          Use advanced AI models, Megsy Computer, longer tasks, and more creative generations with higher limits.
        </p>
      </div>
    </div>
  );
}
// Starter cards — horizontally scrollable suggestion chips shown above the
// composer on a fresh chat. Tapping a chip switches chat mode for the
// service-specific ones. `StarterCards` is the mobile scroll row,
// `StarterChips` the desktop inline row.
import { memo } from "react";
import {
  Globe,
  Image as ImageIcon,
  Video,
  Presentation,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useUserLang } from "@/lib/authI18n";
import type { ChatMode } from "../chatConstants";

interface StarterCardDef {
  icon: LucideIcon;
  en: string;
  ar: string;
  mode?: ChatMode;
}

const CARDS: StarterCardDef[] = [
  { icon: Globe, en: "Website", ar: "موقع", mode: "code" },
  { icon: ImageIcon, en: "Images", ar: "صور", mode: "images" },
  { icon: Video, en: "Video", ar: "فيديو", mode: "video" },
  { icon: Presentation, en: "Slides", ar: "عروض", mode: "slides" },
  { icon: Search, en: "Research", ar: "بحث", mode: "deep-research" },
];

interface StarterCardsProps {
  className?: string;
  onPick: (prompt: string, mode?: ChatMode) => void;
}

const chipClass =
  "group flex h-9 shrink-0 items-center gap-2 rounded-xl border border-foreground/[0.09] bg-background px-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-foreground/[0.18] active:scale-[0.97]";

const Card = memo(function Card({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={chipClass}>
      <Icon className="h-4 w-4 shrink-0 text-foreground/55" strokeWidth={1.8} />
      <span className="text-[13px] font-medium leading-none text-foreground/80">
        {label}
      </span>
    </button>
  );
});

const StarterCards = memo(function StarterCards({
  className,
  onPick,
}: StarterCardsProps) {
  const lang = useUserLang();
  const isAr = lang === "ar-eg";

  return (
    <div
      className={`relative w-full ${className ?? ""}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar ps-3 pe-8 py-1"
        data-starter-chips-scroll
      >
        {CARDS.map((card) => {
          const label = isAr ? card.ar : card.en;
          return (
            <Card
              key={card.en}
              icon={card.icon}
              label={label}
              onClick={() => onPick(label, card.mode)}
            />
          );
        })}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 w-10 ${
          isAr ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l"
        } from-background to-transparent`}
      />
    </div>
  );
});

export const StarterChips = memo(function StarterChips({
  className,
  onPick,
}: StarterCardsProps) {
  const lang = useUserLang();
  const isAr = lang === "ar-eg";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 ${className ?? ""}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      {CARDS.map((card) => {
        const label = isAr ? card.ar : card.en;
        return (
          <Card
            key={card.en}
            icon={card.icon}
            label={label}
            onClick={() => onPick(label, card.mode)}
          />
        );
      })}
    </div>
  );
});

export default StarterCards;

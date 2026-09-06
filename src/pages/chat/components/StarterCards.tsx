// Starter cards — horizontally scrollable suggestion chips shown above the
// composer on a fresh chat. Tapping a card focuses the input (and switches
// chat mode for the service-specific ones).
import { memo } from "react";
import {
  Globe,
  Image as ImageIcon,
  Video,
  Presentation,
  Search,
  ArrowUp,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/i18n";
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
  isArabicUi: boolean;
  activeMode?: string | null;
  onChipPress: (label: string, mode?: ChatMode) => void;
  onSubmit?: (label: string, mode?: ChatMode) => void;
}

const Card = memo(function Card({
  icon: Icon,
  label,
  active,
  onClick,
  arrow,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
  arrow?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex h-9 shrink-0 items-center gap-2 rounded-xl border px-3.5 transition-all duration-200 active:scale-[0.97]",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-foreground/[0.09] bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/[0.18]",
      ].join(" ")}
      aria-pressed={active}
    >
      <Icon
        className={`h-4 w-4 shrink-0 ${active ? "text-background" : "text-foreground/55"}`}
        strokeWidth={1.8}
      />
      <span
        className={`text-[13px] font-medium leading-none ${
          active ? "text-background" : "text-foreground/80"
        }`}
      >
        {label}
      </span>
      {arrow && active && (
        <ArrowUp
          className="h-3 w-3 shrink-0 text-background/80"
          strokeWidth={2.2}
        />
      )}
    </button>
  );
});

export const StarterCards = memo(function StarterCards({
  isArabicUi,
  activeMode,
  onChipPress,
  onSubmit,
}: StarterCardsProps) {
  const { t } = useTranslation();
  const isAr = isArabicUi;
  const selected = CARDS.find((c) => c.mode && c.mode === activeMode);
  const selectedLabel = selected ? (isAr ? selected.ar : selected.en) : null;

  return (
    <div className="relative w-full" dir={isAr ? "rtl" : "ltr"}>
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar ps-3 pe-8 py-1"
        data-starter-chips-scroll
      >
        {CARDS.map((card) => {
          const label = isAr ? card.ar : card.en;
          const isActive = !!card.mode && card.mode === activeMode;
          return (
            <Card
              key={card.en}
              icon={card.icon}
              label={label}
              active={isActive}
              arrow={!!onSubmit}
              onClick={() =>
                isActive && onSubmit
                  ? onSubmit(label, card.mode)
                  : onChipPress(label, card.mode)
              }
            />
          );
        })}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 w-10 ${
          isAr
            ? "left-0 bg-gradient-to-r"
            : "right-0 bg-gradient-to-l"
        } from-background to-transparent`}
      />
    </div>
  );
});

export const selectedModeTitle = (
  chatMode: string | null | undefined,
  isArabicUi: boolean,
): string | null => {
  const found = CARDS.find((c) => c.mode === chatMode);
  if (!found) return null;
  return isArabicUi ? found.ar : found.en;
};

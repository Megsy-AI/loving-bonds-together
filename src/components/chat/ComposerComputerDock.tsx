/**
 * @doc Computer surface embedded straight into the composer.
 *
 * Collapsed: one slim row — a small rectangular live preview, the label
 * "كومبيوتر ميغسي" with a slowly rotating gold Megsy star, and an up-arrow
 * button. Expanded: a clean box that shows the computer screen only.
 */
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import MegsyStar from "@/components/branding/MegsyStar";
import { useComputerLiveView } from "@/lib/computer/liveView";
import { useUserLang } from "@/lib/authI18n";

export function ComposerComputerDock({ className = "" }: { className?: string }) {
  const view = useComputerLiveView();
  const lang = useUserLang();
  const [open, setOpen] = useState(false);
  const isAr = lang.startsWith("ar");

  useEffect(() => {
    setOpen(false);
  }, [view?.id]);

  if (!view || (!view.active && !view.url && !view.poster)) return null;

  const title = isAr ? "كومبيوتر ميغسي" : "Megsy Computer";

  const screen = (interactive: boolean) =>
    view.url ? (
      <iframe
        key={`${view.url}-${interactive ? "full" : "peek"}`}
        src={view.url}
        title={title}
        className={`absolute inset-0 h-full w-full border-0 ${interactive ? "pointer-events-auto" : "pointer-events-none"}`}
        allow="clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    ) : view.poster ? (
      <img
        src={view.poster}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.08] via-foreground/[0.03] to-transparent motion-safe:animate-pulse" />
    );

  return (
    <div
      data-composer-computer
      className={`overflow-hidden rounded-[20px] border border-border/45 bg-background/75 shadow-none backdrop-blur-md ${className}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? (isAr ? "تصغير كومبيوتر ميغسي" : "Collapse Megsy Computer") : (isAr ? "تكبير كومبيوتر ميغسي" : "Expand Megsy Computer")}
        className="flex min-h-12 w-full items-center gap-2.5 px-2.5 py-2 text-start"
      >
        {/* small rectangular live preview */}
        <span className="relative h-9 w-14 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-foreground/90">
          {screen(false)}
        </span>

        <MegsyStar
          className={`h-4 w-4 shrink-0 ${view.active ? "motion-safe:animate-[spin_3s_linear_infinite]" : ""}`}
          style={{ color: "var(--megsy-gold)" }}
        />

        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-foreground">
          {title}
        </span>

        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground">
          <ChevronUp
            className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </span>
      </button>

      {open ? (
        <div className="relative w-full overflow-hidden bg-foreground/90" style={{ height: "min(52vh, 380px)" }}>
          {screen(true)}
        </div>
      ) : null}
    </div>
  );
}

export default ComposerComputerDock;

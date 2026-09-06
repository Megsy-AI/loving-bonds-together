/**
 * @doc Computer surface embedded straight into the composer.
 *
 * While a computer run works, a slim strip sits on top of the input: the label
 * "كومبيوتر ميغسي", a slowly rotating gold Megsy star, and a small cropped peek
 * of the real screen. Tapping it expands the same strip in place (no dialog, no
 * navigation) into the full screen, and tapping again collapses it back.
 */
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
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
  const status = (view.status || "").trim();

  const screen = view.url ? (
    <iframe
      key={view.url}
      src={view.url}
      title={title}
            className={`absolute inset-0 h-full w-full border-0 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
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
        className="flex min-h-10 w-full items-center gap-2 px-3.5 py-2 text-start"
      >
        <span
          className="grid shrink-0 place-items-center"
          style={{ color: "var(--megsy-gold)" }}
        >
          <MegsyStar
            className={`h-4 w-4 ${view.active ? "motion-safe:animate-[spin_3s_linear_infinite]" : ""}`}
          />
        </span>

        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-foreground">
          {title}
          {status ? <span className="ms-2 font-normal text-muted-foreground">{status}</span> : null}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <div
        role="button"
        tabIndex={0}
        aria-label={open ? "تصغير كومبيوتر ميغسي" : "تكبير كومبيوتر ميغسي"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
        className="relative w-full overflow-hidden bg-foreground/90 transition-[height] duration-[420ms] ease-out"
        style={{ height: open ? "min(48vh, 340px)" : "64px" }}
      >
        {screen}
        {!open ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/70 to-transparent"
          />
        ) : null}
      </div>
    </div>
  );
}

export default ComposerComputerDock;

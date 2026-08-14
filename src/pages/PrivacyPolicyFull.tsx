import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ShieldCheck, Info, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import {
  policyMeta,
  policySections,
  type PolicyBlock,
} from "@/lib/privacyPolicyData";

const Block = ({ block }: { block: PolicyBlock }) => {
  switch (block.type) {
    case "p":
      return (
        <p className="text-[13.5px] leading-[1.7] text-foreground/80">{block.text}</p>
      );
    case "sub":
      return (
        <h4 className="font-display text-[14.5px] text-accent pt-1">{block.text}</h4>
      );
    case "list":
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "hsl(41 70% 55%)" }}
              />
              <span className="text-[13.5px] leading-[1.7] text-foreground/80">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <div
          className="rounded-[16px] border border-primary/25 p-3.5 flex gap-2.5"
          style={{ background: "hsl(45 80% 92% / 0.55)" }}
        >
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
          <p className="text-[12.5px] leading-[1.65] text-foreground/80">
            <span className="font-medium text-accent">Important: </span>
            {block.text}
          </p>
        </div>
      );
    case "fields":
      return (
        <div className="space-y-2">
          {block.items.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-[14px] border border-border/40 bg-card/60 px-3.5 py-2.5"
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                {label}
              </span>
              <span className="block text-[13px] leading-relaxed text-foreground/85 mt-0.5 break-words">
                {value}
              </span>
            </div>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="space-y-2.5">
          {block.rows.map((row) => (
            <div
              key={row[0]}
              className="rounded-[16px] border border-border/40 bg-card/70 overflow-hidden"
            >
              <div
                className="px-3.5 py-2 border-b border-border/40"
                style={{ background: "hsl(45 80% 92% / 0.45)" }}
              >
                <span className="font-display text-[13.5px] text-accent">{row[0]}</span>
              </div>
              <div className="px-3.5 py-2.5 space-y-2">
                {row.slice(1).map((cell, i) => (
                  <div key={block.headers[i + 1]}>
                    <span className="block text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {block.headers[i + 1]}
                    </span>
                    <span className="block text-[12.5px] leading-[1.6] text-foreground/80">
                      {cell}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const PrivacyPolicyFull = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>([policySections[0].number]);

  const allOpen = open.length === policySections.length;
  const toggle = (n: string) =>
    setOpen((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 shrink-0 flex items-center gap-3 px-4 h-16 border-b border-border/40 bg-background/90 backdrop-blur">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-4.5 w-4.5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-[20px] text-foreground tracking-tight leading-tight">
            Full Privacy Policy
          </h1>
          <p className="text-[11px] text-muted-foreground truncate">
            {policyMeta.version} · DPDP Act, 2023
          </p>
        </div>
        <button
          onClick={() =>
            setOpen(allOpen ? [] : policySections.map((s) => s.number))
          }
          className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label={allOpen ? "Collapse all sections" : "Expand all sections"}
        >
          {allOpen ? (
            <ChevronsDownUp className="h-4 w-4 text-primary" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 text-primary" />
          )}
        </button>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1 px-4 py-5 pb-12 space-y-5"
      >
        {/* Title block */}
        <section className="text-center pt-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: "hsl(32 70% 36% / 0.85)" }}
            >
              Legal
            </span>
          </div>
          <h2 className="font-display text-[26px] text-foreground leading-tight">
            Privacy Policy
          </h2>
          <p className="text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground mt-1.5">
            {policyMeta.company}
          </p>
          <p className="text-[12px] text-muted-foreground/80 mt-1">
            {policyMeta.effective} · {policyMeta.updated}
          </p>
        </section>

        {/* Important notice */}
        <section
          className="rounded-[20px] border border-primary/25 p-5"
          style={{ background: "hsl(45 80% 92% / 0.6)" }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2">
            Important Notice
          </h3>
          <p className="text-[13px] leading-[1.7] text-foreground/85">
            {policyMeta.notice}
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-3">
          {policySections.map((section) => {
            const isOpen = open.includes(section.number);
            return (
              <section
                key={section.number}
                className="rounded-[20px] border border-border/40 bg-card/50 overflow-hidden"
              >
                <button
                  onClick={() => toggle(section.number)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[12px] font-semibold"
                    style={{
                      background: "hsl(45 80% 92% / 0.9)",
                      color: "hsl(32 70% 36%)",
                    }}
                  >
                    {section.number}
                  </span>
                  <span className="flex-1 font-display text-[15.5px] text-foreground leading-snug">
                    {section.title}
                  </span>
                  <ChevronDown
                    className={`h-4.5 w-4.5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border/30">
                        {section.blocks.map((block, i) => (
                          <Block key={i} block={block} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 space-y-2">
          <p className="text-[11.5px] text-center italic text-muted-foreground/80 leading-relaxed">
            {policyMeta.footer}
          </p>
          <p className="text-[11px] text-center text-muted-foreground/70">
            {policyMeta.copyright}
          </p>
        </div>
      </motion.main>
    </div>
  );
};

export default PrivacyPolicyFull;

"use client";

import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ExternalLink, Mail, MapPin, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Block,
  ListItem,
  PRIVACY_POLICY_CONTACTS,
  PRIVACY_POLICY_META,
  PRIVACY_POLICY_SECTIONS,
} from "./privacy-policy-content";

/**
 * The full Privacy Policy, presented as a reading pane: a table of contents
 * beside the text on desktop, and a full-height sheet with a collapsible
 * contents drawer on mobile.
 *
 * The card itself never scrolls — only the content column does — so the header,
 * the reading-progress bar and the footer action stay put on a long document.
 */
export function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(PRIVACY_POLICY_SECTIONS[0].id);
  const [progress, setProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  // Escape to close, and hold the page behind the modal still while it is open.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollable = container.scrollHeight - container.clientHeight;
    setProgress(scrollable > 0 ? (container.scrollTop / scrollable) * 100 : 100);

    // The last heading to have passed the top of the viewport is the one being
    // read. Falling back to the first section keeps a heading lit from the top.
    const marker = container.getBoundingClientRect().top + 96;
    let current = PRIVACY_POLICY_SECTIONS[0].id;
    for (const section of PRIVACY_POLICY_SECTIONS) {
      const element = document.getElementById(`privacy-${section.id}`);
      if (element && element.getBoundingClientRect().top <= marker) {
        current = section.id;
      }
    }
    setActiveId(current);
  }, []);

  const goToSection = (id: string) => {
    const element = document.getElementById(`privacy-${id}`);
    const container = scrollRef.current;
    if (!element || !container) return;

    container.scrollTo({
      top:
        element.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        16,
      behavior: "smooth",
    });
    setActiveId(id);
    setTocOpen(false);
  };

  return (
    <Modal
      onClose={onClose}
      className={cn(
        "flex h-[86vh] max-h-[860px] w-full max-w-4xl flex-col overflow-hidden p-0",
        "max-sm:h-[94dvh] max-sm:max-h-[94dvh] max-sm:overflow-hidden",
      )}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border px-8 pt-6 pb-5 max-sm:px-5 max-sm:pt-5 max-sm:pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4 max-sm:gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-light text-Green max-sm:h-10 max-sm:w-10 max-sm:rounded-xl">
              <ShieldCheck className="h-6 w-6 max-sm:h-5 max-sm:w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold leading-8 text-card-text max-sm:text-xl max-sm:leading-7">
                Privacy Policy
              </h2>
              <p className="mt-1 truncate text-sm font-normal leading-6 text-text max-sm:text-[13px]">
                {PRIVACY_POLICY_META.company}
              </p>
            </div>
          </div>
          <CloseBtn onClose={onClose} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 max-sm:mt-3">
          <Chip>Version {PRIVACY_POLICY_META.version}</Chip>
          <Chip>Effective {PRIVACY_POLICY_META.effectiveDate}</Chip>
          <Chip className="max-sm:hidden">
            Updated {PRIVACY_POLICY_META.lastUpdated}
          </Chip>
        </div>

        {/* Contents drawer — shown wherever there is no room for the sidebar */}
        <div className="mt-4 md:hidden">
          <button
            type="button"
            onClick={() => setTocOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-input-background px-4 py-3 text-left text-sm font-medium text-card-text"
          >
            <span className="truncate">
              {tocOpen
                ? "Contents"
                : PRIVACY_POLICY_SECTIONS.find((s) => s.id === activeId)
                    ?.title}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-text transition-transform",
                tocOpen && "rotate-180",
              )}
            />
          </button>
          {tocOpen && (
            <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-border bg-input-background p-1">
              {PRIVACY_POLICY_SECTIONS.map((section) => (
                <TocButton
                  key={section.id}
                  active={section.id === activeId}
                  number={section.number}
                  title={section.title}
                  onClick={() => goToSection(section.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reading progress */}
      <div className="h-0.5 w-full shrink-0 bg-border">
        <div
          className="h-full bg-Green transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Table of contents — desktop */}
        <nav className="w-64 shrink-0 overflow-y-auto border-r border-border p-3 max-md:hidden">
          <p className="px-3 pt-2 pb-3 text-[11px] font-semibold tracking-[0.08em] text-text uppercase">
            Contents
          </p>
          {PRIVACY_POLICY_SECTIONS.map((section) => (
            <TocButton
              key={section.id}
              active={section.id === activeId}
              number={section.number}
              title={section.title}
              onClick={() => goToSection(section.id)}
            />
          ))}
        </nav>

        {/* Policy text */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="min-w-0 flex-1 overflow-y-auto px-8 py-6 max-sm:px-5 max-sm:py-5"
        >
          <p className="text-sm leading-6 text-text">
            This policy explains what we collect, why we collect it, and the
            rights you have over your information.
          </p>

          <div className="mt-6 space-y-8 max-sm:mt-5 max-sm:space-y-7">
            {PRIVACY_POLICY_SECTIONS.map((section) => (
              <section key={section.id} id={`privacy-${section.id}`}>
                <h3 className="flex items-baseline gap-3 text-lg font-semibold leading-7 text-card-text max-sm:text-base">
                  <span className="text-sm font-semibold text-Green">
                    {section.number}.
                  </span>
                  {section.title}
                </h3>
                <div className="mt-3 space-y-3">
                  {section.blocks.map((block, index) => (
                    <BlockView key={index} block={block} />
                  ))}
                  {section.id === "contact-us" && <ContactCard />}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-8 border-t border-border pt-5 text-xs leading-5 text-text max-sm:mt-6">
            Version {PRIVACY_POLICY_META.version} · Effective{" "}
            {PRIVACY_POLICY_META.effectiveDate} · Last updated{" "}
            {PRIVACY_POLICY_META.lastUpdated}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border px-8 py-4 max-sm:px-5 max-sm:py-4">
        <p className="text-xs leading-5 text-text max-sm:hidden">
          Questions? Email{" "}
          <a
            href="mailto:info@xbankang.com"
            className="text-Green hover:underline"
          >
            info@xbankang.com
          </a>
        </p>
        <Button onClick={onClose} className="px-6 max-sm:h-12 max-sm:w-full">
          I understand
        </Button>
      </div>
    </Modal>
  );
}

function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full border border-border bg-input-background px-3 py-1 text-[11px] font-medium leading-4 text-text",
        className,
      )}
    >
      {children}
    </span>
  );
}

function TocButton({
  active,
  number,
  title,
  onClick,
}: {
  active: boolean;
  number: number;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-[13px] leading-5 transition-colors",
        active
          ? "bg-teal-light font-medium text-Green"
          : "text-text hover:bg-border/60 hover:text-card-text",
      )}
    >
      <span className="w-4 shrink-0 tabular-nums">{number}.</span>
      <span className="min-w-0">{title}</span>
    </button>
  );
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "h4") {
    return (
      <h4 className="pt-2 text-sm font-semibold leading-6 text-card-text">
        {block.text}
      </h4>
    );
  }

  if (block.type === "note") {
    return (
      <p className="rounded-xl border border-teal-border bg-teal-light px-4 py-3 text-sm font-medium leading-6 text-teal-text">
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return <List items={block.items} />;
  }

  return <p className="text-sm leading-6 text-text">{block.text}</p>;
}

function List({ items, nested }: { items: ListItem[]; nested?: boolean }) {
  return (
    <ul className={cn("space-y-1.5", nested ? "mt-1.5 pl-4" : "")}>
      {items.map((item, index) => {
        const text = typeof item === "string" ? item : item.text;
        return (
          <li key={index} className="flex gap-2.5 text-sm leading-6 text-text">
            <span
              className={cn(
                "mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full",
                nested ? "bg-text/40" : "bg-Green",
              )}
            />
            <span className="min-w-0">
              {text}
              {typeof item !== "string" && <List items={item.items} nested />}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ContactCard() {
  return (
    <div className="mt-2 divide-y divide-border rounded-2xl border border-border bg-input-background">
      {PRIVACY_POLICY_CONTACTS.map((contact) => {
        const Icon = contact.label === "Registered Office" ? MapPin : contact.label === "Website" ? ExternalLink : Mail;
        return (
          <div
            key={contact.label}
            className="flex items-start gap-3 px-4 py-3 max-sm:px-3.5"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-Green" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-text uppercase">
                {contact.label}
              </p>
              {contact.href ? (
                <a
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="text-sm leading-6 break-words text-Green hover:underline"
                >
                  {contact.value}
                </a>
              ) : (
                <p className="text-sm leading-6 break-words text-card-text">
                  {contact.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

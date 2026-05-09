"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Shield,
  Heart,
  EyeOff,
  Check,
  ChevronDown,
  Menu,
  Phone,
  ArrowRight,
  Sparkles,
  Lock,
  Cloud,
  Timer,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useLocale } from "@/lib/use-locale";
import type { Locale } from "@/lib/i18n-dict";

/* ─── Motion helpers ─── */
const prefersReduced =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const fadeUp = {
  hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Nav links helper ─── */
function getNavLinks(t: (k: string) => string) {
  return [
    { label: t("nav.howItWorks"), href: "#how-it-works" },
    { label: t("nav.privacy"), href: "#privacy" },
    { label: t("nav.safety"), href: "#safety" },
  ];
}

/* ─── Donate ─── */
const DONATION_AMOUNTS = [50, 100, 150, 200, 250];

function DonateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLocale();
  const [selected, setSelected] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<"pix" | "card">("pix");

  const activeAmount = selected || parseInt(customAmount) || 50;

  const handleDonate = () => {
    // TODO: integrate with Stripe Checkout for card
    // For Pix: generate QR code via backend
    if (method === "pix") {
      window.open("#", "_blank");
    } else {
      window.open("#", "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="size-5 text-[#075E54]" fill="currentColor" />
            {t("donate.title")}
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            {t("donate.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {/* Story */}
        <div className="bg-secondary/60 rounded-xl p-5 text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            <strong className="text-foreground">Between Clouds</strong>{" "}
            {t("donate.story1")}
          </p>
          <p>{t("donate.story2")}</p>
          <p>{t("donate.story3")}</p>
          <p className="text-xs italic text-center pt-1">
            {t("donate.storyQuote")}
          </p>
        </div>

        {/* Amount selection */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            {t("donate.chooseAmount")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DONATION_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelected(amount);
                  setCustomAmount("");
                }}
                className={`py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                  selected === amount
                    ? "border-[#075E54] bg-[#075E54]/10 text-[#075E54]"
                    : "border-border text-muted-foreground hover:border-[#075E54]/40"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <input
              type="number"
              placeholder={t("donate.customPlaceholder")}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelected(null);
              }}
              min={10}
              className="w-full pl-7 pr-3 py-2.5 rounded-lg border-2 border-border text-sm focus:outline-none focus:border-[#075E54] transition-colors"
            />
          </div>
        </div>

        {/* Payment method */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            {t("donate.paymentMethod")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMethod("pix")}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                method === "pix"
                  ? "border-[#075E54] bg-[#075E54]/10"
                  : "border-border hover:border-[#075E54]/40"
              }`}
            >
              <span className="text-lg font-bold text-[#32BCAD]">
                {t("donate.pixLabel")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {t("donate.pixDesc")}
              </span>
              {method === "pix" && (
                <Check className="size-3.5 text-[#075E54]" />
              )}
            </button>
            <button
              onClick={() => setMethod("card")}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                method === "card"
                  ? "border-[#075E54] bg-[#075E54]/10"
                  : "border-border hover:border-[#075E54]/40"
              }`}
            >
              <span className="text-lg font-bold text-[#075E54]">
                {t("donate.cardLabel")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {t("donate.cardDesc")}
              </span>
              {method === "card" && (
                <Check className="size-3.5 text-[#075E54]" />
              )}
            </button>
          </div>
          {method === "pix" && (
            <p className="text-[11px] text-muted-foreground text-center">
              {t("donate.pixNote")}
            </p>
          )}
          {method === "card" && (
            <p className="text-[11px] text-muted-foreground text-center">
              {t("donate.cardNote")}
            </p>
          )}
        </div>

        {/* Donate button */}
        <Button
          onClick={handleDonate}
          className="w-full h-12 rounded-xl text-base font-semibold bg-[#075E54] hover:bg-[#064E46] gap-2"
        >
          <Heart className="size-4" fill="currentColor" />
          {t("donate.donateButton")} ${activeAmount}
        </Button>

        <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
          {t("donate.feeNote")}
          {method === "card" && t("donate.cardFeeNote")}
        </p>
      </DialogContent>
    </Dialog>
  );
}

/* ─── FAQ Items helper ─── */
function getFaqItems(t: (k: string) => string) {
  return [
    { q: t("faq.items.0.q"), a: t("faq.items.0.a") },
    { q: t("faq.items.1.q"), a: t("faq.items.1.a") },
    { q: t("faq.items.2.q"), a: t("faq.items.2.a") },
    { q: t("faq.items.3.q"), a: t("faq.items.3.a") },
    { q: t("faq.items.4.q"), a: t("faq.items.4.a") },
    { q: t("faq.items.5.q"), a: t("faq.items.5.a") },
  ];
}

/* ═══════════════════════════════════════════════════
   WHATSAPP CHAT MOCKUP COMPONENT
   This is the HERO — a faithful preview of the
   actual conversation environment on WhatsApp.
   ═══════════════════════════════════════════════════ */

function WhatsAppChatMockup() {
  const { t, locale } = useLocale();
  const [phase, setPhase] = useState(0);

  // Memoize conversation so the useEffect only re-triggers on locale change
  const conversation = useMemo(() => [
    {
      type: "incoming" as const,
      text: t("mockup.conversation0"),
      delay: 800,
    },
    {
      type: "button" as const,
      buttons: [t("mockup.conversationButtons0"), t("mockup.conversationButtons1")],
      delay: 3200,
    },
    {
      type: "status" as const,
      text: t("mockup.conversationStatus"),
      delay: 4500,
    },
    {
      type: "incoming" as const,
      text: t("mockup.conversationHowHelp"),
      delay: 5500,
    },
    {
      type: "outgoing" as const,
      text: t("mockup.conversationUser1"),
      delay: 7500,
    },
    {
      type: "incoming" as const,
      text: t("mockup.conversationAi1"),
      delay: 9500,
    },
    {
      type: "outgoing" as const,
      text: t("mockup.conversationUser2"),
      delay: 12000,
    },
    {
      type: "incoming" as const,
      text: t("mockup.conversationAi2"),
      delay: 14500,
    },
  ], [locale]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    conversation.forEach((msg, i) => {
      timers.push(setTimeout(() => setPhase(i + 1), msg.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [conversation]);

  const visibleMessages = conversation.slice(0, phase);

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      {/* Phone frame */}
      <div className="rounded-[2.5rem] border-[6px] border-gray-800 bg-gray-800 shadow-2xl shadow-black/30 overflow-hidden">
        {/* WhatsApp header bar */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">Between Clouds</p>
            <p className="text-white/70 text-xs">{t("mockup.onlineStatus")}</p>
          </div>
          <div className="flex gap-3 text-white/80">
            <MessageCircle className="w-5 h-5" />
            <Phone className="w-5 h-5" />
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-[#ECE5DD] min-h-[480px] max-h-[520px] overflow-y-auto px-3 py-3 flex flex-col gap-1.5">
          {/* Date bubble */}
          <div className="flex justify-center my-1">
            <span className="bg-white/90 text-gray-500 text-[11px] px-3 py-1 rounded-lg shadow-sm">
              {t("mockup.today")}
            </span>
          </div>

          <AnimatePresence>
            {visibleMessages.map((msg, i) => {
              const isLast = i === visibleMessages.length - 1;

              if (msg.type === "status") {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center my-1"
                  >
                    <span className="bg-[#FFEBB4] text-[#5D4037] text-[11px] px-3 py-1 rounded-lg shadow-sm text-center">
                      {msg.text}
                    </span>
                  </motion.div>
                );
              }

              if (msg.type === "button") {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm p-1.5 max-w-[85%] self-start flex flex-col gap-1.5"
                  >
                    {(msg.buttons || []).map((btn, bi) => (
                      <button
                        key={bi}
                        className="w-full text-center text-[13px] text-[#075E54] font-medium py-[7px] px-3 rounded-md hover:bg-[#E8F5E9] transition-colors border border-[#075E54]/20 bg-[#F5F5F5]"
                      >
                        {btn}
                      </button>
                    ))}
                  </motion.div>
                );
              }

              const isUser = msg.type === "outgoing";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{
                    opacity: isLast && !isUser ? [1, 1, 0.4] : 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    opacity: isLast && !isUser
                      ? { duration: 6, delay: 3, ease: "easeInOut" }
                      : { duration: 0.3 },
                    y: { duration: 0.3 },
                    scale: { duration: 0.3 },
                  }}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
                      isUser
                        ? "bg-[#DCF8C6] rounded-tr-none"
                        : "bg-white rounded-tl-none"
                    }`}
                  >
                    <p className="text-[13.5px] text-gray-800 leading-[1.45] whitespace-pre-line">
                      {msg.text}
                    </p>
                    <span className="float-right mt-1 ml-2 text-[10px] text-gray-400 leading-none flex items-center gap-1">
                      {`${Math.floor((msg.delay || 0) / 6000)}:${String(
                        Math.floor(((msg.delay || 0) % 6000) / 100)
                      ).padStart(2, "0")}`}
                      {isUser && (
                        <svg className="w-3.5 h-3.5 text-[#53BDEB]" viewBox="0 0 16 11" fill="currentColor">
                          <path d="M11.07 0L5.41 5.89 2.24 2.49 0 4.83l5.41 5.66L13.54 2z" />
                        </svg>
                      )}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing indicator (shows while "AI is thinking") */}
          {phase >= 5 && phase < conversation.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-lg rounded-tl-none shadow-sm px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.2,
                      delay: dot * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* WhatsApp input bar */}
        <div className="bg-[#F0F0F0] px-2 py-2 flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400 border border-gray-200">
            {t("mockup.typeMessage")}
          </div>
          <div className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Ephemerality indicator — last message fading */}
      {phase === conversation.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-100 rounded-full px-4 py-2">
            <Timer className="w-3.5 h-3.5" />
            <span>{t("mockup.ephemeralityNote")}</span>
            <Lock className="w-3 h-3.5" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LANGUAGE TOGGLE BUTTON
   ═══════════════════════════════════════════════════ */
function LangToggle({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
}) {
  return (
    <button
      onClick={() => setLocale(locale === "en" ? "pt-BR" : "en")}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-sm px-1.5 py-2 border border-border rounded-md"
      aria-label="Switch language"
    >
      <Globe className="size-4" />
      <span className="text-xs font-medium">{locale === "en" ? "PT" : "EN"}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════ */
export default function Home() {
  const { t, locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = getNavLinks(t);
  const faqItems = getFaqItems(t);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── NAVIGATION ─── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
          aria-label="Main navigation"
        >
          <a
            href="#"
            className="flex items-center gap-2 text-foreground font-semibold text-lg"
            aria-label={t("nav.ariaHome")}
          >
            <Cloud className="size-6 text-[#075E54]" strokeWidth={1.8} />
            <span>Between Clouds</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-2"
              >
                {link.label}
              </button>
            ))}
            <LangToggle locale={locale} setLocale={setLocale} />
            <button
              onClick={() => setDonateOpen(true)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#075E54] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-2"
              aria-label={t("nav.ariaDonate")}
            >
              <Heart className="size-4" />
              <span className="hidden sm:inline">{t("nav.donate")}</span>
            </button>
            <Button
              size="sm"
              className="rounded-full bg-[#075E54] hover:bg-[#064E46]"
              onClick={() => scrollTo("#cta")}
            >
              <MessageCircle className="size-4 mr-1.5" />
              {t("nav.startOnWhatsApp")}
            </Button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Cloud className="size-5 text-[#075E54]" strokeWidth={1.8} />
                  Between Clouds
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 mt-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </button>
                  </SheetClose>
                ))}
                <Separator className="my-2" />
                <div className="px-4 py-2">
                  <LangToggle locale={locale} setLocale={setLocale} />
                </div>
                <Separator className="my-2" />
                <SheetClose asChild>
                  <Button
                    className="w-full rounded-full mt-2 bg-[#075E54] hover:bg-[#064E46]"
                    onClick={() => scrollTo("#cta")}
                  >
                    <MessageCircle className="size-4 mr-1.5" />
                    {t("nav.startOnWhatsApp")}
                  </Button>
                </SheetClose>
                <Separator className="my-2" />
                <SheetClose asChild>
                  <button
                    onClick={() => setDonateOpen(true)}
                    className="w-full text-center px-4 py-3 rounded-lg text-muted-foreground hover:text-[#075E54] hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Heart className="size-4" />
                    {t("nav.donate")}
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      <main className="flex-1">
        {/* ─── HERO: WhatsApp Conversation Preview ─── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ECE5DD]/30 via-background to-background pointer-events-none" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Copy */}
              <div className="order-2 lg:order-1 text-center lg:text-left">
                <FadeUp>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-[#075E54] mb-6 bg-[#075E54]/8 rounded-full px-4 py-1.5">
                    <MessageCircle className="size-4" />
                    <span>{t("hero.badge")}</span>
                  </div>
                </FadeUp>

                <FadeUp delay={1}>
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-foreground leading-[1.1]">
                    {t("hero.title1")}
                    <br />
                    <span className="text-[#075E54]">{t("hero.titleAccent")}</span>
                  </h1>
                </FadeUp>

                <FadeUp delay={2}>
                  <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    {t("hero.description")}
                  </p>
                </FadeUp>

                <FadeUp delay={3}>
                  <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-3 justify-center lg:justify-start">
                    <Button
                      size="lg"
                      className="rounded-full text-base px-8 h-12 gap-2 bg-[#075E54] hover:bg-[#064E46]"
                      onClick={() => scrollTo("#cta")}
                    >
                      <MessageCircle className="size-5" />
                      {t("hero.howItWorks")}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full text-base px-8 h-12"
                      onClick={() => scrollTo("#how-it-works")}
                    >
                      {t("nav.howItWorks")}
                      <ArrowRight className="size-4 ml-1" />
                    </Button>
                  </div>
                </FadeUp>

                <FadeUp delay={4}>
                  <div className="mt-6 flex items-center gap-6 justify-center lg:justify-start text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Lock className="size-3.5" />
                      {t("heroTrust.endToEnd")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <EyeOff className="size-3.5" />
                      {t("heroTrust.noDataStored")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="size-3.5" />
                      {t("heroTrust.crisisSupport")}
                    </span>
                  </div>
                </FadeUp>
              </div>

              {/* Right: WhatsApp Chat Mockup (THE HERO) */}
              <div className="order-1 lg:order-2 flex justify-center">
                <FadeUp delay={2}>
                  <WhatsAppChatMockup />
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* ─── VALUE PROPS — anchored in WhatsApp reality ─── */}
        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
            <FadeUp>
              <p className="text-center text-sm font-medium text-[#075E54] mb-10 sm:mb-12 tracking-wide">
                {t("valueProps.subtitle")}
              </p>
            </FadeUp>
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: t("valueProps.items.0.title"),
                  description: t("valueProps.items.0.description"),
                  whatsapp: t("valueProps.items.0.whatsapp"),
                },
                {
                  icon: MessageCircle,
                  title: t("valueProps.items.1.title"),
                  description: t("valueProps.items.1.description"),
                  whatsapp: t("valueProps.items.1.whatsapp"),
                },
                {
                  icon: Heart,
                  title: t("valueProps.items.2.title"),
                  description: t("valueProps.items.2.description"),
                  whatsapp: t("valueProps.items.2.whatsapp"),
                },
                {
                  icon: EyeOff,
                  title: t("valueProps.items.3.title"),
                  description: t("valueProps.items.3.description"),
                  whatsapp: t("valueProps.items.3.whatsapp"),
                },
              ].map((vp) => {
                const Icon = vp.icon;
                return (
                  <motion.div
                    key={vp.title}
                    variants={fadeUp}
                    className="bg-background rounded-xl border border-border p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-10 rounded-xl bg-[#075E54]/10 text-[#075E54]">
                        <Icon className="size-5" strokeWidth={1.8} />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {vp.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {vp.description}
                    </p>
                    <div className="mt-auto pt-3 border-t border-border">
                      <p className="text-[11px] text-[#075E54]/70 italic flex items-start gap-1.5">
                        <MessageCircle className="size-3 flex-shrink-0 mt-0.5" />
                        {vp.whatsapp}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </StaggerGroup>
          </div>
        </section>

        {/* ─── HOW IT WORKS — WhatsApp flow walkthrough ─── */}
        <section id="how-it-works" className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FadeUp>
              <div className="text-center mb-12 sm:mb-16">
                <p className="text-sm font-medium text-[#075E54] mb-3 tracking-wide">
                  {t("howItWorks.subtitle")}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {t("howItWorks.title")}
                </h2>
              </div>
            </FadeUp>

            <div className="space-y-8 max-w-2xl mx-auto">
              {[
                {
                  step: "01",
                  title: t("howItWorks.steps.0.title"),
                  description: t("howItWorks.steps.0.description"),
                  chat: (
                    <div className="mt-3 bg-[#ECE5DD] rounded-lg p-3 max-w-[280px] ml-auto">
                      <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none px-3 py-2 text-[13px] text-gray-800">
                        {t("howItWorks.steps.0.chatText")}
                      </div>
                    </div>
                  ),
                },
                {
                  step: "02",
                  title: t("howItWorks.steps.1.title"),
                  description: t("howItWorks.steps.1.description"),
                  chat: (
                    <div className="mt-3 bg-[#ECE5DD] rounded-lg p-3 max-w-[320px]">
                      <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 text-[13px] text-gray-800">
                        <p>{t("howItWorks.steps.1.consentWelcome")}</p>
                        <p className="mt-1 text-gray-500">{t("howItWorks.steps.1.consentBefore")}</p>
                        <p className="mt-1 text-gray-500 text-[12px]">{t("howItWorks.steps.1.consentEphemeral")}</p>
                      </div>
                      <div className="bg-white rounded-lg mt-1.5 p-1.5">
                        <div className="text-center text-[12px] text-[#075E54] font-medium py-1.5 px-2 rounded border border-[#075E54]/20">
                          {t("howItWorks.steps.1.consentButton")}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  step: "03",
                  title: t("howItWorks.steps.2.title"),
                  description: t("howItWorks.steps.2.description"),
                  chat: (
                    <div className="mt-3 bg-[#ECE5DD] rounded-lg p-3 space-y-1.5">
                      <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none px-3 py-2 text-[13px] text-gray-800 max-w-[240px] ml-auto">
                        {t("howItWorks.steps.2.userMsg")}
                      </div>
                      <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 text-[13px] text-gray-800 max-w-[260px]">
                        {t("howItWorks.steps.2.aiMsg")}
                      </div>
                    </div>
                  ),
                },
                {
                  step: "04",
                  title: t("howItWorks.steps.3.title"),
                  description: t("howItWorks.steps.3.description"),
                  chat: (
                    <div className="mt-3 bg-[#ECE5DD] rounded-lg p-3 flex items-center justify-center gap-2">
                      <Lock className="size-4 text-gray-400" />
                      <span className="text-xs text-gray-400 italic">
                        {t("howItWorks.steps.3.deletedText")}
                      </span>
                    </div>
                  ),
                },
              ].map((item, i) => (
                <FadeUp key={i} delay={i}>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center size-11 rounded-full bg-[#075E54] text-white font-bold text-sm">
                        {item.step}
                      </div>
                      {i < 3 && (
                        <div className="w-px h-full bg-border mx-auto mt-2 min-h-[20px]" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h3 className="font-semibold text-foreground text-lg mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                        {item.description}
                      </p>
                      {item.chat}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRIVACY GUARANTEE ─── */}
        <section id="privacy" className="py-16 sm:py-24 bg-secondary/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeUp>
              <div className="text-center mb-10 sm:mb-14">
                <div className="inline-flex items-center justify-center size-14 rounded-full bg-[#075E54]/10 text-[#075E54] mb-4">
                  <Lock className="size-6" strokeWidth={1.8} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {t("privacy.title")}
                </h2>
                <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                  {t("privacy.subtitle")}
                </p>
              </div>
            </FadeUp>
            <StaggerGroup className="space-y-3">
              {[
                {
                  text: t("privacy.guarantees.0.text"),
                  detail: t("privacy.guarantees.0.detail"),
                },
                {
                  text: t("privacy.guarantees.1.text"),
                  detail: t("privacy.guarantees.1.detail"),
                },
                {
                  text: t("privacy.guarantees.2.text"),
                  detail: t("privacy.guarantees.2.detail"),
                },
                {
                  text: t("privacy.guarantees.3.text"),
                  detail: t("privacy.guarantees.3.detail"),
                },
                {
                  text: t("privacy.guarantees.4.text"),
                  detail: t("privacy.guarantees.4.detail"),
                },
              ].map((g) => (
                <motion.div
                  key={g.text}
                  variants={fadeUp}
                  className="flex items-start gap-3 bg-background rounded-xl border border-border px-5 py-4"
                >
                  <div className="flex-shrink-0 mt-0.5 flex items-center justify-center size-6 rounded-full bg-[#075E54]/10 text-[#075E54]">
                    <Check className="size-3.5" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-foreground text-sm sm:text-base leading-relaxed">
                      {g.text}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {g.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* ─── MEMORY MODE ─── */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeUp>
              <Card className="border-[#075E54]/15 bg-gradient-to-br from-background to-[#ECE5DD]/20 overflow-hidden relative">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#075E54]/5 rounded-full blur-3xl pointer-events-none" />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl">
                      {t("memory.title")}
                    </CardTitle>
                    <Badge className="bg-[#075E54] text-white border-0">
                      {t("memory.badge")}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2 text-base leading-relaxed">
                    {t("memory.subtitle")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("memory.description")}
                  </p>

                  {/* Example of what Memory Mode stores */}
                  <div className="bg-[#ECE5DD]/50 rounded-lg p-4 border border-[#075E54]/10">
                    <p className="text-xs font-medium text-[#075E54] mb-2">
                      {t("memory.example")}
                    </p>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <span className="text-[#075E54]">&#9679;</span>
                        <span><strong className="text-foreground">{t("memory.exampleTheme.label")}</strong> {t("memory.exampleTheme.value")}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#075E54]">&#9679;</span>
                        <span><strong className="text-foreground">{t("memory.exampleInsight.label")}</strong> {t("memory.exampleInsight.value")}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#075E54]">&#9679;</span>
                        <span><strong className="text-foreground">{t("memory.examplePattern.label")}</strong> {t("memory.examplePattern.value")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Sparkles className="size-4 text-[#075E54] flex-shrink-0 mt-0.5" />
                    <p>
                      {t("memory.footer")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          </div>
        </section>

        {/* ─── SAFETY RESOURCES ─── */}
        <section id="safety" className="py-16 sm:py-24 bg-secondary/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeUp>
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center justify-center size-14 rounded-full bg-destructive/10 text-destructive mb-4">
                  <Heart className="size-6" strokeWidth={1.8} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {t("safety.title")}
                </h2>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                  {t("safety.subtitle")}
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={1}>
              <div className="space-y-4">
                {/* WhatsApp-style crisis resource cards */}
                <Card className="border-[#075E54]/20 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-[#075E54] px-4 py-2.5 flex items-center gap-3">
                      <Phone className="size-4 text-white" />
                      <span className="text-white text-sm font-medium">{t("safety.header")}</span>
                    </div>
                    <div className="divide-y divide-border">
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {t("safety.crisis.0.name")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("safety.crisis.0.info")}</p>
                        </div>
                        <Badge variant="outline" className="text-xs border-[#075E54]/30 text-[#075E54]">
                          {t("safety.crisis.0.badge")}
                        </Badge>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {t("safety.crisis.1.name")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("safety.crisis.1.info")}</p>
                        </div>
                        <Badge variant="outline" className="text-xs border-[#075E54]/30 text-[#075E54]">
                          {t("safety.crisis.1.badge")}
                        </Badge>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {t("safety.crisis.2.name")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("safety.crisis.2.info")}</p>
                        </div>
                        <Badge variant="outline" className="text-xs border-[#075E54]/30 text-[#075E54]">
                          {t("safety.crisis.2.badge")}
                        </Badge>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {t("safety.crisis.3.name")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("safety.crisis.3.info")}</p>
                        </div>
                        <Badge variant="outline" className="text-xs border-[#075E54]/30 text-[#075E54]">
                          {t("safety.crisis.3.badge")}
                        </Badge>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {t("safety.crisis.4.name")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("safety.crisis.4.info")}</p>
                        </div>
                        <Badge variant="outline" className="text-xs border-[#075E54]/30 text-[#075E54]">
                          {t("safety.crisis.4.badge")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeUp>

            <FadeUp delay={2}>
              <p className="mt-6 text-center text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                {t("safety.footer")}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeUp>
              <div className="text-center mb-10 sm:mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {t("faq.title")}
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={1}>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeUp>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section
          id="cta"
          className="py-16 sm:py-24 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-[#ECE5DD]/20 to-background pointer-events-none" />

          <div className="relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
            <FadeUp>
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#075E54]/10 text-[#075E54] mb-6">
                <MessageCircle className="size-7" strokeWidth={1.5} />
              </div>
            </FadeUp>
            <FadeUp delay={1}>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                {t("cta.title")}
              </h2>
            </FadeUp>
            <FadeUp delay={2}>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("cta.subtitle")}
              </p>
            </FadeUp>
            <FadeUp delay={3}>
              <Button
                size="lg"
                className="mt-8 rounded-full text-base px-10 h-14 gap-2 text-lg bg-[#075E54] hover:bg-[#064E46]"
              >
                <MessageCircle className="size-5" />
                {t("cta.button")}
              </Button>
            </FadeUp>
            <FadeUp delay={4}>
              <p className="mt-6 text-xs text-muted-foreground">
                {t("cta.footer")}
              </p>
            </FadeUp>
          </div>
        </section>
      </main>

      {/* ─── FLOATING DONATE BUTTON ─── */}
      <button
        onClick={() => setDonateOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#075E54] hover:bg-[#064E46] text-white rounded-full px-4 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label={t("nav.ariaDonate")}
      >
        <Heart className="size-4 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">{t("nav.donate")}</span>
      </button>

      {/* ─── DONATE DIALOG ─── */}
      <DonateDialog open={donateOpen} onOpenChange={setDonateOpen} />

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <a
                href="#"
                className="flex items-center gap-2 text-foreground font-semibold"
                aria-label={t("nav.ariaHome")}
              >
                <Cloud className="size-5 text-[#075E54]" strokeWidth={1.8} />
                <span>Between Clouds</span>
              </a>
              <p className="text-xs text-muted-foreground max-w-xs text-center sm:text-left">
                {t("footer.disclaimer")}
              </p>
            </div>

            <nav
              className="flex items-center gap-6 text-sm text-muted-foreground"
              aria-label="Footer navigation"
            >
              <button
                onClick={() => scrollTo("#privacy")}
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-2"
              >
                {t("footer.privacyPolicy")}
              </button>
              <button className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-2">
                {t("footer.termsOfService")}
              </button>
              <button
                onClick={() => scrollTo("#safety")}
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-2"
              >
                {t("footer.safetyResources")}
              </button>
              <button
                onClick={() => setDonateOpen(true)}
                className="hover:text-[#075E54] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-2 flex items-center gap-1.5"
              >
                <Heart className="size-3.5" />
                {t("nav.donate")}
              </button>
            </nav>
          </div>

          <Separator className="my-6" />

          <p className="text-center text-xs text-muted-foreground">
            {t("footer.copyright").replace("{year}", String(new Date().getFullYear()))}
          </p>
        </div>
      </footer>
    </div>
  );
}

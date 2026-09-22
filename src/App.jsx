import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  Star,
  Quote,
  MapPin,
  Clock,
  Navigation,
  Scale,
  HeartHandshake,
  Award,
  UserRound,
  Building2,
  Instagram,
  Facebook,
  Linkedin,
  Landmark,
  Briefcase,
  ShieldCheck,
  Users,
  Tv,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HERO_FRAME_COUNT = 240;
const heroFrameSrc = (i) => `/hero-frames/f-${String(i).padStart(3, '0')}.webp`;

const WHATSAPP_NUMBER = '5581989736054';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Olá! Gostaria de falar com um especialista da Reis & Pacheco Advogados.'
)}`;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Av. Dr. Euríco Chaves, 1029 - Casa Amarela, Recife - PE, 52071-250'
)}`;

const NAV_ITEMS = [
  { label: 'Áreas', href: '#areas' },
  { label: 'Sobre', href: '#filosofia' },
  { label: 'Dúvidas', href: '#duvidas' },
];

const TESTIMONIALS = [
  {
    name: 'Alexandre Brito',
    text: 'Profissionais extremamente competentes e atenciosos. Recomendo de olhos fechados.',
  },
  {
    name: 'Robson Henrique',
    text: 'Fui muito bem orientado durante todo o processo junto ao INSS. Equipe humana e transparente.',
  },
  {
    name: 'Eliane Gomes',
    text: 'Conquistei meu benefício graças à dedicação e ao cuidado do escritório em cada etapa.',
  },
];

const PHILOSOPHY_POINTS = [
  { icon: HeartHandshake, label: 'Acolhimento' },
  { icon: ShieldCheck, label: 'Transparência' },
  { icon: Award, label: 'Resultados' },
];

const AREAS_OF_PRACTICE = [
  {
    icon: Landmark,
    title: 'Direito Previdenciário',
    description:
      'Aposentadorias, auxílio-doença, BPC/LOAS, pensão por morte e revisão de benefícios junto ao INSS.',
    featured: true,
  },
  {
    icon: Briefcase,
    title: 'Direito Trabalhista',
    description:
      'Rescisões, verbas trabalhistas, horas extras e ações para garantir seus direitos no emprego.',
  },
  {
    icon: ShieldCheck,
    title: 'Direito do Consumidor',
    description:
      'Cobranças indevidas, produtos e serviços com defeito e negativação indevida do seu nome.',
  },
  {
    icon: Users,
    title: 'Direito de Família',
    description:
      'Pensão alimentícia, divórcio, guarda de filhos e inventário, com cuidado e discrição.',
  },
];

const STATS = [
  { value: '+10 mil', label: 'Benefícios conquistados junto ao INSS' },
  { value: '5,0', label: 'Nota média no Google (21 avaliações)' },
  { value: '4', label: 'Áreas de atuação especializadas' },
  { value: '100%', label: 'Atendimento humanizado, do início ao fim' },
];

const FAQS = [
  {
    q: 'Como sei se tenho direito a algum benefício do INSS?',
    a: 'Cada caso depende do seu histórico de contribuições, idade, tipo de atividade e situação de saúde. Fazemos uma análise inicial do seu caso para identificar o benefício mais adequado — aposentadoria, auxílio-doença, BPC/LOAS ou pensão por morte.',
  },
  {
    q: 'Fui demitido e a empresa não pagou minhas verbas rescisórias. O que fazer?',
    a: 'Você pode ter direito a aviso prévio, férias proporcionais, 13º e FGTS com multa. Avaliamos seu caso e, se necessário, ingressamos com ação trabalhista para garantir o pagamento devido.',
  },
  {
    q: 'Fui cobrado por algo que não reconheço ou tive meu nome negativado indevidamente. Posso fazer algo?',
    a: 'Sim. Cobranças indevidas e negativações sem justa causa podem gerar direito a indenização. Analisamos a documentação e orientamos os próximos passos.',
  },
  {
    q: 'Como funciona uma ação de pensão alimentícia ou divórcio?',
    a: 'Cuidamos de todo o processo com discrição e atenção humana, desde o acordo amigável até a ação judicial, sempre priorizando o bem-estar da família.',
  },
  {
    q: 'O primeiro atendimento tem algum custo?',
    a: 'Não. A análise inicial do seu caso é gratuita — entre em contato pelo WhatsApp e agende uma conversa com nossa equipe.',
  },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// ---------------------------------------------------------------------------
// Scroll-scrubbed 3D canvas (Apple-style) + loading screen + safe fallback
// ---------------------------------------------------------------------------

function LoadingScreen({ progress }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#080E14]"
    >
      <img
        src="/logo.jpg"
        alt="Reis & Pacheco Advogados"
        className="h-14 w-14 rounded-full border border-white/10 object-cover"
      />
      <div className="h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gold transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="font-display text-2xl tabular-nums text-gold">{progress}%</span>
    </motion.div>
  );
}

function ScrollCanvas({ trackRef, scrubEndRef }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const fallbackRef = useRef(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isLoadingRef = useRef(true);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  // Preload every frame up front, tolerating individual failures. Canvas
  // drawImage() of an already-decoded bitmap is effectively instant, which
  // is the whole point versus seeking a <video> element: there is no
  // per-frame decode latency to fight, so the motion can be exactly as
  // smooth as the easing driving it.
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    let errors = 0;
    const imgs = [];

    for (let i = 1; i <= HERO_FRAME_COUNT; i += 1) {
      const img = new Image();
      img.decoding = 'async';
      const settle = () => {
        if (cancelled) return;
        loaded += 1;
        setLoadProgress(Math.round((loaded / HERO_FRAME_COUNT) * 100));
        if (loaded === HERO_FRAME_COUNT) {
          fallbackRef.current = errors / HERO_FRAME_COUNT > 0.4;
          setIsLoading(false);
        }
      };
      img.onload = settle;
      img.onerror = () => {
        errors += 1;
        settle();
      };
      img.src = heroFrameSrc(i);
      imgs.push(img);
    }
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let rafId;
    let lastTimestamp = null;
    // Continuous, eased frame position — e.g. 42.7 means "70% of the way
    // between frame 42 and frame 43" — which lets render() cross-fade the
    // two neighbouring frames for genuine sub-frame smoothness, instead of
    // snapping between whole frames.
    let framePos = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    function drawCover(img) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      ctx.drawImage(img, (w - drawW) / 2, (h - drawH) / 2, drawW, drawH);
    }

    function getTargetPos() {
      const track = trackRef.current;
      const scrubEnd = scrubEndRef.current;
      if (!track || !scrubEnd) return null;

      const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;
      const scrubStartY = docTop(track);
      const scrubEndY = docTop(scrubEnd);
      const scrubRange = scrubEndY - scrubStartY;
      const progress =
        scrubRange > 0 ? clamp((window.scrollY - scrubStartY) / scrubRange, 0, 1) : 0;
      return progress * (HERO_FRAME_COUNT - 1);
    }

    function render() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (fallbackRef.current) {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0e1722');
        grad.addColorStop(0.5, '#131f2c');
        grad.addColorStop(1, '#080e14');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        return;
      }
      if (isLoadingRef.current) return;

      // Always draw a single, sharp source frame — never blend two frames
      // together. Cross-fading looks like smoothing in theory, but with
      // real motion between frames it shows up as visible double-exposure
      // ghosting/blur instead. At the full native 240-frame set the jump
      // between any two neighbouring frames is already small enough that
      // snapping to the nearest one (driven by the same fast easing) reads
      // as clean, continuous motion with no blur.
      const index = Math.max(0, Math.min(HERO_FRAME_COUNT - 1, Math.round(framePos)));
      const img = imagesRef.current[index];

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.filter = 'contrast(1.08) saturate(1.12) brightness(1.02)';
        drawCover(img);
        ctx.filter = 'none';
      }
    }

    // Same fast, time-based easing (fixed half-life, not a fixed fraction
    // per frame) proven on the video version: it converges too quickly for
    // scroll speed to ever build up a noticeable lag, so nothing has to
    // "catch up" abruptly when the user stops scrolling.
    function loop(timestamp) {
      const dt = lastTimestamp === null ? 16.67 : timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      const target = getTargetPos();
      if (target !== null) {
        const delta = target - framePos;
        if (Math.abs(delta) > 0.0006) {
          const HALF_LIFE_MS = 28;
          const factor = 1 - Math.pow(0.5, dt / HALF_LIFE_MS);
          framePos += delta * factor;
        } else {
          framePos = target;
        }
      }
      render();
      rafId = requestAnimationFrame(loop);
    }

    resize();
    render();
    rafId = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, [isLoading, trackRef, scrubEndRef]);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <canvas ref={canvasRef} className="h-full w-full" />
        {/* Persistent dark scrim + vignette so the footage reads moody and
            legible everywhere it shows through — identical from the Hero
            all the way down; the footer's own solid background covers it. */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 15%, transparent 25%, rgba(0,0,0,0.75) 100%)',
          }}
        />
      </div>
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading" progress={loadProgress} />}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Small shared UI helpers
// ---------------------------------------------------------------------------

function ImageWithFallback({ src, alt, icon: Icon, label, className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 border border-white/10 bg-white/[0.04] text-ink-muted backdrop-blur-sm ${className}`}
      >
        <Icon size={28} strokeWidth={1.5} className="text-gold/70" />
        <span className="text-xs tracking-wide">{label}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function Badge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs uppercase tracking-wide text-gold">
      <Icon size={13} /> {children}
    </span>
  );
}

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#0B121A]/70 px-5 py-3.5 shadow-lg shadow-black/20 backdrop-blur-xl">
        <a href="#top" className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Reis & Pacheco Advogados"
            className="h-9 w-9 rounded-full border border-white/10 object-cover"
          />
          <span className="hidden font-display text-base font-semibold tracking-wide text-white sm:block">
            Reis & Pacheco
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-gold">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#0E1722] transition-colors hover:bg-gold-bronze lg:inline-flex"
        >
          <MessageCircle size={16} /> Fale com um Especialista
        </a>

        <button
          onClick={() => setOpen((o) => !o)}
          className="text-white lg:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 flex max-w-7xl flex-col gap-4 rounded-2xl border border-white/10 bg-[#0B121A]/95 p-6 backdrop-blur-xl lg:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm text-white/80 hover:text-gold"
              >
                {item.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[#0E1722]"
            >
              <MessageCircle size={16} /> Fale com um Especialista
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Fase 1 — Hero flutuante (canvas 3D scrubbing por trás)
// ---------------------------------------------------------------------------

function Hero({ trackRef }) {
  return (
    <section ref={trackRef} className="relative h-[160vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative z-10 flex h-full flex-col px-6 pt-24 md:px-16 lg:px-24">
          <div className="flex flex-1 flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="max-w-xl"
            >
              <span className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
                Direito Previdenciário
              </span>
              <h1 className="mb-5 font-display text-4xl leading-[1.18] text-white md:text-6xl">
                Garantimos o direito que você merece com empatia e excelência.
              </h1>
              <p className="mb-4 max-w-md text-base text-white/85 md:text-lg">
                Assessoria jurídica dedicada aos seus direitos junto ao INSS — do primeiro
                atendimento até a conquista do seu benefício.
              </p>
              <p className="mb-8 text-xs uppercase tracking-wide text-white/70">
                Também atuamos em Trabalhista · Consumidor · Família
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#0E1722] transition-colors hover:bg-gold-bronze"
                >
                  <MessageCircle size={18} /> (81) 98973-6054
                </a>
                <a
                  href="#areas"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-gold/50 hover:text-gold"
                >
                  Conheça nossa atuação <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-3 py-6 text-white/75">
            <span className="max-w-[80%] text-center text-xs uppercase tracking-[0.15em] md:tracking-[0.3em]">
              Empatia, técnica e excelência em cada etapa
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={22} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Barra de estatísticas
// ---------------------------------------------------------------------------

function StatsBar() {
  return (
    <section className="relative px-6 py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl text-gold md:text-4xl">{s.value}</div>
            <div className="mt-2 text-xs leading-relaxed text-white/75 md:text-sm">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Áreas de Atuação
// ---------------------------------------------------------------------------

function AreaCard({ icon: Icon, title, description, featured }) {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={`rounded-3xl border p-8 backdrop-blur-md ${
        featured ? 'border-gold/40 bg-gold/[0.06]' : 'border-white/10 bg-surface'
      }`}
    >
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
          featured ? 'bg-gold/15 text-gold' : 'bg-white/5 text-gold'
        }`}
      >
        <Icon size={22} />
      </div>
      {featured && (
        <span className="mb-3 inline-block text-[10px] uppercase tracking-[0.2em] text-gold">
          Área principal
        </span>
      )}
      <h3 className="mb-2 font-display text-xl text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
    </motion.div>
  );
}

function AreasSection() {
  return (
    <section id="areas" className="relative scroll-mt-24 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-gold">
            Como podemos ajudar
          </span>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
            Áreas de Atuação
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            Direito Previdenciário é a nossa especialidade, mas também atuamos nas áreas
            Trabalhista, do Consumidor e de Família.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {AREAS_OF_PRACTICE.map((area) => (
            <AreaCard key={area.title} {...area} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Presença na mídia
// ---------------------------------------------------------------------------

function MediaSection() {
  return (
    <section className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-white/10 bg-surface p-8 backdrop-blur-md md:flex-row md:items-center md:gap-8 md:p-10">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold">
            <Tv size={28} />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold">
              Presença na mídia
            </span>
            <h3 className="mb-2 mt-2 font-display text-xl text-white md:text-2xl">
              Já fomos ouvidos pela imprensa sobre mudanças no INSS
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              Participamos do telejornal <span className="text-white">“O Povo na TV”</span>{' '}
              comentando a prorrogação do prazo de auxílio-doença para médicos e outras
              mudanças que afetam segurados do INSS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Dúvidas frequentes
// ---------------------------------------------------------------------------

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface backdrop-blur-md">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-white">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gold transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-ink-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqSection() {
  return (
    <section id="duvidas" className="relative scroll-mt-24 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-gold">
            Dúvidas frequentes
          </span>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
            Perguntas que recebemos com frequência
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {FAQS.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Fase 2 — Bento grid
// ---------------------------------------------------------------------------

function FilosofiaCard() {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      id="filosofia"
      className="scroll-mt-28 rounded-3xl border border-white/10 bg-surface p-8 backdrop-blur-md md:col-span-2 md:p-10 lg:col-span-3"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-6 flex flex-wrap gap-3">
            <Badge icon={Scale}>Direito Previdenciário</Badge>
            <Badge icon={HeartHandshake}>Atendimento Humanizado</Badge>
          </div>
          <h3 className="mb-4 font-display text-2xl text-white md:text-3xl">
            Filosofia & Humanização
          </h3>
          <p className="leading-relaxed text-ink-muted">
            No nosso escritório, colocamos as pessoas em primeiro lugar. Oferecemos acolhimento
            com empatia e compreensão, garantindo suporte em cada etapa do seu processo junto ao
            INSS.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:flex lg:shrink-0 lg:gap-8">
          {PHILOSOPHY_POINTS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex w-full min-w-0 flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                <Icon size={24} />
              </div>
              <span className="w-full text-xs uppercase tracking-wide text-white/70 [hyphens:auto] [overflow-wrap:break-word]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AutoridadeCard() {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      id="autoridade"
      className="scroll-mt-28 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface backdrop-blur-md"
    >
      <ImageWithFallback
        src="/advogado.jpg"
        alt="Dr. Arthur Câmara, advogado responsável"
        icon={UserRound}
        label="Foto em breve"
        className="h-64 w-full object-cover"
      />
      <div className="flex flex-1 flex-col justify-between p-8">
        <div>
          <Badge icon={Award}>Autoridade Jurídica</Badge>
          <h3 className="mb-1 mt-4 font-display text-2xl text-white md:text-3xl">
            Dr. Arthur Câmara
          </h3>
          <p className="mb-4 text-sm text-gold">Advogado Responsável</p>
          <p className="text-sm leading-relaxed text-ink-muted">
            Condução estratégica de cada caso, com rigor técnico e olhar humano, para garantir
            o melhor resultado possível junto ao INSS.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ProvaSocialCard() {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-surface p-8 backdrop-blur-md"
    >
      <div>
        <Badge icon={Star}>Prova Social</Badge>
        <div className="mt-4 flex items-center gap-3">
          <span className="font-display text-4xl text-white">5,0</span>
          <div className="flex flex-col">
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="#D4AF37" strokeWidth={0} />
              ))}
            </div>
            <span className="text-xs text-ink-muted">21 avaliações no Google Maps</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <Quote size={14} className="mb-2 text-gold/60" />
            <p className="mb-2 text-sm leading-relaxed text-ink-muted">&ldquo;{t.text}&rdquo;</p>
            <span className="text-xs font-semibold text-white">{t.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function UnidadeCard() {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      id="unidade"
      className="scroll-mt-28 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface backdrop-blur-md"
    >
      <ImageWithFallback
        src="/faixada-advocacia.jpg"
        alt="Fachada da unidade Casa Amarela do escritório Reis & Pacheco"
        icon={Building2}
        label="Foto em breve"
        className="h-64 w-full object-cover object-center"
      />
      <div className="flex flex-1 flex-col gap-4 p-8">
        <Badge icon={MapPin}>Unidade Casa Amarela</Badge>
        <div className="flex items-start gap-2 text-sm text-ink-muted">
          <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
          <span>Av. Dr. Euríco Chaves, n° 1029 - Casa Amarela, Recife - PE, 52071-250</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <Clock size={16} className="shrink-0 text-gold" />
          <span>Aberto das 07:30 às 16:30</span>
        </div>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-[#0E1722]"
        >
          <Navigation size={16} /> Traçar rota
        </a>
      </div>
    </motion.div>
  );
}

function BentoGrid() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <span className="text-xs uppercase tracking-[0.25em] text-gold">
            Por que escolher a Reis & Pacheco
          </span>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
            Excelência técnica, cuidado humano
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FilosofiaCard />
          <AutoridadeCard />
          <ProvaSocialCard />
          <UnidadeCard />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Fase 3 — Footer
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#05090D] px-6 pb-8 pt-16">
      <div className="mx-auto mb-12 grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Reis & Pacheco Advogados"
              className="h-10 w-10 rounded-full border border-white/10 object-cover"
            />
            <span className="font-display text-lg">Reis & Pacheco</span>
          </div>
          <p className="mb-5 max-w-xs text-sm leading-relaxed text-ink-muted">
            Escritório especializado em Direito Previdenciário — também atuamos em
            Trabalhista, Consumidor e Família — dedicado a garantir com empatia e
            excelência os direitos dos nossos clientes.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/reisepacheco/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-colors hover:border-gold/40 hover:text-gold"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.facebook.com/reisepacheco?locale=pt_BR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-colors hover:border-gold/40 hover:text-gold"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://www.linkedin.com/company/reis-e-pacheco/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-colors hover:border-gold/40 hover:text-gold"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Acesso Rápido
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-ink-muted">
            <li>
              <a href="#top" className="transition-colors hover:text-gold">
                Início
              </a>
            </li>
            <li>
              <a href="#areas" className="transition-colors hover:text-gold">
                Áreas de Atuação
              </a>
            </li>
            <li>
              <a href="#duvidas" className="transition-colors hover:text-gold">
                Dúvidas Frequentes
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Contato
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-ink-muted">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-gold"
              >
                <MessageCircle size={15} /> (81) 98973-6054
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              <span>Av. Dr. Euríco Chaves, n° 1029 - Casa Amarela, Recife - PE, 52071-250</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-ink-muted md:flex-row">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Reis & Pacheco Advogados. Todos os direitos reservados.
          Em conformidade com o Código de Ética da OAB.
        </p>
        <div className="flex gap-5">
          <a href="#termos" className="transition-colors hover:text-gold">
            Termos de Uso
          </a>
          <a href="#privacidade" className="transition-colors hover:text-gold">
            Política de Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const trackRef = useRef(null);
  const scrubEndRef = useRef(null);

  return (
    <div className="relative font-sans text-white">
      <ScrollCanvas trackRef={trackRef} scrubEndRef={scrubEndRef} />
      <Header />
      <Hero trackRef={trackRef} />
      <main className="relative z-10">
        <StatsBar />
        <AreasSection />
        <BentoGrid />
        <div ref={scrubEndRef} />
        <MediaSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

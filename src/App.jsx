import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Battery,
  CheckCircle2,
  Droplets,
  ImageOff,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sun,
  Umbrella,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import "./index.css";

const whatsappNumber = "254759341122";

// Each service carries 2-3 real photos from Elitex projects. The carousel
// switches between services, and within the active service the photos
// themselves crossfade like a short slideshow.
const services = [
  {
    icon: <Sun size={26} />,
    title: "Solar Installation",
    description: "Professional solar system design and installation for homes, businesses, institutions, and farms.",
    images: [
      ["/images/solar-installation.jpeg", "/images/solar-installation.jpg"],
      ["/images/Professional-installation-services.jpeg"],
    ],
  },
  {
    icon: <Battery size={26} />,
    title: "Solar Backup Systems",
    description: "Reliable battery and backup solutions designed to keep your home or business powered when you need it most.",
    images: [
      ["/images/solar-products.jpeg", "/images/solar-products.jpg"],
      ["/images/project-result.jpeg"],
    ],
  },
  {
    icon: <Droplets size={26} />,
    title: "Solar Water Pumping",
    description: "Efficient solar-powered water pumping systems for farms, livestock, homes, and agricultural projects.",
    images: [
      ["/images/water-pumps.jpeg", "/images/water-pumps.jpg"],
      ["/images/showcase/water-pump-river.jpg"],
      ["/images/showcase/water-pump-pond.jpg"],
    ],
  },
  {
    icon: <Wrench size={26} />,
    title: "Borehole Drilling",
    description: "Professional borehole drilling solutions that help homes, businesses, and farms access reliable water.",
    images: [
      ["/images/solar-pumping-project.jpeg", "/images/solar-pumping-project.jpg"],
      ["/images/showcase/borehole-rig-truck.jpg"],
      ["/images/showcase/borehole-flowing.jpg"],
    ],
  },
  {
    icon: <Zap size={26} />,
    title: "Solar Maintenance",
    description: "Inspection, troubleshooting, maintenance, and repair services to keep your solar system performing efficiently.",
    images: [
      ["/images/elitex-engineers.jpg", "/images/elitex-engineers.jpeg"],
      ["/images/sollar.education.jpeg"],
      ["/images/showcase/maintenance-technician-check.jpg"],
    ],
  },
  {
    icon: <Leaf size={26} />,
    title: "Agro Innovation",
    description: "Practical agricultural and energy innovations designed to support productivity and sustainable farming.",
    images: [
      ["/images/services.jpeg", "/images/services.jpg"],
      ["/images/showcase/agro-drip-irrigation.jpg"],
      ["/images/showcase/agro-watering-cabbage.jpg"],
    ],
  },
  {
    icon: <Umbrella size={26} />,
    title: "Solar Shade Structures",
    description: "Elevated solar shade and carport structures that generate clean power while shading homes, yards, and farm equipment.",
    images: [
      ["/images/showcase/solar-shade-hero.jpg"],
      ["/images/showcase/solar-shade-angled.jpg"],
      ["/images/showcase/solar-shade-watertank.jpg"],
    ],
  },
];

function SafeImage({ sources, alt, className = "" }) {
  const [sourceIndex, setSourceIndex] = useState(0);

  const handleImageError = () => {
    setSourceIndex((currentIndex) => currentIndex + 1);
  };

  if (sourceIndex >= sources.length) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={`${alt}. Image unavailable`}>
        <ImageOff size={28} />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleImageError}
    />
  );
}

// A single service's photos, choreographed like a short edit rather than a
// slideshow: photo one opens big and alone; photo two's big entrance sends
// photo one down into a small corner frame, then both settle into an even
// two-up split; photo three's big entrance resolves that split into a
// horizontal reel (one photo enlarged, the next peeking at the edge, cycling
// through all of them); a photo four would resolve the reel into a four-up
// grid. When the sequence has played out, however many photos are on screen
// slide off together along one line, and it opens again from photo one.
const HERO_HOLD = 2600;
const HANDOFF_MS = 900;
const DUO_HOLD = 3400;
const COVER_MS = 900;
const REEL_STEP = 2600;
const GRID_HOLD = 4200;
const EXIT_MS = 750;
const GAP_MS = 180;
const TILE_GAP = 3;
const HIDDEN_TILE = { left: "50%", top: "50%", width: "6%", height: "6%", opacity: 0, zIndex: 0 };

function buildStreamTimeline(count) {
  const cues = [];
  let t = 0;
  cues.push({ t, type: "solo" });
  t += HERO_HOLD;
  if (count >= 2) {
    cues.push({ t, type: "handoff" });
    t += HANDOFF_MS;
    cues.push({ t, type: "duo" });
    t += DUO_HOLD;
  }
  if (count >= 3) {
    cues.push({ t, type: "cover", entering: 2, from: "duo" });
    t += COVER_MS;
    cues.push({ t, type: "reel" });
    t += REEL_STEP * Math.min(count, 3);
  }
  if (count >= 4) {
    cues.push({ t, type: "cover", entering: 3, from: "reel" });
    t += COVER_MS;
    cues.push({ t, type: "grid" });
    t += GRID_HOLD;
  }
  const exitFrom = count >= 4 ? "grid" : count >= 3 ? "reel" : "duo";
  cues.push({ t, type: "exit", from: exitFrom });
  t += EXIT_MS;
  // The gap is just a held beat before the loop restarts, not a fresh
  // layout: it keeps every tile parked exactly where "exit" left it
  // (off-stage, mid-slide) so nothing new starts transitioning here. If
  // it instead re-targeted tiles toward a tiny centered placeholder, that
  // transition would immediately get interrupted by the next solo cue
  // pulling the same tile back on-stage, and the two overlapping,
  // half-finished transitions is what read as a stray dark/hazy patch
  // drifting across the card.
  cues.push({ t, type: "exit", from: exitFrom });
  t += GAP_MS;
  return { cues, total: t };
}

function reelTileStyle(i, activeIndex, revealed) {
  const offset = ((i - activeIndex) % revealed + revealed) % revealed;
  if (offset === 0) return { left: "14%", top: "0%", width: "68%", height: "100%", opacity: 1, zIndex: 6 };
  if (offset === 1) return { left: "84%", top: "9%", width: "20%", height: "82%", opacity: 0.72, zIndex: 3 };
  return { left: "-4%", top: "9%", width: "20%", height: "82%", opacity: 0.72, zIndex: 3 };
}

function streamTileGeometry(i, ctx) {
  const { type, revealed, activeReel, entering, from } = ctx;

  if (type === "gap") return { style: HIDDEN_TILE, hero: false };

  if (type === "exit") {
    // Slide the settled arrangement off as one piece: reuse each tile's
    // already-settled position/size (duo, reel, or grid, whichever the
    // sequence was last showing) rather than snapping to a fresh layout,
    // so only the slide itself animates instead of position and size
    // jumping at the same time the tile starts moving.
    const base =
      from === "reel"
        ? reelTileStyle(i, activeReel, Math.min(revealed, 3))
        : from === "grid"
        ? (() => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const w = 50 - TILE_GAP;
            return { left: `${col === 0 ? 0 : 50 + TILE_GAP}%`, top: `${row === 0 ? 0 : 50 + TILE_GAP}%`, width: `${w}%`, height: `${w}%`, opacity: 1, zIndex: 2 };
          })()
        : { left: `${i === 0 ? 0 : 50 + TILE_GAP}%`, top: "0%", width: `${50 - TILE_GAP}%`, height: "100%", opacity: 1, zIndex: 2 };
    return { style: { ...base, transform: "translateX(-125%)" }, hero: false };
  }

  if (i >= revealed) return { style: HIDDEN_TILE, hero: false };

  if (type === "solo") {
    return { style: { left: "0%", top: "0%", width: "100%", height: "100%", opacity: 1, zIndex: 2 }, hero: false };
  }

  if (type === "handoff") {
    if (i === 0) {
      return { style: { left: "70%", top: "66%", width: "27%", height: "30%", opacity: 1, zIndex: 15 }, hero: false };
    }
    return { style: { left: "0%", top: "0%", width: "100%", height: "100%", opacity: 1, zIndex: 20 }, hero: true };
  }

  if (type === "duo") {
    const w = 50 - TILE_GAP;
    return { style: { left: `${i === 0 ? 0 : 50 + TILE_GAP}%`, top: "0%", width: `${w}%`, height: "100%", opacity: 1, zIndex: 2 }, hero: false };
  }

  if (type === "reel") {
    return { style: reelTileStyle(i, activeReel, Math.min(revealed, 3)), hero: false };
  }

  if (type === "grid") {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const w = 50 - TILE_GAP;
    return {
      style: { left: `${col === 0 ? 0 : 50 + TILE_GAP}%`, top: `${row === 0 ? 0 : 50 + TILE_GAP}%`, width: `${w}%`, height: `${w}%`, opacity: 1, zIndex: 2 },
      hero: false,
    };
  }

  if (type === "cover") {
    if (i === entering) {
      return { style: { left: "0%", top: "0%", width: "100%", height: "100%", opacity: 1, zIndex: 20 }, hero: true };
    }
    if (from === "duo") {
      const w = 50 - TILE_GAP;
      return { style: { left: `${i === 0 ? 0 : 50 + TILE_GAP}%`, top: "0%", width: `${w}%`, height: "100%", opacity: 1, zIndex: 2 }, hero: false };
    }
    if (from === "reel") {
      return { style: reelTileStyle(i, 0, Math.min(revealed - 1, 3)), hero: false };
    }
  }

  return { style: HIDDEN_TILE, hero: false };
}

function ImageStream({ images, alt, active, paused }) {
  const count = images.length;
  const { cues, total } = useMemo(() => buildStreamTimeline(count), [count]);
  const [elapsed, setElapsed] = useState(0);

  // Loops this one service's own sequence indefinitely — it never advances
  // to another service on its own. Only a manual tab click changes which
  // service is showing.
  useEffect(() => {
    if (!active || paused) return undefined;
    const STEP = 90;
    const id = setInterval(() => {
      setElapsed((value) => (value + STEP >= total ? 0 : value + STEP));
    }, STEP);
    return () => clearInterval(id);
  }, [active, paused, total]);

  // Reset the sequence back to its opening shot whenever this service stops
  // being the active one, so returning to it later always starts fresh.
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (!active) setElapsed(0);
  }

  let current = cues[0];
  for (const cue of cues) {
    if (cue.t <= elapsed) current = cue;
    else break;
  }

  const reelCue = cues.find((cue) => cue.type === "reel");
  const activeReel = reelCue ? Math.floor((elapsed - reelCue.t) / REEL_STEP) % Math.min(count, 3) : 0;

  let revealed = 0;
  if (current.type === "solo") revealed = 1;
  else if (current.type === "handoff" || current.type === "duo") revealed = 2;
  else if (current.type === "reel") revealed = Math.min(count, 3);
  else if (current.type === "grid") revealed = Math.min(count, 4);
  else if (current.type === "cover") revealed = (current.entering ?? 0) + 1;
  else if (current.type === "exit") revealed = count;

  const ctx = { ...current, revealed, activeReel, count };

  return (
    <div className={paused ? "stream is-paused" : "stream"}>
      {images.map((sources, i) => {
        const { style, hero } = streamTileGeometry(i, ctx);
        return (
          <div key={i} className={hero ? "stream-tile is-hero" : "stream-tile"} style={{ ...style, "--tile-i": i }}>
            <SafeImage sources={sources} alt={`${alt} photo ${i + 1}`} className="stream-tile-img" />
          </div>
        );
      })}
    </div>
  );
}

function ServiceCarousel({ items, onAction }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const total = items.length;

  const active = items[index];

  // A light, physical tilt that follows the cursor across the image panel,
  // so the floating photo card reads as something you can reach out and
  // turn in your hand rather than a flat, static picture.
  const handleVisualMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -7, y: px * 9 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      className={paused ? "showcase-carousel is-paused" : "showcase-carousel"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="showcase-tabs" role="tablist" aria-label="Our services">
        {items.map((item, i) => {
          const isActive = i === index;
          return (
            <button
              key={item.title}
              role="tab"
              aria-selected={isActive}
              className={isActive ? "showcase-tab is-active" : "showcase-tab"}
              onClick={() => setIndex(i)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <span className="showcase-tab-icon">{item.icon}</span>
              <span className="showcase-tab-label">{item.title}</span>
            </button>
          );
        })}
      </div>

      <div className="showcase-stage">
        <div
          className="showcase-visual"
          onMouseMove={handleVisualMove}
          onMouseLeave={resetTilt}
          style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          <div className="showcase-visual-glow" aria-hidden="true" />
          {items.map((item, i) => (
            <div
              key={item.title}
              className={i === index ? "showcase-frame is-active" : "showcase-frame"}
              aria-hidden={i !== index}
            >
              <ImageStream
                images={item.images}
                alt={item.title}
                active={i === index}
                paused={paused}
              />
            </div>
          ))}
        </div>

        <div key={index} className="showcase-info">
          <span className="showcase-info-index">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
          <button onClick={onAction}>Talk to Us <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

const sectionIds = ["home", "about", "services", "why-us", "contact"];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // The navbar stays transparent over the hero and only picks up a solid
  // backdrop once the page has scrolled past it, so text stays readable.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    ["home", "Home"],
    ["about", "About"],
    ["services", "Services"],
    ["why-us", "Why Elitex"],
    ["contact", "Contact"],
  ];

  // Highlights the nav pill for whichever section is currently in view.
  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = `Hello Elitex Solar & Agro Innovations,\n\nI would like to make an inquiry.\n\nName: ${formData.get("name")}\nPhone: ${formData.get("phone")}\nEmail: ${formData.get("email")}\nService: ${formData.get("service")}\n\nProject details:\n${formData.get("message")}`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
    event.currentTarget.reset();
  };

  return (
    <>
      <header className={scrolled ? "navbar is-scrolled" : "navbar"}>
        <div className="container nav-container">
          <button className="logo" onClick={() => scrollToSection("home")} aria-label="Go to Elitex homepage">
            {/* The navbar always sits over a dark green backdrop (the hero,
                or the scrolled bar's own dark fill), so it always takes the
                white mark. */}
            <SafeImage
              sources={["/images/elitex-mark-white.png"]}
              alt="Elitex Solar and Agro Innovations"
              className="logo-image"
            />
          </button>

          <nav className={menuOpen ? "nav-links active" : "nav-links"} aria-label="Main navigation">
            {navigation.map(([id, label]) => (
              <button
                key={id}
                className={activeSection === id ? "is-active" : undefined}
                aria-current={activeSection === id ? "page" : undefined}
                onClick={() => scrollToSection(id)}
              >
                {label}
              </button>
            ))}
            <button className="nav-links-cta" onClick={() => scrollToSection("contact")}>
              Get a Quote <ArrowRight size={17} />
            </button>
          </nav>

          <button className="nav-cta" onClick={() => scrollToSection("contact")}>
            Get a Quote <ArrowRight size={17} />
          </button>

          <button
            className="menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} strokeWidth={2.75} /> : <Menu size={26} strokeWidth={2.75} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content container">
            <div className="hero-copy">
              <h1>Powering homes, businesses <em>and farms</em> with smart solutions.</h1>
              <div className="hero-actions">
                <button className="primary-btn" onClick={() => scrollToSection("contact")}>
                  Get a Free Consultation <ArrowRight size={19} />
                </button>
                <button className="secondary-btn" onClick={() => scrollToSection("services")}>
                  Explore Our Services
                </button>
              </div>
            </div>
          </div>

          <div className="hero-photo-cluster" aria-hidden="true">
            <div className="hero-photo-circle hero-photo-circle-lg hero-photo-circle-product">
              <SafeImage
                sources={["/images/heropump.png"]}
                alt=""
                className="hero-photo-img"
              />
            </div>
            <div className="hero-photo-circle hero-photo-circle-md hero-photo-circle-product">
              <SafeImage
                sources={["/images/inverter.png"]}
                alt=""
                className="hero-photo-img"
              />
            </div>
            <div className="hero-photo-circle hero-photo-circle-sm hero-photo-circle-product">
              <SafeImage
                sources={["/images/solar.png"]}
                alt=""
                className="hero-photo-img"
              />
            </div>
          </div>

          <svg className="hero-curve" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,110 C 220,180 420,10 720,70 C 1020,130 1180,150 1440,90 L1440,180 L0,180 Z" fill="var(--paper)" />
          </svg>
        </section>

        <section id="about" className="section about-section">
          <div className="hero-cabbage" aria-hidden="true">
            <SafeImage
              sources={["/images/cabbage.png"]}
              alt=""
              className="hero-cabbage-img"
            />
          </div>
          <div className="container about-grid">
            <div className="about-content">
              <span className="section-tag">About Elitex</span>
              <h2>Reliable solutions for energy, <em>water and agriculture.</em></h2>
              <p>Elitex Solar & Agro Innovations Limited provides practical, reliable, and sustainable solutions for homes, businesses, and farmers.</p>
              <p>We combine technical knowledge with hands-on experience to support growth, productivity, efficiency, and long-term sustainability.</p>
              <div className="check-list">
                {["Professional system assessment", "Customized solar solutions", "Reliable water solutions", "Quality after-sales support"].map((item) => (
                  <div key={item}><CheckCircle2 size={19} /> {item}</div>
                ))}
              </div>
              <button className="text-btn" onClick={() => scrollToSection("contact")}>Talk to Our Team <ArrowRight size={18} /></button>
            </div>
          </div>
        </section>

        <section id="services" className="section services-section">
          <div className="container">
            <div className="section-heading">
              <span className="section-tag">Our Services</span>
              <h2>Affordable, reliable engineering you can trust.</h2>
              <p>We provide the best affordable, reliable engineering solutions in solar, water, and agriculture — handled end to end by accredited technicians, from first assessment through installation and after-sales support.</p>
            </div>
            <ServiceCarousel items={services} onAction={() => scrollToSection("contact")} />
          </div>
        </section>

        <section id="why-us" className="section bento-section">
          <div className="container">
            <div className="bento-header">
              <div>
                <span className="section-tag">What You Get</span>
                <h2>What you get with Elitex as a brand.</h2>
                <p>From the first site visit to years of upkeep, one accredited team handles every step — so you never have to manage the project yourself.</p>
              </div>
              <button className="primary-btn bento-cta" onClick={() => scrollToSection("contact")}>
                Get a Quote <ArrowRight size={19} />
              </button>
            </div>

            <div className="bento-grid">
              <div className="bento-card bento-card--light bento-card--tall">
                <h3>Every service, ready to go</h3>
                <p>Solar, water, boreholes, backup power, and agro innovation — seven services under one accredited team. Pick what your project needs.</p>
                <div className="bento-tabs">
                  <span className="bento-tab is-active">All</span>
                  <span className="bento-tab">Solar</span>
                  <span className="bento-tab">Water</span>
                  <span className="bento-tab">Agro</span>
                </div>
                <div className="bento-thumb-grid">
                  {[
                    ["/images/whychooseus/solar-battery.jpg", "Solar Systems"],
                    ["/images/whychooseus/water-pump.png", "Water Pumping"],
                    ["/images/whychooseus/borehole-drilling.jpg", "Borehole Drilling"],
                    ["/images/whychooseus/agro-innovation.jpg", "Agro Innovation"],
                  ].map(([src, label]) => (
                    <div className="bento-thumb" key={label}>
                      <SafeImage sources={[src]} alt={label} className="bento-thumb-image" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bento-col-right">
                <div className="bento-card bento-card--dark">
                  <h3>One accredited team, every step</h3>
                  <p>From first site assessment to final commissioning and after-sales care — the same technicians see your project through, not a rotating crew.</p>
                </div>

                <div className="bento-row-split">
                  <div className="bento-card bento-card--clay">
                    <h3>Every project, tailored</h3>
                    <p>Every project is assessed individually — homes, farms, and institutions each get a system sized and engineered for them.</p>
                  </div>

                  <div className="bento-card bento-card--sky">
                    <h3>Support that doesn't stop at install</h3>
                    <p>Maintenance, troubleshooting, and repairs — one call away whenever you need us.</p>
                    <button className="bento-inline-btn" onClick={() => scrollToSection("contact")}>
                      Talk to Us <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-content">
            <div>
              <span className="section-tag light-tag">Ready to Start?</span>
              <h2>Let's find the right solution for you.</h2>
              <p>Talk to the Elitex team about your solar, water, borehole, or agricultural project.</p>
            </div>
            <button className="white-btn" onClick={() => scrollToSection("contact")}>Request a Quote <ArrowRight size={19} /></button>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="section-tag">Contact Us</span>
              <h2>Let's power your next project.</h2>
              <p>Tell us what you are planning. Our team will help you find a practical solution for your energy, water, or agricultural needs.</p>
              <div className="contact-items">
                <a href="tel:+254705676684"><Phone size={20} /><span><strong>Call Us</strong>0705 676 684</span></a>
                <a href="mailto:elite.solar.agro@gmail.com"><Mail size={20} /><span><strong>Email Us</strong>elite.solar.agro@gmail.com</span></a>
                <div><MapPin size={20} /><span><strong>Visit Us</strong>Royal Courts, Nairobi, 00100, Kenya</span></div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="tel" name="phone" placeholder="Phone Number" required />
              </div>
              <input type="email" name="email" placeholder="Email Address" required />
              <select name="service" defaultValue="" required>
                <option value="" disabled>Select a Service</option>
                {services.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}
              </select>
              <textarea name="message" rows="5" placeholder="Tell us about your project..." required />
              <button className="primary-btn form-btn" type="submit">Send Inquiry on WhatsApp <MessageCircle size={19} /></button>
            </form>
          </div>
        </section>
      </main>

      <a
        className="whatsapp-button"
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Elitex Solar & Agro Innovations, I would like to make an inquiry.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Elitex on WhatsApp"
      >
        <MessageCircle size={25} />
      </a>

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            {/* Footer is dark green too, so it takes the white mark. */}
            <SafeImage
              sources={["/images/elitex-mark-white.png"]}
              alt="Elitex Solar and Agro Innovations"
              className="footer-logo"
            />
          </div>
          <p>© 2026 Elitex Solar & Agro Innovations Limited. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
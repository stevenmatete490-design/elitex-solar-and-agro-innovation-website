import { useEffect, useState } from "react";
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

// Cycles through a service's 2-3 photos with a crossfade + slow zoom while
// its slide is active, like a short looping video clip.
function ImageStream({ images, alt, active }) {
  const [frame, setFrame] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (!active || count <= 1) return undefined;
    const timer = setInterval(() => {
      setFrame((current) => (current + 1) % count);
    }, 3200);
    return () => clearInterval(timer);
  }, [active, count]);

  return (
    <div className="stream">
      {images.map((sources, i) => (
        <div
          key={i}
          className={i === frame ? "stream-frame is-active" : "stream-frame"}
          aria-hidden={i !== frame}
        >
          <SafeImage sources={sources} alt={`${alt} photo ${i + 1}`} className="stream-image" />
        </div>
      ))}
      {count > 1 && (
        <div className="stream-dots" aria-hidden="true">
          {images.map((_, i) => (
            <span key={i} className={i === frame ? "stream-dot is-active" : "stream-dot"} />
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceCarousel({ items, onAction }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = items.length;
  const autoplayMs = 5000;

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, autoplayMs);
    return () => clearInterval(timer);
  }, [paused, total]);

  const active = items[index];

  return (
    <div
      className={paused ? "showcase-shell is-paused" : "showcase-shell"}
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
              <span className="showcase-tab-head">
                <span className="showcase-tab-icon">{item.icon}</span>
                <strong>{item.title}</strong>
              </span>
              {isActive && <span className="showcase-tab-desc">{item.description}</span>}
              <span className="showcase-tab-track">
                {isActive && <span key={index} className="showcase-tab-fill" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="showcase-stage">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={i === index ? "showcase-frame is-active" : "showcase-frame"}
            aria-hidden={i !== index}
          >
            <ImageStream images={item.images} alt={item.title} active={i === index} />
          </div>
        ))}

        <div key={index} className="showcase-overlay">
          <span className="showcase-overlay-index">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <strong>{active.title}</strong>
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
            <SafeImage
              sources={["/images/elitex-logo-dark-cropped.jpg", "/images/elitex-logo-dark.jpg"]}
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
            {menuOpen ? <X /> : <Menu />}
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

          <div className="hero-photo-panel" aria-hidden="true">
            <div className="hero-photo-half">
              <SafeImage
                sources={["/images/showcase/solar-shade-hero.jpg"]}
                alt=""
                className="hero-photo-img"
              />
            </div>
            <div className="hero-photo-half">
              <SafeImage
                sources={["/images/showcase/water-pump-river.jpg"]}
                alt=""
                className="hero-photo-img"
              />
            </div>
          </div>

          <svg className="hero-curve" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,42 C 320,110 1120,-30 1440,42 L1440,100 L0,100 Z" fill="var(--paper)" />
          </svg>
        </section>

        <section id="about" className="section about-section">
          <div className="container about-grid">
            <div className="about-visual">
              <SafeImage
                sources={["/images/about-team.jpeg", "/images/about-team.jpg"]}
                alt="Elitex team working on a solar and agro project"
                className="about-media"
              />
              <div className="image-card">
                <Sun size={32} />
                <strong>ELITEX</strong>
                <span>Solar & Agro Innovations</span>
              </div>
            </div>

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
              <h2>Offering affordable services with accredited technicians.</h2>
              <p>From the first assessment to installation and after-sales support, our accredited technicians deliver quality work at prices that make sense for your budget. Explore each service alongside real projects from the field.</p>
            </div>
            <ServiceCarousel items={services} onAction={() => scrollToSection("contact")} />
          </div>
        </section>

        <section id="why-us" className="section why-section">
          <div className="container why-grid">
            <div>
              <span className="section-tag light-tag">Why Choose Elitex?</span>
              <h2>Good engineering should feel simple.</h2>
              <p>We bring technical judgment, practical experience, and dependable customer support to every project.</p>
            </div>
            <div className="why-cards">
              {[
                ["01", "Professional Expertise", "Properly designed and professionally implemented solutions."],
                ["02", "Tailored Solutions", "Every project is assessed individually before we recommend the right path forward."],
                ["03", "Reliable Support", "Quality service before, during, and after your project."],
              ].map(([number, title, text]) => (
                <div className="why-card" key={number}>
                  <strong>{number}</strong>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </div>
              ))}
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
            <SafeImage
              sources={["/images/elitex-logo-dark-cropped.jpg", "/images/elitex-logo-dark.jpg"]}
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
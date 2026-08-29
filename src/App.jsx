import { useState } from "react";
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
  Wrench,
  X,
  Zap,
} from "lucide-react";
import "./index.css";

const whatsappNumber = "254759341122";

const services = [
  {
    icon: <Sun size={28} />,
    title: "Solar Installation",
    description: "Professional solar system design and installation for homes, businesses, institutions, and farms.",
  },
  {
    icon: <Battery size={28} />,
    title: "Solar Backup Systems",
    description: "Reliable battery and backup solutions designed to keep your home or business powered when you need it most.",
  },
  {
    icon: <Droplets size={28} />,
    title: "Solar Water Pumping",
    description: "Efficient solar-powered water pumping systems for farms, livestock, homes, and agricultural projects.",
  },
  {
    icon: <Wrench size={28} />,
    title: "Borehole Drilling",
    description: "Professional borehole drilling solutions that help homes, businesses, and farms access reliable water.",
  },
  {
    icon: <Zap size={28} />,
    title: "Solar Maintenance",
    description: "Inspection, troubleshooting, maintenance, and repair services to keep your solar system performing efficiently.",
  },
  {
    icon: <Leaf size={28} />,
    title: "Agro Innovation",
    description: "Practical agricultural and energy innovations designed to support productivity and sustainable farming.",
  },
];

// These names match the files shown in your public/images folder.
// Each gallery item uses a different primary image, so no card repeats another card's image.
const galleryItems = [
  {
    sources: ["/images/solar-installation.jpeg", "/images/solar-installation.jpg"],
    category: "Solar Installation",
    title: "Professional Installation Services",
    description: "From planning to final installation, our team delivers dependable solar solutions while valuing customer feedback throughout the journey.",
  },
  {
    sources: ["/images/solar-products.jpeg", "/images/solar-products.jpg"],
    category: "Solar Products",
    title: "Solutions for Every Energy Need",
    description: "From portable solar lanterns and lighting to complete home, business, and backup systems, we help you choose the right solution.",
  },
  {
    sources: ["/images/water-pumps.jpeg", "/images/water-pumps.jpg"],
    category: "Solar Water Pumps",
    title: "Efficient Water Pumping Solutions",
    description: "Our solar surface pumps move water from rivers, dams, swamps, and other sources with reliable pressure while reducing long-term operating costs.",
  },
  {
    sources: ["/images/elitex-engineers.jpg", "/images/elitex-engineers.jpeg"],
    category: "Our Engineers",
    title: "A Skilled and Dedicated Team",
    description: "Our capable team combines practical experience and engineering expertise to deliver quality installations, system support, and dependable after-sales service.",
  },
  {
    sources: ["/images/project-result.jpeg", "/images/project-result.jpg"],
    category: "Results That Matter",
    title: "The Result of Dedicated Work",
    description: "Every completed project reflects our commitment to practical planning, quality workmanship, reliable performance, and sustainable customer solutions.",
  },
  {
    sources: ["/images/solar-pumping-project.jpeg", "/images/solar-pumping-project.jpg"],
    category: "Solar Pumping Project",
    title: "Powering Productive Agriculture",
    description: "Reliable solar pumping helps farms move water efficiently and build more productive, sustainable operations.",
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

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    ["home", "Home"],
    ["about", "About"],
    ["services", "Services"],
    ["gallery", "Our Work"],
    ["why-us", "Why Elitex"],
    ["contact", "Contact"],
  ];

  const scrollToSection = (sectionId) => {
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
      <header className="navbar">
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
              <button key={id} onClick={() => scrollToSection(id)}>{label}</button>
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
              <p>From the first assessment to installation and after-sales support, our accredited technicians deliver quality work at prices that make sense for your budget.</p>
            </div>
            <div className="services-grid">
              {services.map((service, index) => (
                <article className="service-card" key={service.title}>
                  <div className="service-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <button onClick={() => scrollToSection("contact")}>Learn More <ArrowRight size={17} /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="section gallery-section">
          <div className="container">
            <div className="section-heading gallery-heading">
              <span className="section-tag">Elitex in Action</span>
              <h2>Our work, products <em>and practical solutions.</em></h2>
              <p>Explore the installations, products, water solutions, engineering work, and projects behind the Elitex promise.</p>
            </div>
            <div className="gallery-shell">
              <div className="gallery-grid">
                {galleryItems.map((item, index) => (
                  <article className="gallery-card" key={item.title}>
                    <div className="gallery-image">
                      <SafeImage sources={item.sources} alt={item.title} />
                      <span className="gallery-index">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="gallery-content">
                      <span className="gallery-category">{item.category}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <button onClick={() => scrollToSection("contact")}>Talk to Us <ArrowRight size={17} /></button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
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
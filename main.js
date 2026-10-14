/**
 * HOTEL ADJEGOUNLE — main.js
 * Interactions : navbar, menu mobile, scroll reveal, galerie
 */

/* ============================================
   CONFIGURATION CENTRALE
   Modifier ce bloc pour personnaliser le site
   ============================================ */
const HOTEL_CONFIG = {
  name:       "Hôtel Adjégounlè",
  phone1:     "0193459393",
  phone2:     "0195534244",
  whatsapp:   "22601934593939",
  address:    null,                    // null = "Adresse à compléter"
  ifu:        "2201000108000",
  rccm:       "RB/ABY/25 A3514",
  socialLinks: {
    facebook:  null,                   // null = non affiché
    instagram: null,
    twitter:   null,
  },
  // Messages WhatsApp pré-remplis par contexte
  messages: {
    default:     "Bonjour Hôtel Adjégounlè, je souhaite avoir des informations.",
    reservation: "Bonjour Hôtel Adjégounlè, je souhaite avoir des informations concernant une réservation.",
    clim:        "Bonjour Hôtel Adjégounlè, je souhaite réserver une chambre climatisée.",
    vip:         "Bonjour Hôtel Adjégounlè, je souhaite réserver une chambre VIP.",
    ventilee:    "Bonjour Hôtel Adjégounlè, je souhaite réserver une chambre ventilée.",
    event:       "Bonjour Hôtel Adjégounlè, je souhaite avoir des informations concernant l'organisation d'un événement.",
    restaurant:  "Bonjour Hôtel Adjégounlè, je souhaite avoir des informations sur votre restauration.",
  }
};

/* ============================================
   UTILITIES
   ============================================ */
function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

function encodeWAMessage(msg) {
  return encodeURIComponent(msg);
}

function buildWALink(message) {
  return `https://wa.me/${HOTEL_CONFIG.whatsapp}?text=${encodeWAMessage(message)}`;
}

/* ============================================
   NAVBAR — Sticky + Scroll Opacity + Mobile
   ============================================ */
const navbar  = qs("#navbar");
const burgerBtn  = qs("#burger-btn");
const mobileMenu = qs("#mobile-menu");
const mobileLinks = qsa(".mobile-menu__link");

// Scroll behavior
let lastScrollY = 0;

function updateNavbar() {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle("scrolled", scrolled);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

// Burger menu toggle
function openMenu() {
  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  burgerBtn.setAttribute("aria-expanded", "true");
  burgerBtn.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  burgerBtn.setAttribute("aria-expanded", "false");
  burgerBtn.classList.remove("open");
  document.body.style.overflow = "";
}

burgerBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("open");
  isOpen ? closeMenu() : openMenu();
});

mobileLinks.forEach(link => {
  link.addEventListener("click", closeMenu);
});

// Close menu on backdrop click (outside)
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) closeMenu();
});

// Close on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
    closeMenu();
    burgerBtn.focus();
  }
});

/* ============================================
   SMOOTH SCROLL — active nav link highlight
   ============================================ */
const sections  = qsa("section[id]");
const navLinks  = qsa(".navbar__link");

function highlightNavLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute("id");
    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", highlightNavLink, { passive: true });

/* ============================================
   SCROLL REVEAL — Intersection Observer
   ============================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

qsa(".reveal").forEach(el => revealObserver.observe(el));

/* ============================================
   GALLERY FILTER
   ============================================ */
const filterBtns   = qsa(".gallery__filter");
const galleryItems = qsa(".gallery__item");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    // Update active state
    filterBtns.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    // Filter items
    galleryItems.forEach(item => {
      const category = item.dataset.category;
      const show = filter === "all" || category === filter;

      if (show) {
        item.classList.remove("hidden");
        item.style.animation = "fadeIn 0.4s ease forwards";
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

/* ============================================
   CONTACT FORM — Submit handler
   ============================================ */
const contactForm = qs("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = qs("#contact-name", contactForm).value.trim();
    const phone   = qs("#contact-phone", contactForm).value.trim();
    const subject = qs("#contact-subject", contactForm).value;
    const message = qs("#contact-message", contactForm).value.trim();

    // Basic validation
    if (!name || !subject || !message) {
      showFormFeedback("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    // Build WhatsApp message from form
    let subjectLabel = subject;
    const subjectLabels = {
      reservation: "une réservation de chambre",
      evenement:   "l'organisation d'un événement",
      restaurant:  "la restauration / traiteur",
      formation:   "la formation hôtelière",
      autre:       "une demande"
    };

    const waMessage = `Bonjour Hôtel Adjégounlè,\n\nJe m'appelle ${name}${phone ? " (tél. " + phone + ")" : ""} et je souhaite avoir des informations concernant ${subjectLabels[subject] || subject}.\n\n${message}`;
    const waLink = buildWALink(waMessage);

    // Open WhatsApp
    window.open(waLink, "_blank", "noopener,noreferrer");
    showFormFeedback("Votre message a été ouvert dans WhatsApp. Merci !", "success");
    contactForm.reset();
  });
}

function showFormFeedback(text, type) {
  const existing = qs(".form-feedback");
  if (existing) existing.remove();

  const el = document.createElement("p");
  el.className = `form-feedback form-feedback--${type}`;
  el.textContent = text;
  el.setAttribute("role", "alert");

  Object.assign(el.style, {
    marginTop:    "1rem",
    padding:      "0.75rem 1rem",
    borderRadius: "6px",
    fontSize:     "0.85rem",
    fontWeight:   "500",
    background:   type === "success" ? "#E8F5F2" : "#FDEBEE",
    color:        type === "success" ? "#0F6B5B" : "#A71930",
    border:       `1.5px solid ${type === "success" ? "#0F6B5B" : "#A71930"}`,
  });

  contactForm.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

/* ============================================
   HERO SCROLL INDICATOR — hide on scroll
   ============================================ */
const scrollIndicator = qs(".hero__scroll-indicator");

if (scrollIndicator) {
  window.addEventListener("scroll", () => {
    const hide = window.scrollY > 80;
    scrollIndicator.style.opacity = hide ? "0" : "1";
    scrollIndicator.style.transition = "opacity 0.3s ease";
  }, { passive: true });
}

/* ============================================
   MOBILE BAR — show / hide intelligently
   ============================================ */
const mobileBar = qs("#mobile-bar");

if (mobileBar) {
  let prevScroll = window.scrollY;
  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    if (current < 200) {
      mobileBar.style.transform = "translateY(0)";
    } else if (current > prevScroll) {
      // Scrolling down — hide bar
      mobileBar.style.transform = "translateY(100%)";
    } else {
      // Scrolling up — show bar
      mobileBar.style.transform = "translateY(0)";
    }
    prevScroll = current;
    mobileBar.style.transition = "transform 0.3s ease";
  }, { passive: true });
}

/* ============================================
   ACTIVE NAVBAR LINK STYLE
   ============================================ */
const navbarLinkStyle = document.createElement("style");
navbarLinkStyle.textContent = `
  .navbar__link.active {
    color: var(--clr-charcoal);
  }
  .navbar:not(.scrolled) .navbar__link.active {
    color: white;
  }
  .navbar__link.active::after {
    transform: scaleX(1);
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(navbarLinkStyle);

/* ============================================
   PARALLAX SUBTLE on hero image
   ============================================ */
const heroImg = qs(".hero__img");

if (heroImg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}

/* ============================================
   INITIALIZATION LOG
   ============================================ */
console.info(
  `%c${HOTEL_CONFIG.name}%c — Site vitrine initialisé avec succès.`,
  "color:#A71930;font-weight:bold;font-size:14px;",
  "color:#6B6B6B;font-size:12px;"
);

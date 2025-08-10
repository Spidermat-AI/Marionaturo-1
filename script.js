/* ================================
   Menu mobile
================================== */
function toggleMenu() {
  const nav = document.querySelector(".nav-links");
  nav.classList.toggle("show");
}

/* Fermer le menu au clic sur un lien (mobile) */
document.addEventListener("click", (e) => {
  if (e.target.matches(".nav-links a")) {
    document.querySelector(".nav-links")?.classList.remove("show");
  }
});

/* ================================
   Défilement fluide + surlignage du lien actif
================================== */
const links = document.querySelectorAll('a[href^="#"]');
links.forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.scrollY - 64; // compense le header
    window.scrollTo({ top: y, behavior: "smooth" });
    history.pushState(null, "", id);
  });
});

/* Observer pour mettre en surbrillance la section en cours */
const sections = document.querySelectorAll("section[id]");
const observerActive = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-links a").forEach(l => l.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
);
sections.forEach((s) => observerActive.observe(s));

/* ================================
   Effet reveal à l’apparition
================================== */
const revealEls = document.querySelectorAll(".card, .about-content, form, .section h2");
revealEls.forEach((el) => el.classList.add("reveal"));

const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => revealObs.observe(el));

/* ================================
   Parallax doux sur le hero (fallback mobile: off)
================================== */
(function(){
  const hero = document.querySelector(".hero");
  if (!hero) return;

  let ticking = false;
  function onScroll(){
    if (ticking) return;
    window.requestAnimationFrame(() => {
      // Décale légèrement le background en fonction du scroll
      const offset = window.scrollY * 0.35;
      hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
      ticking = false;
    });
    ticking = true;
  }

  // Evite sur mobile (performance)
  const isMobile = matchMedia("(max-width: 820px)").matches;
  if (!isMobile) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();

/* ================================
   Formulaire (feedback local)
================================== */
const form = document.querySelector("form");
if (form) {
  const success = document.createElement("div");
  success.className = "form-success";
  success.textContent = "Merci, votre message a bien été pris en compte.";
  form.appendChild(success);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Ici, tu pourrais envoyer vers un service (Formspree, Netlify Forms, etc.)
    form.reset();
    success.style.display = "block";
    setTimeout(() => (success.style.display = "none"), 4500);
  });
}

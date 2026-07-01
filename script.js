/*
  CONFIGURAÇÃO CENTRAL DO PROJETO
  Altere textos, links, serviços e imagens neste objeto.
*/
const CONFIG = {
  professionalName: "Elis Oliveira",
  brandSuffix: "Integrativa",
  heroTicker: ["Terapia", "Desenvolvimento", "Mentoria"],
  professionalRole: "Terapeuta • Mentora • CRTH-BR 9743",
  intro: "Um espaço de acolhimento, consciência e transformação para mulheres que desejam viver com mais clareza, autonomia e propósito.",
  images: {
    hero: "assets/images/elis-hero.webp"
  },
  media: {
    treeVideoDesktop: "assets/video/tree-scroll.mp4",
    treeVideoMobile: "assets/video/tree-scroll-mobile.mp4",
    treePoster: "assets/video/tree-scroll-poster.webp",
    treePosterMobile: "assets/video/tree-scroll-poster-mobile.webp"
  },
  links: {
    social: {
      instagram: "https://instagram.com/elisoliveiraintegrativa"
    }
  },
  // Número de WhatsApp da Elisangela (apenas dígitos, com DDI+DDD).
  whatsapp: {
    number: "553484060611",
    messageFor(title) {
      return `Olá, Elis! Gostaria de saber mais sobre ${title}.`;
    }
  },
  services: [
    {
      title: "Terapia e desenvolvimento de mulheres",
      description: "Um espaço de escuta, fortalecimento e reconexão com a própria história, escolhas e potência feminina.",
      image: "assets/images/elis-mulheres.webp",
      cta: "Quero fazer parte"
    },
    {
      title: "Terapia e desenvolvimento pessoal",
      description: "Processos individuais para ampliar consciência, autonomia emocional e direção de vida.",
      image: "assets/images/elis-desenvolvimento.webp",
      cta: "Quero começar essa jornada"
    },
    {
      title: "Mentoria profissional",
      description: "Clareza, posicionamento e desenvolvimento para mulheres que desejam avançar em sua trajetória profissional.",
      image: "assets/images/elis-mentoria.webp",
      cta: "Quero essa mentoria"
    },
    {
      title: "CMR — Círculo de Mulheres Raízes",
      description: "Encontros de conexão, pertencimento e desenvolvimento em uma experiência coletiva entre mulheres.",
      image: "assets/images/elis-constelacao.webp",
      cta: "Quero participar do círculo"
    },
    {
      title: "Hipnoterapia e terapias integrativas",
      description: "Abordagens complementares conduzidas com acolhimento, presença e atenção à singularidade de cada processo.",
      image: "assets/images/elis-terapias.webp",
      cta: "Quero conhecer essa terapia"
    },
    {
      title: "Constelação familiar",
      description: "Um olhar sistêmico para padrões, vínculos e movimentos que atravessam a história familiar.",
      image: "assets/images/elis-cmr.webp",
      cta: "Quero minha constelação"
    }
  ]
};

const CTA_ARROW_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function buildWhatsAppLink(title) {
  const message = encodeURIComponent(CONFIG.whatsapp.messageFor(title));
  return `https://wa.me/${CONFIG.whatsapp.number}?text=${message}`;
}

function applyConfig() {
  document.title = `${CONFIG.professionalName} ${CONFIG.brandSuffix}`;

  const heroImage = document.querySelector("#hero-image");
  if (heroImage) heroImage.src = CONFIG.images.hero;

  const treeVideo = document.querySelector("#tree-scroll-video");
  if (treeVideo) treeVideo.poster = CONFIG.media.treePoster;

  renderHeroTicker();

  const textMap = {
    "first-name": CONFIG.professionalName,
    "brand-suffix": CONFIG.brandSuffix,
    "professional-role": CONFIG.professionalRole,
    intro: CONFIG.intro
  };

  Object.entries(textMap).forEach(([key, value]) => {
    const element = document.querySelector(`[data-role="${key}"]`);
    if (element) element.textContent = value;
  });

  Object.entries(CONFIG.links.social).forEach(([key, value]) => {
    const element = document.querySelector(`[data-social="${key}"]`);
    if (element) element.href = value;
  });

  renderServices();
}

function renderHeroTicker() {
  const tickerTrack = document.querySelector('[data-role="hero-ticker-track"]');
  if (!tickerTrack) return;

  const items = (CONFIG.heroTicker && CONFIG.heroTicker.length
    ? CONFIG.heroTicker
    : ["Terapia", "Desenvolvimento", "Mentoria"]);

  tickerTrack.innerHTML = items
    .map(item => `<span class="hero__ticker-item">${item}</span>`)
    .join('<span class="hero__ticker-separator" aria-hidden="true">•</span>');
}

function renderServices() {
  const grid = document.querySelector("#services-grid");
  if (!grid) return;

  grid.innerHTML = CONFIG.services.map((service, index) => `
    <article class="service-card ${index % 2 === 1 ? "service-card--reverse" : ""} reveal">
      <div class="service-card__media">
        <img
          src="${service.image}"
          alt="${service.title} com Elis Oliveira"
          width="1023"
          height="1537"
          loading="lazy"
          decoding="async"
        >
      </div>
      <div class="service-card__content">
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <a
          class="service-card__cta"
          href="${buildWhatsAppLink(service.title)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com Elis no WhatsApp sobre ${service.title}"
        >
          ${service.cta}
          ${CTA_ARROW_ICON}
        </a>
      </div>
    </article>
  `).join("");
}

function initScrollScrubVideo() {
  const section = document.querySelector("[data-scroll-video-section]");
  const video = document.querySelector("#tree-scroll-video");
  if (!section || !video) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const mobileQuery = window.matchMedia("(max-width: 700px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SOURCE_FPS = 24;
  const FRAME_STEP = 1 / SOURCE_FPS;

  let duration = 0;
  let latestProgress = 0;
  let targetTime = 0;
  let seekFrame = 0;
  let sourceIsMobile = mobileQuery.matches;
  let scrollTriggerInstance = null;
  let fallbackFrame = 0;

  video.muted = true;
  video.playsInline = true;
  video.disablePictureInPicture = true;
  video.preload = "auto";

  const sourceForViewport = () => (
    mobileQuery.matches ? CONFIG.media.treeVideoMobile : CONFIG.media.treeVideoDesktop
  );

  const posterForViewport = () => (
    mobileQuery.matches && CONFIG.media.treePosterMobile
      ? CONFIG.media.treePosterMobile
      : CONFIG.media.treePoster
  );

  const quantizeTime = progress => {
    const safeEnd = Math.max(duration - FRAME_STEP, 0.01);
    const rawTime = clamp(progress, 0, 1) * safeEnd;
    return clamp(Math.round(rawTime / FRAME_STEP) * FRAME_STEP, 0.01, safeEnd);
  };

  const applyLatestFrame = () => {
    seekFrame = 0;
    if (!duration || video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    const nextTime = quantizeTime(latestProgress);
    targetTime = nextTime;

    // Nunca cria uma fila de seeks. Enquanto um quadro está sendo entregue,
    // apenas guardamos o destino mais recente do scroll.
    if (video.seeking) return;
    if (Math.abs(video.currentTime - nextTime) < FRAME_STEP * 0.45) return;

    try {
      video.currentTime = nextTime;
    } catch (_) {
      // Alguns navegadores ignoram seeks antes de liberar o primeiro quadro.
    }
  };

  const requestFrame = progress => {
    latestProgress = clamp(progress, 0, 1);
    if (!seekFrame) seekFrame = window.requestAnimationFrame(applyLatestFrame);
  };

  const currentNativeProgress = () => {
    const rect = section.getBoundingClientRect();
    const range = Math.max(section.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / range, 0, 1);
  };

  const createNativeFallback = () => {
    const update = () => {
      fallbackFrame = 0;
      requestFrame(currentNativeProgress());
    };
    const requestUpdate = () => {
      if (!fallbackFrame) fallbackFrame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    update();
  };

  const createScrollTrigger = () => {
    if (!window.gsap || !window.ScrollTrigger) {
      createNativeFallback();
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });

    scrollTriggerInstance?.kill();
    scrollTriggerInstance = window.ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      fastScrollEnd: false,
      onUpdate: self => requestFrame(self.progress),
      onRefresh: self => requestFrame(self.progress)
    });
  };

  const unlockMobileDecoder = () => {
    if (!mobileQuery.matches || reduceMotion) return;
    const attempt = video.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(() => {
        video.pause();
        requestFrame(latestProgress);
      }).catch(() => {});
    }
  };

  const loadResponsiveSource = (preserveProgress = false) => {
    const retainedProgress = preserveProgress
      ? latestProgress
      : currentNativeProgress();

    latestProgress = retainedProgress;
    targetTime = 0;
    duration = 0;
    section.classList.remove("is-video-ready");

    video.pause();
    video.poster = posterForViewport();
    video.src = sourceForViewport();
    video.load();
  };

  video.addEventListener("loadedmetadata", () => {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!duration) return;

    section.classList.add("is-video-ready");

    if (reduceMotion) {
      latestProgress = 0.42;
      requestFrame(latestProgress);
      return;
    }

    requestFrame(latestProgress || currentNativeProgress());
    unlockMobileDecoder();
    createScrollTrigger();
    window.ScrollTrigger?.refresh();
  });

  video.addEventListener("loadeddata", () => {
    section.classList.add("is-video-ready");
  });

  video.addEventListener("seeked", () => {
    // Se o usuário continuou rolando durante o seek, salta diretamente
    // para o quadro mais recente, sem processar os intermediários antigos.
    const newestTime = quantizeTime(latestProgress);
    if (Math.abs(newestTime - video.currentTime) >= FRAME_STEP * 0.5) {
      requestFrame(latestProgress);
    }
  });

  mobileQuery.addEventListener?.("change", () => {
    if (sourceIsMobile === mobileQuery.matches) return;
    sourceIsMobile = mobileQuery.matches;
    loadResponsiveSource(true);
  });

  window.addEventListener("orientationchange", () => {
    window.setTimeout(() => window.ScrollTrigger?.refresh(), 160);
  }, { passive: true });

  loadResponsiveSource(false);
}

function initRevealAnimation() {
  const items = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -24px"
  });

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
    observer.observe(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initRevealAnimation();
  initScrollScrubVideo();
});

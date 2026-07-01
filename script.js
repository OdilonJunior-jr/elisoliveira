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
    treePoster: "assets/video/tree-scroll-poster.webp"
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
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileQuery = window.matchMedia("(max-width: 700px)");
  const VIDEO_FPS = 24;
  const FRAME_STEP = 1 / VIDEO_FPS;

  let activeTrigger = null;
  let fallbackCleanup = null;
  let metadataHandler = null;
  let seekedHandler = null;
  let animationFrame = 0;
  let duration = 0;
  let targetTime = 0;
  let displayedTime = 0;
  let lastSeekAt = 0;
  let sourceIsMobile = mobileQuery.matches;

  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.disablePictureInPicture = true;

  const sourceForViewport = () => (
    mobileQuery.matches ? CONFIG.media.treeVideoMobile : CONFIG.media.treeVideoDesktop
  );

  const stopAnimationLoop = () => {
    if (!animationFrame) return;
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const destroyScrollControl = () => {
    stopAnimationLoop();
    activeTrigger?.kill();
    activeTrigger = null;
    fallbackCleanup?.();
    fallbackCleanup = null;

    if (metadataHandler) video.removeEventListener("loadedmetadata", metadataHandler);
    if (seekedHandler) video.removeEventListener("seeked", seekedHandler);
    metadataHandler = null;
    seekedHandler = null;
  };

  const commitFrame = now => {
    animationFrame = 0;
    if (!duration || video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    const safeEnd = Math.max(duration - FRAME_STEP, FRAME_STEP);
    const smoothing = mobileQuery.matches ? 0.16 : 0.20;
    const differenceToTarget = targetTime - displayedTime;

    displayedTime += differenceToTarget * smoothing;
    if (Math.abs(differenceToTarget) < FRAME_STEP * 0.35) {
      displayedTime = targetTime;
    }

    // Trabalha em passos reais de quadro. Isso evita dezenas de seeks
    // praticamente iguais, que eram a principal causa dos engasgos.
    const quantizedTime = clamp(
      Math.round(displayedTime / FRAME_STEP) * FRAME_STEP,
      FRAME_STEP,
      safeEnd
    );

    const minimumSeekInterval = mobileQuery.matches ? 52 : 38;
    const canSeek = !video.seeking && (now - lastSeekAt) >= minimumSeekInterval;

    if (canSeek && Math.abs(video.currentTime - quantizedTime) >= FRAME_STEP * 0.72) {
      try {
        lastSeekAt = now;
        video.currentTime = quantizedTime;
      } catch (_) {
        // Alguns navegadores recusam um seek enquanto o decoder inicializa.
      }
    }

    const stillSmoothing = Math.abs(targetTime - displayedTime) > FRAME_STEP * 0.28;
    const waitingForFrame = video.seeking || Math.abs(video.currentTime - quantizedTime) > FRAME_STEP;

    if (stillSmoothing || waitingForFrame) {
      animationFrame = window.requestAnimationFrame(commitFrame);
    }
  };

  const requestSmoothFrame = time => {
    if (!duration) return;
    targetTime = clamp(time, FRAME_STEP, Math.max(duration - FRAME_STEP, FRAME_STEP));
    if (!animationFrame) animationFrame = window.requestAnimationFrame(commitFrame);
  };

  const nativeFallback = safeDuration => {
    let scrollFrame = 0;

    const update = () => {
      scrollFrame = 0;
      const rect = section.getBoundingClientRect();
      const range = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / range, 0, 1);
      requestSmoothFrame(progress * safeDuration);
    };

    const requestUpdate = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    update();

    fallbackCleanup = () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
  };

  const createGsapControl = safeDuration => {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });

    activeTrigger = window.ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      anticipatePin: 1,
      fastScrollEnd: false,
      onUpdate: self => requestSmoothFrame(self.progress * safeDuration),
      onRefresh: self => {
        displayedTime = self.progress * safeDuration;
        requestSmoothFrame(displayedTime);
      }
    });

    window.requestAnimationFrame(() => window.ScrollTrigger.refresh());
  };

  const prepareVideo = () => {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!duration) return;

    const safeDuration = Math.max(duration - FRAME_STEP, FRAME_STEP);
    video.pause();
    section.classList.add("is-video-ready");

    displayedTime = FRAME_STEP;
    targetTime = FRAME_STEP;
    lastSeekAt = 0;

    seekedHandler = () => {
      if (Math.abs(video.currentTime - targetTime) > FRAME_STEP) {
        if (!animationFrame) animationFrame = window.requestAnimationFrame(commitFrame);
      }
    };
    video.addEventListener("seeked", seekedHandler);

    if (reduceMotion) {
      displayedTime = safeDuration * 0.42;
      requestSmoothFrame(displayedTime);
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      createGsapControl(safeDuration);
    } else {
      nativeFallback(safeDuration);
    }

    // Inicializa o decoder em celulares sem iniciar reprodução visível.
    if (mobileQuery.matches) {
      const unlock = video.play();
      if (unlock && typeof unlock.then === "function") {
        unlock.then(() => {
          video.pause();
          requestSmoothFrame(targetTime);
        }).catch(() => {});
      }
    }
  };

  const loadResponsiveSource = () => {
    destroyScrollControl();
    section.classList.remove("is-video-ready");
    duration = 0;
    targetTime = 0;
    displayedTime = 0;
    lastSeekAt = 0;

    video.pause();
    video.removeAttribute("src");
    video.load();

    metadataHandler = prepareVideo;
    video.addEventListener("loadedmetadata", metadataHandler, { once: true });
    video.addEventListener("loadeddata", () => section.classList.add("is-video-ready"), { once: true });

    video.src = sourceForViewport();
    video.load();
  };

  mobileQuery.addEventListener?.("change", () => {
    if (sourceIsMobile === mobileQuery.matches) return;
    sourceIsMobile = mobileQuery.matches;
    loadResponsiveSource();
  });

  window.addEventListener("load", () => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }, { once: true });

  loadResponsiveSource();
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

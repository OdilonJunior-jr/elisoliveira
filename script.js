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

  let activeTween = null;
  let activeTrigger = null;
  let metadataHandler = null;
  let seekedHandler = null;
  let frameRequest = 0;
  let requestedTime = 0;
  let sourceIsMobile = mobileQuery.matches;

  const sourceForViewport = () => (
    mobileQuery.matches ? CONFIG.media.treeVideoMobile : CONFIG.media.treeVideoDesktop
  );

  const cancelFrame = () => {
    if (!frameRequest) return;
    window.cancelAnimationFrame(frameRequest);
    frameRequest = 0;
  };

  const destroyScrollControl = () => {
    cancelFrame();
    activeTween?.kill();
    activeTrigger?.kill();
    activeTween = null;
    activeTrigger = null;

    if (metadataHandler) video.removeEventListener("loadedmetadata", metadataHandler);
    if (seekedHandler) video.removeEventListener("seeked", seekedHandler);
    metadataHandler = null;
    seekedHandler = null;
  };

  const commitRequestedFrame = () => {
    frameRequest = 0;
    if (video.readyState < HTMLMediaElement.HAVE_METADATA || !Number.isFinite(video.duration)) return;
    if (video.seeking) return;

    const safeEnd = Math.max(video.duration - 0.04, 0.01);
    const nextTime = clamp(requestedTime, 0.01, safeEnd);
    const difference = Math.abs(video.currentTime - nextTime);
    if (difference < 0.018) return;

    try {
      // Para deslocamentos grandes, fastSeek reduz o custo de decodificação.
      // O vídeo foi exportado com keyframes a cada 0,25 s para manter precisão.
      if (typeof video.fastSeek === "function" && difference > 0.55) {
        video.fastSeek(nextTime);
      } else {
        video.currentTime = nextTime;
      }
    } catch (_) {
      // O navegador pode recusar uma busca enquanto prepara o decoder.
    }
  };

  const requestFrameCommit = time => {
    requestedTime = time;
    if (!frameRequest) frameRequest = window.requestAnimationFrame(commitRequestedFrame);
  };

  const nativeFallback = duration => {
    let scrollFrame = 0;

    const update = () => {
      scrollFrame = 0;
      const rect = section.getBoundingClientRect();
      const range = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / range, 0, 1);
      requestFrameCommit(progress * Math.max(duration - 0.04, 0.01));
    };

    const requestUpdate = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    update();

    activeTrigger = {
      kill() {
        window.removeEventListener("scroll", requestUpdate);
        window.removeEventListener("resize", requestUpdate);
        if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      }
    };
  };

  const createGsapControl = duration => {
    const safeDuration = Math.max(duration - 0.04, 0.01);
    const playhead = { time: 0.01 };

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });

    activeTween = window.gsap.to(playhead, {
      time: safeDuration,
      ease: "none",
      paused: true,
      onUpdate: () => requestFrameCommit(playhead.time)
    });

    activeTrigger = window.ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      animation: activeTween,
      scrub: 0.38,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onRefresh: self => {
        playhead.time = self.progress * safeDuration;
        requestFrameCommit(playhead.time);
      }
    });

    window.requestAnimationFrame(() => window.ScrollTrigger.refresh());
  };

  const prepareVideo = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!duration) return;

    video.pause();
    section.classList.add("is-video-ready");

    seekedHandler = () => {
      if (Math.abs(video.currentTime - requestedTime) > 0.025) {
        requestFrameCommit(requestedTime);
      }
    };
    video.addEventListener("seeked", seekedHandler);

    if (reduceMotion) {
      requestFrameCommit(duration * 0.42);
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      createGsapControl(duration);
    } else {
      nativeFallback(duration);
    }

    // Inicializa o decoder móvel sem deixar o vídeo tocar sozinho.
    if (mobileQuery.matches) {
      const unlock = video.play();
      if (unlock && typeof unlock.then === "function") {
        unlock.then(() => {
          video.pause();
          requestFrameCommit(requestedTime);
        }).catch(() => {});
      }
    }
  };

  const loadResponsiveSource = () => {
    destroyScrollControl();
    section.classList.remove("is-video-ready");
    requestedTime = 0;

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

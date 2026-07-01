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
    contact: "https://instagram.com/elisoliveiraintegrativa",
    social: {
      instagram: "https://instagram.com/elisoliveiraintegrativa"
    }
  },
  services: [
    {
      title: "Terapia e desenvolvimento de mulheres",
      description: "Um espaço de escuta, fortalecimento e reconexão com a própria história, escolhas e potência.",
      image: "assets/images/elis-mulheres.webp",
      accent: "terracotta",
      link: "https://instagram.com/elisoliveiraintegrativa"
    },
    {
      title: "Terapia e desenvolvimento pessoal",
      description: "Processos individuais para ampliar consciência, autonomia emocional e direção de vida.",
      image: "assets/images/elis-desenvolvimento.webp",
      accent: "moss",
      link: "https://instagram.com/elisoliveiraintegrativa"
    },
    {
      title: "Mentoria profissional",
      description: "Clareza, posicionamento e desenvolvimento para mulheres que desejam avançar em sua trajetória profissional.",
      image: "assets/images/elis-mentoria.webp",
      accent: "terracotta",
      link: "https://instagram.com/elisoliveiraintegrativa"
    },
    {
      title: "CMR — Círculo de Mulheres Raízes",
      description: "Encontros de conexão, pertencimento e desenvolvimento em uma experiência coletiva entre mulheres.",
      image: "assets/images/elis-cmr.webp",
      accent: "moss",
      link: "https://instagram.com/elisoliveiraintegrativa"
    },
    {
      title: "Hipnoterapia e terapias integrativas",
      description: "Abordagens complementares conduzidas com acolhimento, presença e atenção à singularidade de cada processo.",
      image: "assets/images/elis-terapias.webp",
      accent: "terracotta",
      link: "https://instagram.com/elisoliveiraintegrativa"
    },
    {
      title: "Constelação familiar",
      description: "Um olhar sistêmico para padrões, vínculos e movimentos que atravessam a história familiar.",
      image: "assets/images/elis-constelacao.webp",
      accent: "moss",
      link: "https://instagram.com/elisoliveiraintegrativa"
    }
  ]
};

function applyConfig() {
  document.title = `${CONFIG.professionalName} ${CONFIG.brandSuffix}`;

  const heroImage = document.querySelector("#hero-image");
  if (heroImage) heroImage.src = CONFIG.images.hero;

  const treeVideo = document.querySelector("#tree-scroll-video");
  if (treeVideo) {
    treeVideo.poster = CONFIG.media.treePoster;
  }

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

  document.querySelectorAll('[data-link="contact"]').forEach(element => {
    element.href = CONFIG.links.contact;
  });

  Object.entries(CONFIG.links.social).forEach(([key, value]) => {
    const element = document.querySelector(`[data-social="${key}"]`);
    if (element) element.href = value;
  });

  renderServices();

  document.querySelectorAll(".service-card__kicker").forEach(element => element.remove());
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

  grid.innerHTML = CONFIG.services.map(service => `
    <a
      class="service-card reveal"
      href="${service.link}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conhecer ${service.title}"
    >
      <div class="service-card__content">
        <h3>${service.title}</h3>
        <p>${service.description}</p>
      </div>
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
    </a>
  `).join("");
}

function initScrollScrubVideo() {
  const section = document.querySelector("[data-scroll-video-section]");
  const video = document.querySelector("#tree-scroll-video");
  if (!section || !video) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileQuery = window.matchMedia("(max-width: 700px)");
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  let duration = 0;
  let targetProgress = 0;
  let renderedProgress = 0;
  let frameRequest = 0;
  let lastMobileState = mobileQuery.matches;

  const sourceForViewport = () => (
    mobileQuery.matches ? CONFIG.media.treeVideoMobile : CONFIG.media.treeVideoDesktop
  );

  const measureProgress = () => {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollRange = Math.max(section.offsetHeight - viewportHeight, 1);
    targetProgress = clamp(-rect.top / scrollRange, 0, 1);
  };

  const renderFrame = () => {
    frameRequest = 0;
    if (!duration || video.readyState < 1) return;

    renderedProgress += (targetProgress - renderedProgress) * 0.20;
    if (Math.abs(targetProgress - renderedProgress) < 0.0007) {
      renderedProgress = targetProgress;
    }

    const nextTime = clamp(renderedProgress * Math.max(duration - 0.06, 0.01), 0.01, Math.max(duration - 0.06, 0.01));

    // Evita enfileirar buscas enquanto o navegador ainda decodifica o quadro anterior.
    if (!video.seeking && Math.abs(video.currentTime - nextTime) >= 0.035) {
      try {
        video.currentTime = nextTime;
      } catch (_) {
        // Navegadores podem ignorar uma busca antes de os metadados estarem prontos.
      }
    }

    if (Math.abs(targetProgress - renderedProgress) > 0.0007 || video.seeking) {
      frameRequest = window.requestAnimationFrame(renderFrame);
    }
  };

  const requestRender = () => {
    measureProgress();
    if (!frameRequest) frameRequest = window.requestAnimationFrame(renderFrame);
  };

  const unlockMobileDecoder = () => {
    if (!mobileQuery.matches || reduceMotion) return;
    const attempt = video.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(() => {
        video.pause();
        requestRender();
      }).catch(() => requestRender());
    }
  };

  const prepareLoadedVideo = () => {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    section.classList.add("is-video-ready");
    measureProgress();

    if (reduceMotion) {
      try { video.currentTime = Math.min(duration * 0.42, Math.max(duration - 0.06, 0.01)); } catch (_) {}
      return;
    }

    try { video.currentTime = Math.max(targetProgress * duration, 0.01); } catch (_) {}
    unlockMobileDecoder();
    requestRender();
  };

  const loadSource = (preserveProgress = false) => {
    if (preserveProgress && duration) {
      renderedProgress = clamp(video.currentTime / duration, 0, 1);
      targetProgress = renderedProgress;
    }

    section.classList.remove("is-video-ready");
    duration = 0;
    video.src = sourceForViewport();
    video.load();
  };

  video.addEventListener("loadedmetadata", prepareLoadedVideo);
  video.addEventListener("seeked", requestRender);
  video.addEventListener("canplay", () => section.classList.add("is-video-ready"));

  if (!reduceMotion) {
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender, { passive: true });

    mobileQuery.addEventListener?.("change", () => {
      if (lastMobileState === mobileQuery.matches) return;
      lastMobileState = mobileQuery.matches;
      loadSource(true);
    });
  }

  loadSource(false);
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

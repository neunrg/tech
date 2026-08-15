(function () {
  // ─── PARTICLE CANVAS ───
  const canvas = document.getElementById("particle-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let W,
      H,
      particles = [],
      mouse = { x: null, y: null };

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7 ? "0,240,255" : "57,255,136";
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (mouse.x) {
          const dx = mouse.x - this.x,
            dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.x -= dx * 0.015;
            this.y -= dy * 0.015;
          }
        }
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H)
          this.reset();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(0,240,255,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(loop);
    }
    loop();
  }

  // ─── MOBILE MENU ───
  window.toggleMenu = function toggleMenu() {
    const links = document.querySelector(".nav-links");
    if (!links) return;
    const open = links.style.display === "flex";
    links.style.display = open ? "none" : "flex";
    links.style.flexDirection = "column";
    links.style.position = "fixed";
    links.style.top = "72px";
    links.style.left = "0";
    links.style.right = "0";
    links.style.background = "rgba(5,10,18,0.98)";
    links.style.padding = "24px";
    links.style.gap = "24px";
    links.style.zIndex = "99";
    links.style.borderBottom = "1px solid var(--border)";
  };

  // ─── SCROLL REVEAL ───
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // ─── DYNAMIC YEAR ───
  document.querySelectorAll(".js-current-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // ─── WHATSAPP CTAs ───
  document.querySelectorAll(".js-wa-cta").forEach((element) => {
    applyWhatsAppLink(element, {
      kind: element.dataset.waKind || "default",
      ariaLabel:
        element.getAttribute("aria-label") || "Chat on WhatsApp",
    });
  });

  document.querySelectorAll(".js-service-cta").forEach((element) => {
    applyWhatsAppLink(element, {
      kind: "service",
      name: element.dataset.serviceName,
      ariaLabel: `Chat on WhatsApp about ${element.dataset.serviceName}`,
    });
  });

  // ─── CONTACT FORM ───
  const submitBtn = document.querySelector(".js-form-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const name = document.getElementById("contact-name")?.value.trim();
      const email = document.getElementById("contact-email")?.value.trim();
      const service = document.getElementById("contact-service")?.value;
      const details = document
        .getElementById("contact-details")
        ?.value.trim();

      submitBtn.textContent = "Opening WhatsApp...";
      submitBtn.style.opacity = "0.7";

      const link = generateWhatsAppLink({
        kind: "form",
        name,
        email,
        service,
        details,
      });
      window.open(link, "_blank", "noopener,noreferrer");

      setTimeout(() => {
        submitBtn.textContent = "Send on WhatsApp \u2192";
        submitBtn.style.opacity = "1";
      }, 1200);
    });
  }
})();
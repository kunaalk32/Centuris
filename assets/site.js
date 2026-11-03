(() => {
  gsap.registerPlugin(ScrollTrigger);
  const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const lenis = motionOk ? new Lenis({ anchors: true }) : null;
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Header turns solid once the next panel reaches it, or while the menu is open
  const header = document.querySelector("[data-header]");
  const hero = document.querySelector("[data-hero]");
  let onHero = !!hero;
  let menuOpen = false;
  const syncHeader = () => header?.classList.toggle("is-solid", !onHero || menuOpen);
  syncHeader();
  if (hero) {
    // An observer also catches jumps that skip past the hero, like loading at an anchor
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;width:1px;height:calc(100svh - 64px);pointer-events:none";
    document.body.prepend(sentinel);
    new IntersectionObserver(([entry]) => {
      onHero = entry.isIntersecting;
      syncHeader();
    }).observe(sentinel);
  }

  // Mobile menu
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (toggle && menu) {
    const items = menu.querySelectorAll(".menu-item");
    const step = Math.min(60, 400 / Math.max(items.length, 1));
    items.forEach((item, i) => (item.style.transitionDelay = `${i * step}ms`));

    const setOpen = (open) => {
      menuOpen = open;
      syncHeader();
      toggle.setAttribute("aria-expanded", String(open));
      document.documentElement.style.overflow = open ? "hidden" : "";
      if (open) lenis?.stop();
      else lenis?.start();
      if (open) {
        menu.hidden = false;
        void menu.offsetHeight; // commit the unhidden state so the fade runs
        menu.classList.add("is-open");
      } else {
        menu.classList.remove("is-open");
        setTimeout(() => {
          if (toggle.getAttribute("aria-expanded") === "false") menu.hidden = true;
        }, 500);
      }
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Mark the nav item for the section in view
  const navLinks = document.querySelectorAll("[data-nav]");
  document.querySelectorAll(".stack[id]").forEach((stack) => {
    ScrollTrigger.create({
      trigger: stack,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        navLinks.forEach((link) => {
          if (link.dataset.nav !== stack.id) return;
          if (self.isActive) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
    });
  });

  if (motionOk) {
    // Overlapping panels: each pins for one screen while the next slides over.
    // A panel taller than the screen pins by its bottom edge, so all of it is read first.
    document.querySelectorAll(".stack:not(:last-child) .panel").forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: () => (panel.offsetHeight > window.innerHeight ? "bottom bottom" : "top top"),
        end: () => `+=${window.innerHeight}`,
        pin: true,
        pinSpacing: false,
      });
    });

    // Each incoming panel's shadow fades in over the first 120px it travels up the screen
    document.querySelectorAll(".stack + .stack").forEach((stack) => {
      gsap.fromTo(
        stack.querySelector(".panel"),
        { "--slide-shadow": 0 },
        {
          "--slide-shadow": 1,
          ease: "none",
          scrollTrigger: { trigger: stack, start: "top bottom", end: "top bottom-=120", scrub: true },
        }
      );
    });

    // Hero figures fade, rise and count up on load from their data-count value, one after another.
    // The HTML holds the final text.
    document.querySelectorAll("[data-count]").forEach((el, i) => {
      const [, before, value, after] = el.textContent.match(/^(\D*)(\d+)(.*)$/);
      const counter = { n: Number(el.dataset.count) };
      const render = () => (el.textContent = before + Math.round(counter.n) + after);
      el.setAttribute("aria-label", el.textContent);
      render();
      const delay = i * 0.1;
      gsap.from(el, { autoAlpha: 0, y: 16, duration: 0.8, delay, ease: "power3.out" });
      gsap.to(counter, { n: Number(value), duration: 1.6, delay, ease: "power3.out", onUpdate: render });
    });

    // Images drift within their spare height, centred when the panel reaches the top
    document.querySelectorAll("[data-parallax]").forEach((img) => {
      const drift = () => ((img.offsetHeight - img.parentElement.offsetHeight) / 2) * 0.9;
      gsap.fromTo(
        img,
        { y: drift },
        {
          y: () => -drift(),
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".stack"),
            start: "top bottom",
            end: "top -100%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });
  }

  // ScrollTrigger resets the scroll position while it measures, so restore an anchor from another page
  if (location.hash) {
    ScrollTrigger.addEventListener("refresh", function restoreAnchor() {
      ScrollTrigger.removeEventListener("refresh", restoreAnchor);
      document.querySelector(location.hash)?.scrollIntoView({ behavior: "instant" });
    });
  }

  // Request form, posted to ActiveCampaign
  const form = document.querySelector("[data-access-form]");
  if (!form) return;
  const config = JSON.parse(document.getElementById("site-config")?.textContent || "{}");
  const ac = config.activecampaign || {};
  const success = document.querySelector("[data-form-success]");
  const formError = form.querySelector("[data-form-error]");
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.textContent;

  const errorFor = (el) => (el.closest("fieldset") || el.closest("div")).querySelector(".field-error");
  const setError = (el, message) => {
    const slot = errorFor(el);
    if (el.matches("input:not([type=checkbox]), select")) el.setAttribute("aria-invalid", String(!!message));
    slot.textContent = message || "";
    slot.hidden = !message;
  };

  const fieldMessage = (el) => {
    if (!el.value.trim()) return "Required.";
    if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()))
      return "Enter a valid email address, for example name@firm.com.";
    return "";
  };

  const validate = () => {
    let firstInvalid = null;
    form.querySelectorAll("input[required], select[required]").forEach((el) => {
      const message = fieldMessage(el);
      setError(el, message);
      if (message && !firstInvalid) firstInvalid = el;
    });
    const statuses = form.querySelectorAll('input[name="status"]');
    const anyStatus = [...statuses].some((c) => c.checked);
    setError(statuses[0], anyStatus ? "" : "Confirm accredited investor status.");
    if (!anyStatus && !firstInvalid) firstInvalid = statuses[0];
    return firstInvalid;
  };

  // Check a field when it loses focus. An untouched empty field stays quiet until submit.
  form.querySelectorAll("input[required], select[required]").forEach((el) =>
    el.addEventListener("blur", () => {
      if (el.value.trim() || !errorFor(el).hidden) setError(el, fieldMessage(el));
    })
  );
  form.querySelectorAll('input[name="status"]').forEach((el) =>
    el.addEventListener("change", () => {
      if (!errorFor(el).hidden) validate();
    })
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formError.hidden = true;
    const invalid = validate();
    if (invalid) {
      invalid.focus();
      return;
    }
    if (!ac.account || !ac.formId) {
      formError.textContent = "Submissions are not connected in this preview.";
      formError.hidden = false;
      return;
    }

    const data = new FormData(form);
    const body = new URLSearchParams({
      u: ac.formId,
      f: ac.formId,
      s: "",
      c: "0",
      m: "0",
      act: "sub",
      v: "2",
      fullname: data.get("fullname"),
      email: data.get("email"),
    });
    const fields = ac.fields || {};
    if (fields.firm) body.set(`field[${fields.firm}]`, data.get("firm"));
    if (fields.role) body.set(`field[${fields.role}]`, data.get("role"));
    if (fields.allocation) body.set(`field[${fields.allocation}]`, data.get("allocation"));
    if (fields.status) body.set(`field[${fields.status}]`, data.getAll("status").join(", "));

    button.disabled = true;
    button.textContent = "Sending";
    try {
      // ActiveCampaign does not send CORS headers, so the response is opaque.
      await fetch(`https://${ac.account}.activehosted.com/proc.php`, { method: "POST", mode: "no-cors", body });
      form.hidden = true;
      success.querySelector("[data-success-email]").textContent = data.get("email");
      success.hidden = false;
      success.focus();
    } catch {
      formError.textContent = "The request did not go through. Check your connection and try again.";
      formError.hidden = false;
    } finally {
      button.disabled = false;
      button.textContent = buttonLabel;
    }
  });
})();

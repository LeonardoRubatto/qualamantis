(function () {
  // Scroll reveal
  const srObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); srObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.sr').forEach((el) => srObs.observe(el));

  // Accordion (data-acc / [data-axis])
  document.querySelectorAll('[data-acc], [data-axis]').forEach((item) => {
    const bar = item.querySelector('.acc-bar, .axis-bar');
    if (!bar) return;
    bar.addEventListener('click', () => item.classList.toggle('open'));
  });

  // Animated counters ([data-count])
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        const target = +e.target.dataset.count;
        const dur = 1300;
        const t0 = performance.now();
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          const ease = 1 - Math.pow(1 - k, 3);
          e.target.textContent = Math.round(target * ease);
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => { el.textContent = '0'; cio.observe(el); });
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileNav.classList.remove('open');
    }));
  }

  // Hero entrance (index only)
  window.addEventListener('load', () => document.body.classList.add('loaded'));
  setTimeout(() => document.body.classList.add('loaded'), 600);

  // Contact form (AJAX submit via Formspree, progressive enhancement)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.style.display = 'block';
      status.style.color = 'var(--ink-soft)';
      status.textContent = 'Sending…';
      const submitBtn = form.querySelector('.form-submit');
      if (submitBtn) submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then((res) => {
          if (res.ok) {
            form.reset();
            status.style.color = 'var(--terra)';
            status.textContent = 'Thank you — your message has been sent. We will respond within 48 hours.';
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(() => {
          status.style.color = '#b3261e';
          status.textContent = 'Something went wrong sending this form. Please email us directly at qualamantis@gmail.com instead.';
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();

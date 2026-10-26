/**
 * NodirDev — Premium Personal Brand Website
 * STEP 3: Full JavaScript
 * Mobile navigation, form validation, scroll reveals,
 * active nav states, and refined UI interactions.
 */

(function () {
  'use strict';

  /* --------------------------------------------
     Utilities
     -------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function debounce(fn, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /* --------------------------------------------
     Current Year (Footer)
     -------------------------------------------- */
  function initYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /* --------------------------------------------
     Mobile Navigation
     -------------------------------------------- */
  function initMobileNav() {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.getElementById('nav-menu');
    const header = document.getElementById('site-header');

    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function isOpen() {
      return menu.classList.contains('is-open');
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when a nav link is clicked
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (isOpen()) closeMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close on resize to desktop
    const handleResize = debounce(function () {
      if (window.innerWidth >= 900 && isOpen()) {
        closeMenu();
      }
    }, 150);

    window.addEventListener('resize', handleResize);
  }

  /* --------------------------------------------
     Header Scroll State
     -------------------------------------------- */
  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const onScroll = debounce(function () {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, 10);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial
  }

  /* --------------------------------------------
     Active Navigation Link (Scroll Spy)
     -------------------------------------------- */
  function initActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!sections.length || !navLinks.length) return;

    const linkMap = {};
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        linkMap[href.slice(1)] = link;
      }
    });

    function setActive(id) {
      navLinks.forEach(function (link) {
        link.classList.remove('is-active');
      });
      if (linkMap[id]) {
        linkMap[id].classList.add('is-active');
      }
    }

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -55% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });

    // Also handle hero / top of page
    window.addEventListener('scroll', debounce(function () {
      if (window.scrollY < 120) {
        setActive('home');
      }
    }, 50), { passive: true });
  }

  /* --------------------------------------------
     Smooth Anchor Scrolling (enhanced)
     -------------------------------------------- */
  function initSmoothAnchors() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* --------------------------------------------
     Scroll Reveal Animations
     -------------------------------------------- */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      // Ensure everything is visible
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    // Auto-mark key elements for reveal if not already marked
    const revealTargets = [
      '.about__container',
      '.services__header',
      '.service-card',
      '.work__header',
      '.project-card',
      '.why__header',
      '.why-card',
      '.github__content',
      '.contact__intro',
      '.contact__form-wrap'
    ];

    revealTargets.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
        }
      });
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optional: unobserve after reveal for performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --------------------------------------------
     Form Validation & Submission
     -------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('project-request-form');
    if (!form) return;

    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit');

    const fields = {
      name: form.querySelector('#form-name'),
      email: form.querySelector('#form-email'),
      telegram: form.querySelector('#form-telegram'),
      projectType: form.querySelector('#form-project-type'),
      description: form.querySelector('#form-description'),
      budget: form.querySelector('#form-budget')
    };

    function clearStatus() {
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.classList.remove('is-success', 'is-error');
      }
    }

    function setStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.remove('is-success', 'is-error');
      if (type) statusEl.classList.add(type);
    }

    function showFieldError(field, message) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');

      let errorEl = field.parentElement.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.setAttribute('role', 'alert');
        field.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = message;
    }

    function clearFieldError(field) {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      const errorEl = field.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.remove();
    }

    function clearAllErrors() {
      Object.values(fields).forEach(function (field) {
        if (field) clearFieldError(field);
      });
      clearStatus();
    }

    function isValidEmail(value) {
      // Practical email check
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
      let isValid = true;
      clearAllErrors();

      // Name
      if (!fields.name.value.trim()) {
        showFieldError(fields.name, 'Please enter your name.');
        isValid = false;
      } else if (fields.name.value.trim().length < 2) {
        showFieldError(fields.name, 'Name must be at least 2 characters.');
        isValid = false;
      }

      // Email
      if (!fields.email.value.trim()) {
        showFieldError(fields.email, 'Please enter your email.');
        isValid = false;
      } else if (!isValidEmail(fields.email.value.trim())) {
        showFieldError(fields.email, 'Please enter a valid email address.');
        isValid = false;
      }

      // Project type
      if (!fields.projectType.value) {
        showFieldError(fields.projectType, 'Please select a project type.');
        isValid = false;
      }

      // Description
      if (!fields.description.value.trim()) {
        showFieldError(fields.description, 'Please describe your project.');
        isValid = false;
      } else if (fields.description.value.trim().length < 20) {
        showFieldError(fields.description, 'Please provide a bit more detail (at least 20 characters).');
        isValid = false;
      }

      return isValid;
    }

    // Live clear error on input
    Object.values(fields).forEach(function (field) {
      if (!field) return;
      field.addEventListener('input', function () {
        if (field.classList.contains('is-invalid')) {
          clearFieldError(field);
        }
      });
      field.addEventListener('change', function () {
        if (field.classList.contains('is-invalid')) {
          clearFieldError(field);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearStatus();

      if (!validate()) {
        setStatus('Please correct the errors above.', 'is-error');
        // Focus first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate successful submission (no backend yet)
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      // Placeholder: real integration would send data to an endpoint
      setTimeout(function () {
        setStatus('Thank you. Your request has been received. Nodir will get back to you shortly.', 'is-success');
        form.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Request';
        }
      }, 900);
    });
  }

  /* --------------------------------------------
     Project Card Interactions (subtle)
     -------------------------------------------- */
  function initProjectCards() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.classList.add('is-hovered');
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('is-hovered');
      });
    });
  }

  /* --------------------------------------------
     Keyboard focus enhancement for cards
     -------------------------------------------- */
  function initFocusableCards() {
    document.querySelectorAll('.project-card, .service-card, .why-card').forEach(function (card) {
      // Make focusable only if it contains interactive elements already
      // No change needed — links inside handle focus
    });
  }

  /* --------------------------------------------
     Initialize everything
     -------------------------------------------- */
  function init() {
    initYear();
    initMobileNav();
    initHeaderScroll();
    initActiveNav();
    initSmoothAnchors();
    initScrollReveal();
    initContactForm();
    initProjectCards();
    initFocusableCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

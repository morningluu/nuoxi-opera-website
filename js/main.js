/* 非遗傩戏文化官网 — 全局交互 */

(function () {
  'use strict';
  function initPageEnter() {
    document.body.classList.add('page-transition');
  }
  function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    if (!navbar) return;
    let scrollTicking = false;
    function updateNavScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      scrollTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        requestAnimationFrame(updateNavScroll);
        scrollTicking = true;
      }
    });
    updateNavScroll();
    if (navToggle && navLinks) {
      function openMenu() {
        navToggle.classList.add('active');
        navLinks.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeMenu() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      navToggle.addEventListener('click', function () {
        if (navLinks.classList.contains('active')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // 点击遮罩关闭菜单
      if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
      }

      // 点击链接关闭菜单
      navLinks.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });
    }
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }
  function initCarousel() {
    var carousel = document.querySelector('.carousel');
    if (!carousel) return;

    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var indicators = carousel.querySelectorAll('.carousel-indicator');
    var prevBtn = carousel.querySelector('.carousel-btn-prev');
    var nextBtn = carousel.querySelector('.carousel-btn-next');

    if (!track || slides.length === 0) return;

    var currentIndex = 0;
    var totalSlides = slides.length;
    var autoplayInterval = null;
    var AUTOPLAY_DELAY = 5000;
    var isTransitioning = false;

    function goToSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

      // 更新指示器
      indicators.forEach(function (ind, i) {
        if (i === currentIndex) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
      setTimeout(function () {
        isTransitioning = false;
      }, 650);
    }

    function nextSlide() {
      if (!isTransitioning) {
        goToSlide(currentIndex + 1);
      }
    }

    function prevSlide() {
      if (!isTransitioning) {
        goToSlide(currentIndex - 1);
      }
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }
    if (prevBtn) prevBtn.addEventListener('click', function () {
      prevSlide();
      startAutoplay();
    });

    if (nextBtn) nextBtn.addEventListener('click', function () {
      nextSlide();
      startAutoplay();
    });
    indicators.forEach(function (ind, i) {
      ind.addEventListener('click', function () {
        goToSlide(i);
        startAutoplay();
      });
    });
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    var touchStartX = 0;
    var touchEndX = 0;

    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAutoplay();
      }
    });
    document.addEventListener('keydown', function (e) {
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoplay();
      }
    });
    goToSlide(0);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        startAutoplay();
      });
    });
  }
  function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;

    timelineItems.forEach(function (item) {
      const card = item.querySelector('.timeline-card');
      if (!card) return;

      card.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
        timelineItems.forEach(function (other) {
          other.classList.remove('active');
        });

        // 如果之前未激活则打开（点击已打开的会关闭）
        if (!isActive) {
          item.classList.add('active');

          // 展开后滚动使内容可见
          setTimeout(function () {
            const body = item.querySelector('.timeline-card-body-inner');
            if (body) {
              const rect = body.getBoundingClientRect();
              if (rect.bottom > window.innerHeight) {
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          }, 500);
        }
      });
    });
  }
  function initFilmStrip() {
    const tracks = document.querySelectorAll('.film-reel-track');
    if (tracks.length === 0) return;

    tracks.forEach(function (track) {
      var originalContent = track.innerHTML;
      track.innerHTML = originalContent + originalContent;
    });
  }
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

    if (revealElements.length === 0) return;

    // 检查是否支持IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // 一旦显示就不再观察
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }
  function initForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(function (group) {
      const input = group.querySelector('.form-input, .form-textarea');
      if (!input) return;

      input.addEventListener('focus', function () {
        group.classList.add('focused');
      });

      input.addEventListener('blur', function () {
        if (!input.value) {
          group.classList.remove('focused');
        }
      });

      // 初始状态检查
      if (input.value) {
        group.classList.add('focused');
      }
    });
    const captchaDisplay = form.querySelector('.captcha-display');
    if (captchaDisplay) {
      function generateCaptcha() {
        const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 4; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        captchaDisplay.textContent = code;
        captchaDisplay.setAttribute('data-code', code);
      }

      generateCaptcha();

      captchaDisplay.addEventListener('click', generateCaptcha);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      form.querySelectorAll('.form-error').forEach(function (err) {
        err.classList.remove('visible');
      });
      form.querySelectorAll('.form-input, .form-textarea').forEach(function (input) {
        input.classList.remove('error');
      });
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          const errorEl = field.parentElement.querySelector('.form-error');
          if (errorEl) {
            errorEl.textContent = '此字段为必填项';
            errorEl.classList.add('visible');
          }
        }
      });
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
          isValid = false;
          emailField.classList.add('error');
          const errorEl = emailField.parentElement.querySelector('.form-error');
          if (errorEl) {
            errorEl.textContent = '请输入有效的邮箱地址';
            errorEl.classList.add('visible');
          }
        }
      }
      const captchaInput = form.querySelector('.captcha-input');
      if (captchaInput && captchaDisplay && captchaInput.value.trim()) {
        const expectedCode = captchaDisplay.getAttribute('data-code');
        if (captchaInput.value.trim().toUpperCase() !== expectedCode) {
          isValid = false;
          captchaInput.classList.add('error');
          const errorEl = captchaInput.parentElement.querySelector('.form-error');
          if (errorEl) {
            errorEl.textContent = '验证码不正确，请重新输入';
            errorEl.classList.add('visible');
          }
        }
      }

      if (isValid) {
        const submitBtn = form.querySelector('.btn-primary');
        const formContent = form.querySelector('.form-fields');
        const successMsg = form.querySelector('.form-success-message');

        if (submitBtn) {
          submitBtn.classList.add('success-flash');
          setTimeout(function () {
            submitBtn.classList.remove('success-flash');
          }, 600);
        }
        setTimeout(function () {
          if (formContent) formContent.style.display = 'none';
          if (successMsg) successMsg.classList.add('visible');
        }, 800);
      }
    });
  }
  function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      statNumbers.forEach(function (el) {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(target * eased);
              el.textContent = current.toLocaleString();

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                el.textContent = target.toLocaleString();
              }
            }

            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      observer.observe(el);
    });
  }
  function initKeyboardNav() {
    document.addEventListener('keydown', function (e) {
      // Escape关闭移动端菜单
      if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const navToggle = document.querySelector('.nav-toggle');
        const navOverlay = document.querySelector('.nav-overlay');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          if (navToggle) navToggle.classList.remove('active');
          if (navOverlay) navOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  }
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 72;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  function initPageSpecific() {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    switch (page) {
      case 'index.html':
      case '':
        initCarousel();
        initCountUp();
        break;
      case 'origin.html':
        initTimeline();
        break;
      case 'feature.html':
        initCarousel();
        initFilmStrip();
        break;
      case 'contact.html':
        initForm();
        break;
      default:
        break;
    }
  }
  function init() {
    initPageEnter();
    initNavigation();
    initScrollReveal();
    initSmoothScroll();
    initKeyboardNav();
    initPageSpecific();
  }

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Daily Product - Dairy Farm & Fresh Milk Delivery Service
 * Global Script: Dark Mode, RTL Toggle, Mobile Menu, Dashboard & Interactive Widgets
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Theme (Dark / Light Mode) Controller
  // --------------------------------------------------------------------------
  const THEME_KEY = 'dailyProductTheme';

  function applyTheme(theme, persist = true) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateThemeIcons(theme);
    if (persist) {
      localStorage.setItem(THEME_KEY, theme);
    }
  }

  function updateThemeIcons(theme) {
    const icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(icon => {
      if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        if (!icon.classList.contains('text-amber-500') && !icon.classList.contains('text-amber-400')) {
          icon.classList.add('text-amber-400');
        }
      } else {
        icon.classList.remove('fa-sun', 'text-amber-400');
        icon.classList.add('fa-moon');
      }
    });
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || localStorage.getItem('daily_product_theme');
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved, true);
    } else {
      applyTheme(systemDark ? 'dark' : 'light', false);
    }

    if (window.matchMedia) {
      try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light', false);
          }
        });
      } catch (err) {
        // Fallback for older browsers
      }
    }

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      if (btn.dataset.themeBound) return;
      btn.dataset.themeBound = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
        showToast('Theme Changed', `Switched to ${next} mode`, 'info');
      });
    });
  }

  // --------------------------------------------------------------------------
  // RTL (Right to Left) Engine & Controller
  // Standardized persistence via 'dailyProductDirection' ('ltr' / 'rtl')
  // --------------------------------------------------------------------------
  const DIRECTION_KEY = 'dailyProductDirection';

  function applyRTL(isRtl, persist = true) {
    const dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    if (isRtl) {
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('lang', 'en');
    }
    updateRTLButtons(isRtl);
    if (persist) {
      try {
        localStorage.setItem(DIRECTION_KEY, dir);
      } catch (e) {}
    }
  }

  function updateRTLButtons(isRtl) {
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      const textSpan = btn.querySelector('.rtl-btn-text');
      if (textSpan) {
        textSpan.textContent = isRtl ? 'LTR' : 'RTL';
      }
      btn.setAttribute('title', isRtl ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
    });
  }

  function initRTL() {
    const saved = localStorage.getItem(DIRECTION_KEY);
    const initialRtl = saved === 'rtl';
    applyRTL(initialRtl, false);

    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      if (btn.dataset.rtlBound) return;
      btn.dataset.rtlBound = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentDir = document.documentElement.getAttribute('dir') === 'rtl';
        const nextRtl = !currentDir;
        applyRTL(nextRtl, true);
        showToast('Direction Changed', nextRtl ? 'Switched to Right-to-Left (RTL) mode' : 'Switched to Left-to-Right (LTR) mode', 'info');
      });
    });
  }

  // Global helper API
  window.setRTL = function(enableRtl) {
    applyRTL(Boolean(enableRtl), true);
  };
  window.toggleRTL = function() {
    const currentDir = document.documentElement.getAttribute('dir') === 'rtl';
    applyRTL(!currentDir, true);
  };

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const openBtn = document.getElementById('mobileMenuOpenBtn');
    const closeBtn = document.getElementById('mobileMenuCloseBtn');
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');

    function openMenu() {
      if (drawer && overlay) {
        drawer.classList.remove('drawer-closed', 'translate-x-full', '-translate-x-full');
        drawer.classList.add('drawer-open');
        overlay.classList.remove('hidden', 'overlay-closed', 'opacity-0');
        overlay.classList.add('overlay-open');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeMenu() {
      if (drawer && overlay) {
        drawer.classList.remove('drawer-open');
        drawer.classList.add('drawer-closed');
        overlay.classList.remove('overlay-open');
        overlay.classList.add('overlay-closed');
        setTimeout(() => {
          if (!drawer.classList.contains('drawer-open')) {
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
          }
        }, 300);
      }
    }

    if (openBtn) openBtn.addEventListener('click', (e) => { e.preventDefault(); openMenu(); });
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); });
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close drawer when any nav link inside drawer is clicked
    if (drawer) {
      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          closeMenu();
        });
      });
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('drawer-open')) {
        closeMenu();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && drawer && drawer.classList.contains('drawer-open')) {
        closeMenu();
      }
    });

    // Ensure drawer is explicitly closed on initialization
    if (drawer && overlay) {
      drawer.classList.add('drawer-closed');
      drawer.classList.remove('drawer-open');
      overlay.classList.add('overlay-closed', 'hidden');
      overlay.classList.remove('overlay-open');
    }
  }

  // --------------------------------------------------------------------------
  // Fixed Header Dynamic Height Sync & Scroll Elevation
  // --------------------------------------------------------------------------
  function initFixedHeader() {
    const header = document.querySelector('header') || document.querySelector('nav#mainNavbar');
    if (!header) return;

    function syncHeaderHeight() {
      const measured = header.offsetHeight || 0;
      const h = Math.max(measured, 80);
      document.documentElement.style.setProperty('--header-height', `${h}px`);
      const spacers = document.querySelectorAll('.header-spacer');
      spacers.forEach(spacer => {
        spacer.style.height = `${h}px`;
        spacer.style.minHeight = `${h}px`;
      });
    }

    // Initial measurement
    syncHeaderHeight();
    requestAnimationFrame(syncHeaderHeight);

    // Font loading measurement support
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncHeaderHeight);
    }

    // Use ResizeObserver for real-time height tracking (e.g. mobile announcement bar wrap, font load)
    if (window.ResizeObserver) {
      try {
        const ro = new ResizeObserver(syncHeaderHeight);
        ro.observe(header);
      } catch (e) {}
    }

    window.addEventListener('resize', syncHeaderHeight, { passive: true });
    window.addEventListener('orientationchange', syncHeaderHeight, { passive: true });
    window.addEventListener('load', syncHeaderHeight, { passive: true });

    // Scroll elevation effect
    const navbar = document.getElementById('mainNavbar');
    function onScroll() {
      const isScrolled = window.scrollY > 20;
      if (isScrolled) {
        header.classList.add('is-scrolled');
        if (navbar) navbar.classList.add('shadow-md', 'backdrop-blur-md', 'bg-white/95', 'dark:bg-slate-900/95');
      } else {
        header.classList.remove('is-scrolled');
        if (navbar) navbar.classList.remove('shadow-md', 'backdrop-blur-md', 'bg-white/95', 'dark:bg-slate-900/95');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initStickyNavbar() {
    initFixedHeader();
  }

  // --------------------------------------------------------------------------
  // Notification Toast System
  // --------------------------------------------------------------------------
  function showToast(title, message, type = 'success') {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all duration-300 transform translate-y-24';
      document.body.appendChild(toast);
    }

    let iconHtml = '<i class="fa-solid fa-circle-check text-blue-500 text-xl"></i>';
    if (type === 'error') {
      iconHtml = '<i class="fa-solid fa-circle-exclamation text-rose-500 text-xl"></i>';
    } else if (type === 'info') {
      iconHtml = '<i class="fa-solid fa-circle-info text-blue-500 text-xl"></i>';
    }

    toast.innerHTML = `
      ${iconHtml}
      <div>
        <h4 class="font-bold text-sm">${title}</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400">${message}</p>
      </div>
      <button class="ml-4 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs" onclick="document.getElementById('toastNotification').classList.add('translate-y-24')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    toast.classList.remove('translate-y-24');
    setTimeout(() => {
      toast.classList.add('translate-y-24');
    }, 4000);
  }
  window.showToast = showToast;

  // --------------------------------------------------------------------------
  // Pincode Availability Checker
  // --------------------------------------------------------------------------
  function initPincodeChecker() {
    const input = document.getElementById('deliveryPincodeInput');
    const btn = document.getElementById('checkPincodeBtn');
    const resultBox = document.getElementById('pincodeResultBox');

    if (!btn || !input || !resultBox) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = input.value.trim();
      if (!code || code.length < 4) {
        showToast('Invalid Pincode', 'Please enter a valid 5-6 digit postal code.', 'error');
        return;
      }

      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Checking...';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-location-dot mr-2"></i> Check Area';
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `
          <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <i class="fa-solid fa-check"></i>
            </div>
            <div>
              <p class="font-bold text-blue-800 dark:text-blue-300 text-sm">Fresh Delivery Active in Area (${code})!</p>
              <p class="text-xs text-blue-700 dark:text-blue-400 mt-1">Our morning cold-chain van reaches your street daily between <strong>5:45 AM and 7:15 AM</strong>. Place before 9 PM for tomorrow morning delivery.</p>
              <a href="subscriptions.html" class="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300 underline mt-2 hover:text-blue-900">Choose Subscription Plan <i class="fa-solid fa-arrow-right text-[10px]"></i></a>
            </div>
          </div>
        `;
        showToast('Service Available!', `Morning cold-chain slot confirmed for ${code}.`, 'success');
      }, 600);
    });
  }

  // --------------------------------------------------------------------------
  // Contact Inquiry Form Handler (contact.html)
  // --------------------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contactInquiryForm');
    if (!form) return;
    if (form.dataset.contactBound) return;
    form.dataset.contactBound = 'true';

    const submitBtn = form.querySelector('button[type="submit"]') || document.getElementById('contactSubmitBtn');
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry &rarr;';
    const modal = document.getElementById('contactSuccessModal');
    const modalCard = document.getElementById('contactModalCard');
    const closeBtn = document.getElementById('contactModalCloseBtn');
    const overlay = document.getElementById('contactModalOverlay');

    let isProcessing = false;

    function openModal() {
      if (!modal) {
        showToast('Enquiry Submitted Successfully!', 'Thank you for contacting Daily Product. Our dairy specialist will get back to you shortly.', 'success');
        form.reset();
        return;
      }
      modal.classList.remove('hidden');
      void modal.offsetWidth; // Force DOM reflow
      modal.classList.remove('opacity-0');
      modal.classList.add('opacity-100');
      if (modalCard) {
        modalCard.classList.remove('scale-95');
        modalCard.classList.add('scale-100');
      }
      document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('opacity-100');
      modal.classList.add('opacity-0');
      if (modalCard) {
        modalCard.classList.remove('scale-100');
        modalCard.classList.add('scale-95');
      }
      setTimeout(() => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }, 300);

      // Reset the form fields after user acknowledges/closes the modal
      form.reset();
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate required fields and constraints
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Prevent duplicate submissions while processing
      if (isProcessing) return;
      isProcessing = true;

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending...';
      }

      // Briefly process submission simulation
      setTimeout(() => {
        // Restore button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.innerHTML = originalBtnContent;
        }

        // Open the success confirmation popup
        openModal();

        isProcessing = false;
      }, 500);
    });
  }

  // --------------------------------------------------------------------------
  // FAQ Accordions
  // --------------------------------------------------------------------------
  function initAccordions() {
    document.querySelectorAll('.faq-header').forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.faq-icon');
        const isOpen = content.classList.contains('active');

        // Close siblings
        const parent = header.closest('.faq-container');
        if (parent) {
          parent.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
          parent.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));
        }

        if (!isOpen) {
          content.classList.add('active');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Products Filter & Quick View
  // --------------------------------------------------------------------------
  // Product Search & Category Filtering System
  // --------------------------------------------------------------------------
  function initProductsFilter() {
    const filterBtns = document.querySelectorAll('.product-filter-btn');
    const productCards = document.querySelectorAll('.product-item-card');
    const searchInput = document.getElementById('productSearchInput');
    const clearBtn = document.getElementById('clearProductSearchBtn');
    const noProductsFound = document.getElementById('noProductsFound');
    const resetSearchBtn = document.getElementById('resetSearchBtn');

    if (!productCards.length) return;

    let activeCategory = 'all';
    let searchQuery = '';

    function setActiveCategoryButton(cat) {
      activeCategory = cat;
      filterBtns.forEach(b => {
        const bCat = b.getAttribute('data-category');
        if (bCat === cat) {
          b.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-600/20');
          b.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        } else {
          b.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-600/20');
          b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        }
      });
    }

    function applyFilter() {
      let visibleCount = 0;
      const q = searchQuery.toLowerCase().trim();
      const tokens = q.split(/\s+/).filter(Boolean);

      productCards.forEach(card => {
        const category = (card.getAttribute('data-category') || '').toLowerCase();
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
        const text = (card.innerText || '').toLowerCase();
        const searchCorpus = `${name} ${keywords} ${category} ${text}`;

        const matchesCategory = (activeCategory === 'all' || category === activeCategory);
        
        let matchesSearch = true;
        if (tokens.length > 0) {
          matchesSearch = tokens.every(token => searchCorpus.includes(token));
        }

        if (matchesCategory && matchesSearch) {
          card.classList.remove('hidden');
          card.style.display = '';
          visibleCount++;
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });

      if (noProductsFound) {
        if (visibleCount === 0) {
          noProductsFound.classList.remove('hidden');
          noProductsFound.style.display = 'block';
        } else {
          noProductsFound.classList.add('hidden');
          noProductsFound.style.display = 'none';
        }
      }

      if (clearBtn) {
        if (q.length > 0) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
      }
    }

    if (filterBtns.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const cat = btn.getAttribute('data-category') || 'all';
          setActiveCategoryButton(cat);
          applyFilter();
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (searchQuery.trim().length > 0 && activeCategory !== 'all') {
          // If searching, check if search exists in other categories and reset to all if needed
          const q = searchQuery.toLowerCase().trim();
          let inCat = false;
          productCards.forEach(c => {
            if ((c.getAttribute('data-category') || '').toLowerCase() === activeCategory) {
              const corpus = `${c.getAttribute('data-name') || ''} ${c.getAttribute('data-keywords') || ''} ${c.innerText || ''}`.toLowerCase();
              if (corpus.includes(q)) inCat = true;
            }
          });
          if (!inCat) {
            setActiveCategoryButton('all');
          }
        }
        applyFilter();
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          searchQuery = '';
          applyFilter();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        applyFilter();
        if (searchInput) searchInput.focus();
      });
    }

    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        setActiveCategoryButton('all');
        applyFilter();
        if (searchInput) searchInput.focus();
      });
    }
  }

  // --------------------------------------------------------------------------
  // Subscription Plan Interactive Customizer
  // --------------------------------------------------------------------------
  function initSubscriptionCalculator() {
    const milkSelect = document.getElementById('calcMilkType');
    const qtyInput = document.getElementById('calcQuantity');
    const freqSelect = document.getElementById('calcFrequency');
    const totalDisplay = document.getElementById('calcMonthlyTotal');
    const dailyDisplay = document.getElementById('calcDailyCost');
    const bottleSavingsDisplay = document.getElementById('calcSavings');

    if (!milkSelect || !qtyInput || !freqSelect || !totalDisplay) return;

    // Read pre-selected product from URL query parameter (e.g. from Service Details page)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const preProduct = urlParams.get('product');
      if (preProduct) {
        if (preProduct === 'a2-desi-cow-milk') {
          milkSelect.value = '2.80';
          qtyInput.value = '1';
        } else if (preProduct === 'a2-family-double-pack') {
          milkSelect.value = '2.80';
          qtyInput.value = '2';
        } else if (preProduct === 'cream-buffalo-milk') {
          milkSelect.value = '3.20';
          qtyInput.value = '1';
        }
      }
    } catch (e) {}

    function recalculate() {
      const pricePerLitre = parseFloat(milkSelect.value) || 2.80;
      const litersPerDay = parseFloat(qtyInput.value) || 1;
      const freqMultiplier = parseFloat(freqSelect.value) || 30; // 30 days, 15 days, or 22 days

      const dailyCost = pricePerLitre * litersPerDay;
      const monthlyTotal = dailyCost * freqMultiplier;
      const glassSavings = (litersPerDay * freqMultiplier * 0.15).toFixed(2); // Plastic pouch vs returnable glass bottle savings

      dailyDisplay.textContent = `$${dailyCost.toFixed(2)}`;
      totalDisplay.textContent = `$${monthlyTotal.toFixed(2)}`;
      if (bottleSavingsDisplay) {
        bottleSavingsDisplay.textContent = `$${glassSavings}`;
      }
    }

    milkSelect.addEventListener('change', recalculate);
    qtyInput.addEventListener('input', recalculate);
    freqSelect.addEventListener('change', recalculate);

    const qtyPlus = document.getElementById('calcQtyPlus');
    const qtyMinus = document.getElementById('calcQtyMinus');
    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val < 10) {
          qtyInput.value = val + 1;
          recalculate();
        }
      });
    }
    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val > 1) {
          qtyInput.value = val - 1;
          recalculate();
        }
      });
    }

    recalculate();
  }

  // --------------------------------------------------------------------------
  // Service Details Subscription Pack Selector
  // --------------------------------------------------------------------------
  function initServiceDetailsSubscription() {
    const cards = document.querySelectorAll('.service-sub-card');
    const proceedBtn = document.getElementById('btnProceedToBuilder');
    if (!cards.length) return;

    const selectedClasses = ['border-blue-500', 'bg-blue-50/50', 'dark:bg-blue-950/30'];
    const unselectedClasses = ['border-slate-200', 'dark:border-slate-700'];
    const selectedPriceClasses = ['text-blue-600', 'dark:text-blue-400'];
    const unselectedPriceClasses = ['text-slate-900', 'dark:text-white'];

    function selectProduct(targetCard) {
      const productSlug = targetCard.getAttribute('data-product');

      cards.forEach(card => {
        const isSelected = card === targetCard;
        const priceSpan = card.querySelector('.sub-price');

        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

        if (isSelected) {
          card.classList.remove(...unselectedClasses);
          card.classList.add(...selectedClasses);
          if (priceSpan) {
            priceSpan.classList.remove(...unselectedPriceClasses);
            priceSpan.classList.add(...selectedPriceClasses);
          }
        } else {
          card.classList.remove(...selectedClasses);
          card.classList.add(...unselectedClasses);
          if (priceSpan) {
            priceSpan.classList.remove(...selectedPriceClasses);
            priceSpan.classList.add(...unselectedPriceClasses);
          }
        }
      });

      if (proceedBtn && productSlug) {
        proceedBtn.setAttribute('href', `subscriptions.html?product=${encodeURIComponent(productSlug)}`);
      }
    }

    cards.forEach(card => {
      card.addEventListener('click', () => selectProduct(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectProduct(card);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Subscription Plan Bundle Card Selector (subscriptions.html)
  // --------------------------------------------------------------------------
  function initSubscriptionCardsSelection() {
    const cards = document.querySelectorAll('.subscription-plan-card');
    if (!cards || cards.length === 0) return;
    if (cards[0].dataset.subBound) return;
    cards[0].dataset.subBound = 'true';

    let selectedPlan = null;

    // Normal / Unselected state classes
    const unselectedCardClasses = [
      'border-slate-200', 'dark:border-slate-700',
      'hover:border-slate-300', 'dark:hover:border-slate-600',
      'bg-slate-50', 'dark:bg-slate-800',
      'shadow-sm', 'hover:shadow-md'
    ];

    // Highlighted / Selected state classes (matching featured center card visual)
    const selectedCardClasses = [
      'border-blue-500', 'dark:border-blue-500',
      'bg-blue-50/50', 'dark:bg-slate-800/90',
      'shadow-xl', 'shadow-blue-500/10'
    ];

    const unselectedPriceClasses = ['text-slate-900', 'dark:text-white'];
    const selectedPriceClasses = ['text-blue-600', 'dark:text-blue-400'];

    // Normal / Unselected button classes
    const unselectedButtonClasses = [
      'border', 'border-blue-600',
      'text-blue-600',
      'hover:bg-blue-600', 'hover:text-white',
      'font-bold'
    ];

    // Highlighted / Selected button classes
    const selectedButtonClasses = [
      'bg-blue-600', 'hover:bg-blue-700',
      'text-white',
      'font-black',
      'shadow-lg', 'shadow-blue-600/30'
    ];

    function deselectAll() {
      selectedPlan = null;
      cards.forEach(card => {
        const priceEl = card.querySelector('.plan-price');
        const ctaBtn = card.querySelector('a');

        card.setAttribute('aria-checked', 'false');
        card.setAttribute('aria-selected', 'false');
        card.classList.remove(...selectedCardClasses);
        card.classList.add(...unselectedCardClasses);
        if (priceEl) {
          priceEl.classList.remove(...selectedPriceClasses);
          priceEl.classList.add(...unselectedPriceClasses);
        }
        if (ctaBtn) {
          ctaBtn.classList.remove(...selectedButtonClasses);
          ctaBtn.classList.add(...unselectedButtonClasses);
        }
      });
    }

    function selectCard(targetCard, persist = true) {
      if (!targetCard) {
        deselectAll();
        return;
      }

      const planName = targetCard.getAttribute('data-plan-name') || targetCard.querySelector('h3')?.textContent.trim();
      const planKey = targetCard.getAttribute('data-plan-key') || 'standard';
      selectedPlan = planName;

      cards.forEach(card => {
        const isSelected = (card === targetCard);
        const priceEl = card.querySelector('.plan-price');
        const ctaBtn = card.querySelector('a');

        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        card.setAttribute('aria-selected', isSelected ? 'true' : 'false');

        if (isSelected) {
          card.classList.remove(...unselectedCardClasses);
          card.classList.add(...selectedCardClasses);
          if (priceEl) {
            priceEl.classList.remove(...unselectedPriceClasses);
            priceEl.classList.add(...selectedPriceClasses);
          }
          if (ctaBtn) {
            ctaBtn.classList.remove(...unselectedButtonClasses);
            ctaBtn.classList.add(...selectedButtonClasses);
          }
        } else {
          card.classList.remove(...selectedCardClasses);
          card.classList.add(...unselectedCardClasses);
          if (priceEl) {
            priceEl.classList.remove(...selectedPriceClasses);
            priceEl.classList.add(...unselectedPriceClasses);
          }
          if (ctaBtn) {
            ctaBtn.classList.remove(...selectedButtonClasses);
            ctaBtn.classList.add(...unselectedButtonClasses);
          }
        }
      });

      if (persist && planName) {
        try {
          localStorage.setItem('selectedSubscriptionPlan', planName);
          localStorage.setItem('dailyProductSelectedPlan', planName);
          localStorage.setItem('selectedPlan', planKey);
        } catch (e) {}
      }
    }

    cards.forEach(card => {
      // Click anywhere on the entire card to select
      card.addEventListener('click', (e) => {
        // If clicked on or inside a link/button, do not trigger card selection
        if (e.target.closest('a') || e.target.closest('button')) {
          return;
        }
        selectCard(card, true);
      });

      // Keyboard accessibility (Enter and Space)
      card.addEventListener('keydown', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) {
          return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCard(card, true);
        }
      });

      // Buttons inside cards: stop propagation so duplicate card-click behavior is prevented,
      // while syncing localStorage for the clicked plan before navigation
      const ctaBtn = card.querySelector('a');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const planName = card.getAttribute('data-plan-name') || card.querySelector('h3')?.textContent.trim();
          const planKey = card.getAttribute('data-plan-key') || 'standard';
          if (planName) {
            try {
              localStorage.setItem('selectedSubscriptionPlan', planName);
              localStorage.setItem('dailyProductSelectedPlan', planName);
              localStorage.setItem('selectedPlan', planKey);
            } catch (err) {}
          }
          selectCard(card, true);
        });
      }
    });

    // Check localStorage ONLY for an existing user-selected plan (to restore upon refresh).
    // If none exists, selectedPlan = null and all cards remain normal.
    let savedPlan = null;
    try {
      savedPlan = localStorage.getItem('selectedSubscriptionPlan') || localStorage.getItem('dailyProductSelectedPlan');
    } catch (e) {}

    let initialCard = null;
    if (savedPlan) {
      cards.forEach(c => {
        const name = c.getAttribute('data-plan-name') || c.querySelector('h3')?.textContent.trim();
        if (name && name.toLowerCase() === savedPlan.toLowerCase()) {
          initialCard = c;
        }
      });
    }

    if (initialCard) {
      // Restore previously explicitly chosen plan
      selectCard(initialCard, false);
    } else {
      // DO NOT automatically select Family Health or any card.
      // All cards must start in the NORMAL state.
      deselectAll();
    }
  }

  // --------------------------------------------------------------------------
  // Pricing & Subscription Plans Registry
  // --------------------------------------------------------------------------
  const PLANS_CONFIG = {
    'standard': {
      id: 'standard',
      name: 'Daily Standard 1L',
      price: '$79',
      priceNum: 79,
      cycle: '/ month',
      unitRate: '$2.63/Litre',
      dailyQty: 1,
      tag: 'Solo / Couple Plan',
      badge: 'Active Selection',
      icon: 'fa-bottle-water',
      features: '1L Raw A2 Cow Milk Daily • Free Insulated Pouch • Unlimited Pauses',
      productDesc: '1L Raw A2 Desi Cow Milk',
      invoiceDesc: 'Daily Standard 1L Plan (September 2026)',
      invoiceBottles: '30 Litres',
      invoiceAmount: '$79.00'
    },
    'family': {
      id: 'family',
      name: 'Family Double 2L',
      price: '$149',
      priceNum: 149,
      cycle: '/ month',
      unitRate: '$2.48/Litre • 10% Savings',
      dailyQty: 2,
      tag: 'Family Nutrition',
      badge: 'Most Popular',
      icon: 'fa-cow',
      features: '2L Daily (Choose Cow or Buffalo) • Weekly 500g Curd Jar • Priority 6 AM',
      productDesc: '2L Raw A2 Desi Cow Milk',
      invoiceDesc: 'Family 2L Daily Plan (September 2026)',
      invoiceBottles: '60 Litres',
      invoiceAmount: '$149.00'
    },
    'gourmet': {
      id: 'gourmet',
      name: 'Farmstead Gourmet',
      price: '$199',
      priceNum: 199,
      cycle: '/ month',
      unitRate: 'All-Inclusive Gourmet Suite',
      dailyQty: 2,
      tag: 'All-Inclusive',
      badge: 'Artisanal Suite',
      icon: 'fa-jar',
      features: '2L Daily Milk • Monthly Bilona Ghee • Weekly Malai Paneer • Farm Pass',
      productDesc: '2L Milk + Ghee & Malai Paneer',
      invoiceDesc: 'Farmstead Gourmet Suite Plan (September 2026)',
      invoiceBottles: '60 Litres + Gourmet Pantry',
      invoiceAmount: '$199.00'
    }
  };

  // --------------------------------------------------------------------------
  // Registration Plan Selector Engine
  // --------------------------------------------------------------------------
  function initRegistrationPlan() {
    const summaryCard = document.getElementById('registerPlanSummary');
    if (!summaryCard) return;

    const urlParams = new URLSearchParams(window.location.search);
    let planKey = urlParams.get('plan');
    if (!planKey || !PLANS_CONFIG[planKey]) {
      try {
        planKey = localStorage.getItem('selectedPlan');
      } catch (e) {
        planKey = null;
      }
    }
    if (!planKey || !PLANS_CONFIG[planKey]) {
      planKey = 'family';
    }

    try {
      localStorage.setItem('selectedPlan', planKey);
    } catch (e) {}

    const plan = PLANS_CONFIG[planKey];

    const planTitle = document.getElementById('registerPlanTitle');
    const planFeatures = document.getElementById('registerPlanFeatures');
    const planPrice = document.getElementById('registerPlanPrice');
    const planCycle = document.getElementById('registerPlanCycle');
    const planBadge = document.getElementById('registerPlanBadge');
    const planIcon = document.getElementById('registerPlanIcon');
    const planInput = document.getElementById('selectedPlanInput');

    if (planTitle) planTitle.textContent = plan.name;
    if (planFeatures) planFeatures.textContent = plan.features;
    if (planPrice) planPrice.textContent = plan.price;
    if (planCycle) planCycle.textContent = plan.cycle;
    if (planBadge) planBadge.textContent = plan.badge;
    if (planIcon) planIcon.innerHTML = `<i class="fa-solid ${plan.icon}"></i>`;
    if (planInput) planInput.value = planKey;

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', () => {
        try {
          localStorage.setItem('selectedPlan', planKey);
        } catch (err) {}
        const currentAction = registerForm.getAttribute('action') || 'dashboard.html';
        const cleanAction = currentAction.split('?')[0];
        registerForm.setAttribute('action', `${cleanAction}?plan=${encodeURIComponent(planKey)}`);
      });
    }
  }

  // --------------------------------------------------------------------------
  // Dashboard Management Engine (Subscriber & Admin)
  // --------------------------------------------------------------------------
  function initDashboard() {
    // Determine active subscription plan from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let activePlanKey = urlParams.get('plan');
    if (!activePlanKey || !PLANS_CONFIG[activePlanKey]) {
      try {
        activePlanKey = localStorage.getItem('selectedPlan');
      } catch (e) {
        activePlanKey = null;
      }
    }
    if (!activePlanKey || !PLANS_CONFIG[activePlanKey]) {
      activePlanKey = 'family';
    }

    try {
      localStorage.setItem('selectedPlan', activePlanKey);
    } catch (e) {}

    const activePlan = PLANS_CONFIG[activePlanKey];

    // Card 1: Current Plan Title & Subtitle
    const currentPlanTitle = document.getElementById('dashCurrentPlanTitle');
    const currentPlanSubtitle = document.getElementById('dashCurrentPlanSubtitle');
    if (currentPlanTitle) {
      currentPlanTitle.textContent = activePlan.name;
    }
    if (currentPlanSubtitle) {
      currentPlanSubtitle.innerHTML = `<i class="fa-solid fa-sparkles text-[10px]"></i> ${activePlan.productDesc}`;
    }

    // Billing Table active invoice statement
    const invoicePlanDesc = document.getElementById('dashInvoicePlanDesc');
    const invoiceBottles = document.getElementById('dashInvoiceBottles');
    const invoiceAmount = document.getElementById('dashInvoiceAmount');
    if (invoicePlanDesc) invoicePlanDesc.textContent = activePlan.invoiceDesc;
    if (invoiceBottles) invoiceBottles.textContent = activePlan.invoiceBottles;
    if (invoiceAmount) invoiceAmount.textContent = activePlan.invoiceAmount;

    // Top portal switcher (Subscriber vs Admin)
    const portalTabs = document.querySelectorAll('.dashboard-portal-tab');
    const subscriberSection = document.getElementById('subscriberPortalSection');
    const adminSection = document.getElementById('adminPortalSection');

    if (portalTabs.length && subscriberSection && adminSection) {
      portalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          portalTabs.forEach(t => {
            t.classList.remove('bg-blue-600', 'text-white');
            t.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
          });
          tab.classList.add('bg-blue-600', 'text-white');
          tab.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');

          const target = tab.getAttribute('data-portal');
          if (target === 'admin') {
            subscriberSection.classList.add('hidden');
            adminSection.classList.remove('hidden');
            showToast('Admin Mode Active', 'Switched to Dispatch & Operations Analytics View', 'info');
          } else {
            subscriberSection.classList.remove('hidden');
            adminSection.classList.add('hidden');
            showToast('Subscriber Mode Active', 'Viewing Daily Milk Delivery Schedule & Quality Reports', 'info');
          }
        });
      });
    }

    // Subscriber inner tabs (Schedule, Live Tracking, Certificates, Invoices)
    const subNavBtns = document.querySelectorAll('.sub-nav-btn');
    const subPanels = document.querySelectorAll('.sub-panel');

    subNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subNavBtns.forEach(b => {
          b.classList.remove('active', 'bg-white', 'dark:bg-[#131c2e]', 'text-blue-700', 'dark:text-blue-400', 'shadow-sm', 'border', 'border-slate-200/80', 'dark:border-slate-700', 'font-bold');
          b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-semibold');
        });
        btn.classList.add('active', 'bg-white', 'dark:bg-[#131c2e]', 'text-blue-700', 'dark:text-blue-400', 'shadow-sm', 'border', 'border-slate-200/80', 'dark:border-slate-700', 'font-bold');
        btn.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-semibold');

        const targetId = btn.getAttribute('data-panel');
        subPanels.forEach(p => {
          if (p.id === targetId) {
            p.classList.remove('hidden');
          } else {
            p.classList.add('hidden');
          }
        });
      });
    });

    // Pause / Resume Subscription Toggle
    const pauseBtn = document.getElementById('pauseSubscriptionBtn');
    const statusBadge = document.getElementById('subscriptionStatusBadge');
    if (pauseBtn && statusBadge) {
      pauseBtn.addEventListener('click', () => {
        const isPaused = pauseBtn.getAttribute('data-paused') === 'true';
        if (isPaused) {
          pauseBtn.setAttribute('data-paused', 'false');
          pauseBtn.innerHTML = '<i class="fa-solid fa-pause text-[11px]"></i> <span>Pause Deliveries (Vacation)</span>';
          pauseBtn.className = 'px-4 py-2.5 text-xs font-bold rounded-xl border border-amber-400 dark:border-amber-600/80 bg-amber-50/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-all flex items-center gap-2 shadow-sm cursor-pointer';
          statusBadge.innerHTML = '<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span> Active Daily Delivery';
          statusBadge.className = 'inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 shadow-sm';
          showToast('Subscription Resumed', 'Your daily morning delivery is active for tomorrow 6:00 AM.', 'success');
        } else {
          pauseBtn.setAttribute('data-paused', 'true');
          pauseBtn.innerHTML = '<i class="fa-solid fa-play text-[11px]"></i> <span>Resume Deliveries</span>';
          pauseBtn.className = 'px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm shadow-blue-600/30 cursor-pointer';
          statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-500"></span> Paused on Vacation';
          statusBadge.className = 'inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 shadow-sm';
          showToast('Subscription Paused', 'Deliveries temporarily held. Billing paused during vacation.', 'info');
        }
      });
    }

    // ------------------------------------------------------------------------
    // Delivery Grid Static Controller & Daily Quota Stepper
    // ------------------------------------------------------------------------
    const deliveryGrid = document.getElementById('deliveryGridContainer');
    const selectionBox = document.getElementById('deliverySelectionBox');
    const dashQty = document.getElementById('dashDailyQty');
    const dashQtyPlus = document.getElementById('dashQtyPlus');
    const dashQtyMinus = document.getElementById('dashQtyMinus');
    const tueQty = document.getElementById('tueScheduledQty');
    const nextDropBanner = document.getElementById('dashNextDropDetail');

    // Prevent any drag or move interaction across the delivery grid and selection box
    if (deliveryGrid) {
      deliveryGrid.addEventListener('dragstart', (e) => e.preventDefault());
    }
    if (selectionBox) {
      selectionBox.addEventListener('dragstart', (e) => e.preventDefault());
    }

    // Daily Milk Quota Adjustment for tomorrow morning
    let currentTomorrowQty = activePlan.dailyQty;

    if (dashQty) dashQty.textContent = `${currentTomorrowQty} Litre${currentTomorrowQty > 1 ? 's' : ''}`;
    if (tueQty) tueQty.textContent = `${currentTomorrowQty}L Scheduled`;
    if (nextDropBanner) nextDropBanner.textContent = `Tomorrow, 6:00 AM • ${currentTomorrowQty}L Raw A2 Cow Milk`;

    if (dashQty && dashQtyPlus && dashQtyMinus) {
      dashQtyPlus.addEventListener('click', (e) => {
        e.preventDefault();
        currentTomorrowQty += 1;
        dashQty.textContent = `${currentTomorrowQty} Litre${currentTomorrowQty > 1 ? 's' : ''}`;
        if (tueQty) tueQty.textContent = `${currentTomorrowQty}L Scheduled`;
        if (nextDropBanner) nextDropBanner.textContent = `Tomorrow, 6:00 AM • ${currentTomorrowQty}L Raw A2 Cow Milk`;
        showToast('Quantity Updated', `Daily morning quota updated to ${currentTomorrowQty}L`, 'success');
      });

      dashQtyMinus.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentTomorrowQty > 1) {
          currentTomorrowQty -= 1;
          dashQty.textContent = `${currentTomorrowQty} Litre${currentTomorrowQty > 1 ? 's' : ''}`;
          if (tueQty) tueQty.textContent = `${currentTomorrowQty}L Scheduled`;
          if (nextDropBanner) nextDropBanner.textContent = `Tomorrow, 6:00 AM • ${currentTomorrowQty}L Raw A2 Cow Milk`;
          showToast('Quantity Updated', `Daily morning quota updated to ${currentTomorrowQty}L`, 'success');
        } else {
          showToast('Minimum Quota', 'Minimum quota is 1 Litre per delivery day.', 'info');
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // Coming Soon Countdown Timer
  // --------------------------------------------------------------------------
  function initCountdown() {
    const daysEl = document.getElementById('countdownDays');
    const hoursEl = document.getElementById('countdownHours');
    const minutesEl = document.getElementById('countdownMinutes');
    const secondsEl = document.getElementById('countdownSeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Target 45 days from now
    const targetDate = new Date().getTime() + (45 * 24 * 60 * 60 * 1000);

    function update() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) return;

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = d < 10 ? '0' + d : d;
      hoursEl.textContent = h < 10 ? '0' + h : h;
      minutesEl.textContent = m < 10 ? '0' + m : m;
      secondsEl.textContent = s < 10 ? '0' + s : s;
    }

    update();
    setInterval(update, 1000);
  }

  // --------------------------------------------------------------------------
  // Blog Filter & Search
  // --------------------------------------------------------------------------
  function initBlogFilter() {
    const searchInput = document.getElementById('blogSearchInput');
    const categoryBtns = document.querySelectorAll('.blog-cat-btn');
    const blogCards = document.querySelectorAll('.blog-post-card');

    if (!blogCards.length) return;

    function applyFilter() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      let activeCat = 'all';
      const activeBtn = document.querySelector('.blog-cat-btn.active');
      if (activeBtn) activeCat = activeBtn.getAttribute('data-category');

      blogCards.forEach(card => {
        const title = (card.querySelector('.blog-post-title') || {}).textContent || '';
        const cat = card.getAttribute('data-category') || '';
        const matchesQuery = !query || title.toLowerCase().includes(query);
        const matchesCat = activeCat === 'all' || cat === activeCat;

        if (matchesQuery && matchesCat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => {
          b.classList.remove('active', 'bg-blue-600', 'text-white');
          b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        });
        btn.classList.add('active', 'bg-blue-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        applyFilter();
      });
    });
  }

  // --------------------------------------------------------------------------
  // Dynamic Blog Details Engine
  // --------------------------------------------------------------------------
  const BLOG_ARTICLES = {
    'glass-bottles': {
      title: 'Why Glass Bottles & Cold-Chain Milk Are Healthier Than Plastic Pouches',
      breadcrumb: 'Glass Bottles vs Plastic Pouches',
      category: 'Sustainability & Pure Packaging',
      categoryClass: 'bg-blue-800 text-blue-300 border-blue-700',
      date: 'Sep 04, 2026',
      readTime: '5 Min Read',
      author: {
        name: 'Dr. Sarah Jenkins',
        role: 'Chief Veterinary Officer & Food Scientist',
        bio: 'Specializes in dairy biochemistry, pasture livestock welfare, and non-toxic cold supply chains.',
        img: 'assets/images/team/dr-sarah-jenkins.jpg'
      },
      heroImg: 'assets/images/blog/blog1-glass-bottles.jpg',
      heroAlt: 'Fresh farm milk in reusable glass bottles organized in cold storage',
      bodyHtml: `
        <p class="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          Every day, millions of households unthinkingly slit open plastic milk pouches or pour milk from poly-coated cartons. While plastic pouches have been the convenient backbone of commercial dairy distribution for decades, recent biochemical research reveals how much harm they cause to both nutritional integrity and human endocrine health.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">1. The Problem of Chemical Leaching in Fatty Liquids</h2>
        <p>
          Milk is an emulsion containing active fats and natural lactic acids. Unlike cold tap water, lipids (fats) act as natural organic solvents that aggressively extract plasticizers, phthalates, and microplastics from low-density polyethylene (LDPE) packaging.
        </p>
        <p>
          When pouches sit in hot delivery crates under direct sunlight at 30°C to 38°C during transit, chemical transfer spikes exponentially. These endocrine-disrupting chemicals mimic estrogen in the human bloodstream, which pediatricians increasingly associate with early hormonal imbalances in growing children.
        </p>
        <div class="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 text-blue-900 dark:text-blue-200 my-6">
          <h4 class="font-extrabold text-sm mb-1"><i class="fa-solid fa-quote-left mr-2 text-blue-500"></i> Glass is 100% Non-Reactive & Food-Inert</h4>
          <p class="text-xs leading-relaxed">
            Lead-free borosilicate and flint glass contains zero endocrine disruptors, zero BPA, and zero microplastics. It does not interact with the milk fatty acids, ensuring the milk you sip tastes exactly as clean as when it was drawn from the cow.
          </p>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">2. Cold Retention: The 4°C Temperature Barrier</h2>
        <p>
          Plastic is an insulator with poor thermal conductivity. When you place a plastic pouch into your refrigerator, it takes up to 4 hours for the core milk to reach 4°C. In contrast, high-density glass bottles conduct ambient cold rapidly, chilling milk to the center in less than 45 minutes. This rapid chill halts bacteria propagation without requiring harsh high-heat chemical treatments.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">3. The 50-Bottle Circular Environmental Pledge</h2>
        <p>
          A typical urban family of four consumes 60 plastic pouches of milk each month — generating over 720 non-biodegradable pouches annually. Due to milk residue and fatty stains, over 80% of milk pouches are rejected by municipal recyclers and end up in landfills.
        </p>
        <p>
          At Daily Product, our sterilized glass bottles are cycled more than 50 times before being melted down and recast. By joining our glass bottle swap program, one household eliminates over 700 plastic packets from municipal dumps every single year.
        </p>
      `
    },
    'a2-milk': {
      title: 'The Science of A2 Beta-Casein: Why It Feels So Much Lighter On The Gut',
      breadcrumb: 'Science of A2 Beta-Casein',
      category: 'Dairy Health & Gut Digestion',
      categoryClass: 'bg-blue-800 text-blue-300 border-blue-700',
      date: 'Aug 28, 2026',
      readTime: '6 Min Read',
      author: {
        name: 'Dr. Sarah Jenkins',
        role: 'Biochemist & Dairy Nutrition Specialist',
        bio: 'Has spent 15 years researching bovine genetics and the impact of pure A2 beta-casein proteins on digestive comfort.',
        img: 'assets/images/team/dr-sarah-jenkins.jpg'
      },
      heroImg: 'assets/images/blog/blog2-desi-cow.jpg',
      heroAlt: 'Pure Desi Gir cow grazing in lush green organic pasture for A2 milk',
      bodyHtml: `
        <p class="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          Millions of adults and children report feeling heavy, bloated, or fatigued after drinking conventional cow milk, usually assuming they have developed lactose intolerance. However, clinical gastroenterology studies indicate that in up to 70% of self-diagnosed cases, milk sugar (lactose) is completely innocent. The real culprit is the inflammatory A1 beta-casein protein produced by modern hybridized cattle.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">1. The 67th Amino Acid: How A1 Differs From Pure A2</h2>
        <p>
          Beta-casein is a chain of 209 amino acids that forms the primary protein in cow milk. In original ancestral breeds, position 67 of this chain is held by the amino acid <strong>Proline</strong>. Proline binds tightly to neighboring amino acids, forming a stable, resilient peptide bond.
        </p>
        <p>
          Thousands of years ago, a genetic mutation occurred in European Holstein-Friesian herds, replacing Proline with <strong>Histidine</strong> at position 67. This mutated variant is known as A1 milk.
        </p>
        <div class="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 text-blue-900 dark:text-blue-200 my-6">
          <h4 class="font-extrabold text-sm mb-1"><i class="fa-solid fa-dna mr-2 text-blue-500"></i> What is BCM-7 (Beta-Casomorphin-7)?</h4>
          <p class="text-xs leading-relaxed">
            Because Histidine does not hold the chain tightly, human digestive enzymes easily cleave the protein right at position 67, liberating an opioid peptide called <strong>BCM-7</strong>. BCM-7 attaches to receptors in the digestive tract, slowing intestinal transit, provoking histamine releases, and causing systemic micro-inflammation.
          </p>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">2. Pure Ancestral Desi Breeds: Gir, Sahiwal, and Rathi</h2>
        <p>
          Indigenous Indian humped cattle (Bos indicus), including purebred Gir and Sahiwal cows, never underwent the A1 mutation. Their milk contains 100% pure A2 beta-casein. During human digestion, enzymes cannot sever the tight Proline bond, meaning BCM-7 is never released. The milk passes through the gut smoothly, without triggering post-meal heaviness or mucus buildup.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">3. How to Transition Your Gut to Pure A2 Milk</h2>
        <p>
          If your family has avoided dairy for years, transitioning back to fresh A2 milk is straightforward:
        </p>
        <ul class="list-disc pl-6 space-y-2 mt-3 text-xs sm:text-sm">
          <li><strong>Start with Warm Cups:</strong> Begin with 150ml of warm A2 milk infused with a pinch of turmeric or crushed cardamom before bedtime.</li>
          <li><strong>Observe Over 7 Days:</strong> Most people notice zero bloating or gassiness within 48 hours compared to store-bought commercial cartons.</li>
          <li><strong>Whole Gut Harmony:</strong> Natural A2 milk supports the mucosal gut barrier, allowing you to enjoy cheese, paneer, and curd once again without digestive distress.</li>
        </ul>
      `
    },
    'vedic-ghee': {
      title: 'The Ancient Art of Vedic Bilona Ghee: Why Cultured Butter Makes All The Difference',
      breadcrumb: 'Ancient Art of Vedic Bilona Ghee',
      category: 'Artisanal Tradition & Ayurveda',
      categoryClass: 'bg-amber-800 text-amber-300 border-amber-700',
      date: 'Aug 19, 2026',
      readTime: '4 Min Read',
      author: {
        name: 'Rajesh Sharma',
        role: '3rd-Generation Bilona Ghee Artisan',
        bio: 'Preserves ancient Vedic dairy traditions and bilona churning methods passed down through three generations in Rajasthan and Gujarat.',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
      },
      heroImg: 'assets/images/blog/blog3-vedic-bilona.jpg',
      heroAlt: 'Traditional Vedic Bilona method showing cultured butter and golden ghee preparation',
      bodyHtml: `
        <p class="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          Walk into any grocery store today and you will find rows of yellow tins labeled "Pure Ghee". Yet almost 95% of commercially manufactured ghee is made through a rapid industrial shortcut: spinning raw cream in high-speed centrifuges and cooking the raw fat at high heat in steel cauldrons. In authentic Ayurvedic tradition, that is not ghee at all — it is merely clarified butterfat.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">1. The Sacred 5-Step Vedic Bilona Process</h2>
        <p>
          The word <em>Bilona</em> refers to the wooden two-way rope churn used in Indian households for centuries. Authentic Vedic Bilona Ghee requires 25 to 30 litres of pure A2 cow milk to yield just 1 single litre of golden ghee:
        </p>
        <ol class="list-decimal pl-6 space-y-2 mt-3 text-xs sm:text-sm">
          <li><strong>Clay Pot Simmering:</strong> Fresh A2 whole milk is gently simmered over cow-dung embers in earthenware pots to preserve delicate nutrients.</li>
          <li><strong>Culturing into Dahi:</strong> The cooled milk is inoculated with natural starter culture and left undisturbed overnight to ferment into full-fat curd.</li>
          <li><strong>Two-Way Bilona Churning:</strong> Early in the morning, the curd is churned clockwise and counter-clockwise using a grooved wooden churn, separating cultured butter (Makhan) from buttermilk (Chaas).</li>
          <li><strong>Washing & Cleansing:</strong> The Makhan is washed in cold spring water to remove all traces of acidic buttermilk whey.</li>
          <li><strong>Slow Fire Clarification:</strong> The cultured butter is gently melted over low firewood flame until milk solids caramelize, leaving behind luminous amber liquid that crystallizes upon cooling.</li>
        </ol>
        <div class="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-600 text-amber-900 dark:text-amber-200 my-6">
          <h4 class="font-extrabold text-sm mb-1"><i class="fa-solid fa-sparkles mr-2 text-amber-500"></i> Why Danedar (Granular) Texture Matters</h4>
          <p class="text-xs leading-relaxed">
            Notice how commercial ghee looks flat and waxy like palm oil? Genuine Bilona ghee cools into distinctive grainy golden granules (Danedar). These granules are proof of unhurried, low-temperature crystallization of complex triglycerides and natural Vitamin K2.
          </p>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">2. Butyric Acid: The Superfuel for Your Colon</h2>
        <p>
          The microbial fermentation step is what makes Bilona ghee miraculous. Fermentation converts milk sugars into short-chain fatty acids, primarily <strong>Butyrate</strong>. Butyric acid feeds the cells lining your colon walls, combats leaky gut syndrome, reduces systemic inflammation, and assists in the assimilation of fat-soluble vitamins (A, D, E, and K2).
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">3. Cooking with Bilona Ghee: High Smoke Point</h2>
        <p>
          With all milk proteins and water removed, pure Bilona ghee has a remarkable smoke point of <strong>250°C (485°F)</strong>. It will not burn, smoke, or form carcinogenic free radicals during frying, making it far superior to vegetable seed oils for seasoning dals, roasting vegetables, or baking.
        </p>
      `
    },
    'cold-chain': {
      title: 'How Cold-Chain Sensors Maintain 3.8°C From Milking Machine to Your Porch Bag',
      breadcrumb: 'Cold-Chain IoT Telemetry',
      category: 'Cold-Chain & Farm Technology',
      categoryClass: 'bg-indigo-800 text-indigo-300 border-indigo-700',
      date: 'Aug 11, 2026',
      readTime: '5 Min Read',
      author: {
        name: 'Vikram Malhotra',
        role: 'Head of Cold Chain Logistics & IoT Systems',
        bio: 'Former cold-chain telemetry engineer designing electric refrigerated delivery fleets and continuous IoT thermal tracking networks.',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
      },
      heroImg: 'assets/images/blog/blog4-cold-chain-van.jpg',
      heroAlt: 'Refrigerated milk delivery vehicle with temperature-controlled cold storage compartment',
      bodyHtml: `
        <p class="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          Fresh, unpasteurized farm milk is a living food teeming with natural digestive enzymes and delicate immunoglobulins. However, milk leaves the cow at 37°C — the exact temperature at which environmental bacteria multiply exponentially. Without an unbroken cold-chain, a single hour of thermal delay ruins sweetness and purity. Here is how our IoT cold-chain guarantees 3.8°C from farm to porch.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">1. Rapid Plate Chilling: 37°C to 3.8°C in 90 Seconds</h2>
        <p>
          Most conventional dairy setups pump warm milk into large collection vats where it slowly cools over 3 to 4 hours. By the time it chills, bacteria have already doubled multiple times, requiring the dairy to heavily pasteurize or add chemical neutralizers.
        </p>
        <p>
          At Daily Product, our cows are milked via pneumatic closed vacuum lines. Within 3 minutes of milking, the liquid passes through a sanitary stainless steel Plate Heat Exchanger (PHE). Chilled propylene glycol cools the milk from 37°C down to exactly 3.8°C in under 90 seconds, arresting bacterial activity instantly while preserving living enzymes intact.
        </p>
        <div class="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-l-4 border-indigo-600 text-indigo-900 dark:text-indigo-200 my-6">
          <h4 class="font-extrabold text-sm mb-1"><i class="fa-solid fa-satellite-dish mr-2 text-indigo-500"></i> Continuous IoT Van Telemetry</h4>
          <p class="text-xs leading-relaxed">
            Every custom electric delivery van in our fleet is equipped with Bluetooth-enabled thermal sensors. The internal cargo temperature is beamed to our central operations dashboard every 15 seconds. If cargo temperature rises above 4.5°C, the dispatch team is alerted instantly to resolve the route.
          </p>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">2. The Doorstep Cooler Bag Defense</h2>
        <p>
          What happens between the time our rider hangs your bottles at 6:00 AM and when you wake up at 7:30 AM? Every subscriber receives an insulated multi-layer foil porch cooler bag with refreezable eutectic gel packs. When the morning rider places chilled glass bottles inside the sealed bag, the interior temperature remains below 5°C for up to 4 hours, even during hot summer mornings.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">3. Zero Chemical Preservatives Needed</h2>
        <p>
          Because our cold-chain is continuous, we never need to add caustic soda, hydrogen peroxide, or artificial stabilizers to preserve milk sweetness. You taste pure, raw farm milk exactly as nature intended.
        </p>
      `
    },
    'soft-paneer': {
      title: 'The Science of Sponge-Soft Paneer: Curdling Temperatures & Whey Retention',
      breadcrumb: 'Making Sponge-Soft Paneer',
      category: 'Cooking Guide & Artisanal Dairy',
      categoryClass: 'bg-amber-800 text-amber-300 border-amber-700',
      date: 'Jul 30, 2026',
      readTime: '4 Min Read',
      author: {
        name: 'Chef Anita Roy',
        role: 'Culinary Consultant & Dairy Sommelier',
        bio: 'Culinary instructor specializing in farm-to-table dairy cookery, artisanal cheese making, and traditional regional gastronomy.',
        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
      },
      heroImg: 'assets/images/blog/blog5-handmade-paneer.jpg',
      heroAlt: 'Freshly handmade soft paneer curds and sliced cubes prepared in clean dairy kitchen',
      bodyHtml: `
        <p class="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          Almost everyone who loves Indian and Mediterranean cooking has experienced the disappointment of rubbery, dry commercial paneer. Commercial blocks bought from supermarket chillers frequently turn chewy like pencil erasers when pan-fried, or crumble into chalky grain when simmered in gravies. But real artisanal paneer should be delicate, velvety, and soft enough to slice with a butter knife.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">1. The Golden Curdling Rule: Exactly 82°C</h2>
        <p>
          The most common home kitchen mistake is adding lemon juice or vinegar directly into vigorously boiling milk (100°C). When milk boils violently, rapid heat denatures casein protein fibers into tight, unyielding knots.
        </p>
        <p>
          The secret to sponge-like tenderness is to bring whole milk to a boil, turn off the flame, and let it rest for 4 minutes until the temperature subsides to <strong>80°C to 82°C</strong>. At this exact threshold, the casein proteins precipitate into soft, delicate curds that trap moisture rather than expelling it.
        </p>
        <div class="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-600 text-amber-900 dark:text-amber-200 my-6">
          <h4 class="font-extrabold text-sm mb-1"><i class="fa-solid fa-lemon mr-2 text-amber-500"></i> Natural Lemon Whey vs. Chemical Vinegar</h4>
          <p class="text-xs leading-relaxed">
            Industrial factories use concentrated glacial acetic acid to curdle milk in seconds, which leaves a lingering sour synthetic note. In our farm kitchen, we use fresh lemon juice diluted with an equal amount of warm water, producing sweet, pristine curds with zero acidity.
          </p>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">2. Gentle Gravity Pressing vs. Hydraulic Pressure</h2>
        <p>
          Factory machines apply heavy hydraulic pressure to extract maximum whey, making the cheese dry and dense so it holds up for 45 days in plastic vacuum packs. Artisanal paneer requires only gentle gravity hanging in fine muslin cloth for 25 minutes, followed by a light 2kg weight for 40 minutes. This retains 55% healthy whey moisture inside the matrix.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">3. The 10-Minute Warm Salt Water Soak</h2>
        <p>
          After cutting your fresh paneer block into cubes, soak them in a bowl of warm water seasoned with a pinch of sea salt for 10 minutes. The osmotic pressure expands the protein matrix, ensuring the cubes remain wonderfully tender and absorb gravies like little culinary sponges.
        </p>
      `
    },
    'lab-certificates': {
      title: 'Deciphering Daily Milk Certificates: What Do Fat %, SNF, and MBRT Mean?',
      breadcrumb: 'Deciphering Milk Quality Certificates',
      category: 'Lab Standards & Transparency',
      categoryClass: 'bg-blue-800 text-blue-300 border-blue-700',
      date: 'Jul 22, 2026',
      readTime: '7 Min Read',
      author: {
        name: 'David Chen, M.Sc.',
        role: 'Chief Food Chemist & Lab Quality Director',
        bio: 'Head of microbiology and chemical purity testing at Daily Product, ensuring compliance with global dairy safety and microbiological standards.',
        img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80'
      },
      heroImg: 'assets/images/blog/blog6-dairy-lab.jpg',
      heroAlt: 'Professional dairy laboratory quality testing of milk samples and purity analysis',
      bodyHtml: `
        <p class="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          Every morning at 5:00 AM, before our refrigerated delivery fleet rolls out, our quality control lab tests sample vials from every single milking batch. The full microbiological and biochemical test certificate is published directly to your subscriber dashboard. But what do metrics like 4.32% Fat, 8.95% SNF, and Negative Adulterants actually mean for your morning cup? Here is your plain-English guide.
        </p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">1. Fat Percentage: Whole Cream vs. Standardized Milk</h2>
        <p>
          Commercial milk is typically "standardized" by stripping all natural cream in cream separators, then blending back just enough fat to meet minimum legal thresholds (typically 3.0% for toned milk).
        </p>
        <p>
          At Daily Product, our milk is <strong>unstandardized whole milk</strong>. The fat percentage naturally hovers between <strong>4.1% and 4.6%</strong> depending on whether our pasture cows grazed on fresh clover or sweet sorghum. When you boil this milk at home, a generous, golden cream layer (malai) naturally rises to the surface.
        </p>
        <div class="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 text-blue-900 dark:text-blue-200 my-6">
          <h4 class="font-extrabold text-sm mb-1"><i class="fa-solid fa-flask-vial mr-2 text-blue-500"></i> Understanding SNF (Solids-Not-Fat)</h4>
          <p class="text-xs leading-relaxed">
            SNF represents all the nutritious solid matter in milk other than fat: pure proteins (casein and whey), essential minerals (calcium, phosphorus, potassium, magnesium), and natural lactose. Our average SNF score is <strong>8.95%</strong> (well above the mandatory 8.5% standard), verifying that the milk is 100% thick, whole, and never diluted with water.
          </p>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">2. Adulterant Screen: The Zero-Tolerance Checklist</h2>
        <p>
          Every dawn batch undergoes automated chemical strip tests and FTIR spectrometry to screen for harmful adulterants commonly found in unorganized dairy supply chains:
        </p>
        <ul class="list-disc pl-6 space-y-2 mt-3 text-xs sm:text-sm">
          <li><strong>Starch & Maltodextrin:</strong> Used by dishonest vendors to falsely boost SNF density. Result: <em>Zero (Negative)</em>.</li>
          <li><strong>Detergents & Urea:</strong> Added artificially to create fake foam and increase nitrogen content. Result: <em>Zero (Negative)</em>.</li>
          <li><strong>Synthetic Neutralizers:</strong> Caustic soda used to mask souring. Result: <em>Zero (Negative)</em>.</li>
        </ul>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-8">3. The MBRT Score: The Gold Standard of Freshness</h2>
        <p>
          The Methylene Blue Reduction Test (MBRT) measures how long dye stays blue in a warm milk sample. The cleaner the milking parlor and the colder the cold-chain, the longer the blue color lasts. Commercial dairy collection routes often average an MBRT score of 2 to 3 hours. Our milk routinely achieves <strong>over 5.5 hours</strong>, proving hospital-grade hygiene at our milking stations.
        </p>
      `
    }
  };

  function renderArticle(articleId) {
    const article = BLOG_ARTICLES[articleId] || BLOG_ARTICLES['glass-bottles'];
    if (!article) return;

    const crumb = document.getElementById('detailBreadcrumbCurrent');
    const catBadge = document.getElementById('detailCategoryBadge');
    const title = document.getElementById('detailTitle');
    const authorTopImg = document.getElementById('detailAuthorTopImg');
    const authorTopName = document.getElementById('detailAuthorTopName');
    const pubDate = document.getElementById('detailPublishedDate');
    const readTime = document.getElementById('detailReadTime');
    const heroImg = document.getElementById('detailHeroImg');
    const body = document.getElementById('detailArticleBody');
    const authorCard = document.getElementById('detailAuthorBioCard');
    const relatedContainer = document.getElementById('detailRelatedArticles');

    if (crumb) crumb.textContent = article.breadcrumb;
    if (catBadge) {
      catBadge.textContent = article.category;
      catBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ' + article.categoryClass;
    }
    if (title) title.textContent = article.title;
    if (authorTopImg) {
      authorTopImg.src = article.author.img;
      authorTopImg.alt = article.author.name;
    }
    if (authorTopName) authorTopName.textContent = article.author.name;
    if (pubDate) pubDate.textContent = 'Published ' + article.date;
    if (readTime) readTime.textContent = article.readTime;
    if (heroImg) {
      heroImg.src = article.heroImg;
      heroImg.alt = article.heroAlt;
    }
    if (body) body.innerHTML = article.bodyHtml;

    if (authorCard) {
      authorCard.innerHTML = `
        <img src="${article.author.img}" alt="${article.author.name}" class="w-16 h-16 rounded-full object-cover border-2 border-blue-500 flex-shrink-0" style="border-radius: 50%;" />
        <div>
          <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">Written by ${article.author.name}</h4>
          <p class="text-xs text-blue-600 dark:text-blue-400 font-semibold">${article.author.role}</p>
          <p class="text-xs text-slate-500 mt-1">${article.author.bio}</p>
        </div>
      `;
    }

    if (relatedContainer) {
      const otherKeys = Object.keys(BLOG_ARTICLES).filter(k => k !== articleId);
      relatedContainer.innerHTML = otherKeys.slice(0, 3).map(key => {
        const item = BLOG_ARTICLES[key];
        return `
          <a href="blog-details.html?id=${key}" class="flex gap-3 group related-post-link" data-id="${key}">
            <img src="${item.heroImg}" alt="${item.heroAlt}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition leading-snug">${item.title}</h4>
              <span class="text-[10px] text-slate-400">${item.date}</span>
            </div>
          </a>
        `;
      }).join('');

      relatedContainer.querySelectorAll('.related-post-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('data-id');
          history.pushState(null, '', '?id=' + targetId);
          renderArticle(targetId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }

    document.title = `${article.title} | Daily Product Dairy Farm`;
  }

  function initBlogDetails() {
    if (!document.getElementById('detailArticleBody')) return;

    function loadFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('id') || 'glass-bottles';
      renderArticle(articleId);
    }

    loadFromUrl();
    window.addEventListener('popstate', loadFromUrl);
  }

  function initBlogCommentForm() {
    const form = document.getElementById('blogCommentForm');
    const submitBtn = document.getElementById('commentSubmitBtn');
    const nameInput = document.getElementById('commentAuthorName');
    const emailInput = document.getElementById('commentAuthorEmail');
    const contentInput = document.getElementById('commentContent');
    const commentsList = document.getElementById('blogCommentsList');
    const successAlert = document.getElementById('commentSuccessAlert');
    const commentCount = document.getElementById('commentCount');

    // Event delegation for deleting comments
    if (commentsList && !commentsList.dataset.deleteBound) {
      commentsList.dataset.deleteBound = 'true';
      commentsList.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-comment-btn');
        if (!deleteBtn) return;
        
        const commentCard = deleteBtn.closest('.comment-card-item');
        if (!commentCard) return;

        // Smooth fade out and collapse
        commentCard.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        commentCard.style.opacity = '0';
        commentCard.style.transform = 'scale(0.95) translateY(-8px)';
        commentCard.style.pointerEvents = 'none';

        setTimeout(() => {
          commentCard.remove();
          if (commentCount) {
            const current = parseInt(commentCount.textContent) || 0;
            commentCount.textContent = Math.max(0, current - 1);
          }
          showToast('Comment Deleted', 'Your comment has been removed.', 'info');
        }, 300);
      });
    }

    if (!form || form.dataset.bound) return;
    form.dataset.bound = 'true';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (nameInput && nameInput.value.trim()) || 'Guest Reader';
      const comment = (contentInput && contentInput.value.trim()) || '';
      if (!comment) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Posting...</span>';
      }

      setTimeout(() => {
        if (commentsList) {
          const initial = name.charAt(0).toUpperCase() || 'U';
          const newComment = document.createElement('div');
          newComment.className = 'comment-card-item p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-2 transition-all duration-300';
          newComment.innerHTML = `
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  ${initial}
                </div>
                <div>
                  <span class="font-bold text-xs text-slate-900 dark:text-white">${name}</span>
                  <span class="ml-1.5 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">You</span>
                  <span class="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold">Verified Comment</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Just now</span>
                <button type="button" class="delete-comment-btn px-2 py-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition text-xs flex items-center gap-1 group/del" title="Delete your comment" aria-label="Delete comment">
                  <i class="fa-solid fa-trash-can text-slate-400 group-hover/del:text-rose-500 transition text-[11px]"></i>
                  <span class="text-[10px] font-bold text-slate-400 group-hover/del:text-rose-500 transition">Delete</span>
                </button>
              </div>
            </div>
            <p class="text-xs text-slate-700 dark:text-slate-200 pl-10 leading-relaxed whitespace-pre-wrap">
              ${comment}
            </p>
          `;
          commentsList.prepend(newComment);

          if (commentCount) {
            const current = parseInt(commentCount.textContent) || 0;
            commentCount.textContent = current + 1;
          }
        }

        if (successAlert) {
          successAlert.classList.remove('hidden');
        }

        showToast('Comment Published!', 'Thank you! Your comment is now live on this article.', 'success');
        form.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Submit Comment</span>';
        }
      }, 400);
    });
  }

  function initBlogNewsletterForm() {
    const form = document.getElementById('blogNewsletterForm');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = 'true';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
      }
      setTimeout(() => {
        form.reset();
        showToast('Guide Sent!', 'Check your inbox for the 2026 Raw Milk & Gut Vitality Guide PDF.', 'success');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = 'Download PDF Free';
        }
      }, 500);
    });
  }

  // --------------------------------------------------------------------------
  // DOM Ready Initialization
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initMobileMenu();
    initStickyNavbar();
    initPincodeChecker();
    initAccordions();
    initProductsFilter();
    initSubscriptionCalculator();
    initRegistrationPlan();
    initDashboard();
    initCountdown();
    initBlogFilter();
    initBlogDetails();
    initBlogCommentForm();
    initBlogNewsletterForm();
    initServiceDetailsSubscription();
    initSubscriptionCardsSelection();
    initContactForm();
  });

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initFixedHeader();
    initSubscriptionCardsSelection();
    initContactForm();
    initBlogCommentForm();
    initBlogNewsletterForm();
  }

})();


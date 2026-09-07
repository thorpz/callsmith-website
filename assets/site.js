(function(){
  // Sticky header shadow
  var header = document.getElementById('site-header');
  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(header) header.classList.toggle('scrolled', y > 8);
    if(backToTop) backToTop.classList.toggle('show', y > 500);
  });
  if(backToTop){
    backToTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  // Feature cards — collapsible on mobile only (CSS gates the visual effect)
  document.querySelectorAll('.feature-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var card = btn.closest('.feature-card');
      if(!card) return;
      var isOpen = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Mobile menu
  var burger = document.getElementById('burgerBtn');
  var panel = document.getElementById('mobilePanel');
  function closeMenu(){
    if(!burger || !panel) return;
    burger.classList.remove('open');
    panel.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  }
  if(burger && panel){
    burger.addEventListener('click', function(){
      var open = panel.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true':'false');
      document.body.style.overflow = open ? 'hidden':'';
    });
    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
  }

  // Trade marquee content
  var track = document.getElementById('marqueeTrack');
  if(track){
    var trades = [
      {name:'Electricians', icon:'<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>'},
      {name:'Plumbers', icon:'<path d="M9 3h6v4H9zM9 7v4a3 3 0 0 0 3 3 3 3 0 0 0 3-3V7M12 14v7"/>'},
      {name:'HVAC Technicians', icon:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/>'},
      {name:'Roofers', icon:'<path d="M3 12L12 4l9 8M5 10v10h14V10"/>'},
      {name:'Landscapers', icon:'<path d="M12 22V12M12 12a5 5 0 1 1 5-5c0 3-5 5-5 5zM12 12a5 5 0 1 0-5-5c0 3 5 5 5 5z"/>'},
      {name:'Carpenters', icon:'<path d="M3 21l7-7M21 3l-7 7M14 3l7 7-3.5 3.5L10 6zM3 21l3.5-3.5"/>'},
      {name:'Locksmiths', icon:'<circle cx="12" cy="8" r="5"/><path d="M12 13v8M9 18h6"/>'},
      {name:'Pest Control', icon:'<circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>'}
    ];
    function chip(t){
      return '<div class="trade-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+t.icon+'</svg>'+t.name+'</div>';
    }
    var html = trades.map(chip).join('');
    track.innerHTML = html + html; // duplicate for seamless loop
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(function(el){ io.observe(el); });
  }

  // Stat count-up
  var statEls = document.querySelectorAll('.stat-item .num[data-count]');
  var statsBand = document.querySelector('.stats-band');
  if(statEls.length && statsBand){
    var counted = false;
    var statIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !counted){
          counted = true;
          statEls.forEach(function(el){
            var target = parseFloat(el.getAttribute('data-count'));
            var suffix = el.getAttribute('data-suffix') || '';
            var start = performance.now();
            var duration = 1200;
            function step(now){
              var progress = Math.min((now-start)/duration, 1);
              var eased = 1 - Math.pow(1-progress, 3);
              var val = Math.round(target*eased);
              el.textContent = val + suffix;
              if(progress < 1) requestAnimationFrame(step);
              else el.textContent = target + suffix;
            }
            requestAnimationFrame(step);
          });
        }
      });
    }, {threshold:0.4});
    statIo.observe(statsBand);
  }

  // FAQ: only one open at a time (per accordion group)
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    item.addEventListener('toggle', function(){
      if(item.open){
        var group = item.closest('.faq-list');
        var scope = group ? group.querySelectorAll('.faq-item') : faqItems;
        scope.forEach(function(other){
          if(other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  // Pricing billing toggle
  var toggle = document.getElementById('billingToggle');
  if(toggle){
    var labelMonthly = document.getElementById('labelMonthly');
    var labelYearly = document.getElementById('labelYearly');
    var amounts = document.querySelectorAll('.price-amount .amt, .compare-amt');
    var yearly = false;
    toggle.addEventListener('click', function(){
      yearly = !yearly;
      toggle.classList.toggle('on', yearly);
      if(labelMonthly) labelMonthly.classList.toggle('active', !yearly);
      if(labelYearly) labelYearly.classList.toggle('active', yearly);
      amounts.forEach(function(el){
        var val = yearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
        if(val) el.textContent = '$' + val;
      });
    });
  }

  // Modal (Book a demo)
  var overlay = document.getElementById('modalOverlay');
  var openers = document.querySelectorAll('[data-open-modal]');
  if(overlay && openers.length){
    var modalClose = document.getElementById('modalClose');
    var formWrap = document.getElementById('formWrap');
    var formSuccess = document.getElementById('formSuccess');
    function openModal(){
      overlay.classList.add('open');
      document.body.style.overflow='hidden';
    }
    function closeModal(){
      overlay.classList.remove('open');
      document.body.style.overflow='';
      setTimeout(function(){
        if(formWrap) formWrap.style.display='';
        if(formSuccess) formSuccess.classList.remove('show');
      }, 200);
    }
    openers.forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        closeMenu();
        openModal();
      });
    });
    if(modalClose) modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
    var demoForm = document.getElementById('demoForm');
    if(demoForm){
      demoForm.addEventListener('submit', function(e){
        e.preventDefault();
        if(formWrap) formWrap.style.display='none';
        if(formSuccess) formSuccess.classList.add('show');
      });
    }
    var closeSuccess = document.getElementById('closeSuccess');
    if(closeSuccess) closeSuccess.addEventListener('click', closeModal);
  }

  // Live call widget (homepage phone mockup) — front-end only for now.
  // TODO integration: when the Retell (or other) calling backend is ready, trigger the
  // real call where noted below, e.g.:
  //   fetch('/api/trigger-call', {
  //     method: 'POST',
  //     headers: {'Content-Type':'application/json'},
  //     body: JSON.stringify({ phone: callPhone.value })
  //   }).then(res => res.ok ? goToConnected() : goToIdle());
  var phoneCallBtn = document.getElementById('phoneCallBtn');
  if(phoneCallBtn){
    var callPhone = document.getElementById('callPhone');
    var callAvatar = document.getElementById('callAvatar');
    var phoneIdle = document.getElementById('phoneIdle');
    var phoneCalling = document.getElementById('phoneCalling');
    var phoneConnected = document.getElementById('phoneConnected');
    var callingNumber = document.getElementById('callingNumber');
    var callTimer = document.getElementById('callTimer');
    var phoneCancelBtn = document.getElementById('phoneCancelBtn');
    var phoneHangupBtn = document.getElementById('phoneHangupBtn');

    var connectTimeout = null;
    var timerInterval = null;
    var elapsedSeconds = 0;

    function showState(el){
      [phoneIdle, phoneCalling, phoneConnected].forEach(function(s){
        s.hidden = (s !== el);
      });
    }

    function goToIdle(){
      clearTimeout(connectTimeout);
      clearInterval(timerInterval);
      elapsedSeconds = 0;
      callTimer.textContent = '00:00';
      callAvatar.classList.remove('pulsing');
      callPhone.value = '';
      showState(phoneIdle);
    }

    function goToConnected(){
      clearTimeout(connectTimeout);
      callAvatar.classList.remove('pulsing');
      showState(phoneConnected);
      elapsedSeconds = 0;
      timerInterval = setInterval(function(){
        elapsedSeconds++;
        var m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
        var s = String(elapsedSeconds % 60).padStart(2, '0');
        callTimer.textContent = m + ':' + s;
      }, 1000);
    }

    phoneCallBtn.addEventListener('click', function(){
      if(!callPhone.value.trim()){
        callPhone.focus();
        return;
      }
      callingNumber.textContent = callPhone.value.trim();
      callAvatar.classList.add('pulsing');
      showState(phoneCalling);

      // Simulated connect delay — swap for a real event from the calling backend later.
      connectTimeout = setTimeout(goToConnected, 2200);
    });

    if(phoneCancelBtn) phoneCancelBtn.addEventListener('click', goToIdle);
    if(phoneHangupBtn) phoneHangupBtn.addEventListener('click', goToIdle);
  }

  // Standalone contact form (contact.html): client-side placeholder
  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      var success = document.getElementById('contactSuccess');
      if(success){
        contactForm.style.display = 'none';
        success.classList.add('show');
      }
    });
  }

  // Newsletter (client-side placeholder, wire up to an email service before launch)
  var newsForm = document.getElementById('newsletterForm');
  if(newsForm){
    var newsNote = document.getElementById('newsletterNote');
    newsForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(newsNote) newsNote.textContent = "Thanks, you're on the list!";
      newsForm.reset();
    });
  }

  // Year
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
})();

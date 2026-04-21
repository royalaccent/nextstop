/* =========================================
   NEXTSTOP — Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  const qs  = (s, c=document) => c.querySelector(s);
  const qsa = (s, c=document) => [...c.querySelectorAll(s)];

  /* =========================================
     SERVICE TABS
     ========================================= */
  qsa('.search-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      qsa('.search-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      qsa('.search-panel').forEach(p =>
        p.classList.toggle('active', p.dataset.panel === tab.dataset.panel));
    });
  });

  /* =========================================
     OFFER TABS
     ========================================= */
  qsa('.offer-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      qsa('.offer-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      qsa('.deal-panel').forEach(p =>
        p.style.display = p.dataset.deals === tab.dataset.deals ? 'grid' : 'none');
    });
  });

  /* =========================================
     CITY PICKER MODAL
     ========================================= */
  const CITIES = [
    { name:'Accra',        code:'ACC', country:'Ghana',           icon:'🇬🇭' },
    { name:'Kumasi',       code:'KMS', country:'Ghana',           icon:'🇬🇭' },
    { name:'Lagos',        code:'LOS', country:'Nigeria',         icon:'🇳🇬' },
    { name:'Abuja',        code:'ABV', country:'Nigeria',         icon:'🇳🇬' },
    { name:'Nairobi',      code:'NBO', country:'Kenya',           icon:'🇰🇪' },
    { name:'Abidjan',      code:'ABJ', country:"Côte d'Ivoire",   icon:'🇨🇮' },
    { name:'Dakar',        code:'DKR', country:'Senegal',         icon:'🇸🇳' },
    { name:'London',       code:'LHR', country:'United Kingdom',  icon:'🇬🇧' },
    { name:'Manchester',   code:'MAN', country:'United Kingdom',  icon:'🇬🇧' },
    { name:'Dubai',        code:'DXB', country:'UAE',             icon:'🇦🇪' },
    { name:'New York',     code:'JFK', country:'USA',             icon:'🇺🇸' },
    { name:'Toronto',      code:'YYZ', country:'Canada',          icon:'🇨🇦' },
    { name:'Paris',        code:'CDG', country:'France',          icon:'🇫🇷' },
    { name:'Frankfurt',    code:'FRA', country:'Germany',         icon:'🇩🇪' },
    { name:'Amsterdam',    code:'AMS', country:'Netherlands',     icon:'🇳🇱' },
    { name:'Johannesburg', code:'JNB', country:'South Africa',    icon:'🇿🇦' },
    { name:'Addis Ababa',  code:'ADD', country:'Ethiopia',        icon:'🇪🇹' },
    { name:'Cairo',        code:'CAI', country:'Egypt',           icon:'🇪🇬' },
    { name:'Casablanca',   code:'CMN', country:'Morocco',         icon:'🇲🇦' },
    { name:'Istanbul',     code:'IST', country:'Turkey',          icon:'🇹🇷' },
  ];

  let activeField = null;
  const modal      = qs('#cityModal');
  const modalClose = qs('#modalClose');
  const citySearch = qs('#citySearch');
  const cityList   = qs('#cityList');
  const fromDisplay = qs('#fromCity');
  const toDisplay   = qs('#toCity');

  function renderCities(q = '') {
    const filtered = CITIES.filter(c =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.code.toLowerCase().includes(q.toLowerCase()) ||
      c.country.toLowerCase().includes(q.toLowerCase())
    );
    if (!cityList) return;
    cityList.innerHTML = filtered.map(c => `
      <div class="city-item" data-name="${c.name}" data-code="${c.code}">
        <span class="city-icon">${c.icon}</span>
        <div>
          <div class="city-item-name">${c.name} <span class="city-item-code">${c.code}</span></div>
          <div style="font-size:.74rem;color:var(--muted)">${c.country}</div>
        </div>
      </div>`).join('');
    qsa('.city-item', cityList).forEach(item => {
      item.addEventListener('click', () => {
        if (activeField === 'from') fromDisplay.textContent = item.dataset.name;
        else toDisplay.textContent = item.dataset.name;
        closeModal();
      });
    });
  }

  function openModal(field) {
    activeField = field; citySearch.value = ''; renderCities();
    modal.classList.add('open'); setTimeout(() => citySearch.focus(), 80);
  }
  function closeModal() { modal?.classList.remove('open'); }

  qs('#fromField')?.addEventListener('click', () => openModal('from'));
  qs('#toField')?.addEventListener('click',   () => openModal('to'));
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  citySearch?.addEventListener('input', e => renderCities(e.target.value));
  qs('#swapBtn')?.addEventListener('click', () => {
    if (!fromDisplay || !toDisplay) return;
    const tmp = fromDisplay.textContent;
    fromDisplay.textContent = toDisplay.textContent;
    toDisplay.textContent = tmp;
  });

  /* =========================================
     DATE PICKER
     ========================================= */
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WDAYS  = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  let dpTarget = null, selectedDep = null, selectedRet = null;
  let dpYear = new Date().getFullYear(), dpMonth = new Date().getMonth();

  function renderCal() {
    const title = qs('#dpTitle'), grid = qs('#dpGrid');
    if (!title || !grid) return;
    title.textContent = `${MONTHS[dpMonth]} ${dpYear}`;
    const first = new Date(dpYear, dpMonth, 1).getDay();
    const days  = new Date(dpYear, dpMonth + 1, 0).getDate();
    const today = new Date();
    let html = WDAYS.map(d => `<div class="dp-day-name">${d}</div>`).join('');
    for (let i = 0; i < first; i++) html += '<div></div>';
    for (let d = 1; d <= days; d++) {
      const dt   = new Date(dpYear, dpMonth, d);
      const past = dt < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const tod  = d === today.getDate() && dpMonth === today.getMonth() && dpYear === today.getFullYear();
      const sel  = (selectedDep && sameDay(dt, selectedDep)) || (selectedRet && sameDay(dt, selectedRet));
      html += `<div class="dp-day${past?' disabled':''}${tod?' today':''}${sel?' selected':''}" data-date="${dt.toISOString()}">${d}</div>`;
    }
    grid.innerHTML = html;
    qsa('.dp-day:not(.disabled)', grid).forEach(el => {
      el.addEventListener('click', () => {
        const d = new Date(el.dataset.date);
        if (dpTarget === 'dep') { selectedDep = d; updateDateField('depDate', 'depDay', d); }
        else { if (selectedDep && d < selectedDep) { showToast('Return must be after departure'); return; } selectedRet = d; updateDateField('retDate', 'retDay', d); }
        closeDatePanel(); renderCal();
      });
    });
  }

  function updateDateField(valId, subId, d) {
    const v = qs('#' + valId), s = qs('#' + subId);
    if (v) v.textContent = `${d.getDate()} ${d.toLocaleDateString('en-US', {month:'short'})}'${String(d.getFullYear()).slice(2)}`;
    if (s) s.textContent = d.toLocaleDateString('en-US', {weekday:'long'});
  }
  function sameDay(a, b) { return a.getDate()===b.getDate() && a.getMonth()===b.getMonth() && a.getFullYear()===b.getFullYear(); }
  function openDatePanel(target) { dpTarget = target; const p = qs('#datePanel'); if (!p) return; p.style.display = 'block'; p.classList.add('open'); renderCal(); }
  function closeDatePanel() { const p = qs('#datePanel'); if (p) { p.classList.remove('open'); setTimeout(() => p.style.display = 'none', 10); } }
  qs('#depDateField')?.addEventListener('click', e => { e.stopPropagation(); openDatePanel('dep'); });
  qs('#retDateField')?.addEventListener('click', e => { e.stopPropagation(); openDatePanel('ret'); });
  qs('#dpPrev')?.addEventListener('click', () => { dpMonth--; if (dpMonth < 0) { dpMonth = 11; dpYear--; } renderCal(); });
  qs('#dpNext')?.addEventListener('click', () => { dpMonth++; if (dpMonth > 11) { dpMonth = 0; dpYear++; } renderCal(); });
  document.addEventListener('click', e => {
    const dp = qs('#datePanel');
    if (dp && !dp.contains(e.target) && e.target !== qs('#depDateField') && e.target !== qs('#retDateField')) closeDatePanel();
  });

  /* =========================================
     PASSENGER COUNTER
     ========================================= */
  const paxField = qs('#passengerField'), paxPanel = qs('#passengerPanel');
  let passengers = {adults:1, children:0, infants:0};
  function updatePaxDisplay() {
    const t = passengers.adults + passengers.children + passengers.infants;
    const el = qs('#passengerCount'); if (el) el.textContent = `${t} Passenger${t !== 1 ? 's' : ''}`;
  }
  paxField?.addEventListener('click', e => {
    e.stopPropagation(); if (!paxPanel) return;
    paxPanel.classList.toggle('open');
    paxPanel.style.display = paxPanel.classList.contains('open') ? 'block' : 'none';
  });
  qsa('.pax-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.type, op = btn.dataset.op;
      if (op === '+') passengers[t]++;
      else { if (t === 'adults' && passengers[t] <= 1) return; if (passengers[t] <= 0) return; passengers[t]--; }
      const el = qs(`#pax-${t}`); if (el) el.textContent = passengers[t];
      updatePaxDisplay();
    });
  });
  document.addEventListener('click', e => {
    if (paxPanel && !paxPanel.contains(e.target) && e.target !== paxField) {
      paxPanel.classList.remove('open'); paxPanel.style.display = 'none';
    }
  });

  /* =========================================
     BOOKING ENQUIRY MODAL
     ========================================= */
  const bookingModal      = qs('#bookingModal');
  const bookingForm       = qs('#bookingForm');
  const bookingModalClose = qs('#bookingModalClose');

  function openBookingModal(opts = {}) {
    if (!bookingModal) return;
    // Set title
    const titleEl = qs('#bookingModalTitle');
    if (titleEl) titleEl.textContent = opts.title || '✈️ Book Your Trip';
    // Set hidden service type
    const serviceEl = qs('#bkService');
    if (serviceEl) serviceEl.value = opts.service || 'General Enquiry';
    // Pre-fill destination if provided
    const countryEl = qs('#bkCountry');
    if (countryEl && opts.destination) countryEl.value = opts.destination;
    // Pre-fill departure city if provided
    const fromEl = qs('#bkFrom');
    if (fromEl && opts.from) fromEl.value = opts.from;
    // Set min date to today and default departure to today if empty
    const today = new Date().toISOString().split('T')[0];
    const depEl = qs('#bkDep');
    if (depEl) { depEl.min = today; if (!depEl.value) depEl.value = today; }
    const retEl = qs('#bkRet');
    if (retEl) retEl.min = today;
    bookingModal.classList.add('open');
    setTimeout(() => qs('#bkName')?.focus(), 100);
  }

  function closeBookingModal() {
    bookingModal?.classList.remove('open');
  }

  bookingModalClose?.addEventListener('click', closeBookingModal);
  bookingModal?.addEventListener('click', e => { if (e.target === bookingModal) closeBookingModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBookingModal(); });

  bookingForm?.addEventListener('submit', e => {
    e.preventDefault();
    const service  = qs('#bkService')?.value?.trim()  || 'General Enquiry';
    const from     = qs('#bkFrom')?.value?.trim()     || 'Not specified';
    const country  = qs('#bkCountry')?.value?.trim();
    const dep      = qs('#bkDep')?.value;
    const ret      = qs('#bkRet')?.value;
    const pax      = qs('#bkPax')?.value              || '1';
    const transit  = qs('#bkTransit')?.value          || 'Not sure';
    const name     = qs('#bkName')?.value?.trim();
    const email    = qs('#bkEmail')?.value?.trim();
    const phone    = qs('#bkPhone')?.value?.trim();
    const notes    = qs('#bkNotes')?.value?.trim();

    // Validation
    if (!country) { showToast('⚠️ Please enter your destination country'); qs('#bkCountry')?.focus(); return; }
    if (!dep)     { showToast('⚠️ Please select your date of travel');     qs('#bkDep')?.focus();     return; }
    if (!name)    { showToast('⚠️ Please enter your full name');           qs('#bkName')?.focus();    return; }
    if (!email)   { showToast('⚠️ Please enter your email address');       qs('#bkEmail')?.focus();   return; }
    if (!phone)   { showToast('⚠️ Please enter your phone number');        qs('#bkPhone')?.focus();   return; }

    const fmt = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'});

    const msg =
`🌍 *NextStop Booking Enquiry*

*Service:* ${service}
*From:* ${from}
*Destination:* ${country}
*Departure:* ${fmt(dep)}
*Return:* ${ret ? fmt(ret) : 'One way / N/A'}
*Travellers:* ${pax}
*Transit Required:* ${transit}

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}${notes ? `\n*Notes:* ${notes}` : ''}

_Sent via NextStop · Royal Accent Creations_`;

    window.open('https://wa.me/233244416725?text=' + encodeURIComponent(msg), '_blank');
    closeBookingModal();
    showToast("📩 Enquiry sent! We'll get back to you shortly.");
    bookingForm.reset();
    qs('#bkCountry').value = '';
  });

  // Expose globally so HTML onclick attributes and external code can call it
  window.openBookingModal = openBookingModal;

  /* =========================================
     SEARCH BUTTON (Flights panel)
     ========================================= */
  qs('#searchBtn')?.addEventListener('click', () => {
    const f = qs('#fromCity')?.textContent;
    const t = qs('#toCity')?.textContent;
    const from = (!f || f === 'Select City') ? '' : f;
    const dest = (!t || t === 'Select City') ? '' : t;
    openBookingModal({
      service:     'Flight',
      title:       '✈️ Book Your Flight',
      from:        from,
      destination: dest,
    });
  });

  /* =========================================
     MOBILE NAV
========================================= */
  qs('#hamburger')?.addEventListener('click', () => qs('#mobileNav')?.classList.add('open'));
  qs('#mobileNavClose')?.addEventListener('click', () => qs('#mobileNav')?.classList.remove('open'));
  qs('#mobileNavOverlay')?.addEventListener('click', () => qs('#mobileNav')?.classList.remove('open'));

  /* =========================================
     NAVBAR SCROLL SHADOW
     ========================================= */
  window.addEventListener('scroll', () => qs('.navbar')?.classList.toggle('scrolled', window.scrollY > 10));

  /* =========================================
     FORMS — Newsletter & App Email
     ========================================= */
  qs('#newsletterForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('🎉 Subscribed! Great deals incoming.');
    const el = qs('#newsletterEmail'); if (el) el.value = '';
  });
  qs('#appEmailForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('📱 App link sent to your email!');
    const el = qs('#appEmail'); if (el) el.value = '';
  });

  /* =========================================
     BOOK NOW BUTTONS (deal cards)
     ========================================= */
  qsa('.deal-book').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    const route    = btn.closest('.deal-body')?.querySelector('.deal-route')?.textContent?.trim() || '';
    const panelEl  = btn.closest('.deal-panel');
    const panelType = panelEl?.dataset.deals || 'flights';
    const serviceMap = { flights: 'Flight', hotels: 'Hotel Stay', packages: 'Holiday Package' };
    const titleMap   = { flights: '✈️ Book Your Flight', hotels: '🏨 Book Your Stay', packages: '🌴 Book Your Package' };
    // Extract destination from route (e.g. "Accra → Dubai" → "Dubai")
    const dest = route.includes('→') ? route.split('→').pop().trim() : route;
    openBookingModal({
      service:     serviceMap[panelType]  || 'Travel',
      title:       titleMap[panelType]    || '📩 Send Enquiry',
      destination: dest,
    });
  }));

  /* =========================================
     SCROLL ANIMATIONS
     ========================================= */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
  }, {threshold: 0.1});
  qsa('.deal-card,.dest-card,.why-card,.info-card,.country-card').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = 'opacity .4s ease, transform .4s ease';
    obs.observe(el);
  });

  /* =========================================
     TOAST
     ========================================= */
  function showToast(msg, dur = 3200) {
    const t = qs('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), dur);
  }
  window.showToast = showToast;

  /* =========================================
     CURRENCY CONVERTER
     ========================================= */
  const CURRENCIES = {
    USD:{name:'US Dollar',         flag:'🇺🇸', symbol:'$'},
    GHS:{name:'Ghanaian Cedi',     flag:'🇬🇭', symbol:'₵'},
    EUR:{name:'Euro',              flag:'🇪🇺', symbol:'€'},
    GBP:{name:'British Pound',     flag:'🇬🇧', symbol:'£'},
    CAD:{name:'Canadian Dollar',   flag:'🇨🇦', symbol:'$'},
    AUD:{name:'Australian Dollar', flag:'🇦🇺', symbol:'$'},
    NGN:{name:'Nigerian Naira',    flag:'🇳🇬', symbol:'₦'},
    KES:{name:'Kenyan Shilling',   flag:'🇰🇪', symbol:'KSh'},
    ZAR:{name:'S.A. Rand',         flag:'🇿🇦', symbol:'R'},
    AED:{name:'UAE Dirham',        flag:'🇦🇪', symbol:'د.إ'},
    XOF:{name:'CFA Franc',         flag:'🌍',   symbol:'₣'},
    JPY:{name:'Japanese Yen',      flag:'🇯🇵', symbol:'¥'},
    CNY:{name:'Chinese Yuan',      flag:'🇨🇳', symbol:'¥'},
    CHF:{name:'Swiss Franc',       flag:'🇨🇭', symbol:'Fr'},
    INR:{name:'Indian Rupee',      flag:'🇮🇳', symbol:'₹'},
    SEK:{name:'Swedish Krona',     flag:'🇸🇪', symbol:'kr'},
    SGD:{name:'Singapore Dollar',  flag:'🇸🇬', symbol:'$'},
    NOK:{name:'Norwegian Krone',   flag:'🇳🇴', symbol:'kr'},
    DKK:{name:'Danish Krone',      flag:'🇩🇰', symbol:'kr'},
    MYR:{name:'Malaysian Ringgit', flag:'🇲🇾', symbol:'RM'},
  };

  const STATIC_RATES = {
    USD:1, GHS:14.8, EUR:0.92, GBP:0.78, CAD:1.37, AUD:1.54,
    NGN:1550, KES:129, ZAR:18.6, AED:3.67, XOF:600, JPY:154,
    CNY:7.24, CHF:0.88, INR:83.5, SEK:10.4, SGD:1.34, NOK:10.7,
    DKK:6.87, MYR:4.72,
  };

  let rates = {...STATIC_RATES};
  let ratesUpdated = 'Static rates (deploy with API key for live rates)';

  async function fetchRates() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) return;
      const data = await res.json();
      if (data.rates) {
        Object.keys(CURRENCIES).forEach(c => { if (data.rates[c]) rates[c] = data.rates[c]; });
        const d = new Date(data.time_last_update_utc || Date.now());
        ratesUpdated = `Live · Updated ${d.toLocaleDateString('en-US', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}`;
        updateCurrencyResult();
      }
    } catch (_) {}
  }

  function populateCurrencySelects() {
    const fromSel = qs('#cpFrom'), toSel = qs('#cpTo');
    if (!fromSel || !toSel) return;
    const opts = Object.entries(CURRENCIES).map(([code, c]) =>
      `<option value="${code}">${c.flag} ${code} — ${c.name}</option>`).join('');
    fromSel.innerHTML = opts; toSel.innerHTML = opts;
    fromSel.value = 'USD'; toSel.value = 'GHS';
  }

  function updateCurrencyResult() {
    const fromSel = qs('#cpFrom'), toSel = qs('#cpTo'), amtIn = qs('#cpAmount');
    const resEl = qs('#cpResult'), rateEl = qs('#cpRate'), updEl = qs('#cpUpdated');
    if (!fromSel || !toSel || !amtIn || !resEl) return;
    const from = fromSel.value, to = toSel.value;
    const amt  = parseFloat(amtIn.value) || 1;
    const usd  = amt / rates[from];
    const result = usd * rates[to];
    const cc = CURRENCIES[to] || {};
    resEl.textContent = `${cc.symbol || ''}${result.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})} ${to}`;
    const rate = rates[to] / rates[from];
    if (rateEl) rateEl.innerHTML = `1 ${from} = <span>${rate.toLocaleString('en-US', {maximumFractionDigits:4})}</span> ${to}`;
    if (updEl)  updEl.textContent = ratesUpdated;
    updatePopularRates(from);
  }

  function updatePopularRates(from = 'USD') {
    const grid = qs('#cpPopularGrid'); if (!grid) return;
    const pops = ['GHS','EUR','GBP','NGN','AED','CAD'].filter(c => c !== from).slice(0, 6);
    grid.innerHTML = pops.map(c => {
      const rate = rates[c] / rates[from];
      const cc = CURRENCIES[c] || {};
      return `<div class="cp-pop-item" data-to="${c}">
        <span class="flag">${cc.flag}</span>
        <span class="rate">${rate.toLocaleString('en-US', {maximumFractionDigits:3})}</span>
        <span class="code">${c}</span>
      </div>`;
    }).join('');
    qsa('.cp-pop-item', grid).forEach(el => {
      el.addEventListener('click', () => {
        const toSel = qs('#cpTo'); if (toSel) { toSel.value = el.dataset.to; updateCurrencyResult(); }
      });
    });
  }

  qs('#currencyFab')?.addEventListener('click', () => {
    const panel = qs('#currencyPanel');
    panel?.classList.toggle('open');
    if (panel?.classList.contains('open')) { populateCurrencySelects(); fetchRates(); updateCurrencyResult(); }
  });
  qs('#cpClose')?.addEventListener('click', () => qs('#currencyPanel')?.classList.remove('open'));
  ['#cpFrom','#cpTo','#cpAmount'].forEach(id => {
    qs(id)?.addEventListener('input',  updateCurrencyResult);
    qs(id)?.addEventListener('change', updateCurrencyResult);
  });
  qs('#cpSwap')?.addEventListener('click', () => {
    const f = qs('#cpFrom'), t = qs('#cpTo'); if (!f || !t) return;
    const tmp = f.value; f.value = t.value; t.value = tmp; updateCurrencyResult();
  });

  populateCurrencySelects();
  fetchRates();

  /* =========================================
     NAV TAB SWITCHER (global — called by onclick)
     ========================================= */
  window.nextstopGoTo = function(panel) {
    qsa('.search-tab').forEach(t => t.classList.toggle('active', t.dataset.panel === panel));
    qsa('.search-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === panel));
    const el = document.getElementById('search-section');
    if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
    document.getElementById('mobileNav')?.classList.remove('open');
  };

  /* =========================================
     CART BUTTON
     ========================================= */
  qs('#cartBtn')?.addEventListener('click', e => {
    e.preventDefault();
    showToast('🛒 Cart coming soon — WhatsApp us to bundle deals!');
  });

  /* =========================================
     OTHER SEARCH PANEL BUTTONS
     ========================================= */
  const PANEL_CONFIG = {
    stays:    { service:'Hotel Stay',       title:'🏨 Book Your Stay'         },
    rides:    { service:'Airport Ride',     title:'🚗 Book an Airport Ride'   },
    holidays: { service:'Holiday Package',  title:'🌴 Book a Holiday Package' },
    events:   { service:'Events & Tours',   title:'🎫 Book Events & Tours'    },
    card:     { service:'Travel Card',      title:'💳 Get a Travel Card'      },
  };
  qsa('.search-panel:not([data-panel="flight"]) .search-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.search-panel')?.dataset.panel;
      const cfg   = PANEL_CONFIG[panel] || {};
      openBookingModal({ service: cfg.service || 'Travel', title: cfg.title || '📩 Send Enquiry' });
    });
  });

  /* =========================================
     DESTINATION CARDS — CLICKABLE
     ========================================= */
  qsa('.dest-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const dest = card.querySelector('h3')?.textContent?.trim() || '';
      openBookingModal({
        service:     'Flight',
        title:       '✈️ Book Your Flight',
        destination: dest,
      });
    });
  });

});

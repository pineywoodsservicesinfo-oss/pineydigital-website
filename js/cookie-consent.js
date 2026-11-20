// Piney Digital — Cookie Consent Banner
// GDPR / CCPA / TDPSA oriented. Google Consent Mode v2: tags load on every page with
// all storage denied; cookies are only set after the user accepts.
// Stores choice in localStorage.

(function() {
  const STORAGE_KEY = 'piney_cookie_consent';
  const REAL_GA_ID = 'G-16SZEY2J5E';
  const GTM_ID = 'GTM-N53DKG27';

  // Check existing consent
  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // Storage unavailable — fail safely, don't load analytics
    }
  }

  // Consent Mode v2: Google tags load on every page, but every storage type defaults to
  // denied. No ad/analytics cookies are set until the visitor accepts.
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  var DENIED = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  };
  var GRANTED = {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  };

  gtag('consent', 'default', Object.assign({ wait_for_update: 500 }, DENIED));
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);

  // Restore an earlier choice before any tag fires
  if (getConsent() === 'accepted') {
    gtag('consent', 'update', GRANTED);
  }

  function loadGoogleTags() {
    if (window.gtag_loaded) return;
    window.gtag_loaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + REAL_GA_ID;
    document.head.appendChild(s);

    gtag('js', new Date());
    gtag('config', REAL_GA_ID, { anonymize_ip: true });

    loadTagManager();
  }

  // Standard GTM bootstrap
  function loadTagManager() {
    if (window.gtm_loaded) return;
    window.gtm_loaded = true;

    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(g);
  }

  function grantConsent() {
    gtag('consent', 'update', GRANTED);
  }

  loadGoogleTags();

  // Disable analytics (remove any existing)
  function disableAnalytics() {
    // Clear GA cookies
    document.cookie.split(';').forEach(function(c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0 || name.indexOf('_gid') === 0) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + location.hostname;
      }
    });
  }

  // Build the banner UI
  function showBanner() {
    // Don't show if already dismissed/decided
    if (getConsent()) return;

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = [
      '<div class="cookie-banner-inner">',
      '  <div class="cookie-banner-text">',
      '    <p><strong>We use cookies for analytics.</strong> Google Analytics and Google Tag Manager load on every page, but set no cookies until you accept. Accepting lets us understand how visitors use our site and measure our Google Ads. We do not sell your data. <a href="/privacy" target="_blank">Privacy Policy</a> · <a href="/privacy#do-not-sell">Do Not Sell My Info</a></p>',
      '  </div>',
      '  <div class="cookie-banner-actions">',
      '    <button type="button" id="cookie-decline" class="cookie-btn cookie-btn-secondary">Decline</button>',
      '    <button type="button" id="cookie-accept" class="cookie-btn cookie-btn-primary">Accept</button>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(banner);

    // Trigger slide-in animation on next frame
    requestAnimationFrame(function() {
      banner.classList.add('cookie-banner-visible');
    });

    // Wire up buttons
    document.getElementById('cookie-accept').addEventListener('click', function() {
      setConsent('accepted');
      grantConsent();
      banner.classList.remove('cookie-banner-visible');
      setTimeout(function() { banner.remove(); }, 300);
    });

    document.getElementById('cookie-decline').addEventListener('click', function() {
      setConsent('declined');
      gtag('consent', 'update', DENIED);
      disableAnalytics();
      banner.classList.remove('cookie-banner-visible');
      setTimeout(function() { banner.remove(); }, 300);
    });
  }

  // Conversion events for Google Tag Manager. GTM tags respect Consent Mode, so events
  // are safe to push always: without consent they send cookieless pings only.
  // In GTM, create a Custom Event trigger named after the event (e.g. generate_lead).
  window.pineyTrack = function(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  };

  // Phone link clicks (tel:) count as conversions for a local service business
  document.addEventListener('click', function(e) {
    var link = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (link) window.pineyTrack('click_to_call', { phone_number: link.getAttribute('href').replace('tel:', '') });
  });

  // Init: show the banner if no decision yet
  if (!getConsent()) {
    if (document.readyState === 'complete') {
      setTimeout(showBanner, 500);
    } else {
      window.addEventListener('load', function() {
        setTimeout(showBanner, 500);
      });
    }
  }
})();

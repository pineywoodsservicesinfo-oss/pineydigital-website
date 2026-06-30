// Piney Digital — Cookie Consent Banner
// GDPR / CCPA / TDPSA compliant. Blocks analytics until user consents.
// Stores choice in localStorage. No cookies set before consent.

(function() {
  const STORAGE_KEY = 'piney_cookie_consent';
  const REAL_GA_ID = 'G-16SZEY2J5E';

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

  // Load Google Analytics only after consent
  function loadAnalytics() {
    if (window.gtag_loaded) return;
    window.gtag_loaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + REAL_GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', REAL_GA_ID, { anonymize_ip: true });
  }

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
      '    <p><strong>We use cookies for analytics.</strong> We use Google Analytics to understand how visitors use our site so we can improve it. We do not sell your data. <a href="privacy.html" target="_blank">Privacy Policy</a> · <a href="privacy.html#do-not-sell">Do Not Sell My Info</a></p>',
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
      loadAnalytics();
      banner.classList.remove('cookie-banner-visible');
      setTimeout(function() { banner.remove(); }, 300);
    });

    document.getElementById('cookie-decline').addEventListener('click', function() {
      setConsent('declined');
      disableAnalytics();
      banner.classList.remove('cookie-banner-visible');
      setTimeout(function() { banner.remove(); }, 300);
    });
  }

  // Init: if consent was given before, load analytics immediately
  var existing = getConsent();
  if (existing === 'accepted') {
    loadAnalytics();
  } else if (existing !== 'declined') {
    // No decision yet — show banner after page load
    if (document.readyState === 'complete') {
      setTimeout(showBanner, 500);
    } else {
      window.addEventListener('load', function() {
        setTimeout(showBanner, 500);
      });
    }
  }
})();
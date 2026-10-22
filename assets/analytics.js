/* ============================================
   GOOGLE ANALYTICS 4
   Paste the Measurement ID from Google Analytics (Admin > Data streams >
   motivision.media, it looks like G-XXXXXXXXXX) between the quotes below.
   Left empty, nothing loads and nothing is tracked.
============================================ */
const GA_ID = '';

if (GA_ID && !/localhost|127\.0\.0\.1/.test(location.hostname)) {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);

  // The actions that matter for the business, reported as GA4 events.
  // Mark book_click, call_click and generate_lead as key events in GA.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const where = { link_text: a.textContent.trim().slice(0, 60), page: location.pathname };
    if (href.includes('listings.motivision.media/order')) gtag('event', 'book_click', where);
    else if (href.startsWith('tel:')) gtag('event', 'call_click', where);
    else if (href.startsWith('mailto:')) gtag('event', 'email_click', where);
    else if (href.includes('zillow.com/view-imx')) gtag('event', 'showcase_tour_click', where);
  });
  document.addEventListener('lead:sent', (e) => {
    gtag('event', 'generate_lead', { form: e.detail.source || 'unknown', page: location.pathname });
  });
}

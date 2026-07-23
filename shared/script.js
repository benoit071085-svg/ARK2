/* ═══════════════════════════════════════════
   TRACKING — Google Analytics 4 (gtag.js direct)
   gtag() est fourni par le snippet officiel dans <head>.
   Aucune couche dataLayer / GTM personnalisée.
═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   UTM CAPTURE — persistés en sessionStorage,
   réinjectés dans les champs cachés du formulaire
   (données de campagne envoyées à Netlify Forms)
═══════════════════════════════════════════ */
(function captureUTMs(){
  var params = ['utm_source','utm_medium','utm_campaign','utm_content'];
  var url = new URLSearchParams(window.location.search);
  params.forEach(function(p){
    var val = url.get(p);
    if (val) { try { sessionStorage.setItem(p, val); } catch(e){} }
  });
  document.addEventListener('DOMContentLoaded', function(){
    params.forEach(function(p){
      var input = document.querySelector('input[name="' + p + '"]');
      if (!input) return;
      var stored = null;
      try { stored = sessionStorage.getItem(p); } catch(e){}
      if (stored) input.value = stored;
    });
  });
})();

/* SMOOTH SCROLL */
var _reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function toAcces(e){
  if(e)e.preventDefault();
  var target=document.querySelector('#acces .form-box')||document.getElementById('acces');
  if(!target)return;
  target.scrollIntoView({behavior:_reduceMotion?'auto':'smooth',block:'start'});
  setTimeout(function(){var el=target.querySelector('select,input[type=email]')||document.querySelector('#acces select,#acces input[type=email]');if(el)el.focus({preventScroll:true});},_reduceMotion?0:700);
}

/* INIT */
document.addEventListener('DOMContentLoaded',function(){

  /* CTA → #acces : cta_click { cta_location }, position uniquement (jamais le texte).
     IMPORTANT : réservé aux liens <a> qui mènent vers la section #acces (Hero, Problem,
     Concept, Benefits, Science, Nav). Le bouton de soumission du formulaire
     (<button type="submit" class="cta-submit">) n'est jamais concerné par ce sélecteur
     — c'est un <button>, pas un <a href="#acces"> — et déclenche uniquement form_submit,
     plus bas, après confirmation de Netlify. Aucun double comptage possible. */
  document.querySelectorAll('a[href="#acces"]').forEach(function(a){
    if (a.tagName !== 'A') return; // garde-fou explicite, ne cible jamais un bouton
    a.addEventListener('click',function(e){
      var loc = a.getAttribute('data-cta-location') || 'unknown';
      gtag('event', 'cta_click', { cta_location: loc });
      toAcces(e);
    });
  });

  /* Problem stat accordion (comportement UI uniquement) */
  document.querySelectorAll('.pb-stat').forEach(function(card){
    function tog(){
      var was=card.classList.contains('open');
      document.querySelectorAll('.pb-stat').forEach(function(c){c.classList.remove('open');c.setAttribute('aria-expanded','false');});
      if(!was){card.classList.add('open');card.setAttribute('aria-expanded','true');}
    }
    card.addEventListener('click',tog);
    card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tog();}});
  });

  /* Benefit tabs (comportement UI uniquement) */
  document.querySelectorAll('.btab').forEach(function(btn){
    btn.addEventListener('click',function(){
      var tid=btn.getAttribute('data-tab');
      document.querySelectorAll('.btab').forEach(function(b){b.classList.remove('on');b.setAttribute('aria-selected','false');});
      document.querySelectorAll('.bpanel').forEach(function(p){p.classList.remove('on');});
      btn.classList.add('on');btn.setAttribute('aria-selected','true');
      var panel=document.getElementById(tid);if(panel)panel.classList.add('on');
    });
  });

  /* Science expand (comportement UI uniquement) */
  document.querySelectorAll('.sci-card').forEach(function(card){
    function togS(){
      var o=card.classList.toggle('open');
      var b=card.querySelector('.sci-expand-btn');if(b)b.setAttribute('aria-expanded',o?'true':'false');
    }
    card.addEventListener('click',togS);
    card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();togS();}});
  });

  /* Product interest buttons → product_interest { product_id } */
  document.querySelectorAll('.cta-interest').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(btn.classList.contains('done'))return;
      btn.classList.add('done');btn.textContent='Int\u00e9r\u00eat not\u00e9 \u2713';
      var pid = btn.getAttribute('data-product-id');
      if (pid) gtag('event', 'product_interest', { product_id: pid });
    });
  });

  /* ── Formulaire : vue / démarrage / early bird / soumission Netlify ── */
  var form = document.getElementById('mainForm');
  if (form) {
    var formBox = form.closest('.form-box') || form;

    /* form_view : une fois, dès que ≥50% du formulaire est visible */
    var viewed = false;
    if ('IntersectionObserver' in window) {
      var viewObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting && !viewed) {
            viewed = true;
            gtag('event', 'form_view');
            viewObserver.disconnect();
          }
        });
      }, { threshold: 0.5 });
      viewObserver.observe(formBox);
    }

    /* form_start : une fois, à la première interaction réelle avec un champ */
    var started = false;
    function markStarted(){
      if (started) return;
      started = true;
      gtag('event', 'form_start');
    }
    form.querySelectorAll('input, select, textarea').forEach(function(field){
      field.addEventListener('focus', markStarted, { once:true });
      field.addEventListener('input', markStarted, { once:true });
    });

    /* earlybird_select : une fois, uniquement au passage décoché → coché */
    var earlybirdSent = false;
    var earlybirdBox = document.getElementById('chk-earlybird');
    if (earlybirdBox) {
      earlybirdBox.addEventListener('change', function(){
        if (earlybirdBox.checked && !earlybirdSent) {
          earlybirdSent = true;
          gtag('event', 'earlybird_select');
        }
      });
    }

    /* Soumission réelle vers Netlify Forms via fetch.
       Ce bouton ne déclenche JAMAIS cta_click — uniquement form_submit,
       et seulement après une réponse HTTP réussie de Netlify. */
    var submitBtn = form.querySelector('.cta-submit');
    var submitting = false;

    function showFormError(){
      var err = form.querySelector('.form-error');
      if (!err) {
        err = document.createElement('p');
        err.className = 'form-error';
        err.setAttribute('role','alert');
        err.style.color = '#c0392b';
        err.style.fontSize = '.8rem';
        err.style.marginTop = '.75rem';
        form.appendChild(err);
      }
      err.textContent = 'Une erreur est survenue lors de l\u2019envoi. Merci de r\u00e9essayer.';
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (submitting) return;
      submitting = true;
      if (submitBtn) { submitBtn.disabled = true; }

      var formData = new FormData(form);
      var body = new URLSearchParams(formData).toString();

      fetch(window.location.pathname || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }).then(function(res){
        if (!res.ok) throw new Error('Netlify Forms error: ' + res.status);
        /* email jamais envoyé à Google Analytics */
        gtag('event', 'form_submit', {
          age: formData.get('age'),
          sport_frequency: formData.get('sport_frequency'),
          professional_status: formData.get('professional_status')
        });
        form.style.display = 'none';
        var msg = document.getElementById('successMsg');
        if (msg) msg.style.display = 'block';
      }).catch(function(){
        submitting = false;
        if (submitBtn) { submitBtn.disabled = false; }
        showFormError();
      });
    });
  }
});

/* ── scroll_depth 50% (une seule fois par visite) ── */
(function(){
  var fired = false;
  function checkScroll(){
    if (fired) return;
    var scrolled = window.scrollY + window.innerHeight;
    var full = document.documentElement.scrollHeight;
    if (full > 0 && (scrolled / full) >= 0.5) {
      fired = true;
      gtag('event', 'scroll_depth', { percent: 50 });
      window.removeEventListener('scroll', checkScroll);
    }
  }
  window.addEventListener('scroll', checkScroll, { passive:true });
  checkScroll();
})();

/* ── bcard mobile wrapper ── */
(function(){
  if(window.innerWidth > 640) return;
  document.querySelectorAll('.bcard').forEach(function(card){
    if(card.querySelector('.bcard-content')) return; // already wrapped
    var sym = card.querySelector('.bcard-sym');
    var rest = Array.from(card.childNodes).filter(function(n){ return n !== sym; });
    var wrap = document.createElement('div');
    wrap.className = 'bcard-content';
    rest.forEach(function(n){ wrap.appendChild(n); });
    card.appendChild(wrap);
  });
})();

/* ── Ingrédients sport-grade accordéon (comportement UI uniquement) ── */
document.querySelectorAll('.sci-ingr-btn').forEach(function(btn){
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    var card=btn.closest('.sci-card');
    var open=card.classList.toggle('ingr-open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
  btn.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();btn.click();}});
});

/* ── Gamme bénéfices accordéon (comportement UI uniquement) ── */
document.querySelectorAll('.gcard-acc-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    var card=btn.closest('.gcard');
    var open=card.classList.toggle('acc-open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
  btn.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();btn.click();}});
});

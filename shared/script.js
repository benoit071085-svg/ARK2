/* TRACKING */
var _log=[],_tT=null;
function track(ev,data){
  var e=Object.assign({event:ev,ts:Date.now()},data||{});
  _log.push(e);console.log('[P40]',e);
  var t=document.getElementById('toast'),m=document.getElementById('toast-msg');
  if(t&&m){m.textContent=ev.replace(/_/g,' ');t.classList.add('show');clearTimeout(_tT);_tT=setTimeout(function(){t.classList.remove('show');},2000);}
}
/* SMOOTH SCROLL */
function toAcces(e){
  if(e)e.preventDefault();
  var s=document.getElementById('acces');
  if(!s)return;
  s.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(function(){var el=s.querySelector('select,input[type=email]');if(el)el.focus({preventScroll:true});},700);
}
/* INIT */
document.addEventListener('DOMContentLoaded',function(){
  /* All #acces CTAs */
  document.querySelectorAll('a[href="#acces"]').forEach(function(a){
    a.addEventListener('click',function(e){track('cta',{label:a.textContent.trim().slice(0,32)});toAcces(e);});
  });
  /* Section views */
  if('IntersectionObserver'in window){
    var ob=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting&&!e.target._s){e.target._s=true;track('view',{id:e.target.id});}});
    },{threshold:.25});
    document.querySelectorAll('section[id]').forEach(function(s){ob.observe(s);});
  }
  /* Problem stat accordion */
  document.querySelectorAll('.pb-stat').forEach(function(card){
    function tog(){
      var was=card.classList.contains('open');
      document.querySelectorAll('.pb-stat').forEach(function(c){c.classList.remove('open');c.setAttribute('aria-expanded','false');});
      if(!was){card.classList.add('open');card.setAttribute('aria-expanded','true');var h=card.querySelector('h3');track('diag',{t:h?h.textContent:''});}
    }
    card.addEventListener('click',tog);
    card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tog();}});
  });
  /* Benefit tabs */
  document.querySelectorAll('.btab').forEach(function(btn){
    btn.addEventListener('click',function(){
      var tid=btn.getAttribute('data-tab');
      document.querySelectorAll('.btab').forEach(function(b){b.classList.remove('on');b.setAttribute('aria-selected','false');});
      document.querySelectorAll('.bpanel').forEach(function(p){p.classList.remove('on');});
      btn.classList.add('on');btn.setAttribute('aria-selected','true');
      var panel=document.getElementById(tid);if(panel)panel.classList.add('on');
      track('benefit',{tab:tid});
    });
  });
  /* Science expand */
  document.querySelectorAll('.sci-card').forEach(function(card){
    function togS(){
      var o=card.classList.toggle('open');
      var b=card.querySelector('.sci-expand-btn');if(b)b.setAttribute('aria-expanded',o?'true':'false');
      var h=card.querySelector('h3');track('sci',{open:o,t:h?h.textContent.trim():''});
    }
    card.addEventListener('click',togS);
    card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();togS();}});
  });
  /* Interest buttons */
  document.querySelectorAll('.cta-interest').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(btn.classList.contains('done'))return;
      btn.classList.add('done');btn.textContent='Int\u00e9r\u00eat not\u00e9 \u2713';
      track('interest',{id:btn.getAttribute('data-track')});
    });
  });
  /* Form */
  var form=document.getElementById('mainForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var g=function(id){return(document.getElementById(id)||{}).value||'';};
      var chk=function(id){return((document.getElementById(id)||{}).checked)||false;};
      var email=g('f-email');
      track('form_submit',{age:g('f-age'),sport:g('f-sport'),statut:g('f-statut'),contact:chk('chk-contact'),earlybird:chk('chk-earlybird'),domain:email.indexOf('@')>-1?email.split('@')[1]:''});
      form.style.display='none';
      var msg=document.getElementById('successMsg');if(msg)msg.style.display='block';
    });
  }
});



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

/* ── Ingrédients sport-grade accordéon ── */
document.querySelectorAll('.sci-ingr-btn').forEach(function(btn){
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    var card=btn.closest('.sci-card');
    var open=card.classList.toggle('ingr-open');
    btn.setAttribute('aria-expanded',open?'true':'false');
    track('sci_ingr',{open:open});
  });
  btn.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();btn.click();}});
});

/* ── Gamme bénéfices accordéon ── */
document.querySelectorAll('.gcard-acc-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    var card=btn.closest('.gcard');
    var open=card.classList.toggle('acc-open');
    btn.setAttribute('aria-expanded',open?'true':'false');
    track('gamme_ben',{open:open});
  });
  btn.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();btn.click();}});
});

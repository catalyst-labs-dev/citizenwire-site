(function(){
  var k='cw-theme';
  function cur(){return document.documentElement.getAttribute('data-theme')==='night'?'night':'day'}
  function apply(t){
    document.documentElement.setAttribute('data-theme',t);
    sync();
  }
  function sync(){
    var n=cur()==='night';
    var label=n?'Switch to day mode':'Switch to night mode';
    document.querySelectorAll('[data-theme-toggle]').forEach(function(b){
      b.setAttribute('aria-pressed',n?'true':'false');
      b.title=label;
      b.setAttribute('aria-label',label);
    });
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-theme-toggle]');
    if(!b)return;
    var next=cur()==='night'?'day':'night';
    try{localStorage.setItem(k,next)}catch(err){}
    apply(next);
  });
  try{
    var mq=matchMedia('(prefers-color-scheme:dark)');
    var onChange=function(){
      try{if(localStorage.getItem(k)==='day'||localStorage.getItem(k)==='night')return}catch(err){}
      apply(mq.matches?'night':'day');
    };
    if(mq.addEventListener)mq.addEventListener('change',onChange);
    else if(mq.addListener)mq.addListener(onChange);
  }catch(err){}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);
  else sync();
})();
/* Hide past "Next meeting" / upcoming entries once their date has passed (static pages can be days old). */
(function(){
  var M={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  function past(s){
    var m=(s||'').replace(/\u00a0/g,' ').match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2})(?:,\s*(\d{4}))?/);
    if(!m)return false;
    var now=new Date(),y=m[3]?+m[3]:now.getFullYear();
    var end=new Date(y,M[m[1]],+m[2],23,59,59);
    return now>end;
  }
  function run(){
    document.querySelectorAll('b').forEach(function(b){
      if(!/^\s*Next meeting:\s*$/.test(b.textContent))return;
      var nodes=[b],n=b.nextSibling,txt='';
      while(n&&!(n.nodeName==='BR')){nodes.push(n);txt+=n.textContent;n=n.nextSibling}
      if(n)nodes.push(n);
      if(!past(txt))return;
      nodes.forEach(function(x){
        if(x.nodeType===1){x.hidden=true;x.style.display='none'}
        else{var s=document.createElement('span');s.hidden=true;s.className='cw-past';x.parentNode.insertBefore(s,x);s.appendChild(x)}
      });
    });
    document.querySelectorAll('.nlist li').forEach(function(li){
      var m=li.querySelector('.meta');
      if(m&&past(m.textContent))li.hidden=true;
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

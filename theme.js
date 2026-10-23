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

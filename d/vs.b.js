(function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=4)})({4:function(){(function(a){'use strict';function b(){let a=document.head||document.getElementsByTagName('head')[0],b=document.createElement('style');b.type='text/css',b.styleSheet?b.styleSheet.cssText=g:b.appendChild(document.createTextNode(g)),a.appendChild(b)}function c(a,b){var c;return'fontawesome'===a?(c=document.createElement('i'),c.className='fa fa-microphone',c.style=iconStyle):'icon'===a?(c=document.createElement('img'),c.src=b.icon,c.style=imgStyle):(c=document.createElement('i'),c.classList.add('icon'),c.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></svg>'),c}function d(a){let d=document.createElement('div'),f=c(this.agent.mic,this.agent),g=document.createElement('dialog');g.innerHTML='<p class="vs-head"> Listening ... </p>',e.dialog=g,b(),d.classList.add('vs'),this.agent.bgColor&&(d.style.backgroundColor=this.agent.bgColor),this.agent.borderColor&&(d.style.borderColor=this.agent.borderColor),g.appendChild(f.cloneNode(!0)),e.dialogHead=e.dialog.querySelector('.vs-head'),e.mic=e.dialog.querySelector('.icon'),d.appendChild(g),d.appendChild(f),document.body.appendChild(d),d.addEventListener('click',a)}function e(a){this.agent=new f,Object.assign(this.agent,k,a),this.agent.onresult=l.bind(this.agent),this.agent.onspeechend=h.bind(this.agent),this.agent.onerror=i.bind(this.agent),this.agent.onnomatch=j.bind(this.agent),this.agent.onstart=function(){e.dialogHead.innerHTML='Getting ready to serve you!',e.dialog.open||e.dialog.showModal()},this.agent.onsoundstart=function(){e.dialogHead.innerHTML='Listening ...'},this.agent.onsoundend=function(){e.mic.style.animationName='none'},this.agent.onaudiostart=function(){e.dialogHead.innerHTML='Speak Now ...'},this.agent.onaudioend=function(){e.mic.style.animationName='none'},d.call(this,this.start.bind(this))}var f=a.SpeechRecognition||a.webkitSpeechRecognition;if(!f)return!1;const g=`.vs,.vs dialog .icon{animation-duration:1s;animation-iteration-count:infinite}@keyframes listening{0%{box-shadow:0 0 50px #afabab}10%{box-shadow:0 0 45px #afabab}20%{box-shadow:0 0 43px #afabab}30%{box-shadow:0 0 40px #afabab}40%{box-shadow:0 0 30px #afabab}50%{box-shadow:0 0 27px #afabab}60%{box-shadow:0 0 25px #afabab}70%{box-shadow:0 0 20px #afabab}80%{box-shadow:0 0 15px #afabab}90%{box-shadow:0 0 10px #afabab}100%{box-shadow:0 0 0 #afabab}}.vs{z-index:2;position:fixed;right:10px;bottom:10px;border-radius:50%;background:#f68c24;box-sizing:border-box;text-align:center;color:#fff;border:0 solid #fff}.vs .icon{display:inline-block;border-radius:50%;width:60px;height:60px;background:-webkit-radial-gradient(#ff8308,#ec9f52);color:#fff;box-shadow:0 0 5px #000;padding-top:10px}.vs dialog .icon{animation-name:listening;box-shadow:0 0 50px #afabab}.vs .icon path{fill:#fff}.vs dialog{position:fixed; width:93vw;padding:40px 0;top:70px;border:transparent;background-color:#f2f2f2}.vs .vs-head{font-size:1em}.vs dialog::backdrop{background-color:rgba(0,0,0,.83)}`,h=function(){e.mic.style.animationName='none',this.stop()},i=function(a){e.mic.style.animationName='none',e.dialogHead.innerHTML='Could not recognise the speech. Please try again!',console.log('Speech recognition error detected: '+a.error+' message '+a.message),this.stop()},j=function(){console.log('Could not recognise the speech, try again...'),this.stop()},k={lang:'en-US',continuous:!1,maxAlternatives:1,interimResults:!1,dictionary:{},mic:'icon',bgColor:'#fff'},l=function(a){var b,c=a.results[0][0].transcript.toLowerCase();a.stopImmediatePropagation(),e.dialog.querySelector('.vs-head').innerHTML=`Looking for '${c}'`,b=this.dictionary[c]?dictionary[c]:this.baseUrl+'?q='+encodeURI(c),'function'==typeof this.cb&&this.cb(c,b),window.location=b};e.prototype.start=function(){e.mic.style.animationName='listening',this.agent.start()},e.prototype.stop=function(){e.mic.style.animationName='none',this.agent.stop()},e.prototype.abort=function(){e.mic.style.animationName='none',this.agent.abort()},a.Recognition=e})(window)}});
//# sourceMappingURL=vs.b.js.map
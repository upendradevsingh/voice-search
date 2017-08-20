/**
 * ***********************************
 * *********** Recognition ***********
 * ***********************************
 */

/**
 * Usage
 * const reco = new Recognition({
 *      baseUrl: 'https://www.google.co.in/search'
 * });
 */


(function(root) {
  "use strict";

  var WebSpeechRecognition = root.SpeechRecognition || root.webkitSpeechRecognition;

  if(!WebSpeechRecognition){
    return false;
  }
  /* Styles */
  const containerStyle = 'position:fixed;height:45px;width:45px;right:10px;bottom:10px;border-radius:50%;background:#f68c24;box-sizing:border-box;text-align:center;color:#fff;border:0 solid #fff;animation-duration:1s;animation-iteration-count:infinite';
  const iconStyle = 'height:25px;position:fixed;display:block;bottom:20px;right:25px;font-size:40px;';
  const imgStyle = 'height:25px;position:fixed;display:block;bottom:20px;right:25px;';
  const animationStyle = '@keyframes listening{0%{border-width:22.5px}10%{border-width:19px}20%{border-width:16px}30%{border-width:13px}40%{border-width:10px}50%{border-width:8px}60%{border-width:6px}70%{border-width:4px}80%{border-width:2px}90%{border-width:1px}100%{border-width:0}}';


  const onspeechend = function() {
    Recognition.mic.style.animationName = 'none';
    this.stop();
  };

  const onerror = function(event) {
    console.log('Speech recognition error detected: ' + event.error + " message " + event.message);
    this.stop();
  };

  const onnomatch = function() {
    console.log('Could not recognise the speech, try again...')
    this.stop();
  };

  function addStyle() {
    let head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
      style.type = 'text/css';
      if (style.styleSheet) {
        style.styleSheet.cssText = animationStyle;
      } else {
        style.appendChild(document.createTextNode(animationStyle));
      }
      head.appendChild(style);
  }

  function iconFactory(type, options){
    var icon;
    switch (type) {
      case 'fontawesome':
        icon = document.createElement('i');
        icon.className = 'fa fa-microphone';
        icon.style = iconStyle;
        break;
      case 'icon': {
          icon = document.createElement('img');
          icon.src = options.icon;
          icon.style = imgStyle;
        }
        break;
      default: {
        icon = document.createElement('i');
        icon.innerHTML = ''
      }
    }
    return icon;
  }

  function decorate(handler) {
    let container = document.createElement('div');
    let icon = iconFactory(this.agent.mic, this.agent);

    Recognition.mic = container;
    addStyle();
    
    container.style = containerStyle;

    if(this.agent.bgColor){
      container.style.backgroundColor = this.agent.bgColor;
    }

    if(this.agent.borderColor){
      container.style.borderColor = this.agent.borderColor;
    }

    container.appendChild(icon);
    document.body.appendChild(container);

    container.addEventListener('click', handler);
  }

  const defaults = {
    lang: 'en-US',
    continuous: false,
    maxAlternatives: 1,
    interimResults: false,
    dictionary: {},
    mic: 'icon',
    bgColor: '#fff'
  }

  const onresult = function(event) {
    var keyword = event.results[0][0].transcript.toLowerCase();
    var url;

    event.stopImmediatePropagation();

    if (this.dictionary[keyword]) {
      url = dictionary[keyword];
    } else {
      url = this.baseUrl + "?q=" + encodeURI(keyword);
    }
    window.location = url;
  };

  function Recognition(options) {
    this.agent = new WebSpeechRecognition();

    Object.assign(this.agent, defaults, options);

    this.agent.onresult = onresult.bind(this.agent);
    this.agent.onspeechend = onspeechend.bind(this.agent);
    this.agent.onerror = onerror.bind(this.agent);
    this.agent.onnomatch = onnomatch.bind(this.agent);
    this.agent.onstart = function(){console.log("I am starting")};
    this.agent.onsoundstart = function(){console.log("Sound Started")};
    this.agent.onsoundend = function(){console.log("Sound ended")};
    this.agent.onaudiostart = function(){console.log("Audio Started")};
    this.agent.onaudioend = function(){console.log("Audio ended")};

    decorate.call(this, this.start.bind(this));
  };

  Recognition.prototype.start = function() {
    Recognition.mic.style.animationName = 'listening';
    this.agent.start();
  };

  Recognition.prototype.stop = function() {
    Recognition.mic.style.animationName = 'none';
    this.agent.stop();
  };

  Recognition.prototype.abort = function() {
    Recognition.mic.style.animationName = 'none';
    this.agent.abort();
  };

  root.Recognition = Recognition;

}(window));

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

(function (root) {
    "use strict";

    var WebSpeechRecognition = root.SpeechRecognition || root.webkitSpeechRecognition;

    if (!WebSpeechRecognition) {
        return false;
    }

// Style sheet
//  const styles = `
//     @keyframes listening{
//       0%{box-shadow: 0px 0px 50px #afabab;}
//       10%{box-shadow: 0px 0px 45px #afabab;}
//       20%{box-shadow: 0px 0px 43px #afabab;}
//       30%{box-shadow: 0px 0px 40px #afabab;}
//       40%{box-shadow: 0px 0px 30px #afabab;}
//       50%{box-shadow: 0px 0px 27px #afabab;}
//       60%{box-shadow: 0px 0px 25px #afabab;}
//       70%{box-shadow: 0px 0px 20px #afabab;}
//       80%{box-shadow: 0px 0px 15px #afabab;}
//       90%{box-shadow: 0px 0px 10px #afabab;}
//       100%{box-shadow: 0px 0px 0px #afabab;}
//     }
//     .vs{position: absolute;right: 15px;top: 15px;box-sizing: border-box;text-align: center;color: #fff;}
//     .vs .icon{display: inline-block;width: 50px;height: 50px;color: #fff;}
//     .vs dialog .icon{animation-duration:1s;animation-iteration-count:infinite;animation-name: listening;box-shadow: 0px 0px 50px #afabab;width: 66px;background-color: #f78f26;border-radius: 50%;color: #fff;height:66px;padding-top:20px;}
//     .vs.jb .icon path{fill:#f79026}
//     .vs .icon path{fill:#b2b2b2}
//     .vs dialog .icon path, .vs.jb dialog .icon path{fill:#fff}
//     .vs dialog{position:fixed;width: 93vw;padding: 40px 0;top: 70px;border: transparent;background-color: #f2f2f2;}
//     .vs .vs-head{font-size: 1em;text-transform:capitalize}
//     .vs dialog::backdrop{background-color:rgba(0, 0, 0, 0.83)}
//     .show-close-btn .vs{display:none}
//     @media (max-width: 767px){
//         .main-header .top-search-input .search-containter {display:none}
//         .main-header.show-close-btn .top-search-input .search-containter{display: block}         
//     }
// `;

    
    const styles = `@keyframes listening{0%{box-shadow:0 0 50px #afabab}10%{box-shadow:0 0 45px #afabab}20%{box-shadow:0 0 43px #afabab}30%{box-shadow:0 0 40px #afabab}40%{box-shadow:0 0 30px #afabab}50%{box-shadow:0 0 27px #afabab}60%{box-shadow:0 0 25px #afabab}70%{box-shadow:0 0 20px #afabab}80%{box-shadow:0 0 15px #afabab}90%{box-shadow:0 0 10px #afabab}100%{box-shadow:0 0 0 #afabab}}.vs{position:absolute;right:15px;top:15px;box-sizing:border-box;text-align:center;color:#fff}.vs .icon{display:inline-block;width:50px;height:50px;color:#fff}.vs dialog .icon{animation-duration:1s;animation-iteration-count:infinite;animation-name:listening;box-shadow:0 0 50px #afabab;width:66px;background-color:#f78f26;border-radius:50%;color:#fff;height:66px;padding-top:20px}.vs.jb .icon path{fill:#f79026}.vs .icon path{fill:#b2b2b2}.vs dialog .icon path,.vs.jb dialog .icon path{fill:#fff}.vs dialog{position:fixed;width:93vw;padding:40px 0;top:70px;border:transparent;background-color:#f2f2f2}.vs .vs-head{font-size:1em;text-transform:capitalize}.vs dialog::backdrop{background-color:rgba(0,0,0,.83)}.show-close-btn .vs{display:none}@media (max-width:767px){.main-header .top-search-input .search-containter{display:none}.main-header.show-close-btn .top-search-input .search-containter{display:block}}`;
    const onspeechend = function() {
        Recognition.mic.style.animationName = 'none';
        this.stop();
    };

    const onerror = function(event) { 
        Recognition.mic.style.animationName = 'none';
        Recognition.dialogHead.innerHTML = 'Could not recognise the speech. Please try again!';
        console.log('Speech recognition error detected: ' + event.error + " message " + event.message);
        this.stop();
    };

    const onnomatch = function() {
        console.log('Could not recognise the speech, try again...');
        this.stop();
    };

    function addStyle() {
        let head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = styles;
        } else {
            style.appendChild(document.createTextNode(styles));
        }
        head.appendChild(style);
    }

    function iconFactory() {
        var icon;
        icon = document.createElement('i');
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></svg>`;

        icon.classList.add('icon');

        return icon;
    }

    function decorate(handler) {
        let container = document.createElement('div');
        let icon = iconFactory();
        let dialog = document.createElement('dialog');
        let header = '<p class="vs-head"> Listening ... </p>';
        let target = document.querySelector(this.agent.target) || document.body;

        dialog.innerHTML = header;
        Recognition.dialog = dialog;

        addStyle();

        container.classList.add('vs');

        if (this.agent.bgColor) {
            container.style.backgroundColor = this.agent.bgColor;
        }

        if (this.agent.borderColor) {
            container.style.borderColor = this.agent.borderColor;
        }

        if (this.agent.micColor) {
            container.classList.add(this.agent.micColor);
        }


        dialog.appendChild(icon.cloneNode(true));

        Recognition.dialogHead = Recognition.dialog.querySelector('.vs-head');
        Recognition.mic = Recognition.dialog.querySelector('.icon');

        container.appendChild(dialog);
        container.appendChild(icon);
        target.appendChild(container);

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

    const onresult = function (event) {
        var keyword = event.results[0][0].transcript.toLowerCase();
        var url;

        event.stopImmediatePropagation();

        Recognition
            .dialog
            .querySelector('.vs-head')
            .innerHTML = `Looking for '${keyword}'`;

        if (this.dictionary[keyword]) {
            url = this.dictionary[keyword];
        } else {
            url = this.baseUrl + "?q=" + encodeURI(keyword);
        }

        if(typeof this.cb === 'function'){
          this.cb(keyword, url);
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
        this.agent.onstart = function(){ 
            Recognition.dialogHead.innerHTML = 'Getting ready to serve you!'
            !Recognition.dialog.open && Recognition.dialog.showModal();
        };

        this.agent.onsoundstart = function(){
          Recognition.dialogHead.innerHTML = 'Listening ...';
        };
        this.agent.onsoundend = function(){
          Recognition.mic.style.animationName = 'none';;
        };
        this.agent.onaudiostart = function(){
          Recognition.dialogHead.innerHTML = 'Speak Now ...';
        };
        this.agent.onaudioend = function(){
          Recognition.mic.style.animationName = 'none';
        };

        decorate.call(this, this.start.bind(this));
    };

    Recognition.prototype.start = function () {
        Recognition.mic.style.animationName = 'listening';
        this.agent.start();
    };

    Recognition.prototype.stop = function () {
        Recognition.mic.style.animationName = 'none';
        this.agent.stop();
    };

    Recognition.prototype.abort = function () {
        Recognition.mic.style.animationName = 'none';
        this.agent.abort();
    };

    root.Recognition = Recognition;

}(window));

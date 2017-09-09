(function(window){

	var baseUrl = 'https://dev.jabong.com/find/',
	$window = $(window),
	windowWidth = $window.width(),
	$backBtn = $('#back-btn'),
	saidSize_or_Price;

	var colors = {'black':'checkbox', 'brown':'checkbox', 'purple':'checkbox', 'blue':'checkbox', 'red':'checkbox',
        'green':'checkbox', 'tan':'checkbox', 'transparent':'checkbox'};

    var categories = {'shoes':'true', 'jewellery':'true', 'accessories':'true', 'home and furniture':'true','sports':'true', 
     'clothing':'true', 'peep toes':'true', 'toys':'true', 'kids toys':'true', 'kids shoes':'true', 'sandals':'true', 'slippers':'true', 
     'sneakers':'true', 'flip flops':'true', 'bellies':'true', 'formal shoes':'true','boots':'true', 'floaters':'true', 'beauty':'true',
     'women beauty':'true', 'fragrances':'true', 'perfumes and edts':'true','deodorants and colognes':'true', 'gift sets':'true',
     'make up':'true', 'lips':'true', 'lipstick':'true', 'lip gloss':'true', 'lip liner':'true', 'lip pencil':'true', 'lip pallete':'true',
     'lip brush':'true', 'eye':'true', 'kajal':'true', 'eye liner':'true'};

    var gender = {'men':'input', 'women':'input', 'kids':'input', 'girls':'input', 'boys':'input', 'unisex':'input'};

	function bindEvents() {
		$window.on('jb:voice:search:text', voiceSearchFilter);
	}

	function newCat(words) {
		for(var i = 0; i < words.length ; i++) {
			for (var j = 0; j < words.length ; j++) {

				// check for n-grams if available in the categories
				var joinedPart = words.slice(i, j+1).join(" ");
				if (joinedPart in categories) {
						return joinedPart;
				}			
			}
		}
		return '';
	}

	function desktopPopUp(word) {
		var attr;
    	if(word === 'size') {
    		attr = $('.filterLeftContent > .h6[data-ref=Size_tab]');
    		if(typeof attr[0] === 'undefined'){
    			attr = $('.filterLeftContent > .h6[data-ref="Shoe Size_tab"]');
    		}
    	}else if(word === 'price') {
    		attr = $('.filterLeftContent > .h6[data-ref=Price_tab]');
    	}
    	
    	if(typeof attr[0] !== 'undefined') {
    		$('#allFilterPopupTop').click();
            attr.click();
            return true;
        }
        return false;
	}

	function mobilePopUp(word) {
		var mobAttr;
		if(word === 'size') {
			mobAttr = $('#filter-container > li.standard_size.full-expand>.h6');
			if(typeof mobAttr[0] === 'undefined') {
				mobAttr = $('#filter-container > li.sh_size.full-expand>.h6');
			}
		}else if(word === 'price') {
			mobAttr = $('#filter-container > li.price>.h6');
		}

		if(typeof mobAttr[0] !== 'undefined') {
			$('#mobile-filter').click();
			mobAttr.click();
    		return true;
		}
		return false;
	}

	function openPopUp(word) {
		saidSize_or_Price = true;
    	closeDialog();

    	if (isDesktop()) {
    		return desktopPopUp(word);
    	}else {
    		return mobilePopUp(word);
    	}
    	return false;
	}

	function closeDialog() {
		if(window.Recognition.dialog.open) {
			window.Recognition.dialog.close();	
    	}
	}
	
	function voiceSearchFilter(e, keyword) {
		console.log(keyword);
        
        var selectedFilters = [];
        saidSize_or_Price = false;
        //extract words from sentence
        var words = keyword.split(" ");

        //for each word categorisation is done
        var oldCatWord = sessionStorage.getItem('cat');
        var newCatWord = newCat(words);
        if(!oldCatWord || oldCatWord !== newCatWord) {
		    for (var i = 0; i < words.length ; i++) {
		    	var parent = null, value = null, type = null;
				if( words[i] in colors ) {
	                parent = "colors";
	                value = words[i].charAt(0).toUpperCase()+words[i].slice(1);
	                type = colors[words[i]];
		        }

		        if(words[i] in gender) {
	                parent = "gender";
	                value = words[i].charAt(0).toUpperCase()+words[i].slice(1);
	                type = gender[words[i]];
		        }

		        if(words[i] === 'size' || words[i] === 'price') {
		        	if(openPopUp(words[i])) {
		        		break;
		        	}
		        }

		        if(value) {
		        	selectedFilters.push({
		        		'parent':parent,
		        		'value':value,
		        		'type':type});
		        }
		    }

		    if(!saidSize_or_Price) {
		    	if (selectedFilters.length <= 0 && !value) {
			    	window.location = baseUrl + "?q=" + encodeURI(keyword);
			    }

			    if (isDesktop()){
			    	set
			    	closeDialog();
			    }else {
			    	$backBtn.trigger('click');
			    }
		    	$window.trigger('jb:catalog:onMobileFilterApplied', [selectedFilters]);
		    }
    	}else {
        	window.location = baseUrl + "?q=" + encodeURI(keyword);
	    }
	    
	    sessionStorage.setItem('cat',newCatWord);
	}
	var isDesktop = (function () {
		var isDesktop = true;
		if (($('html').hasClass('touch-enabled') && windowWidth <= 1024) || windowWidth < 1024) {
			isDesktop = false;
		}
		return function() {
			return isDesktop;
		};
	})();

	function init() {

		bindEvents();
	}
	
	init();
})(window);
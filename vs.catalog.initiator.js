
(function (window) {
	var baseUrl = `https://${window.location.host}/find`,
		$searchValue = $('#search');

	function Store(data) {
		this.data = data['options'];
		this.filterNames = data['filterNames'];
	}

	Store.prototype.get = function (baseKey, nestedKey) {
		var returnVal;
		if (this.data && this.data[baseKey] && this.data[baseKey][nestedKey]) {
			returnVal = this.data[baseKey][nestedKey];
		}
		return returnVal;
	};

	function DOMManipulator() {
		this.filtersToBeHandled = ['size', 'price'];
		this.viewType = {
			MOBILE: 'mobileData',
			DESKTOP: 'desktopData'
		};
		this.desktopData = {
			size: ['Size', 'Shoe Size'],
			price: ['Price'],
			popupElement: $('#allFilterPopupTop'),
			element: function (type) {
				return $(`.filterLeftContent > .h6[data-ref="${type}_tab"]`);
			}
		};
		this.mobileData = {
			size: ['standard_size', 'sh_size'],
			price: ['price'],
			popupElement: $('#mobile-filter'),
			element: function (type) {
				return $(`#filter-container > li.${type}>.h6`);
			}
		};
		this.filterTrigger = 'jb:catalog:onMobileFilterApplied';
	}

	DOMManipulator.prototype.getElement = function (viewType, word) {
		var viewTypeData = this[viewType];
		var domElement;

		for (let value of viewTypeData[word]) {
			domElement = viewTypeData.element(value);
			if (domElement[0]) {
				return domElement;
			}
		}
		return domElement;
	}

	DOMManipulator.prototype.openPopUp = function (viewType, word) {
		var domElement = this.getElement(viewType, word);
		if (domElement[0]) {
			$(this[viewType].popupElement).click();
			domElement.click();
			return true;
		}
		return false;
	};

	DOMManipulator.prototype.checkWordForPopup = function (word) {
		if (this.filtersToBeHandled.includes(word)) {
			setTimeout(closeDialog, 1000);
			if (isDesktop()) {
				return this.openPopUp(this.viewType.DESKTOP, word);
			} else {
				return this.openPopUp(this.viewType.MOBILE, word);
			}
		}
		return false;
	}

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function redirect(keyword) {
		window.location = baseUrl + "?q=" + encodeURI(keyword);
	}

	function closeDialog() {
		if (window.Recognition.dialog.open) {
			window.Recognition.dialog.close();
		}
	}

	function addInSession(newCategoryWord, oldCategoryWord) {
		if (newCategoryWord) {
			return newCategoryWord;
		} else if (oldCategoryWord) {
			return oldCategoryWord;
		}
		// This is passed when a category not present in array is encountered
		return '';
	}

	function getFromSession() {
		if (window.sessionStorage) {
			return sessionStorage.getItem('cat');
		}
	}

	function storeInSession(newCategoryWord, oldCategory) {
		if (window.sessionStorage) {
			sessionStorage.setItem('cat', addInSession(newCategoryWord, oldCategory));
		}
	}

	var isDesktop = (function () {
		var isDesktop = true;
		if (($('html').hasClass('touch-enabled') && $(window).width() <= 1024) || $(window).width() < 1024) {
			isDesktop = false;
		}
		return function () {
			return isDesktop;
		};
	})();


	function VoiceTextHandler(data) {
		this.store = new Store(data);
		this.domManipulator = new DOMManipulator();
		this.selectedFilters;
	}

	VoiceTextHandler.prototype.getFromSearchBox = function () {
		if ($searchValue.val() !== '') {
			var query = $searchValue.val();
			words = query.split(" ");
			return this.getCategoryWord('categories', words)
		}
		return '';
	}

	VoiceTextHandler.prototype.getCategoryWord = function (baseKey, nestedKey) {
		for (var i = 0; i < nestedKey.length; i++) {
			for (var j = 0; j < nestedKey.length; j++) {

				// A check for n-grams if available in the categories
				var joinedStr = nestedKey.slice(i, j + 1).join(" ");
				if (this.store.get(baseKey, joinedStr)) {
					return joinedStr;
				}
			}
		}
		return '';
	};

	VoiceTextHandler.prototype.applyFilter = function (redirectFlag, keyword) {
		setTimeout(closeDialog, 1000);
		if (redirectFlag && this.selectedFilters.length <= 0) {
			redirect(keyword);
		}
		if (redirectFlag) {
			$(window).trigger(this.domManipulator.filterTrigger, [this.selectedFilters]);
		}
	}

	VoiceTextHandler.prototype.filters = function (nestedKey) {
		for (var i = 0; i < this.store.filterNames.length; i++) {
			var identifier = this.store.get(this.store.filterNames[i], nestedKey);
			if (identifier) {
				this.selectedFilters.push({
					parent: this.store.filterNames[i],
					value: capitalizeFirstLetter(nestedKey),
					type: identifier
				});
			}
		}
	};

	VoiceTextHandler.prototype.checkFilter = function (keyword) {
		var popupOpened = false;
		var words = keyword.split(" ");
		this.selectedFilters = [];
		
		var oldCategory = getFromSession() || this.getFromSearchBox();
		var newCategory = this.getCategoryWord('categories', words);

		if (!oldCategory || oldCategory !== newCategory) {
			for (var i = 0; i < words.length; i++) {
				if (this.domManipulator.filtersToBeHandled.includes(words[i])) {
					popupOpened = this.domManipulator.checkWordForPopup(words[i]);
				}
				if (popupOpened) {
					break;
				} else {
					this.filters(words[i])
				}
			}
			this.applyFilter(!popupOpened, keyword);
		} else {
			redirect(keyword);
		}
		storeInSession(newCategory, oldCategory);
	};
	window.VoiceTextHandler = new VoiceTextHandler({
		options: {
			'categories': {
				'shoes': 'true', 'jewellery': 'true', 'accessories': 'true', 'home and furniture': 'true', 'sports': 'true',
				'clothing': 'true', 'peep toes': 'true', 'toys': 'true', 'kids toys': 'true', 'kids shoes': 'true', 'sandals': 'true', 'slippers': 'true',
				'sneakers': 'true', 'flip flops': 'true', 'bellies': 'true', 'formal shoes': 'true', 'boots': 'true', 'floaters': 'true', 'beauty': 'true',
				'women beauty': 'true', 'fragrances': 'true', 'perfumes and edts': 'true', 'deodorants and colognes': 'true', 'gift sets': 'true',
				'make up': 'true', 'lips': 'true', 'lipstick': 'true', 'lip gloss': 'true', 'lip liner': 'true', 'lip pencil': 'true', 'lip pallete': 'true',
				'lip brush': 'true', 'eye': 'true', 'kajal': 'true', 'eye liner': 'true', 'kurta': 'true', 'kurti': 'true', 'suits': 'true', 'saree': 'true',
				'tops': 'true', 'tees': 'true', 'shirt': 'true', 'jeans': 'true', 'leggings': 'true', 'sunglasses': 'true', 'dresses': 'true', 'watches': 'true',
				'polos': 'true', 'shorts': 'true', 'skirts': 'true', 'trousers': 'true', 'top': 'true', 'pants': 'true', 'pant': 'true','sheets': 'true',
				'bedsheets': 'true', 'shirts':'true','trouser': 'true','jacket': 'true','sweater':'true'
			},
			'colors': {
				'black': 'checkbox', 'brown': 'checkbox', 'purple': 'checkbox', 'blue': 'checkbox', 'red': 'checkbox',
				'green': 'checkbox', 'tan': 'checkbox', 'transparent': 'checkbox', 'white': 'checkbox', 'yellow': 'checkbox',
				'maroon': 'checkbox', 'orange': 'checkbox', 'copper': 'checkbox', 'silver': 'checkbox', 'khaki': 'checkbox'
			},
			'gender': {
				'men': 'input', 'women': 'input', 'kids': 'input', 'girls': 'input', 'boys': 'input', 'unisex': 'input'
			}
		},
		filterNames: ['colors', 'gender']
	});

})(window);
	var colorIdx = GetCookie("colorIdx");
	switch (Number(colorIdx)) {
		case 1:
			document.getElementById("css1").removeAttribute("disabled");
			break;
		case 2:
			document.getElementById("css2").removeAttribute("disabled");
			break;
		case 3:
			document.getElementById("css3").removeAttribute("disabled");
			break;
	};

	function SetCss(obj) {
		var idx = obj.selectedIndex;
		SetCookie("colorIdx", idx);
		window.location.reload();
	};

	function GetCookie(key) {
		var tmp = document.cookie + ";";
		var tmp1 = tmp.indexOf(key, 0);
		if (tmp1 != -1) {
			tmp = tmp.substring(tmp1, tmp.length);
			var start = tmp.indexOf("=", 0) + 1;
			var end = tmp.indexOf(";", start);
			return (decodeURIComponent(tmp.substring(start, end)));
		}
		return ("");
	};

	function SetCookie(key, val) {
		document.cookie = key + "=" + encodeURIComponent(val) + ";max-age=31536000;";
	}
	colorIdx = GetCookie('colorIdx');
	var select_mystyle = document.getElementById("mystyle");
	if(select_mystyle){
		document.getElementById("mystyle").selectedIndex = colorIdx;
	};

	jQuery(function() {
		window.onpageshow = function () {
			var $btn = $('[type="submit"]');
			//disbledを解除
			$btn.prop('disabled', false);
			$btn.click(function () { //送信ボタン2度押し対策
				$(this).prop('disabled', true);
				$(this).closest('form').submit();
			});
		}
		// https://cotodama.co/pagetop/
		var pagetop = $('#page_top');   
		pagetop.hide();
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {  //100pxスクロールしたら表示
				pagetop.fadeIn();
			} else {
				pagetop.fadeOut();
			}
		});
		pagetop.click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 500); //0.5秒かけてトップへ移動
			return false;
		});
		// https://www.webdesignleaves.com/pr/plugins/luminous-lightbox.html
		const luminousElems = document.querySelectorAll('.luminous');
		//取得した要素の数が 0 より大きければ
		if( luminousElems.length > 0 ) {
			luminousElems.forEach( (elem) => {
			new Luminous(elem);
			});
		}
		const paintform = document.getElementById("paint_form");
		if(paintform){
			paintform.onsubmit = function (){
				if(paintform.picw){
					SetCookie("picwc",paintform.picw.value);
				}
				if(paintform.pich){
					SetCookie("pichc",paintform.pich.value);
				}
				if(paintform.shi){
					SetCookie("appletc",paintform.shi.value);
				}
			}
		};
		const commentform = document.getElementById("comment_form");
		if(commentform){
			commentform.onsubmit = function (){
				if(commentform.name){
					SetCookie("namec",commentform.name.value);
				}
				if(commentform.url){
					SetCookie("urlc",commentform.url.value);
				}
				if(commentform.pwd){
					SetCookie("pwdc",commentform.pwd.value);
				}
			}
		};
	});


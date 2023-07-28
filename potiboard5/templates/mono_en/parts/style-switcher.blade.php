<style>
	@if(!$is_IE)
			html {
			visibility: hidden;
		}
	@endif
		html.ie {
			visibility: visible;
		}
</style>
<noscript>
	<style>
	html {
		visibility: visible;
	}
	</style>
</noscript>
<script>
	// IEを検出する関数
	function isIE() {
		const ua = window.navigator.userAgent;
		const msie = ua.indexOf('MSIE ');
		const trident = ua.indexOf('Trident/');
		return msie > 0 || trident > 0;
	}

	// EdgeのIEモードを検出する関数
	function isEdgeIE() {
		return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
	}

	// IEかEdgeのIEモードならtrueを返す
	if (isIE() || isEdgeIE()) {
		document.documentElement.className += 'ie'; // <html>要素にクラス名を追加
	}
</script>

<link rel="stylesheet" href="{{$skindir}}css/mono_main.css?{{$ver}}">
<link rel="stylesheet" href="{{$skindir}}css/mono_dark.css?{{$ver}}" id="css1" disabled>
<link rel="stylesheet" href="{{$skindir}}css/mono_deep.css?{{$ver}}" id="css2" disabled>
<link rel="stylesheet" href="{{$skindir}}css/mono_mayo.css?{{$ver}}" id="css3" disabled>

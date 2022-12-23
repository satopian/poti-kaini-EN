<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<link rel="stylesheet" href="{{$skindir}}css/mono_main.css">
	<link rel="stylesheet" href="{{$skindir}}css/mono_dark.css" id="css1" disabled>
	<link rel="stylesheet" href="{{$skindir}}css/mono_deep.css" id="css2" disabled>
	<link rel="stylesheet" href="{{$skindir}}css/mono_mayo.css" id="css3" disabled>
	<link rel="preload" as="style" href="{{$skindir}}icomoon/style.css" onload="this.rel='stylesheet'">
	<link rel="preload" as="script" href="lib/{{$jquery}}">
	<link rel="preload" as="script" href="loadcookie.js">
	<link rel="preload" as="script" href="{{$skindir}}js/mono_common.js">
	<style>
		.input_disp_none {
			display: none;
		}
	</style>
	<title>{{$title}}</title>
</head>

<body>
	<header>
		<h1><a href="{{$self2}}">{{$title}}</a></h1>
		<div>
			<a href="{{$home}}" target="_top">[Home]</a>
			<a href="{{$self}}?mode=admin">[Admin mode]</a>
		</div>
		<hr>
		<div>
			<nav class="menu">
				<a href="{{$self2}}">[Top]</a>
				@if($for_new_post)
				<a href="{{$self}}?mode=newpost">[Post]</a>
				@endif
				[Catalog]
				<a href="{{$self}}">[Normal mode]</a>
				<a href="{{$self}}?mode=piccom">[Recover Images]</a>
				<a href="#footer" title="to bottom">[↓]</a>
			</nav>
			<hr>
			<h2><span class="oyano"></span>Catalog mode</h2>
		</div>
	</header>
	<main>
		<div id="catalog">
			<hr>
			<div>
				@if(isset($oya) and !(empty($oya)))
				@foreach ($oya as $i => $ress)
				@foreach ($ress as $res)
				<div>
					@if($res['imgsrc'])
					<p><a href="{{$self}}?res={{$res['no']}}" title="{{$res['sub']}} by {{$res['name']}}"><img
								src="{{$res['imgsrc']}}" alt="{{$res['sub']}} by {{$res['name']}}" width="{{$res['w']}}"
								@if($res['h']) height="{{$res['h']}}" @endif @if($i>23)loading="lazy"@endif></a></p>
					@endif
					@if($res['txt'])
					<p><a href="{{$self}}?res={{$res['no']}}"
							title="{{$res['sub']}} by {{$res['name']}}">{{$res['sub']}} by {{$res['name']}}</a></p>
					@endif
					<p>[{{$res['no']}}] {{$res['now']}}@if($res['updatemark']){{$res['updatemark']}}@endif
						@if($res['id']) ID:{{$res['id']}}@endif</p>
				</div>
				@endforeach @endforeach
				@endif

			</div>
			<hr>
		</div>
	</main>
	<footer id="footer">
		<div>
			{{-- 前、次のナビゲーション --}}
			@include('parts.mono_prev_next')

			{{--  メンテナンスフォーム欄  --}}
			@include('parts.mono_mainte_form')

		</div>
				{{--  Copyright notice, do not delete  --}}
				@include('parts.mono_copyright')
	</footer>
	<div id="page_top"><a class="icon-angles-up-solid"></a></div>
	<script src="loadcookie.js"></script>
	<script>
	document.addEventListener('DOMContentLoaded',l,false);
	</script>
	<script src="lib/{{$jquery}}"></script>
	<script src="{{$skindir}}js/mono_common.js"></script>
</body>

</html>
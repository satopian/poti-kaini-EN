<!DOCTYPE html>
<html lang="en" id="search">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<link rel="preload" as="style" href="{{$skindir}}icomoon/style.css" onload="this.rel='stylesheet'">
	<link rel="preload" as="script" href="lib/{{$jquery}}">
	<link rel="preload" as="script" href="{{$skindir}}js/mono_common.js">
	<link rel="stylesheet" href="{{$skindir}}css/mono_main.css">
	<link rel="stylesheet" href="{{$skindir}}css/mono_dark.css" id="css1" disabled>
	<link rel="stylesheet" href="{{$skindir}}css/mono_deep.css" id="css2" disabled>
	<link rel="stylesheet" href="{{$skindir}}css/mono_mayo.css" id="css3" disabled>
	<style>
		img {
			height: auto;
		}
	</style>
	@if(!$imgsearch)
	<style>
		.article {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			padding: 3px 0;
			border-bottom: 1px dashed #8a8a8a;
			line-height: 3em;
		}

		img {
			max-width: 300px;
			margin: 12px 0 0;
		}
	</style>
	@endif
	<title>Displaying {{$title}}</title>
</head>

<body>
	<div id="main">
		<div class="title">
			<h1>Displaying {{$h1}}</h1>
		</div>
		<nav>
			<div class="menu">
				[<a href="./@if($php_self2){{$php_self2}}@endif">Return to bulletin board</a>]
				@if($imgsearch)
				[<a href="?page=1&imgsearch=off{{$query_l}}">Comments</a>]
				@else
				[<a href="?page=1&imgsearch=on{{$query_l}}">Images</a>]
				@endif


			</div>
		</nav>
		<p></p>
		<form method="get" action="./search.php">
			<span class="radio">
				<input type="radio" name="radio" id="author" value="1" @if($radio_chk1)checked="checked"@endif><label for="author"
					class="label">Name</label>
				<input type="radio" name="radio" id="exact" value="2" @if($radio_chk2)checked="checked"@endif><label for="exact"
					class="label">Exact</label>
				<input type="radio" name="radio" id="fulltext" value="3" @if($radio_chk3)checked="checked"@endif><label for="fulltext"
					class="label">Body</label>
			</span>
			<br>
			@if($imgsearch)
			<input type="hidden" name="imgsearch" value="on">
			@else
			<input type="hidden" name="imgsearch" value="off">
			@endif
			<input type="text" name="query" placeholder="Search Word" value="{{$query}}">
			<input type="submit" value="Search">
		</form>
		<p></p>
		<!-- 反復 -->
		@if($comments)
		@if($imgsearch)
		<div class="newimg">
			<ul>@foreach ($comments as $comment)<li class="catalog"><a href="{{$comment['link']}}" target="_blank"><img
							src="{{$comment['img']}}"
							alt="{{$comment['sub']}} Illustration/{{$comment['name']}} {{$comment['postedtime']}}"
							title="{{$comment['sub']}} by {{$comment['name']}} {{$comment['postedtime']}}"
							loading="lazy" width="{{$comment['w']}}" height="{{$comment['h']}}"></a></li>@endforeach</ul>

		</div>
		@else
		@foreach ($comments as $comment)
		<div>
			<div class="article">
				<div class="comments_title_wrap">
					<h2><a href="{{$comment['link']}}" target="_blank">{{$comment['sub']}}</a></h2>
					{{$comment['postedtime']}}<br><span class="name"><a
							href="?page=1&query={{$comment['encoded_name']}}&radio=2"
							target="_blank">{{$comment['name']}}</a></span>
				</div>
				@if ($comment['img'])
				<a href="{{$comment['link']}}" target="_blank"><img src="{{$comment['img']}}"
						alt="{{$comment['sub']}} by {{$comment['name']}}" loading="lazy" width="{{$comment['w']}}" height="{{$comment['h']}}"></a><br>
				@endif
				{{$comment['com']}}
				<div class="res_button_wrap">
					<form action="{{$comment['link']}}" method="post" target="_blank"><input type="submit" value=" Reply "
							class="res_button"></form><span class="page_top"><a href="#top">△</a></span>
				</div>
			</div>
		</div>
		@endforeach
		@endif
		@endif
		<p></p>

		<!-- 最終更新日時 -->
		<p>new arrival {{$img_or_com}}.</p>
		@if($lastmodified)
		<p>last modified: {{$lastmodified}}</p>
		@endif

		<footer>
			<nav>
				<div class="leftbox">
					<!-- ページング -->
					{!!$prev!!}@if($nxet) | {!!$nxet!!} @endif
				</div>
				<!-- 著作表示 消さないでください -->
				<div class="rightbox">- <a href="https://paintbbs.sakura.ne.jp/poti/"
						target="_blank">search</a> -</div>
				<div class="clear"></div>
			</nav>
		</footer>

	</div>
	<div id="bottom"></div>
	<div id="page_top"><a class="icon-angles-up-solid"></a></div>
	<script src="lib/{{$jquery}}"></script>
	<script src="{{$skindir}}js/mono_common.js"></script>
</body>

</html>
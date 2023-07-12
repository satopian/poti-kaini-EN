<!DOCTYPE html>
<!-- Mastodon、misskey等の分散型SNSへ記事を共有 -->
<!-- (c)satopian 2023 MIT LICENSE -->
<html id="search">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="preload" as="script" href="lib/{{$jquery}}">
	<link rel="preload" as="script" href="{{$skindir}}js/mono_common.js?{{$ver}}">
	@include('parts.style-switcher')
	<style>
	form.form_radio_sns_server {
	margin: 1em 0 0;
	}
	#search body,input[type=submit]{
		font-size: 18px;
	}
	.form_radio_sns_server label{
		display: block;
		margin: 0 0 5px;
		padding: 2px;
		border-radius: 5px;
	}
	.form_radio_sns_server input[type="radio"]{
		display: none;
	}
	.form_radio_sns_server input[type="text"]{
		margin: 3px 0;
	}
	input.post_share_button {
    width: 100%;
	margin: 8px 0 0;
	}
	:not(input){
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	</style>
	<title>Share</title>
</head>
<body>
<form action="{{$self}}" method="POST" class="form_radio_sns_server">
@foreach($servers as $i => $server)
	<input type="radio" name="sns_server_radio" value="{{$server[1]}}" id="{{$i}}" 
	@if($i===0||$server[1]===$sns_server_radio_cookie) checked="checked"@endif>
			<label for="{{$i}}">{{$server[0]}}</label>
@endforeach
<input type="text" name="sns_server_direct_input" value="{{$sns_server_direct_input_cookie}}">
<br>
<?php if($en):?>Example<?php else:?>例<?php endif;?>
: https://mstdn.jp/
<br>
<input type="hidden" name="encoded_t" value="{{$encoded_t}}">
<input type="hidden" name="encoded_u" value="{{$encoded_u}}">
<input type="hidden" name="mode" value="post_share_server">
<input type="submit" value="@if($en) Share @else シェア @endif" class="post_share_button">
<script src="lib/{{$jquery}}"></script>
<script src="{{$skindir}}js/mono_common.js?{{$ver}}"></script>
</form>
</body>
</html>

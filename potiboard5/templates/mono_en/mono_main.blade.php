<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	@include('parts.style-switcher')
	<link rel="preload" as="style" href="{{$skindir}}icomoon/style.css" onload="this.rel='stylesheet'">
	<link rel="preload" as="script" href="lib/{{$jquery}}">
	<link rel="preload" as="style" href="lib/lightbox/css/lightbox.min.css" onload="this.rel='stylesheet'">
	<link rel="preload" as="script" href="lib/lightbox/js/lightbox.min.js">
	<link rel="preload" as="script" href="loadcookie.js?{{$ver}}">
	<link rel="preload" as="script" href="{{$skindir}}js/mono_common.js?{{$ver}}">
	<style>
		.input_disp_none {
			display: none;
		}
	</style>
	<title>{{$title}}</title>
	@if($notres)
	{{-- I would be happy if you could change this area.
	Please ask google for the detailed meaning. --}}
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content="">
	<meta property="og:site_name" content="">
	<meta property="og:title" content="{{$title}}">
	<meta property="og:type" content="article">
	<meta property="og:description" content="">
	<meta property="og:image" content="{{$rooturl}}{{$skindir}}img/og.png">
	<meta property="og:image:width" content="1028">
	<meta property="og:image:height" content="1028">
	<meta property="og:url" content="{{$rooturl}}">
	<meta name="description" content="">
	@endif
	@if($resno)
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content="">
	<meta property="og:site_name" content="">
	<meta property="og:title"
		content="[{{$oya[0][0]['no']}}] {{$oya[0][0]['sub']}} by {{$oya[0][0]['name']}} - {{$title}}">
	<meta property="og:type" content="article">
	<meta property="og:description" content="{{$oya[0][0]['descriptioncom']}}">
	<meta property="og:url" content="{{$rooturl}}{{$self}}?res={{$oya[0][0]['no']}}">
	@if ($oya[0][0]['src'])
	<meta property="og:image" content="{{$rooturl}}{{$oya[0][0]['imgsrc']}}">
	<meta property="og:description" content="{{$oya[0][0]['descriptioncom']}}">
	@endif
	@endif
	<style id="for_mobile"></style>
</head>

<body>
	<header id="header">
		<h1><a href="{{$self2}}">{{$title}}</a></h1>
		<div>
			<a href="{{$home}}" target="_top">[Home]</a>
			@if($use_admin_link)<a href="{{$self}}?mode=admin">[Admin mode]</a>@endif

		</div>
		<hr>
		<div>
			<nav class="menu">
				<a href="{{$self2}}">[Top]</a>
				@if($for_new_post)
				<a href="{{$self}}?mode=newpost">[Post]</a>
				@endif
				<a href="{{$self}}?mode=catalog">[Catalog]</a>
				[Normal mode]
				<a href="{{$self}}?mode=piccom">[Recover Images]</a>
				<a href="#footer" title="to bottom">[↓]</a>
			</nav>
			<hr>
			@if($resno)
			@if($form)
			<p class="resm">
				Reply mode
				@if($resname)
					<script>
					const add_to_com = ()=> {
						const textField = document.getElementById("p_input_com");
						const postername = {!! json_encode(htmlspecialchars_decode($resname).$_san,JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT) !!};

						// テキストフィールドの現在のカーソル位置を取得
						const startPos = textField.selectionStart;
						const endPos = textField.selectionEnd;
						// カーソル位置に指定した文字列を挿入
						textField.value = textField.value.substring(0, startPos) + postername + textField.value.substring(endPos);
						// カーソル位置を更新
						const newCursorPosition = startPos + postername.length;
						textField.setSelectionRange(newCursorPosition, newCursorPosition);						// テキストフィールドにフォーカスを設定
						textField.focus();
					}
					</script>
				{{-- copy button  --}}
				<button class="copy_button" onclick="add_to_com()">Copy the poster name</button>
				@endif
			</p>
			<hr>
	@endif
	@endif
	@if($paintform)
	@if($resno or !$diary)
	@if($resno)
			<p class="resm">Reply with oekaki</p>
			<hr>
		@endif
		<div class="epost">
			{{-- ペイントフォーム --}}
			@include('parts.mono_paint_form',['admin'=>$admin])
		</div>

	@endif

		<div class="epost">
		@if ($notres and (!$diary or $addinfo))
			<ul>
			@if ($paint2 and !$diary)
			<li>Canvas size is width {{$pminw}}px to {{$pmaxw}}px, height {{$pminh}}px to {{$pmaxh}}px.</li>
			<li>Images larger than width {{$maxw}}px height {{$maxh}}px will be thumbnailed.</li>
			@endif
			{!!$addinfo!!}
		</ul>
		@endif	
		</div>
		@endif
		@if($form)
			<div>
			<form action="{{$self}}" method="post" enctype="multipart/form-data" id="comment_form">
				<input type="hidden" name="token" value="@if($token){{$token}}@endif">
				<input type="hidden" name="mode" value="regist">
				@if($resno)<input type="hidden" name="resto" value="{{$resno}}">@endif
				<input type="hidden" name="MAX_FILE_SIZE" value="{{$maxbyte}}">
				<table>
					<tr>
						<td>Name @if($usename){{$usename}}@endif</td>
						<td><input class="form" type="text" name="name" size="28" value="" autocomplete="username">
						</td>
					</tr>
					<tr>
						<td>Email</td>
						<td><input class="form" type="text" name="email" size="28" value="" autocomplete="email">
						</td>
					</tr>
					@if($use_url_input)
					<tr>
						<td>URL</td>
						<td><input class="form" type="text" name="url" size="28" autocomplete="url"></td>
					</tr>
					@endif
					<tr>
						<td>Subject @if($usesub){{$usesub}}@endif</td>
						<td>
							<input class="form" type="text" name="sub" size="20" value="@if($resub){{$resub}}@endif"
								autocomplete="section-sub">
							<input class="button" type="submit" value="Post">
						</td>
					</tr>
					<tr>
						<td>Comment @if($usecom){{$usecom}}@endif</td>
						<td><textarea class="form" name="com" cols="28" rows="4" wrap="soft"
								id="p_input_com"></textarea></td>
					</tr>
					@if($upfile)
					<tr>
						<td>File</td>
						<td>
							<input class="form" type="file" name="upfile" accept="image/*">
							<img id="attach_preview" style="max-width:100px;max-height:100px; display:block;">
						</td>
					</tr>
					@endif
					<tr>
						<td>Password</td>
						<td><input class="form" type="password" name="pwd" value=""
								autocomplete="current-password"><small>(For editing and deleting)</small></td>
					</tr>
				</table>
				<ul>
					@if($upfile)
					<li>Attachable files type: GIF, JPG, PNG and WEBP. </li>
					<li>Attached image larger than width {{$maxw_px}}px height {{$maxh_px}}px will be reduced size.</li>
					@endif
					@if($paintform or $upfile)
					<li>Images larger than width {{$maxw}}px height {{$maxh}}px will be  will be thumbnailed.</li>
					<li>The maximum amount of posted data is {{$maxkb}}KB. With sage function.</li>
					@endif
					{!!$addinfo!!}
				</ul>
			</form>
		</div>
	@endif
	</div>
	</header>

	<main>
		<section>
			{{-- スレッドのループ --}}
			@foreach ($oya as $i=>$ress)
			<div class="thread">

				@if(isset($ress) and !@empty($ress))
				@foreach ($ress as $res)
				{{-- 記事表示 --}}
				@if ($loop->first)
				{{-- 最初のループ --}}
				{{-- レスモードの時 --}}
				@if($resno)
				<h2><span class="oyano">[{{$res['no']}}]</span> {{$res['sub']}}</h2>
				@else
				<h2><a href="{{$self}}?res={{$res['no']}}"><span class="oyano">[{{$res['no']}}]</span>
						{{$res['sub']}}</a></h2>
				@endif
				{{-- 親記事のヘッダ --}}
				<h3>
				@if(!isset($res['not_deleted'])||$res['not_deleted'])
					<span class="name"><a
							href="{{$self}}?mode=search&page=1&amp;imgsearch=on&amp;query={{$res['encoded_name']}}&amp;radio=2"
							target="_blank" rel="noopener">{{$res['name']}}</a></span><span
						class="trip">{{$res['trip']}}</span> :
					{{$res['now']}}@if($res['id']) ID : {{$res['id']}}@endif @if($res['url']) <span class="url">[<a
							href="{{$res['url']}}" target="_blank" rel="nofollow noopener noreferrer">URL</a>]</span>
					@endif @if($res['updatemark']){{$res['updatemark']}}@endif
				@endif
				</h3>
				<hr>
				@else
				<hr>
				{{-- 子レス --}}
				<div class="res">
					{{-- 子レスヘッダ --}}
					<h4>
					<span class="oyaresno" id="{{$res['no']}}">[{{$res['no']}}]</span>
					@if(!isset($res['not_deleted'])||$res['not_deleted'])
						<span class="rsub">{{$res['sub']}}</span> :
						<span class="name"><a
							href="{{$self}}?mode=search&page=1&amp;imgsearch=on&amp;query={{$res['encoded_name']}}&amp;radio=2"
								target="_blank" rel="noopener">{{$res['name']}}</a></span><span
							class="trip">{{$res['trip']}}</span> : {{$res['now']}}@if($res['id']) ID :
						{{$res['id']}}@endif @if($res['url']) <span class="url">[<a href="{{$res['url']}}"
								target="_blank" rel="nofollow noopener noreferrer">URL</a>]</span>@endif
						@if($res['updatemark']) {{$res['updatemark']}}@endif
					@endif
					</h4>
				{{-- 子レスヘッダここまで --}}
				@endif
					{{-- 親子共通 --}}
					@if($res['src'])
					<div class="img_info_wrap">
						<a href="{{$res['src']}}" target="_blank" data-lightbox="filename_{{$res['no']}}">{{$res['srcname']}}</a>
						({{$res['size_kb']}} KB)
						@if($res['thumb']) - Showing thumbnail - @endif @if($res['painttime']) PaintTime :
						{{$res['painttime']}}@endif
						@if($res['tool'])<span class="article_info_desc"> Tool :
						{{$res['tool']}}</span>@endif
						<br>
						@if($res['continue']) <a
							href="{{$self}}?mode=continue&amp;no={{$res['continue']}}&amp;resno={{$ress[0]['no']}}">*Continue</a>@endif
						@if($res['spch'])<span class="for_pc">@endif @if($res['pch']) <a
								href="{{$self}}?mode=openpch&amp;pch={{$res['pch']}}&amp;resno={{$ress[0]['no']}}&no={{$res['no']}}" target="_blank">*Replay</a>@endif
							@if($res['spch'])</span>@endif
					</div>
					<figure @if($res['w']>=750) style="float:none;margin-right:0"@endif>
						<a href="{{$res['src']}}" target="_blank" rel="noopener" data-lightbox="{{$ress[0]['no']}}">
							<img src="{{$res['imgsrc']}}" alt="{{$res['sub']}} by {{$res['name']}}"
								title="{{$res['sub']}} by {{$res['name']}}" width="{{$res['w']}}"
								height="{{$res['h']}}" @if($i>4)loading="lazy"@endif>
						</a>
					</figure>
					@endif
					<div class="comment_wrap">
					<p>{!!$res['com']!!}
						@if(isset($res['not_deleted'])&&!$res['not_deleted'])
						This post does not exist.
						@endif
					</p>
				</div>
				{{-- 最初のループならレス省略件数を表示 --}}
					@if ($loop->first)
					@if ($res['skipres'])
					<hr>
					<div class="article_skipres">
						{{$res['skipres']}} 
						@if($res['skipres']>1) posts @else post @endif
						 omitted.
					</div>
					@endif
					@endif
					{{-- 子レスなら --}}
					@if (!$loop->first)
			</div>
			@endif
			@endforeach
			@endif
			<div class="thfoot">
				<hr>
				@if($sharebutton)
				{{-- シェアボタン --}}
				<span class="share_button">
					@if($switch_sns)
						<a href="{{$self}}?mode=set_share_server&encoded_t={{$ress[0]['encoded_t']}}&amp;encoded_u={{$ress[0]['encoded_u']}}" onclick="open_sns_server_window(event,{{$sns_window_width}},{{$sns_window_height}})"><span
						class="button"><img src="{{$skindir}}img/share-from-square-solid.svg" alt=""> Share on SNS</span></a>
					@else
						<a target="_blank"
						href="https://twitter.com/intent/tweet?text={{$ress[0]['encoded_t']}}&url={{$ress[0]['encoded_u']}}"><span
						class="button"><img src="{{$skindir}}img/twitter.svg" alt=""> Tweet</span></a>
						<a target="_blank" class="fb btn"
							href="http://www.facebook.com/share.php?u={{$ress[0]['encoded_u']}}"><span
								class="button"><img src="{{$skindir}}img/facebook.svg" alt="">
								Share</span></a>
					@endif
				</span>
				@endif
				@if($notres)<span class="button"><a href="{{$self}}?res={{$ress[0]['no']}}"><img
							src="{{$skindir}}img/rep.svg" alt=""> @if($ress[0]['disp_resbutton'])Reply @else
							View @endif</a></span>@endif
				<a href="#header" title="to top">[&uarr;]</a>
			</div>
			</div>
			@endforeach
			{{-- スレッドループここまで --}}
		</section>
	</main>


	<footer id="footer">
		<div>

			<nav>
				@if($resno)
				<div class="pcdisp page">

					@if($res_prev)<a href="{{$self}}?res={{$res_prev['no']}}">≪{{$res_prev['substr_sub']}}</a>@endif
					| <a href="{{$self2}}">Top</a> |
					@if($res_next)<a href="{{$self}}?res={{$res_next['no']}}">
						{{$res_next['substr_sub']}}≫</a>@endif
				</div>

				<div class="mobiledisp">
					@if($res_prev)
					Prev: <a href="{{$self}}?res={{$res_prev['no']}}">{{$res_prev['sub']}}</a>
					<br>
					@endif
					@if($res_next)
					Next: <a href="{{$self}}?res={{$res_next['no']}}">{{$res_next['sub']}}</a>
					<br>
					@endif
				</div>

				@if($view_other_works)
				<div class="view_other_works">
					@foreach($view_other_works as $view_other_work)<div><a
							href="{{$self}}?res={{$view_other_work['no']}}"><img src="{{$view_other_work['imgsrc']}}" alt="{{$view_other_work['sub']}} by {{$view_other_work['name']}}" title="{{$view_other_work['sub']}} by {{$view_other_work['name']}}" width="{{$view_other_work['w']}}" height="{{$view_other_work['h']}}" loading="lazy"></a></div>@endforeach
				</div>
				@endif

				@endif

				@if($notres)

				{{-- 前、次のナビゲーション --}}
				@include('parts.mono_prev_next')

				@endif
			</nav>
			{{--  メンテナンスフォーム欄  --}}
			@include('parts.mono_mainte_form')

		</div>
		{{--  著作権表示 削除しないでください  --}}
		@include('parts.mono_copyright')
	</footer>
	<div id="page_top"><a class="icon-angles-up-solid"></a></div>
	<script src="loadcookie.js?{{$ver}}"></script>
	<script>
	document.addEventListener('DOMContentLoaded',l,false);
	</script>
	<script src="lib/{{$jquery}}"></script>
	<script src="lib/lightbox/js/lightbox.min.js"></script>
	<script src="{{$skindir}}js/mono_common.js?{{$ver}}"></script>
</body>

</html>
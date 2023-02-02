<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<link rel="stylesheet" href="{{$skindir}}css/mono_main.css">
	<link rel="stylesheet" href="{{$skindir}}css/mono_dark.css" id="css1" disabled>
	<link rel="stylesheet" href="{{$skindir}}css/mono_deep.css" id="css2" disabled>
	<link rel="stylesheet" href="{{$skindir}}css/mono_mayo.css" id="css3" disabled>
	<link rel="preload" as="script" href="lib/{{$jquery}}">
	<link rel="preload" as="style" href="lib/luminous/luminous-basic.min.css" onload="this.rel='stylesheet'">
	<link rel="preload" as="script" href="lib/luminous/luminous.min.js">
	<link rel="preload" as="style" href="{{$skindir}}icomoon/style.css" onload="this.rel='stylesheet'">
	<link rel="preload" as="script" href="{{$skindir}}js/mono_common.js">
	<style>
		.del_page form {
			display: inline-block;
		}

		.del_page {
			margin: 6px 0;
			display: inline-block;
		}
		.pchup_button {
			margin: 0 0 10px 0;
		}

</style>
	<title>{{$title}}</title>
	<style id="for_mobile"></style>
	<script>
		function is_mobile() {
			if (navigator.maxTouchPoints && (window.matchMedia && window.matchMedia('(max-width: 768px)').matches)){
				return	document.getElementById("for_mobile").textContent = ".for_pc{display: none;}";
			}
			return false;
		}
		document.addEventListener('DOMContentLoaded',is_mobile,false);
	</script>
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
				<a href="{{$self}}?mode=catalog">[Catalog]</a>
				<a href="{{$self}}">[Normal mode]</a>
				<a href="{{$self}}?mode=piccom">[Recover Images]</a>
				<a href="#footer" title="[&darr;]">[↓]</a>
			</nav>
		</div>
		<hr>
		{{-- <!-- 変則的に管理者お絵かきモードをここにも挿入 --> --}}
		@if($post_mode)
		@if($regist)
		<script type="text/javascript" src="loadcookie.js"></script>
		@endif
		@if($admin)@if($rewrite)@else
		@if($paint)
		<div class="epost">

			{{-- ペイントフォーム --}}
			@include('parts.mono_paint_form',['admin'=>$admin])

		</div>
		@endif
		@endif @endif
		@endif
		{{-- <!-- 管理者お絵かきモードおわり --> --}}
	</header>
	<main>
		@if($post_mode)
		{{-- ========== POST MODE(投稿モード) start ========== --}}
		{{-- 【NEW(新規投稿)、OEKAKI(お絵かき投稿)、UPDATE(編集)】 --}}

		<section>
			<div class="thread">
				<h2 class="oekaki">post form @if($admin) - ADMIN MODE-@endif</h2>
				@if($pictmp)
				<div class="tmpimg">
					@if($notmp)
					<p>There are no unposted oekaki images.</p>
					@endif
					@if($tmp)
					<div>
						@foreach ($tmp as $tmpimg)
						<figure>
							<img src="{{$tmpimg['src']}}">
							<figcaption>{{$tmpimg['srcname']}}[{{$tmpimg['date']}}]</figcaption>
						</figure>
						@endforeach
					</div>
					@endif
				</div>
				@endif
				<hr class="hr">
				@if($ptime)<p class="ptime">PaintTime : {{$ptime}}</p>
				@endif
			{{-- 未投稿画像の画像が無い時はフォームを表示しない --}}
			@if(!$notmp)
				<form class="" action="{{$self}}" method="post" enctype="multipart/form-data" @if(!$rewrite)id="comment_form"@endif>
					<input type="hidden" name="token" value="{{$token}}">

					<table>
						<tr>
							<td>Name @if($usename){{$usename}}@endif</td>
							<td><input class="form" type="text" name="name" size="28" autocomplete="username" @if($name)
									value="{{$name}}" @endif></td>
						</tr>
						<tr>
							<td>Mail</td>
							<td><input class="form" type="text" name="email" size="28" autocomplete="email" @if($email)
									value="{{$email}}" @endif></td>
						</tr>
						@if($use_url_input)
						<tr>
							<td>URL</td>
							<td>
								<input class="form" type="text" name="url" size="28" autocomplete="url" @if($url)
									value="{{$url}}" @endif></td>
						</tr>
						@endif
						<tr>
							<td>Sub @if($usesub){{$usesub}}@endif</td>
							<td>
								<input class="form" type="text" name="sub" size="20" autocomplete="section-sub"
									@if($sub) value="{{$sub}}" @endif>
								<input class="button" type="submit" value="Post">
								@if($regist)
								<input type="hidden" name="mode" value="regist">
								@endif
								{{-- <!--モード指定:編集--> --}}
								@if($rewrite)
								<input type="hidden" name="mode" value="rewrite">
								@if($thread_no)<input type="hidden" name="thread_no" value="{{$thread_no}}">@endif
								@if($logfilename)<input type="hidden" name="logfilename" value="{{$logfilename}}">@endif
								@if($mode_catalog)<input type="hidden" name="mode_catalog"
									value="{{$mode_catalog}}">@endif
								@if($catalog_pageno)<input type="hidden" name="catalog_pageno"
									value="{{$catalog_pageno}}">@endif
								@if(!$catalog_pageno)<input type="hidden" name="catalog_pageno" value="0">@endif
								<input type="hidden" name="no" value="{{$rewrite}}">
								<input type="hidden" name="pwd" value="{{$pwd}}">
								@endif
								@if($admin)
								<input type="hidden" name="admin" value="{{$admin}}">
								@endif
								@if($pictmp)
								<input type="hidden" name="pictmp" value="{{$pictmp}}">
								@endif
								@if($ptime)
								<input type="hidden" name="ptime" value="{{$ptime}}">
								@endif
								<!--レスお絵かき対応-->
								@if($resno)
								<input type="hidden" name="resto" value="{{$resno}}">
								@endif
								<input type="hidden" name="MAX_FILE_SIZE" value="{{$maxbyte}}">
								@if($ipcheck)Checking IP address ...@endif
							</td>
						</tr>
						<tr>
							<td>com @if($usecom){{$usecom}}@endif</td>
							<td><textarea class="form" name="com" cols="48" rows="4"
									wrap="soft">@if($com){{$com}}@endif</textarea></td>
						</tr>
						@if($upfile)
						<tr>
							<td>UpFile</td>
							<td><input class="form" type="file" name="upfile" size="35" accept="image/*">
							</td>
						</tr>
						@endif
						@if($tmp)
						@php 
						rsort($tmp);
						@endphp
		
						<tr>
							<td>Images</td>
							<td><select name="picfile">
									@foreach ($tmp as $tmpimg)
									<option value="{{$tmpimg['srcname']}}">{{$tmpimg['srcname']}}</option>
									@endforeach
								</select></td>
						</tr>
						@endif
						@if($regist)
						<tr>
							<td>Pass</td>
							<td><input class="form" type="password" name="pwd" value="" autocomplete="current-password">
								<small>(For editing and deleting)</small></td>
						</tr>
						@endif
					</table>
					@if($regist)
					<ul>
						@if($upfile)
						<li>Attachable files type: GIF, JPG, PNG and WEBP.</li>
						<li>Images larger than width {{$maxw}}px height {{$maxh}}px will be displayed in reduced size.</li>
						<li>The maximum amount of posted data is {{$maxkb}}KB. With sage function.</li>
						@endif
						@if($rewrite)
						<li>Cookies are not saved in edit mode. The position does not change even if sage is added.</li>
						<li>The maximum amount of posted data is {{$maxkb}}KB. With sage function.</li>
						@endif
					</ul>
					@endif
				</form>
			@endif
				@if($regist)
				<script>
				document.addEventListener('DOMContentLoaded',l,false);
				</script>
				@endif
			</div>
		</section>
		<!-- (========== POST MODE(投稿モード) end ==========) -->
		@endif
		@if($admin_in)
		<!-- (========== ADMIN MODE -LOGIN-(管理モード(認証)) start ==========) -->
		<section>
			<div class="thread">
				<h2 class="oekaki">Admin mode</h2>
				<form action="{{$self}}" method="post" class="adminin">
					<label><input type="radio" name="admin" value="update" checked>Update</label>
					<label><input type="radio" name="admin" value="del">Manage posts</label>
					<label><input type="radio" name="admin" value="post">Admin Post</label>
					<input type="hidden" name="mode" value="admin">
					<input class="form" type="password" name="pass">
					<input class="button" type="submit" value="ADMIN IN">
				</form>
			</div>
		</section>
		<!-- (========== ADMIN MODE -LOGIN-(管理モード(認証)) end ==========) -->
		@endif
		@if($admin_del)
		<!-- (========== ADMIN MODE -DELETE-(管理モード(削除)) start ==========) -->
		<section>
			<div class="thread">
				<h2 class="oekaki">Admin mode</h2>
				<form action="{{$self}}" method="post">
					<input type="hidden" name="admin" value="update">
					<input type="hidden" name="mode" value="admin">
					<input type="hidden" name="pass" value="{{$pass}}">
					<input type="submit" value="UPDATE" class="button delbtton">
					Update the html file
				</form>
				<hr>
				<form id="delete" action="{{$self}}" method="post" class="delmode">
					<input type="hidden" name="mode" value="admin">
					<input type="hidden" name="admin" value="del">
					<input type="hidden" name="pass" value="{{$pass}}">
					<p>Check the checkbox of the article you want to delete and press the delete button.</p>
					<input class="button delbtton" type="submit" value="DELETE">
					<input class="button delbtton" type="reset" value="RESET">
					<label>[<input type="checkbox" name="onlyimgdel" value="on">ImageOnly]</label>
				</form>
				<table class="delfo">
						<tr>
							<th>Check</th>
							<th>No</th>
							<th>Time</th>
							<th>Subject</th>
							<th>Name</th>
							<th>Comment</th>
							<th>Host</th>
							<th>Image (KB) </th>
							<th>MD5</th>
					</tr>
						@foreach ($dels as $del)
						<tr>
							<td><input form="delete" type="checkbox" name="del[]" value="{{$del['no']}}"></td>
							<td>
								<form action="{{$self}}" method="post" id="form{{$del['no']}}">
								<input type="hidden" name="del[]" value="{{$del['no']}}"><input type="hidden" name="pwd"
									value="{{$pass}}"><input type="hidden" name="mode" value="edit">
								<a href="javascript:form{{$del['no']}}.submit()">{{$del['no']}}</a></form>
							</td>
							<td>{{$del['now']}}</td>
							<td>{{$del['sub']}}</td>
							<td>{!!$del['name']!!}</td>
							<td>{{$del['com']}}</td>
							<td>{{$del['host']}}</td>
							<td>@if($del['src'])
								<a href="{{$del['src']}}" target="_blank" rel="noopener" class="luminous">{{$del['srcname']}}</a>
								({{$del['size_kb']}})KB @endif</td>
							<td>@if($del['src']){{$del['chk']}}@endif</td>
						</tr>
						@endforeach
					</table>
				@if($del_pages)
				@foreach($del_pages as $del_page)
				<div class="del_page">[
					<form action="{{$self}}" method="post" id="form_page{{$del_page['no']}}">
						<input type="hidden" name="mode" value="admin">
						<input type="hidden" name="admin" value="del">
						<input type="hidden" name="pass" value="{{$pass}}">
						<input type="hidden" name="del_pageno" value="{{$del_page['no']}}">
						@if($del_page['notlink'])
						<strong>{{$del_page['pageno']}}
						</strong>
					</form>
				@else
				<a href="javascript:form_page{{$del_page['no']}}.submit()">{{$del_page['pageno']}}</a></form>
				@endif
				]</div>
				@endforeach
				@endif



				<p>&lt;&lt;Image all size : {{$all}} KB &gt;&gt;</p>
			</div>
		</section>
		{{-- <!-- (========== ADMIN MODE -DELETE-(管理モード(削除)) end ==========) --> --}}
		@endif
		@if($err_mode)
		{{-- <!-- (========== ERROR MODE(エラー画面) start ==========) --> --}}
		<section>
			<div class="thread">
				<h2 class="oekaki">ERROR</h2>
				<p class="err">{!!$mes!!}</p>
				<p><a href="#" onclick="javascript:window.history.back(-1);return false;">[Back]</a></p>
			</div>
		</section>
		{{-- <!-- (========== ERROR MODE(エラー画面) end ==========) --> --}}
		@endif
	</main>
	<footer>
	{{--  Copyright notice, do not delete  --}}
		@include('parts.mono_copyright')
	</footer>
	<div id="page_top"><a class="icon-angles-up-solid"></a></div>
	<script src="lib/{{$jquery}}"></script>
	<script src="lib/luminous/luminous.min.js"></script>
	<script src="{{$skindir}}js/mono_common.js"></script>
</body>

</html>
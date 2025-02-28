<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<style>
		div#appstage,
		div#chickenpaint-parent {
			letter-spacing: initial;
			word-break: initial;
			overflow-wrap: initial;
		}

		.input_disp_none {
			display: none;
		}
	</style>
	@if(!$chickenpaint)
	@include('parts.style-switcher')
	<link rel="preload" as="script" href="lib/{{$jquery}}">
	<link rel="preload" as="script" href="{{$skindir}}js/mono_common.js?{{$ver}}">
	{{-- アプレットの幅がmax-widthを超える時はmax-widthにアプレット+パレットの幅を設定する --}}

	@isset($w)
	@if(($w+192)>1350)
	<style>
		header,
		main>section>.thread,
		main>div#catalog,
		footer>div,
		footer>div.copy {
			margin: 0px auto;
			display: block;

			max-width: calc({
					{
					$w
				}
			}

			px + 192px);
		}
	</style>
	@endif
	@endisset

	@endif

	@if($paint_mode)
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0">
	@endif
	@if($pch_mode)
	<meta name="viewport" content="width=device-width,initial-scale=1.0">@endif
	@if($continue_mode)
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0">
	<style>
		/* index.cssを更新しない人がいるかもしれないためインラインでも記述 */
		#span_cont_paint_same_thread {
			display: none;
		}
	</style>
	@endif
	@if($useneo)
	<link rel="stylesheet" href="neo.css?{{$parameter_day}}&{{$ver}}">
	<script src="neo.js?{{$parameter_day}}&{{$ver}}"></script>
	<script>
		Neo.handleExit=()=>{
			@if($rep)
			// 画像差し換えに必要なフォームデータをセット
			const formData = new FormData();
			formData.append("mode", "picrep"); 
			formData.append("no", "{{$no}}"); 
			formData.append("pwd", "{{$pwd}}"); 
			formData.append("repcode", "{{$repcode}}");

			// 画像差し換え

			fetch("{{$sefl}}", {
				method: 'POST',
				mode: 'same-origin',
				headers: {
					'X-Requested-With': 'PaintBBS'
					,
				},
			body: formData
			})
			.then(response => {
		// console.log("response",response);
				if (response.ok) {

					if (response.redirected) {
						return window.location.href = response.url;
						}
					response.text().then((text) => {
						//console.log(text);
						if (text.startsWith("error\n")) {
								console.log(text);
								return window.location.href = "?mode=piccom&stime={{$stime}}";
						}
					})
				}
			})
			.catch(error => {
				console.error('There was a problem with the fetch operation:', error);
				return window.location.href = "?mode=piccom&stime={{$stime}}";
			});
			@else
			return window.location.href = "?mode=piccom&stime={{$stime}}";
			@endif
			}
	</script>
	@endif
	@if($paint_mode)
	@if(!$chickenpaint)
	<script>
		//Firefoxのメニューバーが開閉するのため、Altキーのデフォルトの処理をキャンセル
				document.addEventListener('keyup', function(e) {//しぃペインター NEO共通
					// e.key を利用して特定のキーのアップイベントを検知する
					if (e.key.toLowerCase() === 'alt') {
						e.preventDefault(); // Alt キーのデフォルトの動作をキャンセル
					}
				});
	</script>
	@endif
	@endif
	@if($pch_mode)
	@if($type_neo)
	<link rel="stylesheet" href="neo.css?{{$parameter_day}}&{{$ver}}">
	<script src="neo.js?{{$parameter_day}}&{{$ver}}"></script>
	@endif
	@endif
	@if($chickenpaint)
	<style>
		:not(input),
		div#chickenpaint-parent :not(input) {
			-moz-user-select: none;
			-webkit-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}
	</style>
	<script>
		document.addEventListener('DOMContentLoaded',function(){
				document.addEventListener('dblclick', function (e){ e.preventDefault()}, { passive: false });
				const chicken=document.querySelector('#chickenpaint-parent');
				chicken.addEventListener('contextmenu', function(e){
					e.preventDefault();
					e.stopPropagation();
				}, { passive: false });
			});
	</script>


	<script src="chickenpaint/js/chickenpaint.min.js?{{$parameter_day}}&{{$ver}}"></script>
	<link rel="stylesheet" href="chickenpaint/css/chickenpaint.css?{{$parameter_day}}&{{$ver}}">

	@else
	@if(($paint_mode and !$useneo) or ($pch_mode and !$type_neo))
	<!-- Javaが使えるかどうか判定 -->
	<script>
		document.addEventListener("DOMContentLoaded", function() {
			var jEnabled = navigator.javaEnabled();
			if(!jEnabled){
				var sN = document.createElement("script");
				sN.src = "{{$cheerpj_url}}";
				sN.integrity="{{$cheerpj_hash}}";
				sN.crossOrigin="anonymous";
				var s0 = document.getElementsByTagName("script")[0];
				s0.parentNode.insertBefore(sN, s0);
				sN.addEventListener("load", function(){ cheerpjInit({!!htmlspecialchars($cheerpj_preload,ENT_NOQUOTES)!!}); }, false);
			}
		});
	</script>
	@endif
	@endif
	@if($paint_mode)
	<style>
		body {
			overscroll-behavior-x: none !important;
		}
	</style>
	@endif

	<title>{{$title}}</title>
	<style id="for_mobile"></style>

</head>

<body id="paintmode">


	@if(!$chickenpaint)
	<header>
		<h1><a href="{{$self2}}">{{$title}}</a></h1>
		<div>
			<a href="{{$home}}" target="_top">[Home]</a>
			@if($use_admin_link)<a href="{{$self}}?mode=admin">[Admin mode]</a>@endif
		</div>
		<hr>
		<div>
			<p class="menu">
				@if($continue_mode||$pch_mode)
				<a href="{{$self}}?res={{$oyano}}#{{$no}}">[Back]</a>
				@else
				<a href="{{$self2}}">[Back]</a>
				@endif
			</p>
		</div>
		<hr>
		@if($paint_mode)
		<h2 class="oekaki">PAINT MODE</h2>
		@endif
		@if($continue_mode)
		<h2 class="oekaki">CONTINUE MODE</h2>
		@endif
	</header>
	@endif

	<main>
		@if($paint_mode)

		@if($chickenpaint)

		<div id="chickenpaint-parent"></div>
		<p></p>

		<script>
			document.addEventListener("DOMContentLoaded", function() {
				new ChickenPaint({
					uiElem: document.getElementById("chickenpaint-parent"),
					canvasWidth: {{$picw}},
				canvasHeight: {{$pich}},
			
				@if($imgfile) loadImageUrl: "{{$imgfile}}",@endif
				@if($img_chi) loadChibiFileUrl: "{{$img_chi}}",@endif
				saveUrl: "?mode=saveimage&tool=chi&usercode={!!$usercode!!}",
				postUrl: "?mode={!!$mode!!}&stime={{$stime}}",
				exitUrl: "?mode={!!$mode!!}&stime={{$stime}}",
			
					allowDownload: true,
					resourcesRoot: "chickenpaint/",
					disableBootstrapAPI: true,
					fullScreenMode: "force",
					post_max_size: {{$max_pch}}
				});
			});
			const handleExit=()=>{
			@if($rep)
			// 画像差し換えに必要なフォームデータをセット
			const formData = new FormData();
			formData.append("mode", "picrep"); 
			formData.append("no", "{{$no}}"); 
			formData.append("pwd", "{{$pwd}}"); 
			formData.append("repcode", "{{$repcode}}");

			// 画像差し換え

			fetch("{{$sefl}}", {
				method: 'POST',
				mode: 'same-origin',
				headers: {
					'X-Requested-With': 'chickenpaint'
					,
				},
			body: formData
			})
			.then(response => {
			// console.log("response",response);
				if (response.ok) {

					if (response.redirected) {
						return window.location.href = response.url;
						}
					response.text().then((text) => {
						//console.log(text);
						if (text.startsWith("error\n")) {
								console.log(text);
								return window.location.href = "?mode=piccom&stime={{$stime}}";
						}
					})
				}
			})
			.catch(error => {
				console.error('There was a problem with the fetch operation:', error);
				return window.location.href = "?mode=piccom&stime={{$stime}}";
			});
			@else
			return window.location.href = "?mode=piccom&stime={{$stime}}";
			@endif
			}
		</script>
		@else
		{{--
		<!-- (========== PAINT MODE(お絵かきモード) start ==========) --> --}}
		<script>
			"use strict";
				//	BBS Note 動的パレット＆マトリクス 2003/06/22
				//	(C) のらネコ WonderCatStudio http://wondercatstudio.com/
				var DynamicColor=1,Palettes=[];
				// パレット配列作成
				@if($palettes) 
				{!!htmlspecialchars($palettes,ENT_NOQUOTES)!!}
				@endif
function setPalette(){document.paintbbs.setColors(Palettes[document.forms.Palette.select.selectedIndex]);document.forms.grad.view.checked&&GetPalette()}{{$async}} function PaletteSave(){Palettes[0]=String({{$await}} document.paintbbs.getColors())}var cutomP=0;
{{$async}} function PaletteNew(){var a=String({{$await}} document.paintbbs.getColors());const b=document.forms.Palette.select;Palettes[b.length]=a;cutomP++;a=prompt("Palette name","Palette "+cutomP);null==a||""==a?cutomP--:(b.options[b.length]=new Option(a),30>b.length&&(b.size=b.length),PaletteListSetColor())}{{$async}} function PaletteRenew(){Palettes[document.forms.Palette.select.selectedIndex]=String({{$await}} document.paintbbs.getColors());PaletteListSetColor()}
function PaletteDel(){const a=Palettes.length,b=document.forms.Palette.select;let c=b.selectedIndex;if(-1!=c&&confirm("Are you sure you want to delete ["+b.options[c].text+"]?")){for(b.options[c]=null;a>c;)Palettes[c]=Palettes[c+1],c++;30>b.length&&(b.size=b.length)}}
{{$async}} function P_Effect(a){a=parseInt(a);let b,c=1;255==a&&(c=-1);const f=document.paintbbs;let e=String({{$await}} f.getColors()).split("\n");const d=e.length;let g="";for(b=0;d>b;b++){let h=a+parseInt("0x"+e[b].substring(1,3))*c,k=a+parseInt("0x"+e[b].substring(3,5))*c,l=a+parseInt("0x"+e[b].substring(5,7))*c;255<h?h=255:0>h&&(h=0);255<k?k=255:0>k&&(k=0);255<l?l=255:0>l&&(l=0);g+="#"+Hex(h)+Hex(k)+Hex(l)+"\n"}f.setColors(g);PaletteListSetColor()}
{{$async}} function PaletteMatrixGet(){const a=Palettes.length;var b=document.forms.Palette;const c=b.select;let f=b.setr;switch(b.m_m.selectedIndex){default:f.value="";let e=b=0;for(;a>b;)null!=c.options[b]&&(f.value=f.value+"\n!"+c.options[b].text+"\n"+Palettes[b],e++),b++;alert("Number of pallets "+e+"\ngot the palette matrix.");break;case 1:f.value="!Palette\n"+String({{$await}} document.paintbbs.getColors()),alert("got the palette information currently used.")}f.value=f.value.trim()+"\n!Matrix"}
function PalleteMatrixSet(){var a=document.forms.Palette;const b=a.select;switch(a.m_m.selectedIndex){default:a=confirm("Set the palette matrix.\nAll current palette information will be lost. Are you sure you want to proceed?");break;case 1:a=confirm("Set the palette matrix.\nAre you sure you want to replace the current palette?");break;case 2:a=confirm("Set the palette matrix.\nAre you sure you want to add this to the current palette?")}a&&(PaletteSet(),b.size=30>b.length?b.length:30,DynamicColor&&
PaletteListSetColor())}
function PalleteMatrixHelp(){alert("**ABOUT PALETTE MATRIX**\nThe palette matrix allows you to use free palette settings \nby using text that lists palette information.\n\nGet the matrix\n1)Get the palette matrix from the [Get] button.\n2)The retrieved information will appear in the text area below, copy it all.\n3)Let's save this matrix information as text in a file.\n\nto set matrix\n1)Paste the copied matrix into the text area below.\n2)If you have saved it in a file, copy and paste it.\n3)You can use the saved palette by pressing the set button.\n\nPlease note that the palette will not be set correctly if there is unnecessary information.")}
function PaletteSet(){var a=document.forms.Palette;const b=a.setr.value,c=a.select;var f=a.m_m.selectedIndex;a=b.length;let e;if(1>a)alert("There is no matrix information.");else{var d;switch(f){default:for(d=c.length;0<d;)d--,c.options[d]=null;case 2:f=c.options.length;d=b.indexOf("!",0)+1;if(0==d)return;for(;d<a;){var g=b.indexOf("\n#",d);if(-1==g)return;const h=b.substring(d,g+1);d=b.indexOf("!",g);if(-1==d)return;e=b.substring(g+1,d+-1);"Palette"!=h?(0<=f&&(c.options[f]=new Option(h)),Palettes[f]=
e,f++):document.paintbbs.setColors(e);d+=1}break;case 1:d=b.indexOf("!",0)+1;if(0==d)return;g=b.indexOf("\n#",d);d=b.indexOf("!",g);0<=g&&(e=b.substring(g+1,d-1));document.paintbbs.setColors(e)}PaletteListSetColor()}}function PaletteListSetColor(){let a;const b=document.forms.Palette.select;for(a=1;b.options.length>a;a++){var c=Palettes[a].split("\n");b.options[a].style.background=c[4];b.options[a].style.color=GetBright(c[4])}}
function GetBright(a){let b=parseInt("0x"+a.substring(1,3)),c=parseInt("0x"+a.substring(3,5));a=parseInt("0x"+a.substring(5,7));a=b>=c?b>=a?b:a:c>=a?c:a;return 128>a?"#FFFFFF":"#000000"}function Chenge_(){const a=document.forms.grad;var b=a.ped.value;isNaN(parseInt("0x"+a.pst.value))||isNaN(parseInt("0x"+b))||GradView()}
function ChengeGrad(){var a=document.forms.grad,b=a.pst.value,c=a.ped.value;Chenge_();var f=parseInt("0x"+b.substring(0,2)),e=parseInt("0x"+b.substring(2,4)),d=parseInt("0x"+b.substring(4,6));b=Math.trunc((f-parseInt("0x"+c.substring(0,2)))/15);a=Math.trunc((e-parseInt("0x"+c.substring(2,4)))/15);c=Math.trunc((d-parseInt("0x"+c.substring(4,6)))/15);isNaN(b)&&(b=1);isNaN(a)&&(a=1);isNaN(c)&&(c=1);var g="";let h;for(h=0;14>h;h++,f-=b,e-=a,d-=c){if(255<f||0>f)b*=-1,f-=b;if(255<e||0>e)a*=-1,e-=a;if(255<
d||0>d)c*=-1,e-=c;g+="#"+Hex(f)+Hex(e)+Hex(d)+"\n"}document.paintbbs.setColors(g)}function Hex(a){a=Math.trunc(a);0>a&&(a*=-1);for(var b=new String,c;16<a;)c=a,16<a&&(a=Math.trunc(a/16),c-=16*a),c=Hex_(c),b=c+b;c=Hex_(a);for(b=c+b;2>b.length;)b="0"+b;return b}function Hex_(a){isNaN(a)?a="":10==a?a="A":11==a?a="B":12==a?a="C":13==a?a="D":14==a?a="E":15==a&&(a="F");return a}
{{$async}} function GetPalette(){var a=String({{$await}} document.paintbbs.getColors());if("null"!=a&&""!=a){a=a.split("\n");var b=document.forms.grad,c=b.p_ed.selectedIndex;b.pst.value=a[b.p_st.selectedIndex].substring(1,7);b.ped.value=a[c].substring(1,7);GradSelC();PaletteListSetColor()}}
{{$async}} function GradSelC(){var a=String({{$await}} document.paintbbs.getColors());if("null"!=a&&""!=a){a=a.split("\n");var b=document.forms.grad,c;if(b.view.checked){var f=a.length,e="";for(c=0;f>c;c++){let d=255+-1*parseInt("0x"+a[c].substring(1,3)),g=255+-1*parseInt("0x"+a[c].substring(3,5)),h=255+-1*parseInt("0x"+a[c].substring(5,7));255<d?d=255:0>d&&(d=0);255<g?g=255:0>g&&(g=0);255<h?h=255:0>h&&(h=0);e+="#"+Hex(d)+Hex(g)+Hex(h)+"\n"}e=e.split("\n");for(c=0;f>c;c++)b.p_st.options[c].style.background=
a[c],b.p_st.options[c].style.color=e[c],b.p_ed.options[c].style.background=a[c],b.p_ed.options[c].style.color=e[c]}}}function GradView(){}function showHideLayer(){const a=document.forms.grad;var b;(b=(b=document.getElementById("psft"))?b.style:null)&&!a.view.checked&&(b.visibility="hidden");b&&a.view.checked&&(b.visibility="visible",GetPalette())};
		</script>
		<noscript>
			<p>JavaScript isn't working</p>
		</noscript>

		<div id="appstage">
			<div class="app" style="width:{{$w}}px; height:{{$h}}px">


				@if($paintbbs)
				@if($useneo)
				<applet-dummy code="pbbs.PaintBBS.class" archive="./PaintBBS.jar" name="paintbbs" width="{{$w}}" height="{{$h}}"
					mayscript>
					@if(isset($max_pch))
					<param name="neo_max_pch" value="{{$max_pch}}">
					@endif
					<param name="neo_send_with_formdata" value="true">
					<param name="neo_confirm_layer_info_notsaved" value="true">
					<param name="neo_confirm_unload" value="true">
					<param name="neo_show_right_button" value="true">
					<param name="neo_animation_skip" value="true">
					<param name="neo_disable_grid_touch_move" value="true">
					@else
					<applet code="pbbs.PaintBBS.class" archive="./PaintBBS.jar" name="paintbbs" width="{{$w}}" height="{{$h}}"
						mayscript>
						@endif
						@endif
						<!--しぃペインター個別設定-->
						@if($normal)
						<applet code="c.ShiPainter.class" archive="spainter_all.jar" name="paintbbs" WIDTH="{{$w}}" HEIGHT="{{$h}}"
							mayscript>
							<param name=dir_resource value="./">
							<param name="tt.zip" value="tt_def.zip">
							<param name="res.zip" value="res.zip">
							{{-- しぃペインターv1.05_9以前を使うなら res_normal.zip に変更 --}}
							<param name=tools value="normal">
							<param name=layer_count value="{{$layer_count}}">
							@if($quality)
							<param name=quality value="{{$quality}}">
							@endif
							@endif
							<!--しぃペインターPro個別設定-->
							@if($pro)
							<applet code="c.ShiPainter.class" archive="spainter_all.jar" name="paintbbs" width="{{$w}}"
								height="{{$h}}" mayscript>
								<param name=dir_resource value="./">
								<param name="tt.zip" value="tt_def.zip">
								<param name="res.zip" value="res.zip">
								<!--(Shi-Painterv1.05_9以前を使うなら res_pro.	zip に変更)-->
								<param name=tools value="pro">
								<param name=layer_count value="{{$layer_count}}">
								@if($quality)
								<param name=quality value="{{$quality}}">
								@endif
								@endif
								<!--共通設定(変更不可)-->
								<param name="send_header_count" value="true">
								<param name="send_header_timer" value="true">
								<param name="image_width" value="{{$picw}}">
								<param name="image_height" value="{{$pich}}">
								<param name="image_jpeg" value="{{$image_jpeg}}">
								<param name="image_size" value="{{$image_size}}">
								<param name="compress_level" value="{{$compress_level}}">
								<param name="undo" value="{{$undo}}">
								<param name="undo_in_mg" value="{{$undo_in_mg}}">
								@if($useneo)
								{{-- neo --}}
								<param name="url_save" value="{{$self}}?mode=saveimage&amp;tool=neo">
								<param name="send_header" value="usercode={{$usercode}}&amp;tool={{$tool}}">
								<param name="url_exit" value="{{$self}}?mode={{$mode}}&amp;stime={{$stime}}">
								@else
								{{-- しぃペインター --}}
								<param name="url_save" value="{{$self}}?mode=picpost">
								<param name="send_header"
									value="usercode={{$usercode}}&amp;tool={{$tool}}&amp;rep={{$rep}}&amp;no={{$no}}&amp;pwd={{$pwd}}">
								@if($rep)
								<param name="url_exit" value="{{$self}}?res={{$oyano}}&amp;resid={{$no}}">
								@else
								<param name="url_exit" value="{{$self}}?mode=piccom&amp;stime={{$stime}}">
								@endif
								@endif
								@if($anime)
								<param name="thumbnail_type" value="animation">
								@endif
								@if($pchfile)
								<param name="pch_file" value="{{$pchfile}}">
								@endif
								@if($imgfile)
								<param name="image_canvas" value="{{$imgfile}}">
								@endif
								<param name="poo" value="false">
								<param name="send_advance" value="true">
								<param name="thumbnail_width" value="100%">
								<param name="thumbnail_height" value="100%">
								<param name="tool_advance" value="true">
								@if($useneo)
				</applet-dummy>
				@else
				</applet>
				@endif
			</div>
			<div class="palette_wrap">
				<div class="palette">
					<form name="Palette">
						@if($useneo)
						<fieldset>
							<legend>TOOL</legend>
							<input class="button" type="button" value="[L]" onclick="Neo.setToolSide(true)">
							<input class="button" type="button" value="[R]" onclick="Neo.setToolSide(false)">
						</fieldset>
						@endif
						<fieldset>
							<legend>PALETTE</legend>
							<select class="form palette_select" name="select" size="13" onchange="setPalette()">
								<option>saved palette</option>
								@if($dynp)
								@foreach ($dynp as $p)
								<option>{{$p}}</option>
								@endforeach
								@endif
							</select><br>
							<input class="button" type="button" value="Save" onclick="PaletteSave()"><br>
							<input class="button" type="button" value="New" onclick="PaletteNew()">
							<input class="button" type="button" value="Renew" onclick="PaletteRenew()">
							<input class="button" type="button" value="Del" onclick="PaletteDel()"><br>
							<input class="button" type="button" value="Bright" onclick="P_Effect(10)">
							<input class="button" type="button" value="Dark" onclick="P_Effect(-10)">
							<input class="button" type="button" value="Invert" onclick="P_Effect(255)">
						</fieldset>
						<fieldset>
							<legend>MATRIX</legend>
							<select class="form" name="m_m">
								<option value="0">Overall</option>
								<option value="1">Current</option>
								<option value="2">Add</option>
							</select>
							<input type="button" class="button" name="m_g" value="Get" onclick="PaletteMatrixGet()">
							<input type="button" class="button" name="m_h" value="Set" onclick="PalleteMatrixSet()">
							<input type="button" class="button" name="1" value=" ? " onclick="PalleteMatrixHelp()"><br>
							<textarea class="form" name="setr" rows="1" cols="13" onmouseover="this.select()"></textarea>
						</fieldset>
					</form>
					<form name="grad">
						<fieldset>
							<legend>GRADATION</legend>
							<input type="checkbox" name="view" onclick="showHideLayer()">
							<input type="button" class="button" value=" Ok " onclick="ChengeGrad()"><br>
							<select class="form" name="p_st" onchange="GetPalette()">
								<option>1</option>
								<option>2</option>
								<option>3</option>
								<option>4</option>
								<option>5</option>
								<option>6</option>
								<option>7</option>
								<option>8</option>
								<option>9</option>
								<option>10</option>
								<option>11</option>
								<option>12</option>
								<option>13</option>
								<option>14</option>
							</select>
							<input class="form" type="text" name="pst" size="8" onkeypress="Chenge_()" onchange="Chenge_()"><br>
							<select class="form" name="p_ed" onchange="GetPalette()">
								<option>1</option>
								<option>2</option>
								<option>3</option>
								<option>4</option>
								<option>5</option>
								<option>6</option>
								<option>7</option>
								<option>8</option>
								<option>9</option>
								<option>10</option>
								<option>11</option>
								<option selected>12</option>
								<option>13</option>
								<option>14</option>
							</select>
							<input class="form" type="text" name="ped" size="8" onkeypress="Chenge_()" onchange="Chenge_()">
							<div id="psft"></div>
							<script>
								if(DynamicColor) PaletteListSetColor();
							</script>
						</fieldset>
						<p class="c">DynamicPalette &copy;NoraNeko</p>
					</form>
				</div>
			</div>
		</div>
		@if($paint_mode)
		<section>
			<div class="thread">
				<hr>
				<div class="timeid">
					<form class="watch" action="index.html" name="watch">
						<p>
							PaintTime :
							<input type="text" size="24" name="count" readonly>
						</p>
						<script>
							timerID = 10;
								stime = new Date();
								function SetTimeCount() {
									now = new Date();
									s = Math.floor((now.getTime() - stime.getTime())/1000);
									disp = '';
									if(s >= 86400){
										d = Math.floor(s/86400);
										disp += d+"day ";
										s -= d*86400;
									}
									if(s >= 3600){
										h = Math.floor(s/3600);
										disp += h+"hr ";
										s -= h*3600;
									}
									if(s >= 60){
										m = Math.floor(s/60);
										disp += m+"min ";
										s -= m*60;
									}
									document.watch.count.value = disp+s+"sec";
									clearTimeout(timerID);
									timerID = setTimeout(function(){ SetTimeCount(); }, 250);
								};
								document.addEventListener('DOMContentLoaded',SetTimeCount,false);
						</script>
					</form>
					<hr>
				</div>
			</div>
		</section>
		@endif
		<section>
			<div class="thread siihelp">
				<p>
					If you make a mistake and change the page or close the window, calm down and reopen the edit page with the
					same canvas width. Mostly left.
				</p>
				<h2>Basic function (At a minimum, the function you need to remember)</h2>
				<h3>Basic</h3>
				<p>
					In PaintBBS, right-click, [Ctrl + click], and [Alt + click] have the same behavior.<br>
					Basically, the operation is completed with a single click or Right-click. (Except when using Bezier or copy)
				</p>
				<h3>toolbar</h3>
				<p>
					Most buttons on the toolbar can be clicked multiple times to switch between functions.<br>
					Right-click to reverse the order of function switching.
					Use right-click to set palette colors, mask colors, and the current state of the pen tool.<br>
					You can also right-click to switch the show / hide of the layer.<br>
					Left-click to get the color and state of the palette saved in the pen save tool.
				</p>
				<h3>Canvas part</h3>
				<p>
					Right-click to pick up the color.<br>
				</p>
				<h2>Special function (Function that is not essential but useful to remember)</h2>
				<h3>toolbar</h3>
				<p>
					As you move away from the bar while dragging, the bar's values change slowly, allowing you to make subtle
					changes.
					Shift + click the palette to return the colors to their default state.
				</p>
				<h3>Keyboard shortcuts</h3>
				<ul>
					<li>[+] to zoom in [-] to zoom out.</li>
					<li>Undo with [Ctrl + Z] or [Ctrl + U], redo with [Ctrl + Alt + Z] or [Ctrl + Y].</li>
					<li>Copy and Bezier operations can be reset with [Esc]. (Same for right-clicking)</li>
					<li>Free scrolling by dragging the canvas while holding down the space key.</li>
					<li>Change the line width by [Ctrl + Alt + drag].</li>
				</ul>
				<h3>Special usage of copy tool</h3>
				<p>
					Use copy and merge layers to move between layers. To move by copying, first select the rectangle on the layer
					you want to move, then select the layer you want to move, and then continue the normal copy work. By doing so,
					you can move between layers.
				</p>
				<h2>A brief description of the toolbar buttons and special features</h2>
				<dl>
					<dt>Nib (normal pen, watercolor pen, text)</dt>
					<dd>
						Main freeline pen and text
					</dd>
					<dt>Nib 2 (halftone, blur, etc.)</dt>
					<dd>
						Freeline pen that produces special effects
					</dd>
					<dt>Shapes (circles and rectangles)</dt>
					<dd>
						Shapes such as rectangles and circles
					</dd>
					<dt>Special (copy, merge layers, flip, etc.)</dt>
					<dd>
						Copy is a tool that allows you to select, then drag, move, and copy.
					</dd>
					<dt>Mask mode specification (normal, mask, reverse mask)</dt>
					<dd>
						Masks the color set in the color mask. The reverse mask is the opposite.<br>
						Normal is no mask. You can also change the mask color by right-clicking.
					</dd>
					<dt>Eraser (white, white rect , clear)</dt>
					<dd>
						If you fill the transparent layer with white, the lower layer will not be visible, Use this tool to erase
						lines in the upper layers.<br>
						Clear is a tool that makes everything transparent pixels.<br>
						If you want to clear all, select this tool and click on the canvas.
					</dd>
					<dt>Designation of drawing method (Freehand, straight line, Bezier curve)</dt>
					<dd>
						The pen tip and drawing function are not specified.<br>
						And it applies only to freeline tools.
					</dd>
					<dt>Color palette group</dt>
					<dd>
						Click to get color. Right-click to set the color. Shift + click to default color.
					</dd>
					<dt>RGB bar and alpha bar</dt>
					<dd>
						Fine color changes and transparency changes. R is red, G is green, B is blue, and A is transparency.<br>
						The density of the halftone can be changed by changing the value with the Alpha bar.
					</dd>
					<dt>Line width change tool</dt>
					<dd>
						When the line width is changed when the watercolor pen is selected, the default value is assigned to the
						alpha value.
					</dd>
					<dt>temporary pen save tool</dt>
					<dd>
						Left-click to get the data. Right-click to set the data. (Mask value is not set)
					</dd>
					<dt>Layer tool</dt>
					<dd>
						PaintBBS has a structure in which two transparent canvases are stacked.<br>
						it is a tool that makes it possible to draw the main line on the top and the color on the bottom.<br>
						Since it is a type of thing called a normal layer, Lines like those drawn with a pencil are also
						transparent.<br>
						Click to switch layers. Right-click to switch the show / hide of the layer.
					</dd>
				</dl>
				<h2>Regarding posting</h2>
				<p>
					When the picture is completed, post it with the send button. If the picture is posted successfully, it will
					jump to the specified URL. If it fails, it just reports the failure and does not jump anywhere.
					If it was just heavy, please wait a moment and try posting again. <br>In this case, it may be posted twice.
					However, this is a web server or CGI processing issue.
				</p>
			</div>
		</section>
		<!-- (========== PAINT MODE(お絵かきモード) end ==========) -->
		@endif
		@endif
		@if($pch_mode)

		<!-- (========== 動画表示モード ==========) -->
		<div id="appstage">
			<div class="app">
				<div style="width:{{$w}}px; height:{{$h}}px">
					@if($paintbbs)
					@if($type_neo)
					<applet-dummy code="pch.PCHViewer.class" archive="PCHViewer.jar,PaintBBS.jar" name="pch" width="{{$w}}"
						height="{{$h}}" mayscript>
						@else
						<applet code="pch.PCHViewer.class" archive="PCHViewer.jar,PaintBBS.jar" name="pch" width="{{$w}}"
							height="{{$h}}" mayscript>
							@endif
							@endif
							@if($normal)
							<applet name="pch" code="pch2.PCHViewer.class" archive="PCHViewer.jar,spainter_all.jar" codebase="./"
								width="{{$w}}" height="{{$h}}">
								@endif
								@if($normal)
								<param name="res.zip" value="res.zip">
								<!--(Shi-Painterv1.05_9以前を使うなら res_normal.zip に変更)-->
								<param name="tt.zip" value="tt_def.zip">
								<param name="tt_size" value="31">
								@endif
								<param name="image_width" value="{{$picw}}">
								<param name="image_height" value="{{$pich}}">
								<param name="pch_file" value="{{$pchfile}}">
								<param name="speed" value="{{$speed}}">
								<param name="buffer_progress" value="false">
								<param name="buffer_canvas" value="false">
								@if($type_neo)
					</applet-dummy>
					@else
					</applet>
					@endif
				</div>
				<p>
					<a href="{{$pchfile}}" target="_blank" rel="nofollow noopener noreferrer">Download</a> - Datasize :
					{{$datasize}} KB
				</p>
				<p>
					<a href="javascript:close()">close</a>
				</p>
			</div>
		</div>
		<!-- (========== animation view mode end ==========) -->
		@endif
		@if($continue_mode)
		<!-- (========== CONTINUE MODE start ==========) -->
		<section>
			<script src="loadcookie.js"></script>
			<div class="thread">
				<figure>
					<img src="{{$picfile}}" width="{{$picw}}" height="{{$pich}}"
						alt="@if($sub){{$sub}} @endif @if($name) by {{$name}} @endif{{$picw}} x {{$pich}}"
						title="@if($sub){{$sub}} @endif @if($name) by {{$name}} @endif{{$picw}} x {{$pich}}">

					<figcaption>{{$picfile_name}}@if($painttime) PaintTime : {{$painttime}}@endif</figcaption>
				</figure>
				<hr class="hr">
				{{-- ダウンロード --}}
				@if($download_app_dat)
				<form action="{{$self}}" method="post">
					<input type="hidden" name="mode" value="download">
					<input type="hidden" name="no" value="{{$no}}">
					<span class="input_disp_none"><input type="text" value="" autocomplete="username"></span>
					Pass <input class="form" type="password" name="pwd" value="">
					<input class="button" type="submit" value="Download {{$pch_ext}} file">
				</form>
				<hr class="hr">
				@endif
				<div class="continue_post_form">

					<form action="{{$self}}" method="post">
						<input type="hidden" name="mode" value="contpaint">
						<input type="hidden" name="anime" value="true">
						<input type="hidden" name="picw" value="{{$picw}}">
						<input type="hidden" name="pich" value="{{$pich}}">
						<input type="hidden" name="no" value="{{$no}}">
						<input type="hidden" name="pch" value="{{$pch}}">
						<input type="hidden" name="ext" value="{{$ext}}">
						<select class="form" name="ctype">
							@if($ctype_pch)<option value="pch">from animation</option>@endif
							@if($ctype_img)<option value="img">from picture</option>@endif
						</select>
						The image is a <select class="form" name="type" id="select_post">
							<option value="rep">replace</option>
							<option value="new">new post</option>
						</select>
						<span id="span_cont_paint_same_thread">
							<input type="checkbox" name="cont_paint_same_thread" id="cont_paint_same_thread" value="on"
								checked="checked"><label for="cont_paint_same_thread">Post in the same thread</label>
						</span>
						<br>
						@if($select_app)

						<select name="shi">
							@if($use_neo)<option value="neo">PaintBBS NEO</option>@endif
							@if($use_tegaki)<option value="tegaki">Tegaki</option>@endif
							@if($use_axnos)<option value="axnos">Axnos Paint</option>@endif
							@if($use_shi_painter)<option value="1" class="for_pc">Shi-Painter</option>@endif
							@if($use_chickenpaint)<option value="chicken">ChickenPaint</option>@endif
							@if($use_klecks)<option value="klecks">Klecks</option>@endif
						</select>
						@endif
						@if($app_to_use)
						<input type="hidden" name="shi" value="{{$app_to_use}}">
						@endif

						@if($use_select_palettes)
						Palettes <select name="selected_palette_no" title="Palettes"
							class="form">{!!$palette_select_tags!!}</select>
						@endif

						<span class="input_disp_none"><input type="text" value="" autocomplete="username"></span>
						<span id="span_cont_pass">Pass <input class="form" type="password" name="pwd" value=""></span>
						<input class="button" type="submit" value="Draw more">

					</form>

					<ul>
						@if($newpost_nopassword)
						<li>If you select new post, you can draw the continuation without the password.</li>
						@else
						<li>To draw the continuation, you need the password when you drew it.</li>
						@endif
					</ul>

				</div>
			</div>
			<script>
				document.addEventListener('DOMContentLoaded',l,false);
			</script>
		</section>
		<script>
			// 新規投稿時にのみ、同じスレッドに投稿するボタンを表示
				document.getElementById('select_post').addEventListener('change', function() {
					const idx=document.getElementById('select_post').selectedIndex;
					console.log(idx);
					const cont_paint_same_thread=document.getElementById('span_cont_paint_same_thread');
					const cont_pass=document.getElementById('span_cont_pass');
					if(idx === 1){
						if(cont_paint_same_thread){
							cont_paint_same_thread.style.display = "inline-block";
						}
						@if($newpost_nopassword) 
						if(cont_pass){
						cont_pass.style.display = "none";
						}
						@endif
					}else{
						if(cont_paint_same_thread){
							cont_paint_same_thread.style.display = "none";
						}
						@if($newpost_nopassword) 
						if(cont_pass){
							cont_pass.style.display = "inline-block";
						}
						@endif
					}
				});
		</script>

		{{-- (========== CONTINUE MODE(コンティニューモード) end ==========) --}}
		@endif
	</main>
	<footer>
		{{-- 著作権表示 削除しないでください --}}
		@include('parts.mono_copyright')

	</footer>
	@if(!$chickenpaint)
	<script src="lib/{{$jquery}}"></script>
	<script src="{{$skindir}}js/mono_common.js?{{$ver}}"></script>
	@endif
</body>

</html>
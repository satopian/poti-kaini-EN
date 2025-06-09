{{-- ペイントボタン --}}
<form action="{{$self}}" method="post" enctype="multipart/form-data" id="paint_form">
	<p>
		@if($admin)
		<input type="hidden" name="admin" value="{{$admin}}">
		<input name="pch_upload" type="file" accept="image/*,.pch,.spch,.chi,.psd" class="pchup_button">
		<br>
		@endif
		Width : <input name="picw" type="number" title="Width" class="form" value="{{$pdefw}}" min="{{$pminw}}" max="{{$pmaxw}}">
		Height : <input name="pich" type="number" title="Height" class="form" value="{{$pdefh}}" min="{{$pminh}}" max="{{$pmaxh}}">
		@if($select_app)
			Tool:
			<select name="shi" id="select_app">
			@if($use_neo)<option value="neo">PaintBBS NEO</option>@endif
			@if($use_tegaki)<option value="tegaki">Tegaki</option>@endif
			@if($use_axnos)<option value="axnos">Axnos Paint</option>@endif
			@if($use_shi_painter)<option value="1" class="for_pc">Shi-Painter</option>@endif
			@if($use_chickenpaint)<option value="chicken">ChickenPaint</option>@endif
			@if($use_klecks)<option value="klecks">Klecks</option>@endif
		</select>
		@endif 
		{{-- 選択メニューを出さない時に起動するアプリ --}}
		@if($app_to_use)
		<input type="hidden" name="shi" value="{{$app_to_use}}">
		@endif
	
		@if($use_select_palettes)
		Palette：<select name="selected_palette_no" title="Palette" class="form">{!!$palette_select_tags!!}</select>
		@endif
		@if($resno)
		<input type="hidden" name="resto" value="{{$resno}}">
		@endif
		<input type="hidden" name="mode" value="paint">
		<input type="hidden" name="MAX_FILE_SIZE" value="{{ isset($upload_max_filesize) ? $upload_max_filesize : '' }}">
		<input class="button" type="submit" value="Paint">
		@if($anime)<label id="save_playback"><input type="checkbox" value="true" name="anime" title="Save Playback" @if($animechk){{$animechk}}@endif>Save Playback</label>@endif
	</p>
</form>

{{-- ペイントボタン --}}
<form action="{{$self}}" method="post" enctype="multipart/form-data">
	<p>
		Width :<input name="picw" type="number" title="幅" class="form" value="{{$pdefw}}" min="300" max="{{$pmaxw}}">
		Height :<input name="pich" type="number" title="高さ" class="form" value="{{$pdefh}}" min="300" max="{{$pmaxh}}">
		@if($select_app)
		Tool:
		<select name="shi">
		<option value="neo">PaintBBS NEO</option>
		@if($use_shi_painter)<option value="1" class="for_pc">Shi-Painter</option>@endif
		@if($use_chickenpaint)<option value="chicken">ChickenPaint</option>@endif
	</select>
	@else 
	{{-- <!-- 選択メニューを出さない時に起動するアプリ --> --}}
	<input type="hidden" name="shi" value="neo">
	@endif
	
		@if($use_select_palettes)
		パレット：<select name="selected_palette_no" title="パレット" class="form">{!!$palette_select_tags!!}</select>
		@endif
		@if($resno)
		<input type="hidden" name="resto" value="{{$resno}}">
		@endif
		@if($anime)<label><input type="checkbox" value="true" name="anime" title="動画記録" @if($animechk){{$animechk}}@endif>動画記録</label>@endif
		<input type="hidden" name="mode" value="paint">
		<input class="button" type="submit" value="お絵かき">
		@if($admin)
		<input type="hidden" name="admin" value="{{$admin}}">
		<input name="pch_upload" type="file" accept="image/*,.pch,.spch,.chi" title="pch upload">
		@endif
	</p>
</form>

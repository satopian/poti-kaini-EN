<div class="page">
	@if($prev)<a href="{{$prev}}">≪Prev</a>@endif | <a href="{{$self2}}">Top</a> |
	@if($next)<a href="{{$next}}">Next≫</a>@endif<br>
	@if($startpage)<a href="{{$self2}}">start</a> | @endif
	{!!$paging!!}
	@if($totalpages) | <a href="{{$totalpages}}">end</a>@endif</div>

</div>

<div class="page">
	@if($prev)<a href="{{$prev}}">≪Prev</a>@endif | <a href="{{$self2}}">Top</a> |
	@if($next)<a href="{{$next}}">Next≫</a>@endif<br>
	@if($firstpage)<a href="{{$firstpage}}">First</a> | @endif
	{!!$paging!!}
	@if($lastpage) | <a href="{{$lastpage}}">Last</a>@endif

</div>

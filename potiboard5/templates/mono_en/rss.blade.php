<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
	<title>{{$title}}</title>
	<subtitle></subtitle>
	<link href="{{$rooturl}}"/>
	<updated>{{$updated}}</updated>
	<author>
	  <name></name>
	</author>
	<generator uri="{{$rooturl}}rss.php" version="{{$ver}}">POTI-board</generator>
	<id>PaintBBS:{{$rooturl}}</id>
	@foreach ($oya as $ress)
	
	<entry>
		<title>[{{$ress[0]['no']}}]{!!$ress[0]['sub']!!} by {!!$ress[0]['name']!!}</title>
			<link href="{{$rooturl}}{{$self}}?res={{$ress[0]['no']}}"/>
			<id>paintbbs:{{$self}}?res={{$ress[0]['no']}}</id>
			<published>{{$ress[0]['updated']}}</published>
			<updated>{{$ress[0]['updated']}}</updated>
					<summary type="html">
						{{$ress[0]['imgsrc']}}
						{!!$ress[0]['descriptioncom']!!}
					</summary>
		<content type="html">
			{{$ress[0]['imgsrc']}}
			{!!$ress[0]['com']!!}{{'<br>'}}
			@if(isset($ress) and !@empty($ress))
			@foreach ($ress as $i=>$res)
			@if (!$loop->first)
			{{'<h3>'}}{!!$res['sub']!!} by {!!$res['name']!!}{{'</h3>'}}
				{{$res['imgsrc']}}
				{!!$res['com']!!}{{'<br>'}}
			@endif
			@endforeach
			@endif
		</content>        
		  <category term="PaintBBS" label="PaintBBS" />
		  <link rel="enclosure" href="{{$res['enclosure']}}" type="{{$res['imgtype']}}" length="{{$res['size']}}" />
		  <author>
			  <name>{!!$ress[0]['name']!!}</name>
		  </author>
	</entry>
	  @endforeach
	</feed>
  
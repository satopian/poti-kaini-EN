<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{{$title}}</title> 
<script src="tegaki/tegaki.js?{{$parameter_day}}"></script>
<link rel="stylesheet" href="tegaki/tegaki.css?{{$parameter_day}}">
<meta name="viewport" content="width={{$picw+100}}, initial-scale=1.0,maximum-scale=1.0">
<style>
	:not(input){
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
	}
	#tegaki-canvas-cnt {
	overflow: inherit;
	touch-action: auto;
	}
</style>
</head>
<body>
<script>
Tegaki.open({
  replayMode: true,
  replayURL: '{{$pchfile}}' // Store replay files preferably with the .tgkr extension
});

</script>
</body>
</html>

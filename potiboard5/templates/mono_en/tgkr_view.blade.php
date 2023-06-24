<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{{$title}}</title> 
<script src="tegaki/tegaki.js?{{$parameter_day}}"></script>
<link rel="stylesheet" href="tegaki/tegaki.css?{{$parameter_day}}">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<script>
console.log(screen.width-<?=h($picw)?>);
if (screen.width-<?=h($picw)?> < 80) {
  document.querySelector('meta[name="viewport"]').setAttribute('content', '');
}
</script>
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

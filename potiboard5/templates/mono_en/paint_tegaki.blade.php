<!DOCTYPE html>
<!-- mocked drawing page -->
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<title>{{$title}}</title> 
	<!-- this is important -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
<script src="tegaki/tegaki.js?{{$parameter_day}}"></script>
<link rel="stylesheet" href="tegaki/tegaki.css?{{$parameter_day}}">

	<style>
		:not(input){
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
		}
	</style>
</head>
<body>

<!-- embed start -->
<script>
function showAlert(text) {
  if (Tegaki.saveReplay) {
    Tegaki.replayRecorder.start();
  }
  alert(text);
}
Tegaki.open({
// when the user clicks on Finish
  onDone: function() {
	
	//2022-2023 (c)satopian MIT Licence
	//この箇所はさとぴあが作成したMIT Licenceのコードです。

	if (Tegaki.saveReplay) {
		Tegaki.replayRecorder.stop();
	}
	const postData = (path, data) => {

		fetch(path, {
			method: 'post',
			mode: 'same-origin',
			headers: {
				'X-Requested-With': 'tegaki'
				,
			},
			body: data,
		})
		.then((response) => {
			if (response.ok) {
				response.text().then((text) => {
				console.log(text)
					if(text==='ok'){
						Tegaki.hide();//｢このサイトを離れますか?｣を解除
						return window.location.href="?mode={!!$mode!!}&stime={{$stime}}";
					}
					return showAlert(text);
				})
			}else{
				let response_status = response.status; 

				if(response_status===403){
					return showAlert(@if($en)'It may be a WAF false positive.\nTry to draw a little more.'@else'投稿に失敗。\nWAFの誤検知かもしれません。\nもう少し描いてみてください。'@endif);
				}
				if(response_status===404){
					return showAlert(@if($en)'404 not found\nsaveklecks.php'@else'エラー404\nsaveklecks.phpがありません。'@endif);	
				}
				return showAlert(@if($en)'Your picture upload failed!\nPlease try again!'@else'投稿に失敗\n時間をおいて再度投稿してみてください。'@endif);
			}
		})
		.catch((error) => {
				return showAlert(@if($en)'Server or line is unstable.\nPlease try again!'@else'サーバまたは回線が不安定です。\n時間をおいて再度投稿してみてください。'@endif);	
		})
	}

    Tegaki.flatten().toBlob(
      function(blob) {
        console.log(blob);
		var tgkr = Tegaki.replayRecorder ? Tegaki.replayRecorder.toBlob() : null;
		var formData = new FormData();
		if(tgkr){
			formData.append("tgkr",tgkr,'blob');
		}
		formData.append("picture",blob,'blob');
		formData.append("usercode", "{{$klecksusercode}}");
		 <?php if($rep):?>formData.append("repcode", "{{$repcode}}");<?php endif;?>
		formData.append("tool", "tegaki");
		formData.append("stime", <?=time();?>);
		formData.append("resto", "{{$resto}}");
		postData("saveklecks.php", formData);
      },
      'image/png'
    );
  },
  // (c)satopian MIT Licence ここまで

  // when the user clicks on Cancel
  onCancel: function() {
    console.log('Closing...')
  },
  // initial canvas size
  width: {{$picw}},
  height: {{$pich}},
  saveReplay: @if($imgfile||!$anime) false @else true @endif,

});

@if($imgfile)
	var self = Tegaki;
    var image = new Image();
    image.onload = function() {
		self.activeLayer.ctx.drawImage(image, 0, 0);
		TegakiLayers.syncLayerImageData(self.activeLayer);
    };
    image.src = "{{$imgfile}}"; // image URL
@endif

</script>
</body>
</html>

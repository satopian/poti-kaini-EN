<!DOCTYPE html>
<!-- mocked drawing page -->
<html>

<head>
	<meta charset="UTF-8">
	<title>{{$title}}</title>
	<!-- this is important -->
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">

	<style>
		:not(input) {
			-moz-user-select: none;
			-webkit-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}
	</style>
	<script>
		//ブラウザデフォルトのキー操作をキャンセル
		document.addEventListener("keydown",(e)=>{
			const keys = ["+",";","=","-","s","h","r","o"];
			if ((e.ctrlKey||e.metaKey) && keys.includes(e.key.toLowerCase())) {
				// console.log("e.key",e.key);
				e.preventDefault();
			}
		});
		//ブラウザデフォルトのコンテキストメニューをキャンセル
		document.addEventListener("contextmenu",(e)=>{
			e.preventDefault();
		});
	</script>
</head>

<body>

	<!-- embed start -->
	<script src="klecks/embed.js?{{$parameter_day}}&{{$ver}}"></script>
	<script>
		const getHttpStatusMessage = (response_status) => {
			// HTTP ステータスコードに基づいてメッセージを返す関数
			switch (response_status) {
				case 400:
					return "Bad Request";
				case 401:
					return "Unauthorized";
				case 403:
					return "Forbidden";
				case 404:
					return "Not Found";
				case 500:
					return "Internal Server Error";
				case 502:
					return "Bad Gateway";
				case 503:
					return "Service Unavailable";
				default:
					return "Unknown Error";
			}
		}

		/*
	Using Klecks in a drawing community:
	- on first time opening, start with a manually created project (klecks.openProject)
	- on submit, upload psd (and png) to the server
	- on continuing a drawing, read psd that was stored on server (klecks.readPsd -> klecks.openProject)
		*/

	const psdURL = '@if($img_klecks){{$img_klecks}}@endif';

	let saveData = (function () {
		let a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		return function (blob, fileName) {
			let url = window.URL.createObjectURL(blob);
			console.log(url);
			a.href = url;
			a.download = fileName;
			a.click();
			window.URL.revokeObjectURL(url);
		};
		
	}());

	const klecks = new Klecks({

		disableAutoFit: true,

		onSubmit: (onSuccess, onError) => {
			// download png
			// saveData(klecks.getPNG(), 'drawing.png');

			/*// download psd
			klecks.getPSD().then((blob) => {
				saveData(blob, 'drawing.psd');
			});*/

			setTimeout(() => {
			onSuccess();
			//2022-2025 (c)satopian MIT Licence
			//この箇所はさとぴあが作成したMIT Licenceのコードです。
			const postData = (path, data) => {
					fetch(path, {
						method: 'post',
						mode: 'same-origin',
						headers: {
							'X-Requested-With': 'klecks'
							,
						},
						body: data,
					})
					.then((response) => {
						if (response.ok) {
							response.text().then((text) => {
								console.log(text)
								if(text==='ok'){
									@if($rep)
									return repData();
									@endif
									return window.location.href = "?mode=piccom&stime={{$stime}}";
								}
								return alert(text);
							})
						}else{
							const HttpStatusMessage = getHttpStatusMessage(response.status);

							return alert(@if($en)`Your picture upload failed!\nPlease try again!\n( HTTP status code ${response.status} : ${HttpStatusMessage} )`
								@else`投稿に失敗。\n時間を置いて再度投稿してみてください。\n( HTTPステータスコード ${response.status} : ${HttpStatusMessage} )`
								@endif);
						}
					})
					.catch((error) => {
						return alert(@if($en)'Server or line is unstable.\nPlease try again!'@else'サーバまたは回線が不安定です。\n時間をおいて再度投稿してみてください。'@endif);	
					})
				}
				Promise.all([klecks.getPNG(), klecks.getPSD()]).then(([png, psd]) => {
					const TotalSiz=((png.size+psd.size)/1024/1024).toFixed(3);
					const max_pch = Number({{$max_pch}}); // 最大サイズ
					if(max_pch && TotalSiz>max_pch){
						return alert(`<?php if($en):?>File size is too large.<?php else:?>ファイルサイズが大きすぎます。<?php endif;?>\n<?php if($en):?>limit size<?php else:?>制限値<?php endif;?>:${max_pch}MB\n<?php if($en):?>Current size<?php else:?>現在値<?php endif;?>:${TotalSiz}MB`);
					}
					const formData = new FormData();
					formData.append("picture", png,'blob');
					formData.append("psd", psd,'blob');
					formData.append("usercode", "{{$klecksusercode}}");
					formData.append("repcode", "{{$repcode}}");
					formData.append("stime", <?=time();?>);
					formData.append("resto", "{{$resto}}");
					formData.append("tool", "Klecks");
					postData("?mode=saveimage&tool=klecks", formData);
					
				});
				// (c)satopian MIT Licence ここまで
				// location.reload();
			}, 500);
		}
	});
	//2022-2025 (c)satopian MIT Licence
	//この箇所はさとぴあが作成したMIT Licenceのコードです。
@if($rep)
const repData = () => {
	// 画像差し換えに必要なフォームデータをセット
	const formData = new FormData();
	formData.append("mode", "picrep"); 
	formData.append("no", "{{$no}}"); 
	formData.append("pwd", "{{$pwd}}"); 
	formData.append("repcode", "{{$repcode}}");

	// 画像差し換え

fetch("{{$self}}", {
		method: 'POST',
		mode: 'same-origin',
		headers: {
			'X-Requested-With': 'klecks'
			,
		},
			body: formData
		})
		.then(response => {
			if (response.ok) {
				if (response.redirected) {
					return window.location.href = response.url;
					}
				response.text().then((text) => {
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
	}
@endif
	// (c)satopian MIT Licence ここまで
if (psdURL) {
	fetch(new Request(psdURL)).then(response => {
		return response.arrayBuffer();
	}).then(buffer => {
		return klecks.readPSD(buffer); // resolves to Klecks project
	}).then(project => {
		klecks.openProject(project);
	}).catch(e => {
		klecks.initError(@if($en)'failed to read image'@else'画像の読み込みに失敗しました。'@endif);
	});

} else {
	const loadImage = (src) => {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = () => klecks.initError(<?php if($en):?>'failed to read image'<?php else:?>'画像の読み込みに失敗しました。'<?php endif;?>);
			img.src = src;
		});
	};

	(async () => {
	const createCanvasWithImage = async () => {
		const canvas = document.createElement('canvas');
		canvas.width = {{$picw}};
		canvas.height = {{$pich}};
		const ctx = canvas.getContext('2d');

		@if($imgfile)
		try {
		const img = await loadImage("{{$imgfile}}");
		ctx.drawImage(img, 0, 0);
		} catch (error) {
		console.error(error);
		}
		@else
		ctx.save();
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
		@endif

		return canvas;
	};

	const backgroundCanvas = await createCanvasWithImage();
	const emptyCanvas = document.createElement('canvas');
	emptyCanvas.width = {{$picw}};
	emptyCanvas.height = {{$pich}};

	klecks.openProject({
		width: {{$picw}},
		height: {{$pich}},
		layers: [{
			name: @if($en)'Background'@else'背景'@endif,
			opacity: 1,
			mixModeStr: 'source-over',
			image: backgroundCanvas
			}, {
				name: '{{$TranslatedLayerName}} 1',
				opacity: 1,
				mixModeStr: 'source-over',
				image: emptyCanvas
			}]
		});
	})();
}
	</script>
	<!-- embed end -->
</body>

</html>
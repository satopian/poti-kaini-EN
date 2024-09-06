<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<style>body{overscroll-behavior-x: none !important; }</style>

<title>{{$title}}</title>
<script>
// 画面上部のお知らせ領域に表示するテキスト（掲示板名を想定）
	const HEADER_TEXT = "AXNOS Paint（アクノスペイント）";
	// ページ遷移を防止する場合アンコメントする
	window.onbeforeunload = (e) => {
		e.preventDefault();
	}

	document.addEventListener("keydown",(e) => {
		const keys = ["+",";","=","-","s","h","r","o"];
		if ((e.ctrlKey||e.metaKey) && keys.includes(e.key.toLowerCase())) {
			// console.log("e.key",e.key);
			e.preventDefault();
		}
	});

	document.addEventListener("DOMContentLoaded", () => {

		var axp = new AXNOSPaint({
			bodyId: 'axnospaint_body',
			minWidth:{{$pminw}},
			minHeight:{{$pminh}},
			maxWidth:{{$pmaxw}},
			maxHeight:{{$pmaxh}},
			width: {{$picw}},
			height: {{$pich}},
			checkSameBBS: true,
			draftImageFile:'{{$imgfile}}',
			headerText: HEADER_TEXT,
			expansionTab: {
				name: @if($en)'Help'@else'ヘルプ'@endif,
				msg: '説明書（ニコニコ大百科のAXNOS Paint:ヘルプの記事）を別タブで開きます。',
				link: 'https://dic.nicovideo.jp/id/5703111',
			},
			postForm: {
				// 投稿フォーム
				input: {
					isDisplay: false, 
				},
				// 注意事項
				notice: {
					isDisplay: true,
					// 文章はユーザー辞書を使用して書き換えが可能 
				},
			},
			dictionary:@if($en) './axnos/en.txt?{{$parameter_day}}&{{$ver}}' @else null @endif ,
			post: axnospaint_post,
		});

		// 投稿処理

		//Base64からBlob
		const toBlob = (base64) => {
		try {
			const binaryString = atob(base64);
			const len = binaryString.length;
			const bytes = new Uint8Array(len);

			for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
			}

			return new Blob([bytes], {type: 'image/png'});
		} catch (error) {
				console.error('Error converting base64 to Blob:', error);
				throw error;
			}
		}

		function axnospaint_post(postObj) {

			return new Promise(resolve => {

				const BlobPng = toBlob(postObj.strEncodeImg)
				// console.log(BlobPng);
				//2022-2024 (c)satopian MIT Licence
				//この箇所はさとぴあが作成したMIT Licenceのコードです。
				const postData = (path, data) => {
					fetch(path, {
						method: 'post',
						mode: 'same-origin',
						headers: {
							'X-Requested-With': 'axnos'
							,
						},
						body: data,
					})
					.then((response) => {
						if (response.ok) {
							response.text().then((text) => {
							console.log(text)
							if(text==='ok'){
								window.onbeforeunload = null;
								@if($rep)
								return repData();
								@endif
								return window.location.href = "?mode=piccom&stime={{$stime}}";
							}
							resolve(false);
							return alert(text);
							})
						}else{
							let response_status = response.status; 

							if(response_status===403){
								resolve(false);
								return alert(@if($en)'It may be a WAF false positive.\nTry to draw a little more.'@else'投稿に失敗。\nWAFの誤検知かもしれません。\nもう少し描いてみてください。'@endif);
							}
							if(response_status===404){
								resolve(false);
								return alert(@if($en)'404 not found\nThe PHP file to save the image does not exist.'@else'エラー404\n画像を保存するPHPファイルがありません。'@endif);	
							}
							resolve(false);
							return alert(@if($en)'Your picture upload failed!\nPlease try again!'@else'投稿に失敗\n時間をおいて再度投稿してみてください。'@endif);
						}
					})
					.catch((error) => {
						resolve(false);
						return alert(@if($en)'Server or line is unstable.\nPlease try again!'@else'サーバまたは回線が不安定です。\n時間をおいて再度投稿してみてください。'@endif);	
					})
				}
					const formData = new FormData();
					formData.append("picture", BlobPng,'blob');
					@if($rep)formData.append("repcode", "{{$repcode}}");@endif
					formData.append("stime", <?=time();?>);
					formData.append("resto", "{{$resto}}");
					formData.append("tool", "Axnos Paint");
					postData("?mode=saveimage&tool=tegaki", formData);
				// (c)satopian MIT Licence ここまで
				// location.reload();
			})
		}
	});
//2022-2024 (c)satopian MIT Licence
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
			'X-Requested-With': 'axnos'
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
</script>
</head>
<body>
<div id="axnospaint_body"></div><script defer="defer" src="./axnos/axnospaint-lib.min.js?{{$parameter_day}}&{{$ver}}"></script></body></html>

<?php
// Mastodon、misskey等の分散型SNSへ記事を共有するクラス
//(c)satopian 2023-2025 MIT License
$sns_share_inc_ver = 20250328;
class sns_share{

//シェアするserverの選択画面
	public static function set_share_server(): void {
		global $en,$skindir,$servers,$petit_lot;
		
		//ShareするServerの一覧
		//｢"ラジオボタンに表示するServer名","snsのserverのurl"｣
		$dat['servers']=$servers ??
		[
		
			["X","https://x.com"],
			["Bluesky","https://bsky.app"],
			["Threads","https://www.threads.net"],
			["pawoo.net","https://pawoo.net"],
			["fedibird.com","https://fedibird.com"],
			["misskey.io","https://misskey.io"],
			["xissmie.xfolio.jp","https://xissmie.xfolio.jp"],
			["misskey.design","https://misskey.design"],
			["nijimiss.moe","https://nijimiss.moe"],
			["sushi.ski","https://sushi.ski"],
			
		];
		//設定項目ここまで

		$dat['servers'][]=[($en?"Direct input":"直接入力"),"direct"];//直接入力の箇所はそのまま。

		$dat['encoded_t']=filter_input_data('GET',"encoded_t");
		$dat['encoded_u']=filter_input_data('GET',"encoded_u");
		$dat['sns_server_radio_cookie']=(string)filter_input_data('COOKIE',"sns_server_radio_cookie");
		$dat['sns_server_direct_input_cookie']=(string)filter_input_data('COOKIE',"sns_server_direct_input_cookie");
		
		//HTML出力
		htmloutput(SET_SHARE_SERVER,$dat);

	}

	//SNSへ共有リンクを送信
	public static function post_share_server(): void {
		global $en;

		$sns_server_radio=(string)filter_input_data('POST',"sns_server_radio",FILTER_VALIDATE_URL);
		$sns_server_radio_for_cookie=(string)filter_input_data('POST',"sns_server_radio");//directを判定するためurlでバリデーションしていない
		$sns_server_radio_for_cookie=($sns_server_radio_for_cookie === 'direct') ? 'direct' : $sns_server_radio;
		$sns_server_direct_input=(string)filter_input_data('POST',"sns_server_direct_input",FILTER_VALIDATE_URL);
		$encoded_t=(string)filter_input_data('POST',"encoded_t");
		$encoded_t=urlencode($encoded_t);
		$encoded_u=(string)filter_input_data('POST',"encoded_u");
		$encoded_u=urlencode($encoded_u);
		setcookie("sns_server_radio_cookie",$sns_server_radio_for_cookie, time()+(86400*30),"","",false,true);
		setcookie("sns_server_direct_input_cookie",$sns_server_direct_input, time()+(86400*30),"","",false,true);
		$share_url='';
		if($sns_server_radio){
			$share_url=$sns_server_radio."/share?text=";
		}elseif($sns_server_direct_input){
			$share_url=$sns_server_direct_input."/share?text=";
			if($sns_server_direct_input==="https://bsky.app"){
				$share_url="https://bsky.app/intent/compose?text=";
			}
			elseif($sns_server_direct_input==="https://www.threads.net"){
				$share_url="https://www.threads.net/intent/post?text=";
			}
		}
		if(in_array($sns_server_radio,["https://x.com","https://twitter.com"])){
			// $share_url="https://x.com/intent/post?text=";
			$share_url="https://twitter.com/intent/tweet?text=";
		}
		elseif($sns_server_radio === "https://bsky.app"){
			$share_url="https://bsky.app/intent/compose?text=";
		}
		elseif($sns_server_radio === "https://www.threads.net"){
			$share_url="https://www.threads.net/intent/post?text=";
		}
		$share_url.=$encoded_t.'%20'.$encoded_u;
		$share_url = filter_var($share_url, FILTER_VALIDATE_URL) ? $share_url : ''; 
		if(!$share_url){
			error($en ? "Please select an SNS sharing destination.":"SNSの共有先を選択してください。");
		}
		header('Location:'.$share_url);
	}
}

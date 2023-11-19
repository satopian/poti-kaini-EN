<?php
//POTI-board plugin search(C)2020-2023 さとぴあ(@satopian)
//MIT License
//v6.0.0 lot.20230828
//POTI-board EVO v6.0 対応版
//https://paintbbs.sakura.ne.jp/

//サポート

// サポートは設置サポート掲示板、またはPOTI-board EVOのリポジトリのissuesで行います。
//https://paintbbs.sakura.ne.jp/poti/

//更新履歴

//v6.0.0 2023.08.28 POTI-board v6.0に対応。
//v5.5.1 2023.07.07 jQuery。
//v5.5.0 2022.09.30 翻訳の改善。記事の並び方が最新順になっていなかったのを修正。
//v5.3.0 2022.09.30 jQuery。
//v5.2.0 2022.07.27 画像の縦横比を算出するための画像の幅と高さを出力。
//v5.1.0 2022.07.20 BladeONEでエスケープしていない箇所のエスケープ処理を追加。
//v5.0.0 2022.01.16 テンプレートエンジンをbladeに変更。
//v1.7.1 2021.08.25 ツリーの照合方式を変更。config.phpで設定したタイムゾーンが反映されるようにした。
//v1.7.0 2021.07.07 v3.03.1 対応。マークダウン記法による自動リンクの文字部分だけを表示。出力時のエスケープ処理追加。
//v1.6.9 2021.03.10 ２重エンコードにならないようにした。
//v1.6.8 2021.03.10 未定義エラーを修正。
//v1.6.6 2021.01.17 PHP8環境で致命的エラーが出るバグを修正。1発言分のログが4096バイト以上の時に処理できなくなるバグを修正。
//v1.6.5 2020.10.02 波ダッシュと全角チルダを区別しない。
//v1.6.3 2020.09.11 1ページ目の画像の表示枚数が19枚になっていたのを修正。
//v1.6.2 2020.08.26 画像検索でis_file()のチェックが２重になっていたのを修正。
//v1.6.1 2020.08.15 radioボタン未チェックの時の動作を修正。
//v1.6 2020.08.13 削除ずみのスレッドのレスが表示されるバグを修正。
//本文も全角英数、半角英数どちらでも検索できるようにした。
//v1.5 2020.07.19 改二以外のPOTI-boardでも使えるようにした。
//v1.4 2020.07.18 負荷削減。画像のis_fileの処理の見直し。
//v1.3 2020.07.18 イラストの単位を「枚」、コメントの単位を「件」に。
//v1.2 2020.07.14 last modifiedが表示されないバグを修正。
//v1.1 2020.07.14 HTMLとCSSをテーマディレクトリに分離。
//v0.5 2020.07.14 イラストの表示数を1ページあたり20枚、コメントの表示数を30件に。
//v0.4 2020.07.14 compact()で格納してextract()で展開するようにした。 
//v0.3 2020.07.14 コード整理と高速化。
//v0.2 2020.07.14 負荷削減。ページングで表示している記事の分だけレス先を探して見つけるようにした。
//v0.1 2020.07.13 GitHubに公開

class processsearch {
    public static function search() {
//設定
// How many cases can you search?
// Initial value 120 Do not make it too large.
defined("MAX_SEARCH") or define("MAX_SEARCH","120");
//設定を変更すればより多く検索できるようになりますが、サーバの負荷が高くなります。

//filter_input

$imgsearch=(bool)filter_input(INPUT_GET,'imgsearch',FILTER_VALIDATE_BOOLEAN);
$page=(int)filter_input(INPUT_GET,'page',FILTER_VALIDATE_INT);
$page= $page ? $page : 1;
$query=(string)filter_input(INPUT_GET,'query');
$query=urldecode($query);
$check_query=mb_convert_kana($query, 'rn', 'UTF-8');
$check_query=str_replace(array(" ", "　"), "", $check_query);
$check_query=str_replace("〜","～",$check_query);//波ダッシュを全角チルダに
$check_query=strtolower($check_query);//すべて小文字に
$radio =(int)filter_input(INPUT_GET,'radio',FILTER_VALIDATE_INT);

if($imgsearch){
	$disp_count_of_page=20;//画像検索の時の1ページあたりの表示件数
}
else{
	$disp_count_of_page=30;//通常検索の時の1ページあたりの表示件数
}

//ログの読み込み
$i=0;$j=0;
$arr=[];
$oya = [];
$tp = fopen(TREEFILE, "r");
while ($line = fgets($tp)) {
	$tree_nos = explode(',', trim($line));
	foreach ($tree_nos as $tree_no) {
		$oya[$tree_no] = $tree_nos[0]; //キーにres no、値にoya no
	}
}
fclose($tp);

$fp = fopen(LOGFILE, "r");
while ($line = fgets($fp)) {
	if(!trim($line)){
		continue;
	}
	list($no,,$name,$email,$sub,$com,$url,,,$ext,$w,$h,$time,,,,,,,$logver) = explode(",", rtrim($line).",,,,,,");
	if(!isset($oya[$no])||(!$name && !$email && !$url && !$com && !$ext)){
		continue;
	}

	$key_time= ($logver==="6") ? $time : (strlen($time)>12 ? substr($time,-13) : $time);

	$continue_to_search=true;
	if($imgsearch){//画像検索の場合
		$continue_to_search=($ext&&is_file(IMG_DIR.$time.$ext));//画像があったら
	}

	if($continue_to_search){
		if($radio===1||$radio===2||$radio===0){
			list($name,) = separateNameAndTrip($name);
			$s_name=mb_convert_kana($name, 'rn', 'UTF-8');//全角英数を半角に
			$s_name=str_replace(array(" ", "　"), "", $s_name);
			$s_name=str_replace("〜","～", $s_name);//波ダッシュを全角チルダに
			$s_name=strtolower($s_name);//すべて小文字に
		}
		else{
			$s_sub=mb_convert_kana($sub, 'rn', 'UTF-8');//全角英数を半角に
			$s_sub=str_replace(array(" ", "　"), "", $s_sub);
			$s_sub=str_replace("〜","～", $s_sub);//波ダッシュを全角チルダに
			$s_sub=strtolower($s_sub);//すべて小文字に
			$s_com=mb_convert_kana($com, 'rn', 'UTF-8');//全角英数を半角に
			$s_com=str_replace(array(" ", "　"), "", $s_com);
			$s_com=str_replace("〜","～", $s_com);//波ダッシュを全角チルダに
			$s_com=strtolower($s_com);//すべて小文字に
		}
		
		//ログとクエリを照合
		if($query===''||//空白なら
		$check_query!==''&&$radio===3&&stripos($s_com,$check_query)!==false||//本文を検索
		$check_query!==''&&$radio===3&&stripos($s_sub,$check_query)!==false||//題名を検索
		$check_query!==''&&($radio===1||$radio===null)&&stripos($s_name,$check_query)===0||//作者名が含まれる
		$check_query!==''&&($radio===2&&$s_name===$check_query)//作者名完全一致
		){
			$link='';
			$link=PHP_SELF."?res={$oya[$no]}#{$time}";
			$arr[$key_time]=[$no,$name,$sub,$com,$ext,$w,$h,$time,$link,$logver];
			++$i;
			if($i>=MAX_SEARCH){break;}//1掲示板あたりの最大検索数
		}
		
	}

	++$j;
	if($j>=5000){break;}//1掲示板あたりの最大行数

}
	fclose($fp);
//検索結果の出力
$j=0;
$dat['comments']=[];
if(!empty($arr)){
	
	krsort($arr);
	
	$articles=array_slice($arr,((int)$page-1),$disp_count_of_page,false);
	$articles = array_values($articles);

	foreach($articles as $i => $val){
		list($no,$name,$sub,$com,$ext,$w,$h,$time,$link,$logver)=$val;
		$img='';
		if($ext){
			if(is_file(THUMB_DIR.$time.'s.jpg')){//サムネイルはあるか？
				$img=THUMB_DIR.$time.'s.jpg';
			}
			elseif($imgsearch||is_file(IMG_DIR.$time.$ext)){
				$img=IMG_DIR.$time.$ext;
				}
			}

			$time=microtime2time($time,$logver);
			$postedtime =$time ? (date("Y/m/d G:i", $time)) : '';
		$sub=h($sub);
		$com=str_replace('<br />',' ',$com);
		if(MD_LINK){
			$com= preg_replace("{\[([^\[\]\(\)]+?)\]\((https?://[[:alnum:]\+\$\;\?\.%,!#~*/:@&=_-]+)\)}","\\1",$com);
		}
		$com=h(strip_tags($com));
		$com=mb_strcut($com,0,180);
		$name=h($name);
		$encoded_name=urlencode($name);
		//変数格納
		$dat['comments'][]= compact('no','name','encoded_name','sub','img','w','h','com','link','postedtime');

	}
	$j=$page+$i;//表示件数
}
unset($sub,$name,$no,$boardname);
unset($i,$val);

$search_type='';
if($imgsearch){
	$search_type='&imgsearch=on';
	$img_or_com='images';
	$mai_or_ken=' ';
}
else{
	$img_or_com='comments';
	$mai_or_ken=' ';
}
$dat['imgsearch']= $imgsearch ? true : false;

//クエリを検索窓に入ったままにする
$dat['query']=h($query);
//ラジオボタンのチェック
$dat['radio_chk1']=false;//作者名
$dat['radio_chk2']=false;//完全一致
$dat['radio_chk3']=false;//本文題名	
$query_l='&query='.urlencode(h($query));//クエリを次ページにgetで渡す
if($query!==''&&$radio===3){//本文題名
	$query_l.='&radio=3';
	$dat['radio_chk3']=true;
}
elseif($query!==''&&$radio===2){//完全一致
	$query_l.='&radio=2';
	$dat['radio_chk2']=true;	
}
elseif($query!==''&&($radio===null||$radio===1)){//作者名
	$query_l.='&radio=1';
	$dat['radio_chk1']=true;
}
else{//作者名	
	$query_l='';
	$dat['radio_chk1']=true;
}
$dat['query_l']=$query_l;

$dat['page']=(int)$page;

$dat['img_or_com']=$img_or_com;
$pageno=0;
if($j&&$page>=2){
	$pageno = $page.'-'.$j.$mai_or_ken;
}else{
	$pageno = $j.$mai_or_ken;
}
if($check_query!==''&&$radio===3){
	$dat['title']=$pageno.' '.$img_or_com.' of '.$query;//titleタグに入る
	$dat['h1']=$pageno.' '.$img_or_com.' of '.$query;//h1タグに入る
}
elseif($check_query!==''){
	$dat['title']=$pageno.' Posts by '.$query;
	$dat['h1']=$pageno.' Posts by '.$query;
}
else{
	$dat['title']='Recent '.$pageno.' Posts';
	$dat['h1']='Recent '.$pageno.' Posts';
}
$dat['pageno']=$pageno;
//ページング

$nxetpage=$page+$disp_count_of_page;//次ページ
$prevpage=$page-$disp_count_of_page;//前のページ
$countarr=count($arr);//配列の数
$dat['prev']=false;
$dat['nxet']=false;

if($page<=$disp_count_of_page){
	$dat['prev']='<a href="./'.h(PHP_SELF2).'">Return to bulletin board</a>';//前のページ
if($countarr>=$nxetpage){
	$dat['nxet']='<a href="'.h(PHP_SELF).'?mode=search&page='.h($nxetpage.$search_type.$query_l).'">next '.h($disp_count_of_page.$mai_or_ken).'≫</a>';//次のページ
}
}

elseif($page>=$disp_count_of_page+1){
	$dat['prev']= '<a href="'.h(PHP_SELF).'?mode=search&page='.h($prevpage.$search_type.$query_l).'">≪prev '.h($disp_count_of_page.$mai_or_ken).'</a>'; 
	if($countarr>=$nxetpage){
		$dat['nxet']='<a href="'.h(PHP_SELF).'?mode=search&page='.h($nxetpage.$search_type.$query_l).'">next '.h($disp_count_of_page.$mai_or_ken).'≫</a>';
	}else{
		$dat['nxet']='<a href="./'.h(PHP_SELF2).'">Return to bulletin board</a>';
	}
}
//最終更新日時を取得
$postedtime='';
$dat['lastmodified']='';
if(!empty($arr)){

	$postedtime= key($arr);
	$postedtime=(int)substr($postedtime,0,-3);
	$dat['lastmodified']=date("Y/m/d G:i", $postedtime);
}

unset($arr);

$dat['self2']=PHP_SELF2;
//HTML出力
htmloutput('search',$dat);

}
}

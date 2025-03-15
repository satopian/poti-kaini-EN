<?php
/*
** メール通知クラス(UTF-8) lot.20250314
**
** https://paintbbs.sakura.ne.jp/poti/
** by POTI改
** originalscript (C)SakaQ 2004-2007
** http://www.punyu.net/php/
**
** 2022/12/19 コード整理。
** 2022/09/18 多国語対応。mb_language( 'uni' )。
** 2020/06/20 多国語対応。メール送信をJISからutf-8へ。
** 2020/07/12 軽微なエラーを修正。
** 2020/05/11 説明追加、POTI改のURL変更。
** 2020/01/25 "REMOTE_ADDR"が使えないサーバに対応。
** 2019/07/24 変換元のエンコードをutf-8に。コード整理。
** 2019/07/21 コード整理。
** 2019/06/25 コード整理。
** 2018/12/02 php7の静的コール警告エラーを修正。
** 2018/06/05 エラー対処。
** 2018/01/15 php7対応改造。
** 2007/03/01 件名(Subject)を日本語が含まれる場合にMIMEヘッダ変換するように変更。
** 2005/01/14 jcode.php(v1.35～) 対応。
** 2004/01/19 公開。

このスクリプトは、PHPの掲示板等にメール通知機能を追加するクラスです。
※通知を目的にしているので添付ファイルに対応していません。

※このファイルをpotiboard.phpと同じディレクトリにアップロードするとメール送信機能がオンになります。
※メールアドレスなど細かな設定はconfig.phpで。

【使用方法】
 このクラスを使いたいスクリプトの先頭で noticemail.inc を require() か include() して下さい。
 これで使えるようになります。
 ☆例: include("noticemail.inc");
 あとは、受け渡すデータをセットして、noticemail::send() で送信します。

【関数説明】
    noticemail::send(メールデータ[, MB関数使用フラグ])
・メールデータは、配列に各種設定を入れてセットします。
・MB関数使用フラグは、MB関数を使用したくない場合に'0'をセットします。ただし、その場合はjcode.phps(～v1.34)またはjcode.php(v1.35～)が必要になります。
  MB関数を使う場合は省略して下さい。
・漢字変換ができない場合は送信できません(falseを返します)

【設定データ項目】※例として $data で説明します
  ・$data['to']
 - 通知先のメールアドレス。

  ・$data['subject']
 - 通知メールの題名。

  ・$data['name']
 - 投稿者の名前。

  ・$data['email']
 - 投稿者のメールアドレス。
   通常、Fromに使われますが日本語、'sage'、'http://:'のどれかが含まれているか未設定の場合
   代替わりがFromにセットされます。

 ★ここまでが必須です。以下は必要に応じてセットして下さい。

  ・$data['option']
 - 追加投稿データ。複数セットできます。
   セットするときは、['option'][]="題名,内容" として下さい。

  ・$data['comment']
 - 投稿データの本文。
   本文は、<br>または<br />を \n に戻してからセットして下さい。
 ☆例: $data['comment'] = preg_replace("/<br(( *)|( *)/)>/i","\n", $comment);

【使用例】※実際には変数を使うが、判り易くする為に直接内容をセットしています

$data['to'] = 'me@example.com';
$data['subject'] = '投稿がありました。';
$data['name'] = '名無しさん';
$data['email'] = 'example@example.com';
$data['option'][] = 'URL,http://www.example.com/';
$data['option'][] = 'お絵かき絵,http://example.com/poti/src/OB11111111.png';
$data['comment'] = 'はじめまして。';
noticemail::send($data);

【ご注意】
・sendmail などの MTA がインストール・設定されていないと使えません。
・データチェックはしていますが、エラーメッセージは出してません。
・万が一、このスクリプトにより何らかの損害が発生しても、その責任を私は負いません。
  自己の責任で利用して下さい。
・著作権は放棄しませんが、改造・再配布は自由にどうぞ。
*/

class noticemail
{

	public static function send($data): void
	{
		mb_language('uni');
		mb_internal_encoding("UTF-8");

		$name = $data['name'] ?? '';
		// 明らかにメールアドレスじゃない物は除外
		$from = filter_var(($data['email'] ?? ""), FILTER_VALIDATE_EMAIL);
		$subject = $data['subject'] ?? '';
		$comment = $data['comment'] ?? '';
		$option = $data['option'] ?? [];
		$to = filter_var(($data['to'] ?? ""), FILTER_VALIDATE_EMAIL);
		if (!$to) {
			return;
		}

		$line = "---------------------------------------------------------------------\n";

		// ヘッダを指定

		$MailHeaders = 'Mime-Version: 1.0' . "\n";
		$MailHeaders .= 'Content-Type: text/plain; charset=utf-8' . "\n";
		$MailHeaders .= 'Content-Transfer-Encoding: 8bit' . "\n";

		// メール本文作成
		$Message = '■' . $subject . "\n";
		$Message .= 'Date: ' . date("Y/m/d H:i:s", time()) . "\n";
		//ユーザーip
		$userip = get_uip();
		$host = $userip ? gethostbyaddr($userip) : '';
		$Message .= 'Host: ' . $host . "\n";
		$Message .= 'UserAgent: ' . $_SERVER["HTTP_USER_AGENT"] . "\n";
		$Message .= $line;
		$Message .= $name ? ('Name: ' . $name . "\n") : '';
		$Message .= $from ? ('e-Mail:' . $from . "\n") : '';
		if (is_array($option)) {
			foreach ($option as $value) {
				list($optitle, $opvalue) = explode(",", rtrim($value));
				$Message .= $optitle . ': ' . $opvalue . " \n";
			}
		}
		$Message .= $line;
		if ($comment) {
			$com = str_replace(["\r\n", "\r"], "\n", $comment); // 改行文字の統一
			$com = preg_replace("/^(\n)+|(\n)+$/i", "", $com);	// 連続改行を消す
			$Message .= $com;
		}

		// 半角対応
		$Message = mb_convert_kana($Message);
		$name = mb_convert_kana($name);
		$name = str_replace('"', "", $name); //ダブルクオートを除去
		$from = mb_convert_kana($from);

		// メールアドレスがなければ代替え
		if (!$from) $from = 'nomail@' . $_SERVER["HTTP_HOST"];
		$name = str_replace(["\r", "\n"], '', $name); // 改行コードを除去
		$name = mb_encode_mimeheader($name);

		$subject = str_replace(["\r", "\n"], '', $subject); // 改行コードを除去

		// ヘッダにFrom追加
		$MailHeaders .= 'From: ' . $name . ' <' . $from . '>' . "\n";
		// メール送信
		mb_send_mail(
			$to,
			$subject,
			$Message,
			$MailHeaders
		);
	}
}

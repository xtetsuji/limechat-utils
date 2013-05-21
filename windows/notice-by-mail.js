// Original on CVS: $Id: notice-by-mail.js,v 1.3 2009/02/16 09:18:58 ogata Exp $
// -*- encoding: utf-8-dos -*-
// notice-by-mail.js - キーワードに反応してメールを送信する LimeChat スクリプト
// LimeChat for Windows の JScript 環境でしか使えません、たぶん。
//////////
// 設定 //
//////////

// MAIL_TO: 送信先 (ケータイメールアドレスなど)
var MAIL_TO = "example@keitai.example.ne.jp"; // 例えば自分のケータイアドレス

// MAIL_FROM: 送信元(From)に設定する値。使用するSMTPサーバが許可するもの。
//var MAIL_FROM = MAIL_TO;
var MAIL_FROM = "example@isp.example.net"; // 自分の会社のアドレス

// SMTP_SERVER: 使用するSMTPサーバ
var SMTP_SERVER = "smtp.example.net"; // ISP等

// SMTP_SERVER_PORT: 使用するSMTPサーバのポート番号 (通常は25)
var SMTP_SERVER_PORT = 25;

// KEYWORD_REGEXP: 正規表現のキーワード
var KEYWORD_REGEXP = "(やまだ|山田|yamada)";

// NOTICE_ONLY_AWAY: true:離席時のみ通知, false:いつでも通知
var NOTICE_ONLY_AWAY  = false;

// NOTICE_ONLY_OTHER: true:自分の発言は通知しない, false:自分の発言でも通知(デバッグ時)
var NOTICE_ONLY_OTHER = false;

var DEBUG = false;

var keywordRegExp = new RegExp(KEYWORD_REGEXP, "i"); // "i" があれば大文字小文字区別しない

//////////////
// 関数定義 //
//////////////
function noticeByMail(prefix, channel, text) {
    var msgline   = "<" + channel + ":" + prefix.nick + "> " + text;
    var subject   = msgline;
    //var subject   = "IRC " + channel + " で呼ばれました";
    var body      = msgline;
    var mail      = new ActiveXObject("CDO.Message");
    mail.From     = MAIL_FROM;
    mail.To       = MAIL_TO;
    mail.Subject  = subject;
    mail.TextBody = body;

    var s = "http://schemas.microsoft.com/cdo/configuration/";
    var f = mail.Configuration.Fields;
    f.Item(s+"sendusing") = 2;
    f.Item(s+"smtpserver") = SMTP_SERVER;
    f.Item(s+"smtpserverport") = SMTP_SERVER_PORT;
    f.Update();
    return mail.Send();
}

function event::onChannelText(prefix, channel, text) {
    if ( DEBUG ) {
        log("離席状態は" + myAwayStatus);
    }
    if ( NOTICE_ONLY_AWAY && !myAwayStatus ) {
        return true;
    }
    if ( NOTICE_ONLY_OTHER && prefix.nick == myNick ) {
        return true;
    }
    if ( keywordRegExp.exec(text) ) {
        if ( DEBUG ) {
            log("メールを送信します");
        }
        return noticeByMail(prefix, channel, text);
    }
    return true;
}

// TODO:
// event::onChannelNotice
// event::onChannelAction
// event::onTalkText
// event::onTalkNotice
// event::onTalkAction
//   ... のときはどうしようかな
// キーワードに反応したときのフックは
// event::onHighlight(Prefix prefix, String command, String channel, String text)
// のようだから、そっちと統合するならこれを上書きするとよい？

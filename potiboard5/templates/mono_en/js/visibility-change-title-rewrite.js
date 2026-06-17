/**
 * Chromeのメモリーセーバによるタブ破棄対策
 * 非アクティブになった時にタイトルタグにアスタリスクを追加
 * Petit Note (c)さとぴあ satopian 2021-2026 MIT License
 * https://paintbbs.sakura.ne.jp/
 */
document.addEventListener("DOMContentLoaded", () => {
    //オリジナルのタイトルタグを保持
    const originalTitle = document.title;
    document.addEventListener("visibilitychange", () => {
        // ページが見えている時は元に戻す
        if (document.visibilityState === "visible") {
            document.title = originalTitle;
        }
        // ページが隠れた時はタイマーをセット
        else if (document.visibilityState === "hidden") {
            setTimeout(() => {
                if (
                    document.visibilityState === "hidden" &&
                    document.title === originalTitle
                ) {
                    document.title = `${originalTitle} *`;
                }
            }, 3000);
        }
    });
});

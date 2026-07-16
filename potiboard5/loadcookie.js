"usestrict";
function l() {
    let P = loadCookie("pwdc"),
        N = loadCookie("namec"),
        E = loadCookie("emailc"),
        U = loadCookie("urlc"),
        FC = loadCookie("fcolorc"),
        AP = loadCookie("appletc"),
        PW = loadCookie("picwc"),
        PH = loadCookie("pichc"),
        PL = loadCookie("palettec");
    for (let i = 0; i < document.forms.length; i++) {
        const form = document.forms[i];

        const pwd = form.elements.namedItem("pwd");

        if (pwd instanceof HTMLInputElement) {
            pwd.value = P;
        }
        const name = form.elements.namedItem("name");

        if (name instanceof HTMLInputElement) {
            name.value = N;
        }
        const email = form.elements.namedItem("email");

        if (email instanceof HTMLInputElement) {
            email.value = E;
        }
        const url = form.elements.namedItem("url");

        if (url instanceof HTMLInputElement) {
            url.value = U;
        }
        const fcolor = form.elements.namedItem("fcolor");

        if (fcolor instanceof RadioNodeList) {
            if (FC == "") FC = fcolor[0].value;

            checkd_if_formval_equal_cookieval(fcolor, FC);
        }
        const shi = form.elements.namedItem("shi");

        if (shi instanceof HTMLSelectElement) {
            checkd_if_formval_equal_cookieval(shi, AP);
        }

        const picw = form.elements.namedItem("picw");

        if (
            picw instanceof HTMLSelectElement ||
            picw instanceof HTMLInputElement
        ) {
            if (PW != "") {
                picw.value = PW;
            }
        }

        const pich = form.elements.namedItem("pich");

        if (
            pich instanceof HTMLSelectElement ||
            pich instanceof HTMLInputElement
        ) {
            if (PH != "") {
                pich.value = PH;
            }
        }
        const selected_palette_no = form.elements.namedItem(
            "selected_palette_no",
        );

        if (selected_palette_no instanceof HTMLSelectElement) {
            selected_palette_no.selectedIndex = Number(PL);
        }
    }
}

// Cookieと一致したらチェック
/**
 *
 * @param {HTMLSelectElement|RadioNodeList} docformsname
 * @param {string} cookieval
 */
function checkd_if_formval_equal_cookieval(docformsname, cookieval) {
    if (docformsname.length) {
        // ラジオボタンやチェックボックス（NodeList）をループでチェック
        for (let j = 0; j < docformsname.length; j++) {
            if (docformsname instanceof RadioNodeList) {
                if (docformsname[j].value == cookieval) {
                    docformsname[j].checked = true; //チェックボックス
                }
            }
            if (docformsname instanceof HTMLSelectElement) {
                if (docformsname.options[j].value == cookieval) {
                    docformsname.selectedIndex = j; //プルダウンメニュー
                }
            }
        }
    }
}
/**
 * @param {string} name
 */
//指定した名前のCookieをロード
function loadCookie(name) {
    const cookies = new URLSearchParams(document.cookie.replace(/; /g, "&"));
    const cookieValue = cookies.get(name);
    return cookieValue ? decodeURIComponent(cookieValue) : "";
}

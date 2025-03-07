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

        if (form.pwd) {
            form.pwd.value = P;
        }
        if (form.name) {
            form.name.value = N;
        }
        if (form.email) {
            form.email.value = E;
        }
        if (form.url) {
            form.url.value = U;
        }
        if (form.fcolor) {
            if (FC == "") FC = form.fcolor[0].value;

            checkd_if_formval_equal_cookieval(form.fcolor, FC);
        }
        if (form.shi) {
            checkd_if_formval_equal_cookieval(form.shi, AP);
        }
        if (form.picw) {
            if (PW != "") {
                form.picw.value = PW;
            }

            checkd_if_formval_equal_cookieval(form.picw, PW);
        }

        if (form.pich) {
            if (PH != "") {
                form.pich.value = PH;
            }

            checkd_if_formval_equal_cookieval(form.pich, PH);
        }

        if (form.selected_palette_no) {
            form.selected_palette_no.selectedIndex = PL;
        }
    }
}

//Cookieと一致したらcheckd
function checkd_if_formval_equal_cookieval(docformsname, cookieval) {
    var j;
    for (j = 0; docformsname.length > j; j++) {
        if (docformsname[j].value == cookieval) {
            docformsname[j].checked = true; //チェックボックス
            docformsname.selectedIndex = j; //プルダウンメニュー
        }
    }
}
//指定した名前のCookieをロード
function loadCookie(name) {
    const cookies = new URLSearchParams(document.cookie.replace(/; /g, "&"));
    const cookieValue = cookies.get(name);
    return cookieValue ? decodeURIComponent(cookieValue) : "";
}

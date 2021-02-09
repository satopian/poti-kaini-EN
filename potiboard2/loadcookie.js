function l(){
	var P=loadCookie("pwdc"),N=loadCookie("namec"),E=loadCookie("emailc"),U=loadCookie("urlc"),
	FC=loadCookie("fcolorc"),AP=loadCookie("appletc"),PW=loadCookie("picwc"),PH=loadCookie("pichc"),PL=loadCookie("palettec"),i;
		for(i=0;i<document.forms.length;i++){
			if(document.forms[i].pwd){
				document.forms[i].pwd.value=P;
			}
			if(document.forms[i].name){
				document.forms[i].name.value=N;
			}
			if(document.forms[i].email){
				document.forms[i].email.value=E;
			}
			if(document.forms[i].url){
				document.forms[i].url.value=U;
			}
			if(document.forms[i].fcolor){
				if(FC == "") FC = document.forms[i].fcolor[0].value;

				checkd_if_formval_equal_cookieval(document.forms[i].fcolor,FC);

			}
			if(document.forms[i].shi){

				checkd_if_formval_equal_cookieval(document.forms[i].shi,AP);

			}
			if(document.forms[i].picw){
				if(PW != ""){
					document.forms[i].picw.value=PW;
				}

				checkd_if_formval_equal_cookieval(document.forms[i].picw,PW);

			}

			if(document.forms[i].pich){
				if(PH != ""){
					document.forms[i].pich.value=PH;
				}

				checkd_if_formval_equal_cookieval(document.forms[i].pich,PH);

			}

			if(document.forms[i].selected_palette_no){
				document.forms[i].selected_palette_no.selectedIndex = PL;
			}

		}
};

//Cookieと一致したらcheckd
function checkd_if_formval_equal_cookieval(docformsname,cookieval) {
var j;
	for(j = 0; docformsname.length > j; j ++) {
	if(docformsname[j].value == cookieval){
		docformsname[j].checked = true;//チェックボックス
		docformsname.selectedIndex = j;//プルダウンメニュー
	}
}
}

/* Function to get cookie parameter value string with specified name
   Copyright (C) 2002 Cresc Corp. http://www.cresc.co.jp/
   Version: 1.0
*/
function loadCookie(name) {
	var allcookies = document.cookie;
	if (allcookies == "") return "";
	var start = allcookies.indexOf(name + "=");
	if (start == -1) return "";
	start += name.length + 1;
	var end = allcookies.indexOf(';',start);
	if (end == -1) end = allcookies.length;
	
	return decodeURIComponent(allcookies.substring(start,end));
}

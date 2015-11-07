<?php

/**
 *
 *  Analytics Javascript client for personal use on topperstudios.com,
 *  AND for possible testing on other sites
 *
 *  VERSION 0.2 alpha
 * 
 *  
 */


include './paths.php';
$paths = new Paths;
$phpPath = $paths->getFullPath('php');
$analyticsPath = $paths->getHTTPPath("submitAnalytics");
$jsPath = $paths->getHTTPPath("js");
$jsonPhpPath = $paths->getHTTPPath("jsonphp");
$libsjsPath = $paths->getHTTPPath("libsjs");
require_once($phpPath."libs.php");

ini_set('display_errors', 0);

// Force full reload of data every time this is loaded

http_response_code(200);

header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');
header('Last-Modified: ' . gmdate( 'D, d M Y H:i:s') . ' GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
 
header('Content-Type:text/javascript');

$TSAN_SECRET1 = "sQTKigb3MTkuvE7mtlCPkKBelzBCZRVKgFxgpT4XZ2OWDi0yTit89Qy8du8F";
$TSAN_SECRET2 = "rsmK6xzcRbmk9x7G4SW54aTN44iILKKFZdKUO5UeUSzu7XxKbUvm5SvmmouI";

$countryCode = iptocountry($_SERVER["REMOTE_ADDR"]);

function getParamTrue($param){
	$val = $_GET[$param];
	$trueStrings = array(
		"yes",
		"true",
		"1",
		1,
		"on"
	);
	foreach ($trueStrings as $key => $value) {
		if ($val == $value) {
			return true;
		}
	}
	return false;
}

?>
// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// @js_externs window.__tsanalytics_id_
// @js_externs window.__tsanalytics_evts_
// @js_externs window.__COMMENT__
// ==/ClosureCompiler==

/*

How to compile:

1. Google Closure Compiler w/advanced optimizations
2. Expand in jsbeautifier
3. Check code
	a. All externally accessed object names should not be changed
	b. Remove any unused functions
	c. Remove all tscomments
4. Minify edited code with SIMPLE optimizations in Closure Compiler
5. Put final js code and PHP head together

*/
(function(){

// TODO: FOR GOD'S SAKE, ORGANIZE THESE FUNCTIONS AND FIND A STABLE ARCHITECTURE ! ! !

var EXT_STR = "tsanalytics";

// TS LIB

var doc = document;

// LOCAL DECLARATION
var _tslib = {};


var protocol = (("https:" == doc.location.protocol) ? "https://" : "http://");

var JSON_PATH = "<?=$jsonPhpPath?>";
// Alhpanumeric characters
var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// Timing ticks array
var timer = [];
// JSONP callbacks array
var jsonp_callbacks = [];
// Preloaded images array
var imgs = [];

var browser_prefixes = ["moz","webkit","o","ms"];

// If Flash is Available
var flashVersion=function(){var b=[0,0,0],a=null;if(void 0!=typeof navigator.plugins&&"object"==typeof navigator.plugins["Shockwave Flash"]){if((a=navigator.plugins["Shockwave Flash"].description)&&!(void 0!=typeof navigator.mimeTypes&&navigator.mimeTypes["application/x-shockwave-flash"]&&!navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin))a=a.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),b[0]=parseInt(a.replace(/^(.*)\..*$/,"$1"),10),b[1]=parseInt(a.replace(/^.*\.(.*)\s.*$/,"$1"),10),b[2]= /[a-zA-Z]/.test(a)?parseInt(a.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}else if(void 0!=typeof window.ActiveXObject)try{var c=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(c&&(a=c.GetVariable("$version")))a=a.split(" ")[1].split(","),b=[parseInt(a[0],10),parseInt(a[1],10),parseInt(a[2],10)]}catch(d){}return b}();

var isFlashAvailable = (flashVersion[0] > 9);

var isHTML5 = function(){return !!doc.createElement('canvas').getContext}();

var browser = (function () {
	function _isBrowser(a) {
		return (navigator.userAgent.toLowerCase().indexOf(a) > -1);
	}
	return {
		ie: (_isBrowser("msie")),
		opera: (_isBrowser("opera")),
		firefox: (_isBrowser("firefox")),
		chrome: (_isBrowser("chrome")),
		safari: ((_isBrowser("safari")) && (!_isBrowser("chrome"))),
		m: (_isBrowser("iphone") || _isBrowser("ipod") || _isBrowser("android"))
	}
})();

function getter(objClass,propName,func) {
	(objClass.prototype? objClass.prototype : objClass).__defineGetter__(propName,func);
}

function setter(objClass,propName,func) {
	(objClass.prototype? objClass.prototype : objClass).__defineSetter__(propName,func);
}

function copyObj(from,to) {
	if (_tslib.isString(to)) {
		var p = window;
		var a = to.split(".");
		for (var i = 0; i < a.length; i++) {
			if (!_tslib.isDefined(p[a[i]])) {
				p[a[i]] = {};
			}
			p = p[a[i]];
		}
		for (var i in from){
			p[i] = from[i];
		}
	} else {
		for (var i in from){
			to[i] = from[i];
		}
	}
}
function getObj(id) {
	if (!_tslib.isString(id))return id;
	var a = id.split(".");
	var p = window;
	for (var i = 0; i < a.length; i++) {
		p = p[a[i]];
	}
	return p;
}

function bind(element,event_name,callback_function){
	event_name = event_name.split(" ");
	for (var i=0;i<event_name.length;i++){
		if (element.addEventListener) {
			element.addEventListener(event_name[i],callback_function); 
		} else if (element.attachEvent)  {
			element.attachEvent(("on"+event_name[i]),callback_function);
		}
	}
}

function trigger(element,evtName,memo) {
	var event;
	if (document.createEvent) {
		event = document.createEvent("HTMLEvents");
		event.initEvent(evtName, true, true);
	} else {
		event = document.createEventObject();
		event.eventType = evtName;
	}

	event.eventName = evtName;
	event.memo = memo || { };

	if (document.createEvent) {
		element.dispatchEvent(event);
	} else {
		element.fireEvent("on" + event.eventType, event);
	}
}

function jsonp_request(url,callback,use_ts,return_string,add_random_token){
	var callbackID,scriptElement,usedIDs=[];
	if (jsonp_callbacks.length > 0){
		for (var i = 0; i < jsonp_callbacks.length; i++) {
			if (_tslib.isObject(jsonp_callbacks[i]))
				usedIDs.push(jsonp_callbacks[i].id);
		}
		var currentID = 0;
		for (var a = 0;usedIDs.indexOf(a) > -1;a++) {
			currentID = a;
		}
		callbackID = currentID+1;
	} else {
		callbackID = 0;
	}
	var urlArgs = {};
	if (use_ts){
		url = ASSET_PATH+'php/json.php?url='+encodeURIComponent(url);
	}
	if (callback){
		urlArgs["callback"] = EXT_STR+".jsonp_receive("+callbackID+")";
	}
	if (return_string){
		urlArgs["str"] = "yes";
	}
	if (add_random_token){
		urlArgs["__random"] = Math.random();
	}
	scriptElement = doc.createElement("script");
	
	jsonp_callbacks.push({
		element:scriptElement,
		callback:callback,
		id:callbackID
	});

	scriptElement.src = addParamsToURL(url,urlArgs);
	scriptElement.async = true;
	doc.getElementsByTagName('head')[0].appendChild(scriptElement);
	
}
function jsonp_receive(id){
	var index = 0;
	for (var i = 0; i < jsonp_callbacks.length; i++) {
		if (_tslib.isObject(jsonp_callbacks[i])){
			if (jsonp_callbacks[i].id==id){
				index = i;
			}
		}
	}
	var callback = jsonp_callbacks[index].callback;
	jsonp_callbacks[index].element.parentNode.removeChild(jsonp_callbacks[index].element);
	delete jsonp_callbacks[index];
	return callback;
}
function xhr(url,method,callback,postData){
	if (!_tslib.isDefined(XMLHttpRequest)) {
		XMLHttpRequest = function () {
		try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
			catch (e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
			catch (e) {}
		try { return new ActiveXObject("Microsoft.XMLHTTP"); }
			catch (e) {}
		}
	}
	
	var xhr = new XMLHttpRequest();
	xhr.open(method,url,true);
	xhr.onload = function(e) {
		callback(xhr.response); 
	}
	xhr.send( (method.toLowerCase() == "post") && postData );
	
}
function post(url,data,callback){
	xhr(url,"POST",callback,urlobj(data));
}

function addParamsToURL(url,paramsObj) {
	if (url.indexOf("?") != -1){
		url = url+'&';
	} else {
		url = url+'?';
	}
	return url+urlobj(paramsObj);
}

// url: The url to request
// callback: the function to send the data to when the request has loaded
// use_ts: use topper studios as the json reuqest engine or not
// return_string: return the request as a string or not
// custom_data: call the callback with this data rather than the URL data
/*
function jsonp_request(url,callback,use_ts,return_string,custom_data) {
	//var callback_id = jsonp_callbacks.length;
	//jsonp_callbacks[callback_id] = callback;
	var script = doc.createElement("script");
	script.setAttribute("type","text/javascript");
	if (_tslib.isFunction(callback)){
		callback = encodeURIComponent('('+callback+')');
	}
	if (use_ts) {
		url = encodeURIComponent(url);
		if (callback) {
			if (return_string) {
				script.setAttribute("src",ASSET_PATH+'php/json.php?url='+url+'&callback='+callback+'&str=yes');
			} else {
				if (custom_data) {
					script.setAttribute("src",ASSET_PATH+'php/json.php?data='+encodeURIComponent(custom_data)+'&callback='+callback);
				} else {
					script.setAttribute("src",ASSET_PATH+'php/json.php?url='+url+'&callback='+callback);
				}
			}
		} else {
			if (custom_data) {
				script.setAttribute("src",ASSET_PATH+'php/json.php?data='+encodeURIComponent(custom_data));
			} else {
				script.setAttribute("src",ASSET_PATH+'php/json.php?url='+url);
			}
			
		}
	} else {
		if (callback) {
			if (url.indexOf("?") != -1) {
				script.setAttribute("src",url+"&callback="+callback);
			} else {
				script.setAttribute("src",url+"?callback="+callback);
			}
		} else {
			script.setAttribute("src",url);
		}
	}
	doc.getElementsByTagName('head')[0].appendChild(script);
}*/
function addLeadingZeros(num,count) {
	var finalNum = num + '';
	while(finalNum.length < count) {
		finalNum = "0" + finalNum;
	}
	return finalNum;
}
// Hash Algorithms
// Released by webtoolkit.info under GPL

// Minified Version of the md5 algorithm
// See the full source code at: http://code.google.com/p/tbwebframework/source/browse/trunk/WebsiteFramework_src/WebSite/JScript/WebToolKit/WebToolKit.MD5.js?r=248
function md5(e){function h(a,b){var c,d,e,f,g;e=a&2147483648;f=b&2147483648;c=a&1073741824;d=b&1073741824;g=(a&1073741823)+(b&1073741823);return c&d?g^2147483648^e^f:c|d?g&1073741824?g^3221225472^e^f:g^1073741824^e^f:g^e^f}function i(a,b,c,d,e,f,g){a=h(a,h(h(b&c|~b&d,e),g));return h(a<<f|a>>>32-f,b)}function j(a,b,c,d,e,f,g){a=h(a,h(h(b&d|c&~d,e),g));return h(a<<f|a>>>32-f,b)}function k(a,b,d,c,e,f,g){a=h(a,h(h(b^d^c,e),g));return h(a<<f|a>>>32-f,b)}function l(a,b,d,c,e,f,g){a=h(a,h(h(d^(b|~c),e), g));return h(a<<f|a>>>32-f,b)}function m(a){var b="",d="",c;for(c=0;3>=c;c++)d=a>>>8*c&255,d="0"+d.toString(16),b+=d.substr(d.length-2,2);return b}var f=[],n,o,p,q,a,b,c,d,e=function(a){for(var a=a.replace(/\r\n/g,"\n"),b="",d=0;d<a.length;d++){var c=a.charCodeAt(d);128>c?b+=String.fromCharCode(c):(127<c&&2048>c?b+=String.fromCharCode(c>>6|192):(b+=String.fromCharCode(c>>12|224),b+=String.fromCharCode(c>>6&63|128)),b+=String.fromCharCode(c&63|128))}return b}(e),f=function(b){var a,c=b.length;a=c+ 8;for(var d=16*((a-a%64)/64+1),e=Array(d-1),f=0,g=0;g<c;)a=(g-g%4)/4,f=8*(g%4),e[a]|=b.charCodeAt(g)<<f,g++;a=(g-g%4)/4;e[a]|=128<<8*(g%4);e[d-2]=c<<3;e[d-1]=c>>>29;return e}(e);a=1732584193;b=4023233417;c=2562383102;d=271733878;for(e=0;e<f.length;e+=16)n=a,o=b,p=c,q=d,a=i(a,b,c,d,f[e+0],7,3614090360),d=i(d,a,b,c,f[e+1],12,3905402710),c=i(c,d,a,b,f[e+2],17,606105819),b=i(b,c,d,a,f[e+3],22,3250441966),a=i(a,b,c,d,f[e+4],7,4118548399),d=i(d,a,b,c,f[e+5],12,1200080426),c=i(c,d,a,b,f[e+6],17,2821735955), b=i(b,c,d,a,f[e+7],22,4249261313),a=i(a,b,c,d,f[e+8],7,1770035416),d=i(d,a,b,c,f[e+9],12,2336552879),c=i(c,d,a,b,f[e+10],17,4294925233),b=i(b,c,d,a,f[e+11],22,2304563134),a=i(a,b,c,d,f[e+12],7,1804603682),d=i(d,a,b,c,f[e+13],12,4254626195),c=i(c,d,a,b,f[e+14],17,2792965006),b=i(b,c,d,a,f[e+15],22,1236535329),a=j(a,b,c,d,f[e+1],5,4129170786),d=j(d,a,b,c,f[e+6],9,3225465664),c=j(c,d,a,b,f[e+11],14,643717713),b=j(b,c,d,a,f[e+0],20,3921069994),a=j(a,b,c,d,f[e+5],5,3593408605),d=j(d,a,b,c,f[e+10],9,38016083), c=j(c,d,a,b,f[e+15],14,3634488961),b=j(b,c,d,a,f[e+4],20,3889429448),a=j(a,b,c,d,f[e+9],5,568446438),d=j(d,a,b,c,f[e+14],9,3275163606),c=j(c,d,a,b,f[e+3],14,4107603335),b=j(b,c,d,a,f[e+8],20,1163531501),a=j(a,b,c,d,f[e+13],5,2850285829),d=j(d,a,b,c,f[e+2],9,4243563512),c=j(c,d,a,b,f[e+7],14,1735328473),b=j(b,c,d,a,f[e+12],20,2368359562),a=k(a,b,c,d,f[e+5],4,4294588738),d=k(d,a,b,c,f[e+8],11,2272392833),c=k(c,d,a,b,f[e+11],16,1839030562),b=k(b,c,d,a,f[e+14],23,4259657740),a=k(a,b,c,d,f[e+1],4,2763975236), d=k(d,a,b,c,f[e+4],11,1272893353),c=k(c,d,a,b,f[e+7],16,4139469664),b=k(b,c,d,a,f[e+10],23,3200236656),a=k(a,b,c,d,f[e+13],4,681279174),d=k(d,a,b,c,f[e+0],11,3936430074),c=k(c,d,a,b,f[e+3],16,3572445317),b=k(b,c,d,a,f[e+6],23,76029189),a=k(a,b,c,d,f[e+9],4,3654602809),d=k(d,a,b,c,f[e+12],11,3873151461),c=k(c,d,a,b,f[e+15],16,530742520),b=k(b,c,d,a,f[e+2],23,3299628645),a=l(a,b,c,d,f[e+0],6,4096336452),d=l(d,a,b,c,f[e+7],10,1126891415),c=l(c,d,a,b,f[e+14],15,2878612391),b=l(b,c,d,a,f[e+5],21,4237533241), a=l(a,b,c,d,f[e+12],6,1700485571),d=l(d,a,b,c,f[e+3],10,2399980690),c=l(c,d,a,b,f[e+10],15,4293915773),b=l(b,c,d,a,f[e+1],21,2240044497),a=l(a,b,c,d,f[e+8],6,1873313359),d=l(d,a,b,c,f[e+15],10,4264355552),c=l(c,d,a,b,f[e+6],15,2734768916),b=l(b,c,d,a,f[e+13],21,1309151649),a=l(a,b,c,d,f[e+4],6,4149444226),d=l(d,a,b,c,f[e+11],10,3174756917),c=l(c,d,a,b,f[e+2],15,718787259),b=l(b,c,d,a,f[e+9],21,3951481745),a=h(a,n),b=h(b,o),c=h(c,p),d=h(d,q);return(m(a)+m(b)+m(c)+m(d)).toLowerCase()};
// Minified Version of the sha-1 algorithm
// See the full source code at: http://www.webtoolkit.info/javascript-sha1.html
function sha1(d){function j(a,b){return a<<b|a>>>32-b}function l(a){var b="",d,c;for(d=7;0<=d;d--)c=a>>>4*d&15,b+=c.toString(16);return b}var a,c,g=Array(80),m=1732584193,n=4023233417,o=2562383102,p=271733878,q=3285377520,b,e,f,h,i,d=function(a){for(var a=a.replace(/\r\n/g,"\n"),b="",d=0;d<a.length;d++){var c=a.charCodeAt(d);128>c?b+=String.fromCharCode(c):(127<c&&2048>c?b+=String.fromCharCode(c>>6|192):(b+=String.fromCharCode(c>>12|224),b+=String.fromCharCode(c>>6&63|128)),b+=String.fromCharCode(c& 63|128))}return b}(d);b=d.length;var k=[];for(a=0;a<b-3;a+=4)c=d.charCodeAt(a)<<24|d.charCodeAt(a+1)<<16|d.charCodeAt(a+2)<<8|d.charCodeAt(a+3),k.push(c);switch(b%4){case 0:a=2147483648;break;case 1:a=d.charCodeAt(b-1)<<24|8388608;break;case 2:a=d.charCodeAt(b-2)<<24|d.charCodeAt(b-1)<<16|32768;break;case 3:a=d.charCodeAt(b-3)<<24|d.charCodeAt(b-2)<<16|d.charCodeAt(b-1)<<8|128}for(k.push(a);14!=k.length%16;)k.push(0);k.push(b>>>29);k.push(b<<3&4294967295);for(d=0;d<k.length;d+=16){for(a=0;16>a;a++)g[a]= k[d+a];for(a=16;79>=a;a++)g[a]=j(g[a-3]^g[a-8]^g[a-14]^g[a-16],1);c=m;b=n;e=o;f=p;h=q;for(a=0;19>=a;a++)i=j(c,5)+(b&e|~b&f)+h+g[a]+1518500249&4294967295,h=f,f=e,e=j(b,30),b=c,c=i;for(a=20;39>=a;a++)i=j(c,5)+(b^e^f)+h+g[a]+1859775393&4294967295,h=f,f=e,e=j(b,30),b=c,c=i;for(a=40;59>=a;a++)i=j(c,5)+(b&e|b&f|e&f)+h+g[a]+2400959708&4294967295,h=f,f=e,e=j(b,30),b=c,c=i;for(a=60;79>=a;a++)i=j(c,5)+(b^e^f)+h+g[a]+3395469782&4294967295,h=f,f=e,e=j(b,30),b=c,c=i;m=m+c&4294967295;n=n+b&4294967295;o=o+e&4294967295; p=p+f&4294967295;q=q+h&4294967295}i=l(m)+l(n)+l(o)+l(p)+l(q);return i.toLowerCase()};
// Minified Version of the sha-256 algorithm
// See the full source code at: http://www.webtoolkit.info/javascript-sha256.html
function sha256(i){function e(c,b){var d=(c&65535)+(b&65535);return(c>>16)+(b>>16)+(d>>16)<<16|d&65535}function g(c,b){return c>>>b|c<<32-b}i=function(c){for(var c=c.replace(/\r\n/g,"\n"),b="",d=0;d<c.length;d++){var a=c.charCodeAt(d);128>a?b+=String.fromCharCode(a):(127<a&&2048>a?b+=String.fromCharCode(a>>6|192):(b+=String.fromCharCode(a>>12|224),b+=String.fromCharCode(a>>6&63|128)),b+=String.fromCharCode(a&63|128))}return b}(i);return function(c){for(var b="",d=0;d<4*c.length;d++)b+="0123456789abcdef".charAt(c[d>> 2]>>8*(3-d%4)+4&15)+"0123456789abcdef".charAt(c[d>>2]>>8*(3-d%4)&15);return b}(function(c,b){var d=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051, 2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],h=Array(64),j,l,m,i,k,n,o,q,p,f,r,s;c[b>>5]|=128<<24-b%32;c[(b+64>>9<<4)+15]=b;for(p=0;p<c.length;p+=16){j=a[0];l=a[1];m=a[2];i=a[3]; k=a[4];n=a[5];o=a[6];q=a[7];for(f=0;64>f;f++)h[f]=16>f?c[f+p]:e(e(e(g(h[f-2],17)^g(h[f-2],19)^h[f-2]>>>10,h[f-7]),g(h[f-15],7)^g(h[f-15],18)^h[f-15]>>>3),h[f-16]),r=e(e(e(e(q,g(k,6)^g(k,11)^g(k,25)),k&n^~k&o),d[f]),h[f]),s=e(g(j,2)^g(j,13)^g(j,22),j&l^j&m^l&m),q=o,o=n,n=k,k=e(i,r),i=m,m=l,l=j,j=e(r,s);a[0]=e(j,a[0]);a[1]=e(l,a[1]);a[2]=e(m,a[2]);a[3]=e(i,a[3]);a[4]=e(k,a[4]);a[5]=e(n,a[5]);a[6]=e(o,a[6]);a[7]=e(q,a[7])}return a}(function(c){for(var b=[],d=0;d<8*c.length;d+=8)b[d>>5]|=(c.charCodeAt(d/ 8)&255)<<24-d%32;return b}(i),8*i.length))};

// Random string generator
function randomString(len) {
	var str = '';
	if (!len) {
		len=20;
	}
	for (var i=0;i<len;i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		//str += chars.substring(rnum,rnum+1);
		str+=chars[rnum];
	}
	return str;
}

// Sets a Browser cookie
function setCookie(c_name,value,exdays,domain) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString() + ((!domain)?"":("; domain="+domain + "; path=/")));
	doc.cookie=c_name + "=" + c_value;
}

// Gets a Browser cookie
function getCookie(c_name)
{
	var i,x,y,ARRcookies=doc.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++){
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name) {
			return unescape(y);
		}
	}
}

// Deletes a browser cookie
function deleteCookie(c_name) {
	setCookie(c_name,"",-1);
}

// Convert an object to url parameters
function urlobj(object) {
	var strBuilder = [];
	for (var key in object) if (object.hasOwnProperty(key)) {
	   strBuilder.push(encodeURIComponent(key)+'='+encodeURIComponent(object[key]));
	}
	return strBuilder.join('&');
}


// Get a URL GET variable
function urlGET(name) {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars[name];
}

function linkTargetBlank(link) {
	_tslib.getEl(link).setAttribute("target","_blank");
}

// Get a function's name as a string
function functionName(func){
	return func.toString().substr(9).match(/(.*)\(/)[1];
}

function removeSpacing(str){
	var toRemove = [" ","\n","\r","\t"];
	str = str+'';
	for (var i = 0; i < toRemove.length; i++) {
		str=str.replace(RegExp(toRemove[i],'g'),"");
	}
	return str;
}

function escapeRegExp(str){
	return String(str).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
}

function isEmailAddress(email){
	var emailTestingRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return emailTestingRegExp.test(email);
}

// A custom TS request protocol (for specific apps only)
// ts://product/request_name/data
function custom_request(app,name,data) {
	window.location = 'ts://'+encodeURIComponent(app)+'/'+encodeURIComponent(name)+'/'+urlobj(data);
}

function assert(condition,message){
	if (!condition){
		console.error("TS: "+message);
	}
}

bind(doc,"keydown",function(e) {
	_tslib.keyactive=e.keyCode? e.keyCode : e.charCode;
})
bind(doc,"keyup",function(e) {
	_tslib.keyactive=0;
})
bind(doc,"mousemove",function(e){
	if (!_tslib.mouse)return;
	_tslib.mouse.x = e.pageX;
	_tslib.mouse.y = e.pageY;
})
bind(doc,"mousedown",function(e) {
	if (!_tslib.mouse)return;
	_tslib.mouse.down = true;
})
bind(doc,"mouseup",function(e) {
	if (!_tslib.mouse)return;
	_tslib.mouse.down = false;
})

_tslib = {
	chars: chars,
	mouse:{},
	browser:browser,
	obj:{
		copy:copyObj,
		get:getObj
	},
	image:{
		load:function(image,tag){
			tag = tag || image;
			tag += '';
			var element = doc.createElement("img");
			element.setAttribute("src",image);
			element.setAttribute("id",tag);
			imgs[tag] = {
				element:element,
				loaded:false
			};
			imgs[tag].element.onload = (function(img_tag){
				return function(){
					var ob = imgs[img_tag];
					ob.loaded = true;
					if (ob.load_callback){
						ob.load_callback.call();
					}
				}
			})(tag);
		},
		show:function(tag,element_id){
			tag += '';
			if (imgs[tag]){
				getEl(element_ID).appendChild(imgs[tag].element);
				return imgs[tag].element;
			}
		},
		get:function(tag){
			tag += '';
			if (imgs[tag]) {
				return imgs[tag].element;
			}
		},
		hide:function(tag){
			tag += '';
			if (imgs[tag]) {
				var el = imgs[tag].element;
				if (el.parentNode){
					el.parentNode.removeChild(el);
				}
			}
		},
		onload:function(tag,loaded_callback){
			tag += '';
			if (imgs[tag]){
				imgs[tag].load_callback = loaded_callback;
			}
		}
	},
	string:{
		test: function(str, regex, params){
			return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(str);
		},
		contains: function(str, string, separator){
			return (separator) ? (separator + str + separator).indexOf(separator + string + separator) > -1 : String(str).indexOf(string) > -1;
		},
		hyphenate: function(str){
			return String(str).replace(/[A-Z]/g, function(match){
				return ('-' + match.charAt(0).toLowerCase());
			});
		},
		capitalize: function(str){
			return String(str).replace(/\b[a-z]/g, function(match){
				return match.toUpperCase();
			});
		},
		escapeRegExp:escapeRegExp,
		toInt: function(str,base){
			return parseInt(str, base || 10);
		},
		toFloat: function(str){
			return parseFloat(str);
		},
		hexToRgb: function(str,array){
			var hex = String(str).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
			return (hex) ? hex.slice(1).hexToRgb(array) : null;
		},
		rgbToHex: function(str,array){
			var rgb = String(str).match(/\d{1,3}/g);
			return (rgb) ? rgb.rgbToHex(array) : null;
		},
		isEmail:isEmailAddress,
		removeSpacing:removeSpacing,
		substitute: function(str, object, regexp){
			return String(str).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
				if (match.charAt(0) == '\\') return match.slice(1);
				return (object[name] != null) ? object[name] : '';
			});
		}
	},
	formInsertData:function(formElement,dataObj){
		formElement = getEl(formElement);
		for (var i in dataObj){
			if (_tslib.isDefined(dataObj[i])){
				var el = doc.createElement("input");
				el.type = "hidden";
				el.name = i;
				el.value = _tslib.isObject(dataObj[i]) ? JSON.stringify(dataObj[i]) : dataObj[i];
				formElement.appendChild(el);
			}
		}
	},
	iframeClick:function(el,func){
		var el = _tslib.getEl(el);
		var isOver = false;
		_tslib.bind(window,'blur',function(e){
			if(isOver){
				func(e);
			}
		}); 

		_tslib.bind(el,'mouseover',function(){
			isOver = true;
		});

		_tslib.bind(el,'mouseout',function(){
			isOver = false;
		});
	},
	functionName:functionName,
	jsonp:jsonp_request,
	jsonp_receive:jsonp_receive,
	linkTargetBlank:linkTargetBlank,
	post:post,
	xhr:xhr,
	html5:isHTML5,
	fullScreen:function(element,exitCallback){
		var enabled = false;
		if (element.requestFullScreen){
			element.requestFullScreen();
			enabled = true;
		}
		if (element.webkitRequestFullScreen){
			element.webkitRequestFullScreen();
			enabled = true;
		}
		if (element.mozRequestFullScreen){
			element.mozRequestFullScreen();
			enabled = true;
		}
		if (exitCallback){
			bind(doc,"webkitfullscreenchange mozfullscreenchange fullscreenchange",function(a){
				if(!enabled){exitCallback(a)}
				enabled = !enabled;
			});
		}
		return enabled;
	},
	isFullScreenAvailable:function(){
		return !!(Element.prototype.mozRequestFullScreen||Element.prototype.webkitRequestFullScreen||Element.prototype.requestFullScreen);
	}(),
	addZeros: function(num,count) {
		return addLeadingZeros(num,count);
	},
	md5: function(string) {
		return md5(string);
	},
	sha1: function(string) {
		return sha1(string);
	},
	sha256: function(string) {
		return sha256(string);
	},
	randomString: function(len) {
		return randomString(len);
	},
	assert:assert,
	bind:bind,
	trigger:trigger,
	cookie: {
		set:setCookie,
		get:getCookie,
		remove:deleteCookie
	},
	time: {
		tick: function(tag,alt_time) {
			timer[tag] = (alt_time)? alt_time : new Date().getTime();
		},
		timer:function(tag){
			return timer[tag];
		},
		speed: {
			connection:function (finished_callback){
				var startTime = new Date().getTime(),endTime,fullTime;
				jsonp_request("",function(){
					endTime = new Date().getTime();
					fullTime = endTime - startTime;
					finished_callback(fullTime);
				},true);
			},
			script:function (){
				var startTime = new Date().getTime();
				md5(chars);
				var finishTime = new Date().getTime();
				return finishTime-startTime;
			}
		},
		interval:function (callback,interval) {
			return {
				callback:callback,
				interval:interval,
				frame:0,
				isPaused:false,
				isOn:false,
				tick:function(){
					if (!this.isPaused) {
						this.callback(this.frame);
						this.frame++;
					}
				},
				start:function(){
					if (this.isPaused) {
						this.unpause();
						return;
					}
					this.stop();
					this.frame = 0;
					var self = this;
					this.updater = setInterval(function(){self.tick()},this.interval);
					this.isOn = true;
				},
				stop:function(){
					this.updater = window.clearInterval(this.updater);
					this.unpause();
					this.isOn = false;
				},
				pause:function(){
					this.isPaused = true;
				},
				unpause:function(){
					this.isPaused = false;
				}
			}
		}
	},
	style:{
		addClass:function (element,a) {
			element = getEl(element);
			if (_tslib.style.hasClass(element,a)){
				return;
			}
			var b = "" == element.className ? [] : element.className.split(/\s/);
			b.push(a);
			element.className = b.join(" ");
		},
		bgRect:function (element,rect) {
			var bgPos = _tslib.style.getBgPos(element);
			if (!_tslib.isDefined(rect.x))
				rect.x = bgPos.x;
			if (!_tslib.isDefined(rect.y))
				rect.y = bgPos.y;
			element.style.backgroundPosition = (-1*rect.x)+"px "+(-1*rect.y)+"px";
			element.style.width = rect.width || element.style.width;
			element.style.height = rect.height || element.style.height;
		},
		cssPrefix:function(element,propName,value){
			element.style.cssText += propName+":"+value+";";
			for (var i=0;i<browser_prefixes.length;i++){
				element.style.cssText += '-'+browser_prefixes[i]+'-'+propName+":"+value+";";
			}
		},
		fadeIn:function (element,duration) {
			_tslib.graphics.html.cssPrefix(element,"transition","opacity "+duration+"s");
			element.style.opacity = 1.0;
		},
		fadeOut:function (element,duration) {
			_tslib.graphics.html.cssPrefix(element,"transition","opacity "+duration+"s");
			element.style.opacity = 0;
		},
		getBgPos:function (element) {
			var a = element.style.backgroundPosition.split(" ");
			a[0] = a[0] || '0';
			a[1] = a[1] || '0';
			return {
				x:parseFloat(a[0].replace(/[^0-9-]/g,'')),
				y:parseFloat(a[1].replace(/[^0-9-]/g,''))
			}
		},
		unselectable:function(element){
			element = getEl(element);
			element.style.cssText += "user-select:none;";
			for (var i = 0; i < browser_prefixes.length; i++) {
				element.style.cssText+="-"+browser_prefixes[i]+"-user-select:none;";
			}
		},
		linearGradient:function(element,start,end){
			element = getEl(element);
			for (var i=0;i<browser_prefixes.length;i++){
				element.style.cssText+="background:-"+browser_prefixes[i]+"-linear-gradient("+start+","+end+");";
			}
			element.style.cssText+="background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, "+start+"), color-stop(100%, "+end+"));filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='"+start+"', endColorstr='"+end+"'); -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr='"+start+"', endColorstr='"+end+"')\";background: linear-gradient("+start+","+end+");"
		},
		hasClass:function(el, name) {
			el = getEl(el);
			return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
		},
		removeClass:function(el, name)
		{
			el = getEl(el);
			if (_tslib.style.hasClass(el, name)) {
				el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
			}
		}
	},
	math:{
		cosh:function(x){
			return (Math.pow(Math.E,x) + Math.pow(Math.E,-1*x))/2;
		},
		catenary:function(x,a){
			return a * _tslib.math.cosh(x/a);
		},
		sinh:function(x){
			return (Math.pow(Math.E,x) - Math.pow(Math.E,-1*x))/2; 
		}
	},
	isString:function(data){
		return (typeof(data)=="string");
	},
	isNumber:function(data){
		return (typeof(data)=="number");
	},
	isFunction:function(data){
		return (typeof(data)=="function");
	},
	isDefined:function(data){
		return (typeof(data)!="undefined");
	},
	isObject:function(data){
		return (typeof(data)=="object");
	},
	isArray:function(data){
		return (data instanceof Array);
	},
	isElement:function(data){
		return (data instanceof Element);
	},
	inArray:function(needle,haystack){
		for(item in haystack){
			if(item==needle){
				return true;
			}
		}
		return false;
	},
	arrayAvg:function(array_obj){
		var av = 0;
		var cnt = 0;
		var len = array_obj.length;
		for (var i = 0; i < len; i++) {
		var e = +array_obj[i];
		if(!e && array_obj[i] !== 0 && array_obj[i] !== '0') e--;
		if (array_obj[i] == e) {av += e; cnt++;}
		}
		return av/cnt;
	},
	contextMenu:function(html_cmenu,event_callback,off_event_callback,element){
		var cmenu_element = doc.createElement("div");
		var mouseX;
		var mouseY;
		cmenu_element.innerHTML = html_cmenu;
		cmenu_element.style.display = 'none';
		cmenu_element.style.position = 'fixed';
		cmenu_element.id = '___ts__c_menu__';
		doc.body.appendChild(cmenu_element);
		element = element || doc;
		element.oncontextmenu=function (){return false};
		bind(element,"mousemove",function (e) {
			mouseX = e.pageX;
			mouseY = e.pageY;
		});
		bind(element,"mousedown",function (e) {
			if (e.which==3) {
				cmenu_element.style.display = 'block';
				cmenu_element.style.left = mouseX+'px';
				cmenu_element.style.top = mouseY+'px';
				if (event_callback){
					event_callback();
				}
			} else {
				cmenu_element.style.display = 'none';
				if (off_event_callback){
					off_event_callback();
				}
			}
		});
	},
	flash:isFlashAvailable,
	urlGET: function(name) {
		return urlGET(name);
	},
	urlobj: function(obj) {
		return urlobj(obj);
	},
	crequest: function(app,name,data) {
		return custom_request(app,name,data);
	},
	url:{}
};

(function () {
	/*
	URL safe:

	0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-~!*().'

	1280 = 010100 000000 = 20 00 = I0
	128011 = 011111 010000 001011 = 31 16 11
	4096 = 000001 000000 000000 = 01 00 00 = 100

	*/


	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
	var byteSize = 6;
	var byteSizeIdentifiers = {
		1:"~",
		2:"", // Default
		4:"!",
		8:"*"
	};
	var maxByteSize = 8;

	function tsstrdecode(a){
		var index = 0,arr=[],fin=[];
		function inArray(thing,array){
			return (array.indexOf(thing) > -1);
		}
		function scanNext(num){
			//console.log("Scanning: "+num);
			var subarr = [num];
			for (var i = index; i < (index + num); i++){
				if (inArray(a[i],chars)){
					subarr.push(a[i]);
					//console.log("Scanned "+a[i]+" Size: "+subarr[0]);
				} else {
					num++;
				}
				if (num > maxByteSize) { // Maximum single byte size
					break;
				}
			}
			index += num;
			arr.push(subarr);
		}
		function decodeChunk(c,size){
			//console.log("Decoding chunk: "+JSON.stringify(c));
			c.reverse();
			var n = 0;
			for (var i = 0; i < size; i++){
				//console.log("Reading chunk byte "+i+": "+chars.indexOf(c[i])+" value: "+(chars.indexOf(c[i]) << (byteSize*i))+" with bit shift of "+(byteSize*i));
				n += (chars.indexOf(c[i]) << (byteSize*i));
			}
			fin.push(n);
		}
		while (index < a.length){
			scanNext(tsgetstrbytesize(a[index]));
		}
		for (var i = 0; i < arr.length; i++){
			var size = arr[i].shift();
			decodeChunk(arr[i],size);
		}
		return fin;
	}


	function tsgetstrbytesize(a){
		for (var i in byteSizeIdentifiers){
			if (a==byteSizeIdentifiers[i]){
				return i;
			}
		}
		return 2;
	}


	function tsarrayencode(a){
		var str = "";
		for (var i = 0; i < a.length; i++){
			str += tsnumencode(a[i]);
		}
		return str;
	}

	function tsnumencode(a){
		a = tsnumerateint(a);
		var str = byteSizeIdentifiers[a.length];
		for (var i = 0; i < a.length; i++){
			str += chars[a[i]];
		}
		return str;
	}

	function tsnumerateint(a){
		var b=[];
		for (var i = (tsgetbytesize(a)-1); i >= 0; i--){
			b.push((a >> (byteSize*i)) & 63);
		}
		return b;
	}
	function tsgetbytesize(a){
		var b = {
			63		:1,
			4095	:2,
			16777215:4
		}
		for (var i in b){
			if (a <= i)
				return b[i];
		}
		return 8;
	}
	_tslib.url.compress = {};
	_tslib.url.decompress = {};
	_tslib.url.compress.numbers = tsarrayencode
	_tslib.url.compress.number = tsnumencode
	_tslib.url.decompress.numbers = tsstrdecode
    /*var h = {
        1: "~",
        2: "",
        4: "!",
        8: "*"
    };
    _tslib.url.compress.numbers = function (g) {
        for (var d = "", e = 0; e < g.length; e++) {
            var b = g[e],
                c = [],
                a;
            a: {
                a = {
                    63: 1,
                    4095: 2,
                    16777215: 4
                };
                var f = void 0;
                for (f in a) if (b <= f) {
                    a = a[f];
                    break a
                }
                a = 8
            }
            for (a -= 1; 0 <= a; a--) c.push(b >> 6 * a & 63);
            b = c;
            c = h[b.length];
            for (a = 0; a < b.length; a++) c += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-" [b[a]];
            d += c
        }
        return d
    }*/
})();

function addPoints(object1,object2){
	return {x:object1.x + object2.x,y:object1.y + object2.y};
}
function subPoints(object1,object2){
	return {x:object1.x - object2.x,y:object1.y - object2.y};
}
function multPoints(object1,s){
	return {x:object1.x*s,y:object1.y*s};
}
function midpoint(object1,object2){
	return multPoints(addPoints(object1,object2), 0.5);
}
function weightedPoint(object1,object2,s){
	return addPoints(object2,multPoints(subPoints(object1,object2),s));
}

function removeElement (element) {
	element = getEl(element);
	element.parentNode.removeChild(element);
}

_tslib.removeElement = removeElement;

// Gets the absolute position of a standard block element
// Full source can be seen at: http://www.codeproject.com/Articles/35737/Absolute-Position-of-a-DOM-Element
// Licensed under CPOL (http://www.codeproject.com/info/cpol10.aspx)
function getElementPosition(k){function f(a){var b=0;"string"==typeof a&&(null!=a&&""!=a)&&(b=a.indexOf("px"),b=0<=b?parseInt(a.substring(0,b)):1);return b}function h(a){var b={left:0,top:0,right:0,bottom:0};window.getComputedStyle?(a=window.getComputedStyle(a,null),b.left=parseInt(a.borderLeftWidth.slice(0,-2)),b.top=parseInt(a.borderTopWidth.slice(0,-2)),b.right=parseInt(a.borderRightWidth.slice(0,-2)),b.bottom=parseInt(a.borderBottomWidth.slice(0,-2))):(b.left=f(a.style.borderLeftWidth),b.top= f(a.style.borderTopWidth),b.right=f(a.style.borderRightWidth),b.bottom=f(a.style.borderBottomWidth));return b}var d=navigator.userAgent,g=null!=navigator.appVersion.match(/MSIE/),e=function(){var a=-1;"Microsoft Internet Explorer"==navigator.appName&&null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&(a=parseFloat(RegExp.$1));return a}(),i=g&&8<=e,l=g&&!i,j=(e=null!=d.match(/firefox/i))&&(null!=d.match(/firefox\/2./i)||null!=d.match(/firefox\/1./i)),m=e&&!j,n=null!=navigator.appVersion.match(/WebKit/), o=null!=navigator.appVersion.match(/Chrome/),d=null!=window.opera,e=function(){var a=0;window.opera&&(a=window.opera.version(),a=parseFloat(a));return a}(),p=d&&10>e;return function(a){var b={x:0,y:0};if(null!==a)if(a.getBoundingClientRect){var c=doc.documentElement,a=a.getBoundingClientRect(),d=c.scrollTop;b.x=a.left+c.scrollLeft;b.y=a.top+d}else{b.x=a.offsetLeft;b.y=a.offsetTop;c=a.parentNode;for(a=null;null!=offsetParent;){b.x+=offsetParent.offsetLeft;b.y+=offsetParent.offsetTop;a=offsetParent.tagName.toLowerCase(); if(l&&"table"!=a||(m||o)&&"td"==a)a=h(offsetParent),b.x+=a.left,b.y+=a.top;offsetParent!=doc.body&&offsetParent!=doc.documentElement&&(b.x-=offsetParent.scrollLeft,b.y-=offsetParent.scrollTop);if(!g&&!p||i)for(;offsetParent!=c&&null!==c;){b.x-=c.scrollLeft;b.y-=c.scrollTop;if(j||n)a=h(c),b.x+=a.left,b.y+=a.top;c=c.parentNode}c=offsetParent.parentNode;offsetParent=offsetParent.offsetParent}}return b}(k)};

// Make an inline element absolute
function makeAbsolute(b) {
	b = getEl(b);
	if (b.style.position == "absolute") {
		return
	}
	var g = getPositionedOffset(b);
	var f = g.top - parseFloat(getStyle(b, "margin-top") || 0);
	var d = g.left - parseFloat(getStyle(b, "margin-left") || 0);
	var c = b.clientWidth - parseFloat(getStyle(b, "padding-left") || 0) - parseFloat(getStyle(b, "padding-right") || 0);
	var a = b.clientHeight - parseFloat(getStyle(b, "padding-top") || 0) - parseFloat(getStyle(b, "padding-bottom") || 0);
	b._originalLeft = b.style.left;
	b._originalTop = b.style.top;
	b._originalWidth = b.style.width;
	b._originalHeight = b.style.height;
	b._originalPosition = b.style.position;
	b.style.position = "absolute";
	b.style.top = f + "px";
	b.style.left = d + "px";
	b.style.width = c + "px";
	b.style.height = a + "px"
}
function undoMakeAbsolute(a) {
	a = getEl(a);
	if (a.style.position != "absolute") {
		return
	}
	a.style.position = a._originalPosition;
	a.style.left = a._originalLeft;
	a.style.top = a._originalTop;
	a.style.width = a._originalWidth;
	a.style.height = a._originalHeight
}
function getEl(element_ID){return ((_tslib.isString(element_ID))?doc.getElementById(element_ID) : element_ID)}
function getPositionedOffset(b){b=getEl(b);var a=0;var d=0;do{a+=b.offsetTop||0;d+=b.offsetLeft||0;b=b.offsetParent;if(b){if(b.tagName=="BODY"){break}var c=getStyle(b,"position");if(c=="relative"||c=="absolute"){break}}}while(b);return{left:d,top:a}}
function getStyle(f,d){var g={};var b=window.getComputedStyle(f,null);if("string"===typeof(d)){return f.style[d]||b[d]||null}d=d||Element.PROPERTIES;var h;var a=d.length;for(var c=0;c<a;++c){h=d[c];g[h]=f.style[h]||b[h]||null}return g}

_tslib.getStyle = getStyle;

_tslib.elementPosition = getElementPosition;

_tslib.positionedOffset = getPositionedOffset;

_tslib.makeAbsolute = makeAbsolute;

_tslib.undoMakeAbsolute = undoMakeAbsolute;

_tslib.graphics = {};

_tslib.getEl = getEl;

_tslib.graphics.points = {
	add:addPoints,
	sub:subPoints,
	mult:multPoints,
	midpoint:midpoint,
	weightedPoint:weightedPoint
}


// For all images, width and heights MUST be specified

function initGraphicsRect(rect){
	rect.x = rect.x || 0;
	rect.y = rect.y || 0;
	rect.z = rect.z || 0;
	rect.width = rect.width || 200;
	rect.height = rect.height || 200;
	return rect;
}

function posType(prop){
	prop = (prop+'').replace(/ /gi,"");
	return (prop.charAt(prop.length-1)=='%')?'%':'px';
}




// GLOBAL DECLARATION
copyObj({jsonp_receive:_tslib.jsonp_receive},EXT_STR);









// ANALYTICS BEGIN

var IS_LOADED = false;
var IS_ON = true;
var ANALYTICS_MAIN = function(){
if (!IS_ON)return;
var analyticsURL = '<?=$analyticsPath?>';
var requestID = '<?php /* Request ID = User agent + IP + Referer + Request time + Country code + Secret 1 */ echo md5( $_SERVER["HTTP_USER_AGENT"] . $_SERVER["REMOTE_ADDR"] . $_SERVER["HTTP_REFERER"] . $_SERVER["REQUEST_TIME"] . $countryCode . $TSAN_SECRET1 );?>';
var userID = '<?php /* User ID = User agent + IP + Referer + Host + Country code + Secret 2 */ echo md5( $_SERVER["HTTP_USER_AGENT"] . $_SERVER["REMOTE_ADDR"] . $_SERVER["HTTP_REFERER"] . $_SERVER["REMOTE_HOST"] . $countryCode . $TSAN_SECRET2 );?>';
var domainID = window.__tsanalytics_id_;
var tsAnUrlVarExtension = 'ts_an_';
var getGeolocation = false;//<?=(getParamTrue('t_geo')=='yes')?"true":"false"?>;
var submitted = false;
var serverVars={"TIME":"<?=time()?>"};
// TODO: WebSocket could be used to send data in new advanced browsers
function sendUrl(url,callback) {
	var a = new Image();
	a.src = url;
	if (callback) {
		a.onload = callback;
	};
	return a;
}
function objToUrl(a){var b=[],e;for(e in a)a.hasOwnProperty(e)&&b.push(encodeURIComponent(e)+"="+encodeURIComponent((isObject(a[e]))?(JSON.stringify(a[e])):(a[e])));return b.join("&")}
function objToAnalyticsSumissionUrl(a){for(e in a){var i=a[e];delete a[e];a[tsAnUrlVarExtension+e]=i};return objToUrl(a)}
function submitAnalytics(dataObj,donotSend,useJSONP) {
	var callback = isFunction(dataObj['_callback']) ? dataObj['_callback'] : (function(){});
	delete dataObj['_callback'];
    insertIDs(dataObj);
	for (var i in serverVars){
        dataObj['s_'+i]=serverVars[i];
    }
    var urlExt = objToAnalyticsSumissionUrl(dataObj);
    var finalURL = analyticsURL+'?'+urlExt;
    if ((!donotSend)&&(IS_ON)) {
    	if (useJSONP) {
		    _tslib.jsonp(finalURL,function(a){
				callback(a);
				if (isArray(a)){
					for (var i = a.length - 1; i >= 0; i--) {
						tslog("SERVER: "+a[i]);
					}
				} else {
					tslog("Request completed with code: "+a);
				}
			},false,false,true);
		} else {
			sendUrl(finalURL,callback);
		}
	}
	return finalURL;
}
function getWinsize(){/*
    var winW,winH;
    if (document.body && document.body.offsetWidth) {
     winW = document.body.offsetWidth;
     winH = document.body.offsetHeight;
    }
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
     winW = document.documentElement.offsetWidth;
     winH = document.documentElement.offsetHeight;
    } else {
     winW = window.innerWidth;
     winH = window.innerHeight;
    }

    return {w:winW,h:winH};*/
    var viewportwidth;
	var viewportheight;

	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

	if (typeof window.innerWidth != 'undefined') {
	    viewportwidth = window.innerWidth,
	    viewportheight = window.innerHeight
	}

	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

	else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth !=
	    'undefined' && document.documentElement.clientWidth != 0) {
	    viewportwidth = document.documentElement.clientWidth,
	    viewportheight = document.documentElement.clientHeight
	}

	// older versions of IE

	else {
	    viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
	    viewportheight = document.getElementsByTagName('body')[0].clientHeight
	}
	return {
	    w:viewportwidth, 
	    h:viewportheight
	};
}
var screensize = getWinsize();
var geolocation;
var avgLoadTime = cookie.get('ts_avg_connection');
var referer = ((document.referrer)? document.referrer : "");
if ((getGeolocation)&&(navigator.geolocation)){
    navigator.geolocation.getCurrentPosition(function(position){
        geolocation={lat:position.coords.latitude,lng:position.coords.longitude};
        submissionReady(0);
    },
    function(a){
        geolocation={};
        submissionReady(0);
    })
    setTimeout(function(){
        geolocation={};
        submissionReady(0);
    },4000);
} else {
    submissionReady(0);
}

function pageTimingInfo(){
	if (!window.performance){return {clientTime:(new Date()).toString()};};
	var a = window.performance.timing; 
	var connectTime = a.responseEnd - a.requestStart;
	return {
		"navigationStart":a.navigationStart, // Strings keep property names properly in advanced CCompiler
		"connectStart":a.connectStart,
		"requestStart":a.requestStart,
		"responseStart":a.requestStart,
		"responseEnd":a.responseEnd,
		"connectTime":connectTime,
		"clientTime":(new Date()).toString()
	}
}

function getClientInfo(){
	return {
		'winsize':screensize,
		'screen':{"w":screen.width,"h":screen.height,"depth":screen.colorDepth},
		'coords':geolocation,
		'avg_conn':avgLoadTime,
		'referer':referer,
		'time':pageTimingInfo()
	};
}

// TODO: Get plugin list

function getUpdateInfo() {
	PROCESS_QUEUE();
	var returnObj = {
		"mouse":tsURLEncodeArray(mousePosArr),
		"keys":tsURLEncodeArray(keyPressArr),
		"clicks":tsURLEncodeArray(clickArr),
		"scroll":tsURLEncodeArray(scrollPosArr),
		"events":eventsStr(numberOfEventsToSend(),true),
		"duration":getTimestamp(),
		"__update__":"1"
	};
	resetUpdateInfo();
	return returnObj;
}

function clearSentEvents() {
	for (var i = eventList.length - 1; i >= 0; i--) {
		if (eventList[i].sent){
			removeIndex(eventList,i);
		}
	};
}

function clearAllEvents() {
	eventList = [];
}

function resetUpdateInfo() {
	clickArr = [];
	mousePosArr = [];
	keyPressArr = [];
	scrollPosArr = [];
	clearSentEvents();
}

function getMousePos(){
	return {x:_tslib.mouse.x,y:_tslib.mouse.y};
}

function getScrollPos() {
	var doc = document.documentElement, body = document.body;
	var left = (doc && doc.scrollLeft || body && body.scrollLeft || 0);
	var top = (doc && doc.scrollTop  || body && body.scrollTop  || 0);
	return {x:left,y:top};
}

function eventsStr(count,shouldTag) {
	var evtStr = "";
	count = count || eventList.length;
	if (count > eventList.length) {count = eventList.length};
	for (var i = 0; i < count; i++) {
		if (isDefined(eventList[i])) {
			evtStr += (eventList[i].name || "").replace(/[^a-zA-Z0-9]/g,'_')+"~"+eventList[i].time+"~"+(eventList[i].data || "").replace(/[!~]/g,'_').replace(/'/g,'"')+"!";
		}
		if (shouldTag) {
			eventList[i].sent = true;
		};
	}
	return evtStr;
}

function numberOfEventsToSend() {
	var str = "",
		maxEventStringLength = CONFIG.events.maxCompiledLength;
	for (var i = 0; i < eventList.length; i++) {
		str += eventList[i].name + eventList[i].time + eventList[i].data;
		if (str > maxEventStringLength) {
			return i;
		};
	};
	return eventList.length;
}

function sendUpdate() {
	submitAnalytics(getUpdateInfo());
	tslog("Sent update");
}

function submissionReady(n){
	tslog("Tracking page view");
    submitted || submitAnalytics(getClientInfo());
    submitted = true;
}

function insertIDs(obj) {
	obj['reqid'] = requestID;
	obj['usrid'] = userID;
	obj['dnid'] = domainID;
}

function addDataToForm(formElement,dataObj){
	for (var i in dataObj){
		if (isDefined(dataObj[i])){
			var a = dataObj[i];
			delete dataObj[i];
			dataObj[tsAnUrlVarExtension+i] = a;
		} else {
			delete dataObj[i];
		}
	}
	insertIDs(dataObj);
	_tslib.formInsertData(formElement,dataObj);
}

// Once loaded, add functions to directly submit

function linkUrl(linkEl){
	return _tslib.getEl(linkEl).getAttribute("href");
}

function addLinkEvents(){
	var evtAttribute = "tsan_evt";
	var aTags = document.getElementsByTagName('a');
	for (var i = 0; i < aTags.length; i++) {
		var evtN = aTags[i].getAttribute(evtAttribute);
		if (evtN){
			bind(aTags[i],"click",(function(a,b){
				return function(e) {
					_tsan.track.outgoingEvent(a,b);
				}
			})(evtN,linkUrl(aTags[i])));
			aTags[i].removeAttribute(evtAttribute);
			_tslib.linkTargetBlank(aTags[i]);
		}
	}
}

function getElTSID(el) {
	return el.getAttribute("tsan_id");
}

var trackedEventConfig = {
/*
	Event's element
		Default: Document
		1: Window
		Or Custom element
*/
	e:0, 
//	Boolean: Submit or not in function condition
	b:function(e){return !!getElTSID(e.target)},
// 	Custom data
	d:function(e){return getElTSID(e.target)}
};

var events = {
	"mouseover":trackedEventConfig,
	"mouseout":trackedEventConfig,
	"mousedown":trackedEventConfig,
	"click":trackedEventConfig//,
//	"resize":{e:1,d:function(){return getWinsize();}}
};

var mobileEvents = {
	"touchstart":trackedEventConfig,
	"touchend":trackedEventConfig,
	"click":trackedEventConfig,
	"orientationchange":{e:1,d:function(){return getWinsize();}}
};

function addEvents() {
	evts = (browser.m)? mobileEvents : events;
	function processEvtData(data){
		if (isFunction(data)) {
			return data();
		} else if (isObject(data)) {
			return JSON.stringify(data);
		} else if (isDefined(data)) {
			return data;
		} else {
			return "";
		}
	}
	for (var i in evts) {
		bind( 

			( (evts[i].e==1) ? window : (isElement(evts[i].e)? evts[i].e : document) ),

			(function(a){return a})(i),

			(function(a){
				return function(e) {
					if ((isFunction(evts[a].b)? evts[a].b(e) : true)) {
						if (_tsan.track.events.on) {
							_tsan.track.event( a, processEvtData(isFunction(evts[a].d)? evts[a].d(e) : evts[a].d) );
						}
					}
				}
			})(i)

		);
	};
}

function addPosToSendArray(posData,arr) {
	arr.push(posData.x);
	arr.push(posData.y);
}

addEvents();
addLinkEvents();

bind(document,"DOMNodeInserted",addLinkEvents);

// Send update

var updateIntervalObj = _tslib.time.interval(function(){
	sendUpdate();
},CONFIG.update.interval*1000);


// CONTROL FUNCTIONS

_tsan.update = {};
_tsan.update.start = updateIntervalObj.start;
_tsan.update.stop = updateIntervalObj.stop;

_tsan.track.mouse = {};
_tsan.track.mouse.on = true;

_tsan.track.keys = {};
_tsan.track.keys.on = true;

_tsan.track.events = {};
_tsan.track.events.on = true;

var mousemoveframe = 0;
function mousemovetick() {
	if (_tsan.track.mouse.on && ((mousemoveframe % (11-parseInt(CONFIG.tracking.mouse.resolution))) == 0)) {
		addPosToSendArray(getMousePos(),mousePosArr);
		mousePosArr.push(getTimestamp());
	}
	mousemoveframe++;
}

var mousePosArr = [];
var scrollPosArr = [];

// Mouse position tracking (x,y,timestamp)
bind(document,"mousemove",function(){
	mousemovetick();
});

// Scroll tracking (x,y,timestamp)
bind(window,"scroll",function(){
	addPosToSendArray(getScrollPos(),scrollPosArr);
	scrollPosArr.push(getTimestamp());
});

// Keystroke tracking (keycode,timestamp)
var keyPressArr = [];
bind(document,"keydown",function(){if(_tsan.track.keys.on){keyPressArr.push(_tslib.keyactive);keyPressArr.push(getTimestamp())}});

// Mouse click tracking (x,y,timestamp)
var clickArr = [];
bind(document,"click",function(){
	if (_tsan.track.mouse.on) {
		addPosToSendArray(getMousePos(),clickArr);
		clickArr.push(getTimestamp());
	}
});

/*
TODO: Get:

	- Installed plugins (window.navigator.plugins)
	
	- Attach time to keystrokes and clicks
		(Update this also on server side)

	- Track elements with tsan_id attribute
		* Hover time
		* Click
		* Forms:
			- All data entered (raw data: keystrokes timing already saved in update)
			- Time spent on each input
				* Total sum of time on each input
				* Order of input focus events
			- Can use ts.analytics.track.form(el) OR use tsan_id attribute

	- Track scroll events
	 	var doc = document.documentElement, body = document.body;
		var left = (doc && doc.scrollLeft || body && body.scrollLeft || 0);
		var top = (doc && doc.scrollTop  || body && body.scrollTop  || 0);
	
NOTES:

	- ALL events (except super special stuff like the updating) should be tracked with the ts.analytics.track.event
		* Extra data can be passed in

	- Updating
		* Only send if data (mouseArr, clickArr, eventArr, etc...) has changed = Minimize traffic
	
	- Methods for sending events:
		* Each event sent with separate request <-- Only for CUSTOM USER EVENTS
			- Don't use too much traffic
		* Store each event in array and send in each update <-- What clicktale does!
			- If page closed, store them all in cookie so they can be sent later
			- Data MUST BE COMPRESSED TO SMALLEST POSSIBLE SIZE!!!!!!!!!!!!!!!
				* Avoid URL encoded chars
			- This is very organized and proper, but it is not as practical
				* Some data can be lost if page is exited at unexpected time
				* Update request URLs can exceed max if too many events triggered

	- REPLAYING
		* Mouse positions as HTML element with mouse BG image
		* Scrolling
			- window.scrollTo( x-coord, y-coord )
		* Console Log section
			- Keystrokes
			- Clicks
			- Custom events

*/

// Save connection speed cookie
// Must go AFTER analytics submits
_tslib.time.speed.connection(function(time){
	var tsccn = "ts_avg_connection";
	var tsccc = ((cookie.get(tsccn))?(JSON.parse(cookie.get(tsccn)).count+1):1);
	var tscct = ((((cookie.get(tsccn))?(JSON.parse(cookie.get(tsccn)).time*(tsccc-1)):0)+time)/tsccc);
	cookie.set(tsccn,JSON.stringify({"count":tsccc,"time":tscct}),200);
});

var unsentCName = "ts_analytics_unsent";
if (cookie.get(unsentCName)) {
	_tslib.jsonp(cookie.get(unsentCName),function(){});
	cookie.remove(unsentCName);
};

bind(window,"beforeunload",function(e){
	cookie.set(unsentCName,submitAnalytics(getUpdateInfo(),true),200);
});

for (var i = 0; i < forms.length; i++) {
	_tsan.form.addClientInfo(forms[i]);
}

IS_LOADED = true;

stopAll = function(){
	clearInterval(updateIntervalObj);
	clearInterval(mouseIntervalObj);
}
/*
for (var i = 0; i < ts.__tsanalytics_events.length; i++) {
	var a = ts.__tsanalytics_events[i];
	_tsan.track.event(a[0],a[1],a[2],a[3]);
};

for (var i = 0; i < ts.__tsanalytics_forms.length; i++) {
	_tsan.form.addClientInfo(ts.__tsanalytics_forms[i]);
};*/

}


var _tsan = {};
_tsan.functions = {};

_tsan.track = {};
_tsan.track.event = function(evtName,data,time,sendFinishedCallback) {
	time = time || getTimestamp();
	tslog("Event: "+evtName+" Time: "+time+" Data: "+JSON.stringify(data));
	var objData = {name:evtName,time:time,data:data||""};
	eventList.push(objData);
}

var CONFIG = {
	"events":{
		"maxCompiledLength":1000
	},
	"update":{
		"on":true, // TODO: Call update changer function when this is accessed
		"interval":4
	},
	"tracking":{
		"mouse":{
			"resolution":5 // Movement resolution (int 1-10)
		}
	}
}; // TODO: EDITABLE BY FUNCTION

// As long as these are never referenced in THIS code, the compiler will not change the property names
var FUNCTIONS = { // TODO: Use external mapped object (window.tsanalytics) to obtain these functions
	"event":function(arr,time){
		var evtName = arr[0] || "";
		var data = arr[1] || {};
		_tsan.track.event("usr_"+evtName,data);
	},
	"cancel":function(arr) {
		errcode = arr[0];
		tslog("Cancelling"+(errcode? " with code: "+errcode : ""));
		IS_ON = false;
		stopAll();
	},
	"element":function(arr) {
		// TODO: Tracking an element
	},
	"config":function(arr) {
		var configPath = arr[0].split(".");
		var val = arr[1];

		// TODO: Set config object values
	}
}

copyObj(FUNCTIONS,_tsan.functions);

function PROCESS_ITEM(a) {
	if (!isDefined(a))return;
	var args = a[0];
	var time = a[1];
	var type = minifyString(args.shift());
	if (isFunction(FUNCTIONS[type])) {
		FUNCTIONS[type](args,time);
	};
	if (isString(FUNCTIONS[type])) {
		FUNCTIONS[FUNCTIONS[type]](args,time);
	};
	if (isObject(FUNCTIONS[type])) {
		var hierarchyFinished = false;
		while (!hierarchyFinished){
			var obj = FUNCTIONS[type];
			if (isObject(obj)) {
				type = minifyString(args.shift());
				obj = obj[type];
			} else {
				obj(args,time);
				hierarchyFinished = true;
			}
		}
	}
}

function PROCESS_QUEUE() {
	for (var i = window.__tsanalytics_evts_.length - 1; i >= 0; i--) {
		PROCESS_ITEM(window.__tsanalytics_evts_[i]);
		removeIndex(window.__tsanalytics_evts_,i);
		tscomment("PROCESS_QUEUE")
	};
}

function minifyString(str) {
	return _tslib.string.removeSpacing(str).toLowerCase();
}

var cookie = {
	set:function(c_name,value,exdays,domain) {
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString() + ((!domain)?"":("; domain="+domain + "; path=/")));
		doc.cookie=c_name + "=" + c_value;
	},
	get:function(c_name)
	{
		var i,x,y,ARRcookies=doc.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++){
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name) {
				return unescape(y);
			}
		}
	},
	remove:function(c_name) {
		setCookie(c_name,"",-1);
	}
};


var analyticsStartTime = (new Date()).getTime();
var browser = (function () {
	function _isBrowser(a) {
		return (navigator.userAgent.toLowerCase().indexOf(a) > -1);
	}
	return {
		ie: (_isBrowser("msie")),
		opera: (_isBrowser("opera")),
		firefox: (_isBrowser("firefox")),
		chrome: (_isBrowser("chrome")),
		safari: ((_isBrowser("safari")) && (!_isBrowser("chrome"))),
		m: (_isBrowser("iphone") || _isBrowser("ipod") || _isBrowser("android"))
	}
})();
var stopAll = function(){
	//if (isDefined(clearAllIntervals))
	//	clearAllIntervals();
};

var eventList = [];


var forms = [];
_tsan.form = {};
_tsan.form.addClientInfo=function(form){
	forms.push(form);
}

function getTimestamp() {
	return (new Date()).getTime()-analyticsStartTime;
}
function isString(a) {
	return (typeof(a)=="string");
}
function isDefined(a) {
	return (typeof(a)!="undefined");
}
function isFunction(a) {
	return (typeof(data)=="function");
}
function isNumber(data){
	return (typeof(data)=="number");
}
function isObject(data){
	return (typeof(data)=="object");
}
function isArray(data){
	return (data instanceof Array);
}
function isElement(data){
	return (data instanceof Element);
}
function copyObj(from,to) {
	if (isString(to)) {
		var p = window;
		var a = to.split(".");
		for (var i = 0; i < a.length; i++) {
			if (!isDefined(p[a[i]])) {
				p[a[i]] = {};
			}
			p = p[a[i]];
		}
		for (var i in from){
			p[i] = from[i];
		}
	} else {
		for (var i in from){
			to[i] = from[i];
		}
	}
}
function getObj(id) {
	var a = id.split(".");
	var p = window;
	for (var i = 0; i < a.length; i++) {
		p = p[a[i]];
	}
	return p;
}
function removeIndex(array,index) {
	array.splice(index,1);
}
function tsURLEncodeArray(arr) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
	var byteSize = 6;
	var byteSizeIdentifiers = {
		1:"~",
		2:"", // Default
		4:"!",
		8:"*"
	};
	var maxByteSize = 8;

	function tsstrdecode(a){
		var index = 0,arr=[],fin=[];
		function inArray(thing,array){
			return (array.indexOf(thing) > -1);
		}
		function scanNext(num){
			//console.log("Scanning: "+num);
			var subarr = [num];
			for (var i = index; i < (index + num); i++){
				if (inArray(a[i],chars)){
					subarr.push(a[i]);
					//console.log("Scanned "+a[i]+" Size: "+subarr[0]);
				} else {
					num++;
				}
				if (num > maxByteSize) { // Maximum single byte size
					break;
				}
			}
			index += num;
			arr.push(subarr);
		}
		function decodeChunk(c,size){
			//console.log("Decoding chunk: "+JSON.stringify(c));
			c.reverse();
			var n = 0;
			for (var i = 0; i < size; i++){
				//console.log("Reading chunk byte "+i+": "+chars.indexOf(c[i])+" value: "+(chars.indexOf(c[i]) << (byteSize*i))+" with bit shift of "+(byteSize*i));
				n += (chars.indexOf(c[i]) << (byteSize*i));
			}
			fin.push(n);
		}
		while (index < a.length){
			scanNext(tsgetstrbytesize(a[index]));
		}
		for (var i = 0; i < arr.length; i++){
			var size = arr[i].shift();
			decodeChunk(arr[i],size);
		}
		return fin;
	}


	function tsgetstrbytesize(a){
		for (var i in byteSizeIdentifiers){
			if (a==byteSizeIdentifiers[i]){
				return i;
			}
		}
		return 2;
	}


	function tsarrayencode(a){
		var str = "";
		for (var i = 0; i < a.length; i++){
			str += tsnumencode(a[i]);
		}
		return str;
	}

	function tsnumencode(a){
		a = tsnumerateint(a);
		var str = byteSizeIdentifiers[a.length];
		for (var i = 0; i < a.length; i++){
			str += chars[a[i]];
		}
		return str;
	}

	function tsnumerateint(a){
		var b=[];
		for (var i = (tsgetbytesize(a)-1); i >= 0; i--){
			b.push((a >> (byteSize*i)) & 63);
		}
		return b;
	}
	function tsgetbytesize(a){
		var b = {
			63		:1,
			4095	:2,
			16777215:4
		}
		for (var i in b){
			if (a <= i)
				return b[i];
		}
		return 8;
	}
	return tsarrayencode(arr);
}
function tslog() {
	if (false) {
		for (var i = 0; i < arguments.length; i++) {
			if (console) {
				console.log("TS analytics:",arguments[i]);
			} else {
				alert("TS analytics: "+arguments[i]);
			}
			if (document.getElementById('__ts_an_log__')) {
				document.getElementById('__ts_an_log__').innerHTML += "<br>TS analytics: "+arguments[i];
			}
		}
	}
}
function tscomment(a) {
	window.__COMMENT__ = a;
}

function isLoaded() {
	return document.readyState == "complete";
}

var init = function(){
	tslog("Window loaded");
	ANALYTICS_MAIN();
	_tsan.track.event("pageload");
};

if (isLoaded()){
	init();
} else {
	bind(window,"load",init);
}

tslog("Analytics Begin");

copyObj(_tsan,EXT_STR); // TODO: External mapping (window.tsanalytics.track.event = function(a,b,c,d){_tsan.track.event("usr_"+a,b,c,d)})

})();

/*

(function(a,b){
	var c=window;c.__tsanalytics_id_=a;var d=(new Date).getTime();b=b||"tsan";c[b]=function(){c.__tsanalytics_evts_.push([arguments,(new Date).getTime()-d])};c.__tsanalytics_name_=b;c.__tsanalytics_evts_=[];
	a=document.createElement("script");a.src=("https:"==document.location.protocol?"https://secure.topperstudios.com/assets/":"http://assets.topperstudios.com/")+"js/analytics.js";a.async=!0;document.getElementsByTagName("head")[0].appendChild(a)
})("7ad2f593cd2c6ab5806fa290cd1d7adb");

tsan("event","eventname");
tsan("cancel");

*/

// TODO: provide option for noscript!

// TODO: provide option for <script src="//secure.topperstudios.com/assets/js/analytics.js"></script> (NOTE: this won't work when downloaded, as it will match the file:// protocol)

// Ping architecture (pinging separate from event logging [to reduce traffic])?

// TODO: SHORTER URLS FOR GOD'S SAKE!

/*
	
	ARCHITECTURE:
		- Event queue
			* Array of events with timestamps

		- Tracking beacon
			* Event sending
				- Checks event queue every n seconds, and if there are x number of events enqueued, it will send them

			* Ping sending
				- Pings server every 30 seconds - 5 minutes (depending on event activity)
				- Simply tells server that visitor is still at the site

*/
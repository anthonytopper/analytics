<?php
include './paths.php';
$paths = new Paths;
$phpPath = $paths->getFullPath('php');
$analyticsPath = $paths->getHTTPPath("submitAnalytics");
$jsPath = $paths->getHTTPPath("js");
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

?>(function(){
var IS_LOADED = false;
var IS_ON = !((window.ts||{}).__tsanalytics_cancelTracking);
var EXT_STR = "ts.analytics";
var ANALYTICS_MAIN = function(){
if (!IS_ON)return;
var analyticsURL = '<?=$analyticsPath?>';
var requestID = '<?php /* Request ID = User agent + IP + Referer + Request time + Country code + Secret 1 */ echo md5( $_SERVER["HTTP_USER_AGENT"] . $_SERVER["REMOTE_ADDR"] . $_SERVER["HTTP_REFERER"] . $_SERVER["REQUEST_TIME"] . $countryCode . $TSAN_SECRET1 );?>';
var userID = '<?php /* User ID = User agent + IP + Referer + Host + Country code + Secret 2 */ echo md5( $_SERVER["HTTP_USER_AGENT"] . $_SERVER["REMOTE_ADDR"] . $_SERVER["HTTP_REFERER"] . $_SERVER["REMOTE_HOST"] . $countryCode . $TSAN_SECRET2 );?>';
var domainID = (window.ts||{}).__tsanalytics_id_;
var tsAnUrlVarExtension = 'ts_an_';
var getGeolocation = false;//<?=(getParamTrue('t_geo')=='yes')?"true":"false"?>;
var submitted = false;
var serverVars={"TIME":"<?=time()?>"};
function objToUrl(a){var b=[],e;for(e in a)a.hasOwnProperty(e)&&b.push(encodeURIComponent(e)+"="+encodeURIComponent((ts.lib.isObject(a[e]))?(JSON.stringify(a[e])):(a[e])));return b.join("&")}
function objToAnalyticsSumissionUrl(a){for(e in a){var i=a[e];delete a[e];a[tsAnUrlVarExtension+e]=i};return objToUrl(a)}
function submitAnalytics(dataObj,donotSend) {
	var callback = ts.lib.isFunction(dataObj['_callback']) ? dataObj['_callback'] : (function(){});
	delete dataObj['_callback'];
    insertIDs(dataObj);
	for (var i in serverVars){
        dataObj['s_'+i]=serverVars[i];
    }
    var urlExt = objToAnalyticsSumissionUrl(dataObj);
    var finalURL = analyticsURL+'?'+urlExt;
    if ((!donotSend)&&(IS_ON)) {
	    ts.lib.jsonp(finalURL,function(a){
			callback(a);
			if (ts.lib.isArray(a)){
				for (var i = a.length - 1; i >= 0; i--) {
					tslog("SERVER: "+a[i]);
				}
			} else {
				tslog("Request completed with code: "+a);
			}
		});
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
var avgLoadTime = ts.lib.cookie.get('ts_avg_connection');
var referer = ((document.referrer)? document.referrer : ((ts.page&&ts.page.referer)?ts.page.referer:""));
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
		navigationStart:a.navigationStart,
		connectStart:a.connectStart,
		requestStart:a.requestStart,
		responseStart:a.requestStart,
		responseEnd:a.responseEnd,
		connectTime:connectTime,
		clientTime:(new Date()).toString()
	}
}

function getClientInfo(){
	return {
		'winsize':screensize,
		'screen':{w:screen.width,h:screen.height,depth:screen.colorDepth},
		'coords':geolocation,
		'avg_conn':avgLoadTime,
		'referer':referer,
		'time':pageTimingInfo()
	};
}

function getUpdateInfo() {
	var returnObj = {
		"mouse":tsURLEncodeArray(mousePosArr),
		"keys":tsURLEncodeArray(keyPressArr),
		"clicks":tsURLEncodeArray(clickArr),
		"scroll":tsURLEncodeArray(scrollPosArr),
		"events":eventsStr(30,true),
		"duration":getTimestamp(),
		"__update__":"1"
	};
	//alert(JSON.stringify(eventList));
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

function removeIndex(array,index) {
	array.splice(index,1);
}

function getMousePos(){
	return {x:ts.lib.mouse.x,y:ts.lib.mouse.y};
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
		if (ts.lib.isDefined(eventList[i])) {
			evtStr += (eventList[i].name || "").replace(/[^a-zA-Z0-9]/g,'_')+"~"+eventList[i].time+"~"+(eventList[i].data || "").replace(/[!~]/g,'_').replace(/'/g,'"')+"!";
		}
		if (shouldTag) {
			eventList[i].sent = true;
		};
	}
	return evtStr;
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
		if (ts.lib.isDefined(dataObj[i])){
			var a = dataObj[i];
			delete dataObj[i];
			dataObj[tsAnUrlVarExtension+i] = a;
		} else {
			delete dataObj[i];
		}
	}
	insertIDs(dataObj);
	ts.lib.formInsertData(formElement,dataObj);
}

// Once loaded, add functions to directly submit

//_tsan.submit=submitAnalytics;
_tsan.clientInfo=getClientInfo;
_tsan.track.keystrokes = getObj(EXT_STR).track.keystrokes || true;
_tsan.form = {};
_tsan.form.addData=addDataToForm;
_tsan.form.addClientInfo=function(form){
	addDataToForm(ts.lib.getEl(form)||document[form],getClientInfo());
}

function linkUrl(linkEl){
	return ts.lib.getEl(linkEl).getAttribute("href");
}

function addLinkEvents(){
	var evtAttribute = "tsan_evt";
	var aTags = document.getElementsByTagName('a');
	for (var i = 0; i < aTags.length; i++) {
		var evtN = aTags[i].getAttribute(evtAttribute);
		if (evtN){
			ts.lib.bind(aTags[i],"click",(function(a,b){
				return function(e) {
					_tsan.track.outgoingEvent(a,b);
				}
			})(evtN,linkUrl(aTags[i])));
			aTags[i].removeAttribute(evtAttribute);
			ts.lib.linkTargetBlank(aTags[i]);
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
		if (ts.lib.isFunction(data)) {
			return data();
		} else if (ts.lib.isObject(data)) {
			return JSON.stringify(data);
		} else if (ts.lib.isDefined(data)) {
			return data;
		} else {
			return "";
		}
	}
	for (var i in evts) {
		ts.lib.bind( ( (evts[i].e==1) ? window : (ts.lib.isElement(evts[i].e)? evts[i].e : document) ),(function(a){return a})(i),
		(function(a){
			return function(e) {
				if ((ts.lib.isFunction(evts[a].b)? evts[a].b(e) : true)) {
					_tsan.track.event( a, processEvtData(ts.lib.isFunction(evts[a].d)? evts[a].d(e) : evts[a].d) );
				}
			}
		})(i));
	};
}

function addPosToSendArray(posData,arr) {
	arr.push(posData.x);
	arr.push(posData.y);
}

addEvents();
addLinkEvents();

ts.lib.bind(document,"DOMNodeInserted",addLinkEvents);

// Send update
var updateIntervalObj = setInterval(function(){
	sendUpdate();
},4000)


var mousePosArr = [];
var scrollPosArr = [];

// Mouse position update (x,y)
var mouseIntervalObj = setInterval(function(){
	addPosToSendArray(getMousePos(),mousePosArr)
},200);

// Scroll tracking (x,y,timestamp)
ts.lib.bind(window,"scroll",function(){
	addPosToSendArray(getScrollPos(),scrollPosArr);
	scrollPosArr.push(getTimestamp());
});

var keyPressArr = [];
ts.lib.bind(document,"keydown",function(){if(getObj(EXT_STR).track.keystrokes){keyPressArr.push(ts.lib.keyactive);keyPressArr.push(getTimestamp())}});

var clickArr = [];
ts.lib.bind(document,"click",function(){addPosToSendArray(getMousePos(),clickArr)});

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
ts.lib.time.speed.connection(function(time){
	var tsccn = "ts_avg_connection";
	var tsccc = ((ts.lib.cookie.get(tsccn))?(JSON.parse(ts.lib.cookie.get(tsccn)).count+1):1);
	var tscct = ((((ts.lib.cookie.get(tsccn))?(JSON.parse(ts.lib.cookie.get(tsccn)).time*(tsccc-1)):0)+time)/tsccc);
	ts.lib.cookie.set(tsccn,JSON.stringify({"count":tsccc,"time":tscct}),200);
});

var unsentCName = "ts_analytics_unsent";
if (ts.lib.cookie.get(unsentCName)) {
	ts.lib.jsonp(ts.lib.cookie.get(unsentCName),function(){});
	ts.lib.cookie.remove(unsentCName);
};

ts.lib.bind(window,"beforeunload",function(e){
	ts.lib.cookie.set(unsentCName,submitAnalytics(getUpdateInfo(),true),200);
});

for (var i = 0; i < forms.length; i++) {
	_tsan.form.addClientInfo(forms[i]);
};

copyObj(_tsan,EXT_STR);

IS_LOADED = true;

stopAll = function(){
	clearInterval(updateIntervalObj);
	clearInterval(mouseIntervalObj);
}

for (var i = 0; i < ts.__tsanalytics_events.length; i++) {
	var a = ts.__tsanalytics_events[i];
	_tsan.track.event(a[0],a[1],a[2],a[3]);
};

for (var i = 0; i < ts.__tsanalytics_forms.length; i++) {
	_tsan.form.addClientInfo(ts.__tsanalytics_forms[i]);
};

}

// LOCAL DECLARATION
var _tsan = {};

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

_tsan.track = {
	outgoingEvent:function(evtName,url){
		_tsan.track.event('OUTGOING:'+evtName,url);
	},
	event:function(evtName,data,time,sendFinishedCallback){
		time = time || getTimestamp();
		tslog("Event: "+evtName+" Time: "+time+" Data: "+JSON.stringify(data));
		var objData = {name:evtName,time:time,data:data||""};
		objData['_callback'] = sendFinishedCallback;
		eventList.push(objData);
	}
}
var forms = [];
_tsan.form = {};
_tsan.form.addClientInfo=function(form){
	forms.push(form);
}
_tsan._cancel = function(errcode){
	tslog("Cancelling"+(errcode? " with code: "+errcode : ""));
	IS_ON = false;
	stopAll();
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
	if (true) {
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
function bindEvt(event_name,callback_function){
	if (window.addEventListener) {
		window.addEventListener(event_name,callback_function); 
	} else if (window.attachEvent)  {
		window.attachEvent(("on"+event_name),callback_function);
	}
}
function isLoaded() {
	return document.readyState == "complete";
}
function loadLib(){var a=document.createElement('script');a.src='<?=$libsjsPath?>';document.getElementsByTagName('head')[0].appendChild(a);}

var init = function(){tslog("Window loaded");_tsan.track.event("pageload");ts.lib? ANALYTICS_MAIN() : (ts.libLoaded = ts.libLoaded || [],ts.libLoaded.push(function(){ANALYTICS_MAIN();ANALYTICS_MAIN=null;tslog("TSLib loaded")}),loadLib(),tslog("TSLib not found: Loading..."));}

if (isLoaded())init();

bindEvt("load",init);

// GLOBAL DECLARATION
copyObj(_tsan,EXT_STR);

tslog("Analytics Begin");


})();
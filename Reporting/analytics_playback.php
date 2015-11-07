<?php
include './paths.php';
$paths = new Paths;
$phpPath = $paths->getFullPath('php');
$analyticsPath = $paths->getHTTPPath("submitAnalytics");
$jsPath = $paths->getHTTPPath("js");
$imgsPath = $paths->getHTTPPath("images");
$libsjsPath = $paths->getHTTPPath("libsjs");
$countriesjsPath = $paths->getHTTPPath("countriesjs");
require_once($phpPath."libs.php");


$analytics_DBName = 'tsanalyticsdb';
$analytics_tableName = 'ts_analytics_data_01';
$analytics_username = 'tsanalytics';
$analytics_password = "1Nhda2oFBwrQ6NcZKSWaBTz8e";

$analyticsPrefixString = 'ts_an_';

mysql_connect("topperstudioscom.ipagemysql.com",$analytics_username,$analytics_password);
mysql_select_db($analytics_DBName);

$q = "SELECT * FROM ".$analytics_tableName.' WHERE `ID`="'.tsescape($_GET["cid"]).'"';
$query = mysql_query($q);
$result = mysql_fetch_array($query);
//$result = $result[0];

$fields = array(
	"winsize",
	"coords",
	"avg_conn",
	"reqid",
	"usrid",
	"referer",
	"screen",
	"time",
	"event",
	"duration",
	"s_REMOTE_PORT",
	"s_REMOTE_HOST",
	"s_REMOTE_ADDR",
	"s_TIME",
	"s_REQUEST_METHOD",
	"s_URL",
	"s_SERVER_PORT",
	"s_COUNTRY",
	"s_UA"
);
foreach ($fields as $key => $value) {
	$fields[$key] = $analyticsPrefixString.$value;
}
/*
echo '<table cellpadding="4">';

foreach ($fields as $key => $value) {
	$val = $result[$value];
	if ($value==$analyticsPrefixString."event") {
		$arr = explode("!", $val);
		$val = "";
		foreach ($arr as $k => $v) {
			$val .= $v."<br>";
		}
	}
	echo "<tr><td>".$value."&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>".$val."</td></tr>";
}

echo "</table>";*/

?>
<html>
<head>
<script type="text/javascript" src="<?=$libsjsPath?>"></script>
<script type="text/javascript" src="<?=$countriesjsPath?>"></script>
<script type="text/javascript">
(function(){
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

window.tsarrayencode = tsarrayencode;
window.tsstrdecode = tsstrdecode;

})();
</script>
<style type="text/css">
#frame-container {
	position: relative;
}
#pageviewframe {
	position: absolute;
	left: 0;
	top: 0;
	border: none;
}
#page-view-events {
	float:right;
}
#page-controlpanel {
	position: absolute;
}
</style>
</head>
<body>
<script>
var DATA = <?php

echo json_encode($result);

?>;
for (var i in DATA){
	if (i.length > 6) {
		DATA[i.substr(6)] = DATA[i];
	}
}
</script>
<div id="frame-container">
	<iframe id="pageviewframe" scrolling="no"></iframe>
	<div id="frame-mask"></div>
</div>
<div id="page-view-events"></div>
<div id="page-controlpanel"></div>
<script>
var CONFIG = {
	mouse:{
		rate:200
	},
	scroll:{
		rate:100
	}
};

function minIndex(arr) {
	return arr.indexOf(Math.min.apply(null, arr));
}

function tslog(str) {
	console.log(str);
}

var frameSize = JSON.parse(DATA["winsize"]);
var screenSize = JSON.parse(DATA["screen"]);
var iframe = document.getElementById('pageviewframe');

var w = frameSize.w;
var h = (frameSize.h==0)? screenSize.h : frameSize.h*3;

tslog("Framesize: "+w+" x "+h);

var winsize = (function(){
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
    return {w:winW,h:winH};
})();

var getwinsize = (function(){
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
    return {w:winW,h:winH};
});

iframe.width=w;
iframe.height=h;
iframe.src = "analytics_frame_pageview.php?url="+DATA["s_URL"];

document.getElementById("pageviewframe").style.cssText += 
"zoom: "+((winsize.w/2) / w)+"; -moz-transform: scale("+((winsize.w/2) / w)+"); -moz-transform-origin: 0 0; -o-transform: scale("+((winsize.w/2) / w)+"); -o-transform-origin: 0 0; -webkit-transform: scale("+((winsize.w/2) / w)+"); -webkit-transform-origin: 0 0;";

document.getElementById("frame-mask").style.cssText += 
"zoom: "+((winsize.w/2) / w)+"; -moz-transform: scale("+((winsize.w/2) / w)+"); -moz-transform-origin: 0 0; -o-transform: scale("+((winsize.w/2) / w)+"); -o-transform-origin: 0 0; -webkit-transform: scale("+((winsize.w/2) / w)+"); -webkit-transform-origin: 0 0;";

var mouseData = tsstrdecode(DATA["mouse"]);
var scrollData = tsstrdecode(DATA["scroll"]);
var clickData = tsstrdecode(DATA["clicks"]);
var mousePos = [];
var __mouse_switch = true;
var __mouse_i = 0;

for (var i = 0; i < mouseData.length; i++) {
	if (__mouse_switch) {
		mousePos[__mouse_i] = {x:mouseData[i]};
	} else {
		mousePos[__mouse_i].y = mouseData[i];
		__mouse_i++;
	}
	tslog(__mouse_i);
	__mouse_switch = !__mouse_switch;
};


var __scroll_i = 0;
var scrollPos = [];
for (var i = 0; i < scrollData.length; i+=3) {
	scrollPos[__scroll_i] = {};
	scrollPos[__scroll_i].x = scrollData[i];
	scrollPos[__scroll_i].y = scrollData[i+1];
	scrollPos[__scroll_i].t = scrollData[i+2];
	__scroll_i++;
};

console.log(scrollPos);

window._frame = {};

_frame.mouse = {};
_frame.mouse.cursorPath = "<?=$imgsPath?>cursor.png";
_frame.mouse.updateRate = CONFIG.mouse.rate;

_frame.scroll = {};
_frame.scroll.updateRate = CONFIG.scroll.rate;

_frame.events = {};
_frame.events.onready = _frame.events.onready || [];
_frame.events.update = {};

_frame.clicks = {};
_frame.clicks.data = clickData;

var mouse_index = 0;
var scroll_time = 0;

_frame.events.onready.push(function(){
	setInterval(function(){
		_frame.events.update.mouse(mousePos[mouse_index].x,mousePos[mouse_index].y);
		mouse_index++;
	},CONFIG.mouse.rate);
	setInterval(function(){
		var arr = [];
		for (var i = 0; i < scrollPos.length-1; i++) {
			arr.push(Math.abs(scrollPos[i].t-scroll_time));
			//tslog("Index: "+i+" Time: "+scroll_time+" Index's time: "+scrollPos[i].t+" Diff: "+Math.abs(scrollPos[i].t-scroll_time));
		};
		_frame.events.update.scroll(scrollPos[minIndex(arr)].x,scrollPos[minIndex(arr)].y);
		scroll_time += CONFIG.scroll.rate;
	},CONFIG.scroll.rate)
});

_frame.onready = function(){
	for (var i = 0; i < _frame.events.onready.length; i++) {
		_frame.events.onready[i]();
	};
}

var mask = document.getElementById('frame-mask');
mask.style.position = "absolute";
mask.style.top = 0;
mask.style.left = 0;
mask.style.width = w+"px";
mask.style.height = h+"px";

document.getElementById('page-view-events').innerHTML = DATA["ts_an_event"].split("!").join("<br>");

var m = ts.lib.makeEl;
var cp_top;
var cp_transport;
var cp_transport_play;
var cp_timeline_line;
var cp_timeline_marker;

var currentFrame = 0;
var totalFrames = 1000;

document.getElementById('page-controlpanel').appendChild(m({
	left:0,
	js:function(e) {
		cp_top = e;
	},
	height:"100px",
	position:"fixed",
	background:"#999",
	children:[
		m({
			js:function(e) {
				cp_transport = e;
			},
			children:[
				m({
					background:"url('analytics/web-play-button.png') no-repeat",
					"float":"left",
					width:"50px",
					height:"50px",
					margin:"25px",
					js:function(e) {
						cp_transport_play = e;
					}
				}),
				m({
					background:"url('analytics/web-pause-button.png') no-repeat",
					width:"50px",
					height:"50px",
					position:"absolute",
					left:"80px",
					margin:"25px",
					js:function(e) {
						cp_transport_play = e;
					}
				})
			]
		}),
		m({
			position:"relative",
			left:"200px",
			top:"50px",
			children:[
				m({
					height:"10px",
					background:"#000",
					js:function(e) {
						cp_timeline_line = e;
					}
				}),
				m({
					js:function(e) {
						cp_timeline_marker = e;
					},
					position:"absolute",
					width:"20px",
					height:"60px",
					top:"-25px",
					left:"0px",
					background:"#fff"
				})
			]
		})
	]
}))

setInterval(function() {
	cp_top.style.top = (getwinsize().h - 100)+"px";
	cp_top.style.width = (getwinsize().w)+"px";
	cp_timeline_line.style.width = (getwinsize().w/3)+"px";
	cp_timeline_marker.style.left = ((currentFrame/(totalFrames*1.0))  * (parseFloat(cp_timeline_line.style.width))) + "px";
},100)

// TODO: Move all updating to ONE global update function

</script>
</body>
</html>
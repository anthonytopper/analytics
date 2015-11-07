<?php
include './paths.php';
$paths = new Paths;
$phpPath = $paths->getFullPath('php');
$analyticsPath = $paths->getHTTPPath("submitAnalytics");
$jsPath = $paths->getHTTPPath("js");
$libsjsPath = $paths->getHTTPPath("libsjs");
$countriesjsPath = $paths->getHTTPPath("countriesjs");
require_once($phpPath."libs.php");
?>
<html>
<head>
<style>


table.main {
    border-collapse: collapse;
    border-color: #000000;
    border-spacing: 0;
    border-style: solid;
    border-width: 1px;
    font-size: 10px;
    font-family: Verdana,Arial,Helvetica,sans-serif;
}

td.main,th {
	border-color: #000000;
	border-style: solid;
	border-width: 1px;
	padding: 3.5px;
}

th {
	background-color: #E5E5E5;
}

.meta {
	display: none;
}

</style>
<script type="text/javascript" src="<?=$libsjsPath?>"></script>
<script type="text/javascript" src="<?=$countriesjsPath?>"></script>
</head>
<body>

<?php

$analytics_DBName = 'tsanalyticsdb';
$analytics_tableName = 'ts_analytics_data_01';
$analytics_username = 'tsanalytics';
$analytics_password = "1Nhda2oFBwrQ6NcZKSWaBTz8e";

$analyticsPrefixString = 'ts_an_';

function tsan_connect(){
	$analytics_DBName = 'tsanalyticsdb';
	$analytics_tableName = 'ts_analytics_data_01';
	$analytics_username = 'tsanalytics';
	$analytics_password = "1Nhda2oFBwrQ6NcZKSWaBTz8e";

	$analyticsPrefixString = 'ts_an_';
	$connection = mysql_connect("topperstudioscom.ipagemysql.com",$analytics_username,$analytics_password) or kill_script('1');
	mysql_select_db($analytics_DBName,$connection) or kill_script('2');
	return $connection;
}

$link = mysql_connect("topperstudioscom.ipagemysql.com",$analytics_username,$analytics_password);
mysql_select_db($analytics_DBName);


$analytics_fields = array(
	"winsize",
	"referer",
	"screen",
	"s_REMOTE_HOST",
	"s_REMOTE_ADDR",
	"s_COUNTRY",
	"s_UA"
);

$analytics_fields_meta = array(
	"winsize",
	"coords",
	"avg_conn",
	"reqid",
	"usrid",
	"referer",
	"screen",
	"time",
	"event",
	"eventtime",
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

foreach ($analytics_fields as $key => $value) {
	$analytics_fields[$key] = $analyticsPrefixString.$value;
}
foreach ($analytics_fields_meta as $key => $value) {
	$analytics_fields_meta[$key] = $analyticsPrefixString.$value;
}


$exip = explode(" ",$_GET["exip"]);
$exiparr = array();
/*
foreach( $exip as $key => $val){
array_push($exiparr,'s_REMOTE_ADDR`<>"'.$val'"');
}*/

if ($_GET["page"]=="LIVE") {
	mysql_close($link);
	$LIVE = getLive();
	$link = tsan_connect();
	$query = mysql_query("SELECT * FROM ".$analytics_tableName." WHERE `".$analyticsPrefixString .'s_REMOTE_ADDR`<>"'.$_SERVER['REMOTE_ADDR']./*implode(" and ",$exiparr).*/'" ORDER BY `'.$analyticsPrefixString.'s_TIME`',$link);
	echo '<b>RESULTS FOR '.htmlspecialchars($_GET["page"]).'</b><br><br><div id="meta-display"></div><br><div id="table-main"><table cellpadding="0" class="main"><tr>
<th> ID </th>
<th> ts_an_winsize </th>
<th> ts_an_screen </th>
<th> ts_an_s_REMOTE_HOST </th>
<th> ts_an_s_REMOTE_ADDR </th>
<th> URL </th>
<th> ts_an_s_COUNTRY </th>
<th> ts_an_s_UA </th>
<th> ts_an_referer </th>
</tr>';
	while ($row = mysql_fetch_array($query)) {
		if (in_array($row["ID"], $LIVE)){
			echo '<tr class="data-row main">';
			$metaArray = array();
			foreach ($row as $key => $value) {
				if (in_array($key, $analytics_fields) || ($key==$analyticsPrefixString."s_URL")) {
					echo '<td class="main">'.htmlspecialchars($value)."</td>";
				}
				if (in_array($key, $analytics_fields_meta)) {
					$metaArray[$key] = $value;
				}
			}
			echo '<td class="meta">'.htmlspecialchars(json_encode($metaArray))."</td>";
			echo "</tr>";
		}
	}
	echo '</table></div>';
} elseif ($_GET["page"]) {
	$query = mysql_query("SELECT * FROM ".$analytics_tableName." WHERE `".$analyticsPrefixString .'s_URL`="'.$_GET["page"].'" AND `'.$analyticsPrefixString .'s_REMOTE_ADDR`<>"'.$_SERVER['REMOTE_ADDR']./*implode(" and ",$exiparr).*/'" ORDER BY `'.$analyticsPrefixString.'s_TIME`',$link);
	echo '<b>RESULTS FOR '.htmlspecialchars($_GET["page"]).'</b><br><br><div id="meta-display"></div><br><div id="table-main"><table cellpadding="0" class="main"><tr>
<th> ID </th>
<th> ts_an_winsize </th>
<th> ts_an_screen </th>
<th> ts_an_s_REMOTE_HOST </th>
<th> ts_an_s_REMOTE_ADDR </th>
<th> ts_an_s_COUNTRY </th>
<th> ts_an_s_UA </th>
<th> ts_an_referer </th>
</tr>';
	while ($row = mysql_fetch_array($query)) {
		echo '<tr class="data-row main">';
		$metaArray = array();
		foreach ($row as $key => $value) {
			if (in_array($key, $analytics_fields)) {
				echo '<td class="main">'.htmlspecialchars($value)."</td>";
			}
			if (in_array($key, $analytics_fields_meta)) {
				$metaArray[$key] = $value;
			}
		}
		echo '<td class="meta">'.htmlspecialchars(json_encode($metaArray))."</td>";
		echo "</tr>";
	}
	echo '</table></div>';
} else {
	$query = mysql_query("SELECT DISTINCT `".$analyticsPrefixString ."s_URL` FROM ".$analytics_tableName.' WHERE `ts_an_s_REMOTE_ADDR`<>"'.$_SERVER["REMOTE_ADDR"].'"');
	while ($row = mysql_fetch_array($query)) {
		echo '<a href="?page='.addslashes(htmlspecialchars($row[0])).'">'.$row[0]."</a><br>";
	}
	echo '<br><br><a href="?page=LIVE">LIVE</a><br>';
}

function getLive(){
	$analytics_DBName = 'tsanalyticsdb';
	$analytics_tableName = 'ts_analytics_data_01';
	$analytics_username = 'tsanalytics';
	$analytics_password = "1Nhda2oFBwrQ6NcZKSWaBTz8e";

	$analyticsPrefixString = 'ts_an_';

	$link = tsan_connect();
	$result = mysql_query("SELECT ID FROM ".$analytics_tableName." WHERE ABS(ts_an_lastupdate - ".time().") < 6",$link);
	$ARR = array();
	while ($row = mysql_fetch_assoc($result)) {
		array_push($ARR, $row["ID"]);
	}
	mysql_close($link);
	return $ARR;
}

?>
<script type="text/javascript">
function redirectToPlayback(rowEl){
	window.location = "analytics_playback.php?cid="+JSON.parse(rowEl.getElementsByClassName("meta")[0].innerHTML)["0"];
}

function parseJSON(str) {
	var a = str;
	try {
		a = JSON.parse(str);
	} catch(e) {}
	return a;
}

function isJSONparsable(str) {
	try {
		JSON.parse(str);
	} catch(e) {
		return false;
	}
	return true;
}

function isBlank(str) {
	
}

function constructTable(analyticsObj) {
	var tableTop = document.createElement("table");
	tableTop.className = "main";
	tableTop.innerHTML = "<th> ID </th>\
<th> ts_an_winsize </th>\
<th> ts_an_screen </th>\
<th> ts_an_s_REMOTE_HOST </th>\
<th> ts_an_s_REMOTE_ADDR </th>\
<th> URL </th>\
<th> ts_an_s_COUNTRY </th>\
<th> ts_an_s_UA </th>\
<th> ts_an_referer </th>";
	for (var i = 0; i < analyticsObj.length; i++) {
		var row = document.createElement("tr");
		row.className = "data-row main"
		for (var j in analyticsObj[i]){
			var a = analyticsObj[i];
			var cell = document.createElement("td");
			cell.className = "main";
			cell.innerHTML = a[j];
			row.appendChild(cell);
		}
		tableTop.appendChild(row);
	};
	return tableTop;
}

<? if ($_GET["page"]=="LIVE") { ?>
setInterval(function() {
	ts.lib.jsonp("analytics/getlive.php?columns=ID,ts_an_winsize,ts_an_screen,ts_an_s_REMOTE_HOST,ts_an_s_REMOTE_ADDR,ts_an_s_URL,ts_an_s_COUNTRY,ts_an_s_UA,ts_an_referer",function(data) {
		ts.lib.getEl("table-main").innerHTML = constructTable(data).outerHTML;
	})
},4000)

<? } ?>

var p = "<?=$analyticsPrefixString?>";
var fields = {
	"avg_conn":0,
	"Load time":function(a){
		return (!isJSONparsable(a[p+"time"]))? "" : (parseJSON(a[p+"time"]).connectTime + "ms");
	},
	//"event":0,
	"Event Time":function(a) {
		var b = parseInt(a[p+"eventtime"]);
		if ((!ts.lib.isNumber(b))||((b+"")=="NaN"))return;
		return (b/1000.0) + "s";
	},
	"Duration":function(a) {
		var b = parseInt(a[p+"duration"]);
		if ((!ts.lib.isNumber(b))||((b+"")=="NaN"))return;
		return (b/1000.0) + "s";
	},
	"Server Time":function(a) {
		var d = new Date(parseInt(a[p+"s_TIME"])*1000);
		return d.toLocaleString();
	},
	"Client Time":function(a) {
		return (!isJSONparsable(a[p+"time"]))? "" : (JSON.parse(a[p+"time"]).clientTime);
	},
	"Country":function(a) {
		return ts.countries[a[p+"s_COUNTRY"]];
	}
}
for (var i in fields) {
	fields[p+i] = fields[i];
	delete fields[i];
}
function isData(a) {
	return (ts.lib.isDefined(a) && (a!="") && (a!="undefined"));
}
var a=document.getElementsByClassName('data-row');
for (var i = 0; i < a.length; i++) {
	a[i].onmouseover = (function(b){
		return function(e) {
			var c = JSON.parse(b.getElementsByClassName('meta')[0].innerHTML);
			var str = "<table style='margin:0.5em'><tr><td colspan=2><b>Site hit at: <?=htmlspecialchars($_GET['page'])?></b></td></tr><tr><td>&nbsp;</td></tr>";
			for (var i in fields) {
				var a = (ts.lib.isFunction(fields[i])) ? fields[i](c) : c[i];
				if (isData(a)){
					str += "<tr><td><b>"+i.substr(6)+"</b>: &nbsp;&nbsp;&nbsp;</td><td>";
					str += a;
					str += "</td></tr>";
				}
				var mel = document.getElementById('meta-display');
				mel.style.top = (ts.lib.positionedOffset(b).top + ((ts.lib.positionedOffset(b).top < (window.innerHeight - 400))? 50 : -250))+"px";
			};
			str += "</table>";

			var mel = document.getElementById('meta-display');
			mel.innerHTML = str;
			mel.style.display = "block";
		}
	})(a[i]);
	a[i].onmouseout = (function(b){
		return function(e) {
			document.getElementById('meta-display').style.display = "none";
		}
	})(a[i]);
	a[i].onclick = (function(b){
		return function(e) {
			redirectToPlayback(b);
		}
	})(a[i]);
};
var mel = document.getElementById('meta-display');
mel.style.position = "absolute";
mel.style.border = "2px solid #000";
mel.style.borderRadius = "1em"
ts.lib.style.cssPrefix(mel,"box-shadow","3px 3px 4px #000")
mel.style.background = "#fff";
mel.style.zIndex = "100";
ts.lib.bind(document,"mousemove",function(e) {
	var mel = document.getElementById('meta-display');
	mel.style.left = (ts.lib.mouse.x+((ts.lib.mouse.x < (window.innerWidth-450))? 50 : -500))+"px";
})
</script>
</body>
</html>
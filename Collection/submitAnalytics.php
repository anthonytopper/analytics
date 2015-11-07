<?php

$IS_ON = true;

$DEBUG = ($_GET['debug']=='1')?true:false;

if (!$IS_ON) {
	kill_script('5');
}

include './paths.php';
$paths = new Paths;
$phpPath = $paths->getFullPath('php');
require_once($phpPath."libs.php");

ini_set('display_errors', 0);
header('Content-Type:text/javascript');

$countryCode = iptocountry($_SERVER["REMOTE_ADDR"]);

$analytics_DBName = 'tsanalyticsdb';
$analytics_tableName = 'ts_analytics_data_01';
$analytics_username = 'tsanalytics';
$analytics_password = "1Nhda2oFBwrQ6NcZKSWaBTz8e";

$analyticsPrefixString = 'ts_an_';


$analytics_fields = array(
	"__update__",
	"winsize",
	"coords",
	"avg_conn",
	"reqid",
	"usrid",
	"referer",
	"screen",
	"time",
	"mouse",
	"clicks",
	"scroll",
	"keys",
	"events",
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

$server_vars = array(
	"s_REMOTE_PORT" => $_SERVER['REMOTE_PORT'],
	"s_REMOTE_HOST" => $_SERVER['REMOTE_HOST'],
	"s_REMOTE_ADDR" => $_SERVER['REMOTE_ADDR'],
	"s_URL" => $_SERVER['HTTP_REFERER'],
	"s_SERVER_PORT" => $_SERVER['SERVER_PORT'],
	"s_COUNTRY" => $countryCode,
	"s_UA" => $_SERVER['HTTP_USER_AGENT']
);

foreach ($server_vars as $key => $value) {
	$_GET[$analyticsPrefixString.$key] = $value;
}


foreach ($analytics_fields as $anKey => $anfield) {
	$analytics_fields[$anKey] = $analyticsPrefixString.$anfield;
}

$debug_array = array();
function debugLog($str){
	global $DEBUG;
	global $debug_array;
	if ($DEBUG){
		array_push($debug_array,$str);
	}
}

function kill_script($errorCode){
	global $DEBUG;
	if ($DEBUG){
		global $debug_array;
		array_push($debug_array, "Return Code: ".$errorCode);
		$errorCode = json_encode($debug_array);
	}
	die($_GET['callback']? ($_GET['callback'].'('.$errorCode.');') : $errorCode.'');
}

function isUserValid($dnid){
	// TODO: check if dnid and domain name is valid
}

function isValidSubmission($array){
	global $analyticsPrefixString;
	global $countryCode;
	$TSAN_SECRET1 = "sQTKigb3MTkuvE7mtlCPkKBelzBCZRVKgFxgpT4XZ2OWDi0yTit89Qy8du8F";
	$TSAN_SECRET2 = "rsmK6xzcRbmk9x7G4SW54aTN44iILKKFZdKUO5UeUSzu7XxKbUvm5SvmmouI";
	$TSAN_SECRET3 = "5eLyusUgJpuE9sSs0WU8uMTNoluHvBJ6Wd2WBL6yU4z8hbgkWQkyXKQbF6tZ";
	// User ID = User agent + IP + Referer + Host + Country code + Secret 2
	if ($array[$analyticsPrefixString."usrid"]!=md5( $_SERVER['HTTP_USER_AGENT'] . $_SERVER["REMOTE_ADDR"] . $_SERVER["HTTP_REFERER"] . $_SERVER["REMOTE_HOST"] . $countryCode . $TSAN_SECRET2 )){
		return 1;
	}
	// Request ID = User agent + IP + Referer + Request time + Country code + Secret 1
	if ($array[$analyticsPrefixString."reqid"]!=md5( $_SERVER['HTTP_USER_AGENT'] . $_SERVER["REMOTE_ADDR"] . $_SERVER["HTTP_REFERER"] . $array[$analyticsPrefixString."s_TIME"] . $countryCode . $TSAN_SECRET1 )){
		return 2;
	}
	if ((time() - intval($array[$analyticsPrefixString."s_TIME"])) > 10){ 
		/* Tracking page events do not need to validate the time, 
		   as the user may trigger an event more that 10 seconds after the page loads */
		if (!$array[$analyticsPrefixString."__update__"]){
			return 3;
		}
	}
	return 0;
}

function whereSelector(){
	global $analyticsPrefixString;
	global $inputValues;
	return "".$analyticsPrefixString.'reqid="'.$inputValues[$analyticsPrefixString."reqid"].'" AND '.$analyticsPrefixString.'usrid="'.$inputValues[$analyticsPrefixString."usrid"].'"';
}

function tsan_connect(){
	global $analytics_username;
	global $analytics_password;
	global $analytics_DBName;
	$connection = mysql_connect("topperstudioscom.ipagemysql.com",$analytics_username,$analytics_password) or kill_script('1');
	mysql_select_db($analytics_DBName,$connection) or kill_script('2');
	return $connection;
}

function removeLastChar($valueStr){
	return substr($valueStr,0,strlen($valueStr)-1);
}

function getSQLCells($columns,$whereSelector){

	global $analytics_tableName;

	$colStr = "";

	foreach ($columns as $key => $value) {
		$colStr .= '`'.$value.'`,';
	}

	$colStr = removeLastChar($colStr);

	$query = "SELECT ".$colStr.' FROM '.$analytics_tableName.' WHERE '.$whereSelector;

	debugLog("SQL: Fetching values with query: ".$query);

	$connection = tsan_connect();
	$result = mysql_query($query,$connection) or kill_script('3.1');
	$returnArr = mysql_fetch_array($result);
	mysql_close($connection);
	return $returnArr;
}

function appendToSQLCell($valueArray,$whereSelector){
	
	global $analytics_tableName;
	
	
	
	$valueStr = "";
	
	$columns = array();
	
	foreach ($valueArray as $key=>$value){
		array_push($columns, $key);
	}

	$originalVals = getSQLCells($columns,$whereSelector);
	
	foreach ($valueArray as $key=>$value){
		$valueStr .= ''.$key.'="'.addslashes($originalVals[$key]).$value.'",';
		debugLog("SQL: Appending values with KEY: ".$key." ORIG: ".addslashes($originalVals[$key])." NEW: ".$value);
	}
	
	$valueStr = removeLastChar($valueStr);
	
	$query = 'UPDATE '.$analytics_tableName.' SET '.$valueStr." WHERE ".$whereSelector;
	
	debugLog("SQL: Appending values with query: ".$query);

	$connection = tsan_connect();
	mysql_query($query,$connection) or kill_script('3.2');
	mysql_close($connection);
}

function setSQLValues($valueArray,$whereSelector){
	global $analytics_username;
	global $analytics_password;
	global $analytics_DBName;
	global $analytics_tableName;
	
	$valueStr = "";
	
	foreach ($valueArray as $key=>$value){
		$valueStr .= "".$key.'="'.$value.'",';
	}
	
	$valueStr = removeLastChar($valueStr);
	
	$query = 'UPDATE '.$analytics_tableName.' SET '.$valueStr." WHERE ".$whereSelector;
	
	debugLog("SQL: Setting values with query: ".$query);

	$connection = tsan_connect();
	mysql_query($query,$connection) or kill_script('3.3');
	mysql_close($connection);
}

function getInput($str){
	global $analyticsPrefixString;
	global $inputValues;
	return $inputValues[$analyticsPrefixString.$str];
}

$inputValues = array();
$fieldList = '';

foreach ($_GET as $key => $value) {
	if (in_array($key,$analytics_fields)){
		$inputValues[$key] = tsescape($value);
		$fieldList .= ',`'.removestr('`',removeunsafe($key)).'`';
	}
}

$inputValuesStr = '';

foreach ($inputValues as $inputValue) {
	$inputValuesStr .= ',"'.$inputValue.'"';
}

$query = 'INSERT INTO '.$analytics_tableName.' (ID'.$fieldList.') VALUES ("NULL"'.$inputValuesStr.') ';

$validationError = isValidSubmission($inputValues);

if (($validationError==0)&&($IS_ON)){
	if ($inputValues[$analyticsPrefixString."__update__"]){
		$whereSel = whereSelector();
		
		appendToSQLCell(array(
			$analyticsPrefixString.'mouse' =>	 	getInput("mouse"),
			$analyticsPrefixString.'key' =>			getInput("keys"),
			$analyticsPrefixString.'clicks' =>		getInput("clicks"),
			$analyticsPrefixString.'scroll' =>		getInput("scroll"),
			$analyticsPrefixString.'event' =>		getInput("events")
		),$whereSel);
		
		setSQLValues(array(
			$analyticsPrefixString.'duration' =>	getInput("duration")
		),$whereSel);

		kill_script(0);
	}
	$connection = tsan_connect();
	mysql_query($query,$connection) or kill_script("3.4");
	mysql_close($connection);
	kill_script(0);
} else {
	kill_script('4.'.$validationError);
}

// SELECT `ts_an_winsize` , `ts_an_coords` , `ts_an_avg_conn` , `ts_an_s_REMOTE_HOST`, `ts_an_s_REMOTE_ADDR` , `ts_an_s_TIME` , `ts_an_s_URL` , `ts_an_s_COUNTRY` , `ts_an_s_UA` , `ts_an_referer` FROM `ts_analytics_data_01` WHERE `ts_an_s_REMOTE_ADDR`<>"65.96.211.90" ORDER BY `ts_an_s_TIME` ASC LIMIT 0, 	10000 ;

// SELECT `ts_an_winsize` , `ts_an_screen` , `ts_an_avg_conn` , `ts_an_s_REMOTE_HOST` , `ts_an_s_REMOTE_ADDR` , `ts_an_s_TIME` , `ts_an_s_URL` , `ts_an_s_COUNTRY` , `ts_an_s_UA` , `ts_an_referer` FROM `ts_analytics_data_01` WHERE `ts_an_s_REMOTE_ADDR` <> "65.96.211.90" ORDER BY `ts_an_s_TIME` ASC LIMIT 0 , 10000;

// SELECT `ts_an_event`, `ts_an_eventtime`,`ts_an_winsize` , `ts_an_avg_conn` , `ts_an_s_REMOTE_HOST`, `ts_an_s_REMOTE_ADDR` , `ts_an_s_TIME` , `ts_an_s_URL` , `ts_an_s_COUNTRY` , `ts_an_s_UA` , `ts_an_referer` FROM `ts_analytics_data_01` WHERE `ts_an_s_REMOTE_ADDR`<>"65.96.211.90" ORDER BY `ts_an_s_TIME` ASC LIMIT 0, 10000 ;

?>
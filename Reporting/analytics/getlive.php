<?php
include '../paths.php';
$paths = new Paths;
$phpPath = $paths->getFullPath("php");
require_once($phpPath."libs.php");

header("content-type:text/javascript");

$analytics_DBName = 'tsanalyticsdb';
$analytics_tableName = 'ts_analytics_data_01';
$analytics_username = 'tsanalytics';
$analytics_password = "1Nhda2oFBwrQ6NcZKSWaBTz8e";

$analyticsPrefixString = 'ts_an_';

function tsan_connect(){
	global $analytics_username;
	global $analytics_password;
	global $analytics_DBName;
	$connection = mysql_connect("topperstudioscom.ipagemysql.com",$analytics_username,$analytics_password) or kill_script('1');
	mysql_select_db($analytics_DBName,$connection) or kill_script('2');
	return $connection;
}

$COLS = $_GET["columns"]? tsescape($_GET["columns"]) : "ID";

$link = tsan_connect();
$result = mysql_query("SELECT ".$COLS." FROM ".$analytics_tableName." WHERE ABS(ts_an_lastupdate - ".time().") < 10",$link);
$ARR = array();
while ($row = mysql_fetch_assoc($result)) {
	array_push($ARR, $row);
}


echo $_GET['callback']."(".json_encode($ARR).");";

?>
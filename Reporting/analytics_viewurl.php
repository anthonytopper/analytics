<?php

function isFullURL($str){
	$isHTTP = (substr($str, 0, 7)=="http://");
	$isHTTPS = (substr($str, 0, 8)=="https://");
	if ((!$isHTTPS) && (!$isHTTP)) {
		return false;
	}
	return true;
}

$url = $_GET["url"];

if (!isFullURL($url)) {
	$url = "http://".$_GET["url"];
}

echo '<base href="'.$url.'">';
echo file_get_contents($url);

?>
<script type="text/javascript">
(function () {
    if (window.addEventListener) {
        window.addEventListener("load", window.parent._frame.onready);
    } else if (window.attachEvent) {
        window.attachEvent(("onload"), window.parent._frame.onready);
    }
    if (window.ts && ts.analytics) {
    	ts.analytics._cancel();
    } else {
        window.ts = window.ts || {};
        ts.__tsanalytics_cancelTracking = true;
    }
})();
</script>
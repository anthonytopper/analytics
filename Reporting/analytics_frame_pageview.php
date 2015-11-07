<html>
<head>
<style type="text/css">
#cursor {
	position: absolute;
	width: 17px;
	height: 24px;
}
.click-marker{
	position: absolute;
	width: 9px;
	height: 9px;
	background: #F00;
	border: 1px solid #0FF;
	border-radius: 5px;
}
</style>
</head>
<body>
	<div id="container">
		<iframe src="analytics_viewurl.php?url=<?=$_GET['url']?>" style="position:absolute;left:0;top:0;width:100%;height:100%;border:none" scrolling="no" id="iframe"></iframe>
	</div>
<div id="cursor"></div>
<script type="text/javascript">

var c = document.getElementById('cursor');
c.style.background = "url('"+window.parent._frame.mouse.cursorPath+"')";

window.parent._frame.events.onready = window.parent._frame.events.onready || [];

var scrollOffsetX = 0;
var scrollOffsetY = 0;

window.parent._frame.events.onready.push(function(){
	window.parent._frame.events.update.mouse = function(x,y){
		c.style.left = (x-scrollOffsetX)+"px";
		c.style.top = (y-scrollOffsetY)+"px";
	}
	window.parent._frame.events.update.scroll = function(x,y){
		document.getElementById("iframe").contentWindow.scrollTo(x,y);
		scrollOffsetX = x;
		scrollOffsetY = y;
		var d = document.getElementsByClassName("click-marker");
		for (var i = 0; i < d.length; i++) {
			d[i].style.left = (d[i]._initPos_.x - scrollOffsetX)+"px";
			d[i].style.top = (d[i]._initPos_.y - scrollOffsetY)+"px";
		};
	}
});

window._frame = {};
window._frame.onready = function(){
	window.parent._frame.onready();
}

for (var i = 0; i < window.parent._frame.clicks.data.length; i+=2) {
	var d = document.createElement("div");
	d.className = "click-marker";
	d.style.left = window.parent._frame.clicks.data[i]+"px";
	d.style.top = window.parent._frame.clicks.data[i+1]+"px";
	d._initPos_.x = window.parent._frame.clicks.data[i];
	d._initPos_.y = window.parent._frame.clicks.data[i+1];
	document.body.appendChild(d);
};


</script>
</body>
</html>
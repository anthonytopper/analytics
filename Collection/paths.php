<?

$PATHS_DB = array(
	"ROOT" =>			array("path" => "/",	"HTTP" => "topper-studios.com/"),
	"assets" =>			array("path" => "assets/",	"relative" => "ROOT", 	"HTTP" => "assets.topperstudios.com/"),
	"images" => 		array("path" => "images/",	"relative" => "assets"),
	"js" => 			array("path" => "js/",		"relative" => "assets"),
	"css" => 			array("path" => "css/",		"relative" => "assets"),
	"video" => 			array("path" => "video/",	"relative" => "assets"),
	"flash" => 			array("path" => "flash/",	"relative" => "assets"),
	"php" => 			array("path" => "php/",		"relative" => "assets"),
	"music" => 			array("path" => "music/",	"relative" => "assets"),
	"fonts" => 			array("path" => "fonts/",	"relative" => "assets"),
	"pages" =>			array("path" => "php/pages/","relative" => "assets")
);

class Path {
	
	public $full;
	public $http;
	public $protocol;
	public function __construct(){
		$this->protocol = ($_SERVER["HTTPS"] == "on") ? "https://" : "http://";
	}
	public function createFromName($path_name){
		global $PATHS_DB;
		
		if ($PATHS_DB[$path_name]){
			
			// Construct full server path
			
			$full_path = $PATHS_DB[$path_name]["path"];
			
			$currentPath = $PATHS_DB[$path_name];
			
			$appendingPaths = true;
			
			while ($appendingPaths){
				if ($currentPath["relative"]){
					$full_path = $PATHS_DB[$currentPath["relative"]]["path"] . $full_path;
					$currentPath = $PATHS_DB[$currentPath["relative"]];
				} else {
					$appendingPaths = false;
				}
			}
			
			// Construct full HTTP path
			
			
			
			if ($PATHS_DB[$path_name]["HTTP"]){
				$http_path = $PATHS_DB[$path_name]["HTTP"];
			} else {
			
				$http_path = $PATHS_DB[$path_name]["path"];
				
				$currentPath = $PATHS_DB[$path_name];
				
				$appendingPaths = true;
				
				while ($appendingPaths){
					if ($currentPath["HTTP"]){
						$http_path = $currentPath["HTTP"] . $http_path;
						$appendingPaths = false;
					} else {
						if ($currentPath["relative"]){
							$http_path = $PATHS_DB[$currentPath["relative"]]["path"] . $http_path;
							$currentPath = $PATHS_DB[$currentPath["relative"]];
						} else {
							$appendingPaths = false;
						}
					}
				}
				
				$http_path = $this->protocol . $http_path;
			
			}
			
			$this->full = $full_path;
			$this->http = $http_path;
		}
	}
	
}

$paths = new Paths;
echo $paths->getFullPath("pages");


class Paths {
	/*
	public function currentPath($path_str){
		$this->current_path = $path_str;
	}
	public function getRelativePath($path_str){
		$directories_down = ('/',$this->current_path);
		$dir_count = $directories_down.count;
		$dir_str = '';
		for ($i = 0; $i < $dir_count; $i++){
			$dir_str .= '../';
		}
		$dir_str .= $this->path_info[$path_str]["path"];
		return $dir_str;
	}*/
	public function getHTTPPath($str) {
		$pathObj = new Path;
		$pathObj->createFromName($str);
		return $pathObj->http;
	}
	public function getFullPath($str) {
		$pathObj = new Path;
		$pathObj->createFromName($str);
		return $pathObj->full;
	}
}


?>
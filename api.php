<?php
require 'vendor/autoload.php';

$Request = explode('/', trim($_SERVER['REQUEST_URI'],'/'));
//if the request uri matches index.html or .js, pass through
if ($Request[0] == "index.html"){
	return false;
}
if ($Request[0] == "behavior.js"){
	return false;
}
if ($Request[0] == "style.css"){
	return false;
}
if ($Request[0] != "api") {
	echo "Error";
	return "Error";
}
//
//Request[1] should be the search term
$code_base="https://restcountries.eu/rest/v2/alpha/";
$name_base="https://restcountries.eu/rest/v2/name/";
$url=$code_base.$Request[1];
$data = getData($url);
if (!$data){
	$url=$name_base.$Request[1];
	$data=getData($url);
}
$jsonData=json_decode($data); 
$returnData = (object)[]; //casts an empty array to object class to get an empty object
$returnData->countries=[];
$returnData->regions=[];
$returnData->subregions=[];
if (!$jsonData){
	return "None";
}
if (!(is_array($jsonData))){ //if it's not a list, we have a single country. Nest it so we can iterate over it.
	$jsonData = [$jsonData];
}
foreach($jsonData as $country){
	//check if we've got over 50 and bail if so
	if (count($returnData->countries) >=50){
		break;
	}
	array_push($returnData->countries, $country);
	$region = $country->region;
	if (key_exists($region,$returnData->regions)){
		$returnData->regions[$region] += 1;
	} else{
		$returnData->regions[$region] = 1;
	}
	$subregion = $country->subregion;
	if (key_exists($subregion, $returnData->subregions)){
		$returnData->subregions[$subregion] +=1;
	} else {
		$returnData->subregions[$subregion] =1;
	}
}
usort($returnData->countries, "countryCmp");

$returnData->countryCount = count($returnData->countries);

echo json_encode($returnData);

function getData($url){
	try{
		$guzzle=new GuzzleHttp\Client();

		$response= $guzzle->request('GET',$url, ["query"=> ["fields"=> "name;alpha2Code;alpha3Code;flag;region;subregion;population;languages"]]);
		$data=$response->getBody()->getContents();
		return $data;
	} catch (Exception $e) {
	}
}

function countryCmp($a,$b){
	//country comparison, sort on names alphabetically then population
	if (strcmp($a->name, $b->name) == 0) {
		if ($a->population == $b->population) {
			return 0;
		}
		return ($a->population < $b->population) ? -1 : 1;
	}
	return strcmp($a->name, $b->name);
}
?>

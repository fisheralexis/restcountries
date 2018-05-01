/*  behavior.js
 *  Alexis Fisher
 *  alexis.fisher@gmail.com
 *  5/1/2018
 *  
 *  performs the search and displays results
 *
 */
function search(){
	//get the input
	var searchString = document.getElementById("search").value.trim();
	//validate input
	if (searchString.length == 0){
		//shortcut
		displayError();
		exit;
	}
	hideError();
	//do the search
	results = doSearch(searchString);	
	//call results with the result json
	displayResults(results);
}

function doSearch(searchString = ""){
	// Creates and performs the HTML request.  
	// This is currently synchronous, could be moved to asynchronous.
	var req = new XMLHttpRequest();
	var requestURL="/api/"+searchString;
	req.open("GET",requestURL, false);
	req.send();
	return req.responseText;
}

function displayResults(results){
	//display and populate the results div
	hideError();
	var resultsDiv = document.getElementById("results");
	resultsDiv.innerHTML="";
	resultsDiv.style.display = "block";
	if (results.length == 0) {
		displayError();
		exit;
	}
	var data = JSON.parse(results);
	//name;alpha2Code;alpha3Code;flag;region;subregion;population;languages

	var table=" <table> <tr><th>Flag</th> <th>Country</th> <th>Code 2</th> <th>Code 3</th>";
	table+="<th>Region</th> <th>Subregion</th> <th>Population</th> <th>Languages</th></tr> ";
	for(var i = 0; i < data.countries.length; i++){
		var country = data.countries[i];
		var row= "<tr> <td> <img src="+country.flag +"></td>"; 
		row += "<td>"+country.name + "</td><td>" + country.alpha2Code + "</td><td>";
		row += country.alpha3Code + "</td><td>" + country.region + "</td><td>" + country.subregion;
		row += "</td><td>" + country.population + "</td><td>";
		for (var l = 0; l < country.languages.length; l++){
			row += country.languages[l].name;
			if (l < country.languages.length -1 ){
				row += ", ";
			}
		}
		row += "</td> </tr>";
		table += row;
	}
	table+="</table>";
	resultsDiv.innerHTML = table;
	if (data.countryCount > 1){
		resultsDiv.innerHTML+="<h3>"+data.countryCount +" Countries</h3>";
	}else{
		resultsDiv.innerHTML+="<br>" + "<h3>1 Country</h3>";
	}
	table = "<table><tr> <th>Region</th> <th>Count</th></tr>";
	for(var key in data.regions)
	{
		table+="<tr><td>" + key + "</td><td>" + data.regions[key] + "</td></tr>";
	}
	table += "</table>"
	resultsDiv.innerHTML+= table;

	table = "<table><tr> <th>Subregion</th> <th>Count</th></tr>";
	for (var key in data.subregions){
		table+="<tr><td>" + key + "</td><td>" + data.subregions[key] + "</td></tr>";
	}
	table += "</table>"
	resultsDiv.innerHTML+= table;
	
}
function hideResults(){
	//clear and hide the results div
	var resultsDiv = document.getElementById("results");
	resultsDiv.innerHTML="";
	resultsDiv.style.display = "none";
}

function displayError(){
	//display the error div and message
	var errorDiv = document.getElementById("error");
	hideResults();
	errorDiv.innerHTML = "<h2>Error!</h2>"
	errorDiv.style.display = "block";

}
function hideError(){
	//clear and hide the error div
	var errorDiv = document.getElementById("error");
	errorDiv.innerHTML = "";
	errorDiv.style.display = "none";
}

function onBodyLoad(){
	//hide the result and error div 
	hideError();
	hideResults();
}

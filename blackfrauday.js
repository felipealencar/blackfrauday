// Copyright (c) 2014 Felipe Alencar Lopes. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var url =  "http://sistemas.procon.sp.gov.br/evitesite/list/evitesite.php?action=list&jtStartIndex=0&jtPageSize=600&jtSorting=strSite%20ASC";
var sitesProcon = [];
function getBlockedSites(){
	$.getJSON(url, null, function(records) {
		records["Records"].forEach(function(entry) {
			if(entry["strSite"].length > 0){
				sitesProcon.push(entry["strSite"]);
				sitesProcon.push('http://'+entry["strSite"]+"/*");
				sitesProcon.push('www.'+entry["strSite"]+"/*");
			}
			
		});
	}).done(function() {
		sitesProcon = sitesProcon.join(', ');
		chrome.webRequest.onBeforeRequest.addListener(
			function(details) {
				var uri = new URI(details.url);
				var i=0;
				if(i==0){
					//Add some interaction with the user
					i++;	 
				}
				
				//Verify if it is a short URL (needs a review) && Verify if the url requested is suspected.
				if((uri.hostname().length > 7) && (sitesProcon.indexOf(uri.hostname()) >= 0))
					return { cancel: true };
			},
			{urls: ["<all_urls>"]},
			["blocking"]
		);
	});	
}

$(document).ready(function() {
	getBlockedSites();
});




// Copyright (c) 2014 Felipe Alencar Lopes. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var url =  "http://sistemas.procon.sp.gov.br/evitesite/list/evitesite.php?action=list&jtStartIndex=0&jtPageSize=600&jtSorting=strSite%20ASC";
var sitesProcon = [];
var i = 0;
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
					
					i++;	 
				}
				if(sitesProcon.indexOf(uri.hostname()) >= 0)
					return { cancel: true };
				// function endsWith(str, suffix) {
					// return str.indexOf(suffix, str.length - suffix.length) !== -1;
				// }
				// var hostname = URI(details.url).hostname();
				// var cancel = false;
				// for(var index in sitesProcon) {
					// if(URI(sitesProcon[index]).equals(hostname) === true ) {
						// cancel = true;
						// break;
					// }
				// }
				// if(cancel) {
				// }
			},
			{urls: ["<all_urls>"]},
			["blocking"]
		);
	});	
}

$(document).ready(function() {
	getBlockedSites();
});




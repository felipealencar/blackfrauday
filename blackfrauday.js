// Copyright (c) 2014 Felipe Alencar Lopes. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var url =  "http://sistemas.procon.sp.gov.br/evitesite/list/evitesite.php?action=list&jtStartIndex=0&jtPageSize=600&jtSorting=strSite%20ASC";
var sitesProcon = [];

function getBlockedSites(){
	$.getJSON(url, null, function(records) {
		records["Records"].forEach(function(entry) {
			sitesProcon.push('www.'+entry["strSite"]);
		});
	}).done(function() {
		chrome.webRequest.onBeforeRequest.addListener(
			function(details) {
				function endsWith(str, suffix) {
					return str.indexOf(suffix, str.length - suffix.length) !== -1;
				}
				var hostname = URI(details.url).hostname();
				var cancel = false;
				for(var index in sitesProcon) {
					if( endsWith(hostname, sitesProcon[index]) ) {
						alert("O site que você tentou acessar não é permitido pela extensão Black Frauday.");
						cancel = true;
						break;
					}
				}
				if(cancel) {
				}
				return { cancel: cancel };
			},
			{urls: ["<all_urls>"]},
			["blocking"]
		);
	});	
}

$(document).ready(function() {
	getBlockedSites();
});

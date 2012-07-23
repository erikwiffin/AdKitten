var lastTabId = 0,
	disableAdKittens = 0,
	showIcon, getRedirect;

chrome.pageAction.onClicked.addListener(function(tab) {
	disableAdKittens = !disableAdKittens;
	showIcon();
});
showIcon = function() {
	if (disableAdKittens) {
		chrome.pageAction.setIcon({
			"tabId": lastTabId,
			"path": "icon-off.jpg"
		});
	} else {
		chrome.pageAction.setIcon({
			"tabId": lastTabId,
			"path": "icon-on.jpg"
		});
	}
	chrome.pageAction.show(lastTabId);
};

chrome.tabs.onActivated.addListener(function(activeInfo) {
	lastTabId = activeInfo.tabId;
	showIcon();
});
chrome.tabs.onCreated.addListener(function(tab) {
	lastTabId = tab.id;
	showIcon();
});
chrome.tabs.onUpdated.addListener(function(tabId) {
	lastTabId = tabId;
	showIcon();
});

getRedirect = function(width, height) {
	var redirectUrl;
	redirectUrl = ["http://placekitten.com/",
						(parseInt(width) + parseInt(Math.random() * 10)),
						"/",
						(parseInt(height) + parseInt(Math.random() * 10))
					].join('');
	// Redirect the request to a placekitten url
	return {redirectUrl: redirectUrl};
};

chrome.webRequest.onBeforeRequest.addListener(
	function(info) {
		var ad, adA, adB,
			regexA = /.*(728|468|336|300|250|200|160|120)x(600|280|250|200|100|90|60).*/,
			regexB = /wi?.(728|468|336|300|250|200|160|120).*hi?.(600|280|250|200|100|90|60)/,
			regexCA = /w=(728|468|336|300|250|200|160|120)/,
			regexCB = /h=(600|280|250|200|100|90|60)/,
			regexD = /size=(728|468|336|300|250|200|160|120)(600|280|250|200|100|90|60)/;
		if (disableAdKittens) {
			return {};
		}
		if (ad = info.url.match(regexA)) {
			return getRedirect(ad[1], ad[2]);
		}
		if (ad = info.url.match(regexB)) {
			return getRedirect(ad[1], ad[2]);
		}
		if ((adA = info.url.match(regexCA))
			&& (adB = info.url.match(regexCB)))
		{
			return getRedirect(adA[1], adB[1]);
		}
		if (ad = info.url.match(regexD)) {
			return getRedirect(ad[1], ad[2]);
		}
		return {};
	},
	// filters
	{
		urls: [
			"<all_urls>",
		],
		types: ["sub_frame", "object"]
	},
	// extraInfoSpec
	["blocking"]);

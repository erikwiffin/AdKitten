var lastTabId = 0,
	disableAdKittens = 0,
	showIcon;

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

chrome.webRequest.onBeforeRequest.addListener(
	function(info) {
		var ad, redirectUrl, offset,
			regexA = /.*(728|468|336|300|250|200|160|120)x(600|280|250|200|100|90|60).*/,
			regexB = /wi.(728|468|336|300|250|200|160|120).*hi.(600|280|250|200|100|90|60).*/;
		if (disableAdKittens) {
			return {};
		}
		if (ad = info.url.match(regexA)) {
			offset = (10 * Math.random()).toFixed();
			redirectUrl = ["http://placekitten.com/",
				(parseInt(ad[1]) + parseInt(offset)),
				"/",
				(parseInt(ad[2]) + parseInt(offset))
				].join('');
			// Redirect the request to a placekitten url
			return {redirectUrl: redirectUrl};
		}
		if (ad = info.url.match(regexB)) {
			offset = (10 * Math.random()).toFixed();
			redirectUrl = ["http://placekitten.com/",
				(parseInt(ad[1]) + parseInt(offset)),
				"/",
				(parseInt(ad[2]) + parseInt(offset))
				].join('');
			// Redirect the response to a placekitten url
			return {redirectUrl: redirectUrl};
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

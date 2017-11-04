'use strict'

pushpush.getCurrentTabUrl = function (info, tab, callback, done) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
        var tab = tabs[0];
        var object = pushpush.buildLinkObject(tab.title, tab.url);
        callback(object, done);
    });
};

pushpush.buildMenu = function () {
    var parentMenu = chrome.contextMenus.create({ "title": "PushPush" });

    chrome.contextMenus.create({
        "parentId": parentMenu,
        "title": "Push this page",
        "contexts": ["all"],
        "onclick": function (info, tab) {
            pushpush.getCurrentTabUrl(info, tab, pushpush.postMessage, function (message) {
                pushpush.log('Done!');
            });
        }
    });

    chrome.contextMenus.create({
        "parentId": parentMenu,
        "title": "Clear all notifications",
        "contexts": ["all"],
        "onclick": function (info, tab) {
            chrome.notifications.getAll((items) => {
                if (items) {
                    for (let key in items) {
                        chrome.notifications.clear(key);
                    }
                }
            });
        }
    });
};

pushpush.buildMenu();
pushpush.getRecipientsFromApi();

chrome.gcm.onMessage.addListener(pushpush.gcmMessageReceived);
chrome.runtime.onInstalled.addListener(pushpush.firstTimeGcmRegistration);
chrome.runtime.onStartup.addListener(pushpush.firstTimeGcmRegistration);

chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
    if (!pushpush.currentPayload) {
        return;
    }

    if (buttonIndex === 1) {
        chrome.notifications.clear(notificationId);
        return;
    }

    if (pushpush.currentPayload.type === "link") {
        if (buttonIndex === 0) {
            chrome.tabs.create({ url: pushpush.currentPayload.message });
            chrome.notifications.clear(notificationId);
        }
    }

    if (pushpush.currentPayload.type === "note") {
        if (buttonIndex === 0) {
            chrome.tabs.create({ url: "note.html?message=" + pushpush.currentPayload.message });
            chrome.notifications.clear(notificationId);
        }
    }
});

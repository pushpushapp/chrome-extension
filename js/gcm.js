'use strict'

pushpush.gcmMessageReceived = function (message) {
    var data = message.data;
    pushpush.currentPayload = data;

    var notificationMessage = data.message;
    var type = data.type;
    if (type === "sms" || type === "task" || data.from_device === "chrome") {
        return;
    }

    var buttons = [];
    if (type === "note") {
        buttons.push({ title: "View note" });
    }

    if (type === "link") {
        buttons.push({ title: "Open link" });
    }

    buttons.push({ title: "Close" });

    var options = {
        type: "basic",
        title: data.title || "PushPush",
        message: notificationMessage,
        iconUrl: "icon_48.png",
        isClickable: type === "link",
        buttons: buttons,
        requireInteraction: true,
        contextMessage: (new Date()).toLocaleDateString().replace(/:\d+ /, ' ')
    };

    var notificationTime = (new Date().getTime() / 1000).toString();
    chrome.notifications.create(notificationTime, options);
};

pushpush.firstTimeGcmRegistration = function () {
    var senderIds = [];
    chrome.storage.sync.get({ sender_id: null }, function (items) {
        if (items.sender_id === null || items.sender_id === '') {
            Materialize.toast('No sender ID configured. Please set one in Options.', 4000);
        } else {
            senderIds.push(items.sender_id);
            chrome.gcm.register(senderIds, pushpush.gcmRegisterCallback);
            pushpush.setGcmRegistered();
        }
    });
};

pushpush.gcmRegisterCallback = function (registrationId) {
    console.log(registrationId);
};
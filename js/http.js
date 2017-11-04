'use strict';

pushpush.onResponse = function (status, body, done) {
    if (status == 200) {
        try {
            done(JSON.parse(body));
        } catch (e) {
            done();
        }
    } else if (status === 401) {
        // sign out
    } else if (status === 400) {
        try {
            done(null, JSON.parse(body).error);
        } catch (e) {
            done();
        }
    } else {
        done();
    }
};

pushpush.buildXhr = function (method, url, done) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-User-Agent', 'PushPush Chrome');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            pushpush.onResponse(xhr.status, xhr.responseText, done);
        }
    };

    return xhr;
}

pushpush.postToApi = function (url, object, done) {
    var xhr = pushpush.buildXhr('POST', url, done);
    chrome.storage.sync.get({
        basic_auth_header: null
    }, function (items) {
        if (items.basic_auth_header === null || items.basic_auth_header === '') {
            Materialize.toast('No auth header configured. Please set one in Options.', 4000);
        } else {
            xhr.setRequestHeader('Authorization', items.basic_auth_header);
            xhr.send(JSON.stringify(object));
        }
    });
};

pushpush.postMessage = function (object, done) {
    chrome.storage.sync.get({
        messages_url: null
    }, function (items) {
        if (items.messages_url === null || items.messages_url === '') {
            Materialize.toast('No messages API endpoint configured. Please set one in Options.', 4000);
        } else {
            pushpush.postToApi(items.messages_url, object, done);
        }
    });
};

pushpush.getRecipientsFromApi = function () {
    chrome.storage.sync.get({
        contacts_url: null
    }, function (items) {
        if (items.contacts_url === null || items.contacts_url === '') {
            Materialize.toast('No contacts API endpoint configured. Please set one in Options.', 4000);
        } else {
            pushpush.postToApi(items.contacts_url, {}, function (list) {
                if (list !== undefined) {
                    pushpush.setRecipients(list);
                }
            });
        }
    });
};
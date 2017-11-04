'use strict';

var pushpush = {};
pushpush.currentPayload = {};

pushpush.log = function (message) {
    var line;
    if (message instanceof Object || message instanceof Array) {
        line = message;
    } else {
        line = new Date().toLocaleString() + ' - ' + message;
    }

    console.log(line);
};

pushpush.buildLinkObject = function (title, url) {
    return {
        "title": title,
        "message": url,
        "type": "link",
        "from_device": "chrome"
    };
};

pushpush.buildSmsObject = function (to, message) {
    return {
        "to": to,
        "message": message,
        "type": "sms",
        "from_device": "chrome"
    };
};

pushpush.buildTaskObject = function (task, task_data) {
    return {
        "type": "task",
        "task": task,
        "task_data": task_data,
        "from_device": "chrome"
    };
};
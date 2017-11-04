'use strict';

const GCM_REGISTERED = 'gcm_registered';
const USER_RECIPIENTS = 'user_recipients';

pushpush.getArrayFromLocalStorage = function (key) {
    var storedArray = localStorage.getItem(key);
    return storedArray === null ? [] : JSON.parse(storedArray);
};

pushpush.saveArrayToLocalStorage = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
};

pushpush.setGcmRegistered = function () {
    localStorage.setItem(GCM_REGISTERED, 'true');
};

pushpush.isGcmRegistered = function () {
    return localStorage.getItem(GCM_REGISTERED);
};

pushpush.getRecipients = function () {
    return pushpush.getArrayFromLocalStorage(USER_RECIPIENTS);
};

pushpush.setRecipients = function (recipients) {
    pushpush.saveArrayToLocalStorage(USER_RECIPIENTS, recipients);
};
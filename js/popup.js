'use strict'

$(function () {
    $('select').material_select();
    Materialize.updateTextFields();

    $('#submit').click(function (e) {
        e.preventDefault();
        var to = $('#friends').val();
        var message = $('#message').val();

        var object = pushpush.buildSmsObject(to, message);
        pushpush.postMessage(object, function () {
            Materialize.toast('Sent!', 4000);
        });
    });

    hookUpTaskButton('#find-my-phone', 'findmyphone', 'Good luck finding your phone!');
    hookUpTaskButton('#toggle-wifi', 'togglewifi', 'Toggled!');
    hookUpTaskButton('#toggle-bluetooth', 'togglebluetooth', 'Toggled!');

    var $friendsList = $('#friends');
    if ($friendsList) {
        var friends = pushpush.getRecipients();
        $.each(friends, function (index, value) {
            $friendsList.append($('<option>').text(value.name).attr('value', value.phone_number));
            $('select').material_select();
        });
    }

    $('#message').keyup(updateCount);
    $('#message').keydown(updateCount);

    $('#clear-all-notifications-link').click(function (e) {
        e.preventDefault();
        chrome.notifications.getAll((items) => {
            if (items) {
                for (let key in items) {
                    chrome.notifications.clear(key);
                }
            }
        });
    });

    $('#popout-link').click(function (e) {
        e.preventDefault();
        chrome.tabs.create({ url: 'popup.html' });
    });

    $('#options-link').click(function (e) {
        e.preventDefault();
        chrome.tabs.create({ url: 'options.html' });
    });
});

var updateCount = function () {
    var characterCount = $(this).val().length;
    $('#characterCount').text(characterCount);
};

function hookUpTaskButton(id, task, doneMessage) {
    $(id).click(function () {
        var object = pushpush.buildTaskObject(task, null);
        pushpush.postMessage(object, function () {
            Materialize.toast(doneMessage, 4000);
        });
    });
}
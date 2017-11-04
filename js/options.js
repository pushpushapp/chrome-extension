$(function () {
    chrome.storage.sync.get({
        contacts_url: null,
        messages_url: null,
        sender_id: null,
        basic_auth_header: null
    }, function (items) {
        $('#contacts-url').val(items.contacts_url);
        $('#messages-url').val(items.messages_url);
        $('#sender-id').val(items.sender_id);
        $('#basic-auth-header').val(items.basic_auth_header);
        Materialize.updateTextFields();
    });

    $('#save-options').click(function (e) {
        e.preventDefault();

        chrome.storage.sync.set({
            contacts_url: $('#contacts-url').val(),
            messages_url: $('#messages-url').val(),
            sender_id: $('#sender-id').val(),
            basic_auth_header: $('#basic-auth-header').val()
        }, function () {
            Materialize.toast('Options saved!', 4000);
        });
    });
});
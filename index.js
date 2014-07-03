var mcapi = require('mailchimp-api');

module.exports = cochimp;

function cochimp(mailChimpKey) {

    var mc = new mcapi.Mailchimp(mailChimpKey);

    function list(mailChimpListId) {
        return yield thunkifyList({
            filters: {
                list_id: mailChimpListId
            }
        });
    }

    /**
     * Subscribe a subsciber to a mailchimp list given by id.
     * Structure of subsciber should be:
     * {
     *   email: "co-mailchimp@example.com",
     *   merge_vars: {
     *     FNAME: "Firstname",
     *     LNAME: "Lastname",
     *     MERGEFIELD1: "Your created merge field"
     *   },
     *   ...
     *   see documentation on mailchimp website
     * }
     *
     * @param mailChimpListId id of mailchimp list
     * @param subscriber object related to mailchimp api
     */
    function subscribe(mailChimpListId, subscriber) {

        return yield thunkifySubscribe({
            id: mailChimpListId,
            email: {
                email: subscriber.email,
                euid: subscriber.email,
                leid: subscriber.email
            },
            merge_vars: subscriber.merge_vars,
            double_optin: false
        });
    }
}



function thunkifySubscribe(options) {
    return function(fn) {
        mc.lists.subscribe(options, function(data) {
            fn(null, data);
        }, function(err) {
            fn(err, null);
        });
    }
}

function thunkifyList(options) {
    return function(fn) {
        mc.lists.list(options, function(data) {
            fn(null, data);
        }, function(err) {
            if (err) return fn(err);
        });
    }
}
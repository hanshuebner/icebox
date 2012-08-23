var icebox = require('../lib/icebox');
var buster = require("buster");

buster.testCase("Date support", {
    "Date is preserved through freeze/thaw": function() {
        var timestamp = new Date();
        var original = { timestamp: timestamp };
        var frozen = icebox.freeze(original);
        var thawed = icebox.thaw(frozen);
        assert.equals(timestamp.getTime(), thawed.timestamp.getTime(), 'Date object could not be restored');
    },
    "same Date serialized two times yields same frozen representation": function() {
        var data = { now: new Date() };
        assert.equals(icebox.freeze(data), icebox.freeze(data), 'Same object containing Date yielded different external representations');
    }
});
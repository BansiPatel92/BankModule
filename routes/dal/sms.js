var method = sms.prototype;

function sms() {}

method.addSMSDetails = function (data, fn) {
    console.log("data............",data);
    try {
        var cnn = require('./db');
        var sqlquery = 'insert into tbl_sms_detail ';
        sqlquery += '(int_id,int_batch_id,int_msg_id,str_msg_content,int_msg_balance,str_recipient,str_sender,bit_msg_status,int_msg_cost,dt_created_on) ';
        sqlquery += 'values(:sms_id,:batch_id,:msg_id,:msg_content,:msg_balance, :recipient ,:sender,:msg_status,:msg_cost,:createdOn)';
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data)).on("result", function (result) {
            if (result.info.affectedRows == 1) {
                fn(null, result.info.insertId);
                cnn.end();
            } else {
                fn(null, 0);
                cnn.end();
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

module.exports = sms;
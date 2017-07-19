var method = applicationstatus.prototype;

function applicationstatus() {
    this.applicationId = 0;
    this.statusId = 0;
    this.isCurrent = 0;
    this.updatedOn = new Date();
}

method.addStatus = function (data, fn) {
    try {
        var cnn = require('./db');
        
        var sqlquery = 'update tbl_applications_status set bit_is_current = 0, dt_updated_on = :updatedOn ,int_status_id =:statusId Where int_application_id = :applicationId and bit_is_current = 1; ';
        
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data)).on("result", function (result) {
            
            sqlquery = 'insert into tbl_applications_status(int_application_id,int_status_id,bit_is_current,dt_created_on,dt_updated_on) ';
            sqlquery += 'values(:applicationId,:statusId,:isCurrent,:updatedOn,:updatedOn); ';
            
            var prep = cnn.prepare(sqlquery);
            cnn.query(prep(data)).on("result", function (result) {
                console.log("-----------------rows updated ---------",result.info.affectedRows);
                if (result.info.affectedRows == 1) {
                    fn(null, result.info.insertId);
                    cnn.end();
                } else {
                    fn(null, 0);
                    cnn.end();
                }
            });
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

module.exports = applicationstatus;
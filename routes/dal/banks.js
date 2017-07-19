var method = banks.prototype;

function bankDetails() {
    this.id = 0;
    this.userId = 0;
    this.name = "";
    this.logo = "";
    this.createdOn = new Date();
    this.createdBy = 0;
    this.updatedOn = new Date();
    this.updatedBy = 0;
}

function banks() {
    this.email = "";
    this.password = "";
    this.userId = 0;
    this.bankId = 0;
    this.firstName = "";
    this.lastName = "";
}

method.getBanks = function (fn) {
    try {
        var cnn = require('./db');
        var prep = cnn.prepare('Select int_id as Id, str_name as Name, str_logo as Logo from tbl_banks;');
        cnn.query(prep(), function (err, rows) {
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                var banksList = [];
                for (i = 0; i < rows.length; i++) {
                    var bank = new bankDetails();
                    bank.id = rows[i].Id;
                    bank.name = rows[i].Name;
                    bank.logo = rows[i].Logo;
                    banksList.push(bank);
                }
                fn(null, banksList);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.login = function (data, fn) {
    try {
        var cnn = require('./db');
        var prep = cnn.prepare('Select TU.int_id,TU.str_first_name,TU.str_last_name,TU.str_email,TB.int_id as bankId,TB.str_logo ' +  
                               'from tbl_users TU inner join tbl_banks_branches_users TBBU on TU.int_id = TBBU.int_user_id ' + 
                               'inner join tbl_banks_branches TBB on TBBU.int_branch_id = TBB.int_id ' +
                               'inner join tbl_banks TB on TB.int_id = TBB.int_banks_id ' + 
                               'where TU.str_email = :email and BINARY TU.str_password = :password and TU.bln_is_active = 1');
        
        var applicationList = [];
        cnn.query(prep(data), function (err, rows) {
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                
                if (rows.length > 0) {
                    var bank = new banks();
                    bank.bankId = rows[0].bankId;
                    bank.userId = rows[0].int_id;
                    bank.firstName = rows[0].str_first_name;
                    bank.lastName = rows[0].str_last_name;
                    bank.email = rows[0].str_email;
                    bank.logo = rows[0].str_logo;
                    
                    fn(null, bank);
                }
                else
                    fn(null, null);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

module.exports = banks;
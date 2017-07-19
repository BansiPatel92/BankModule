var method = users.prototype;

function users() {
    this.id = 0;
    this.userType = 0;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.address1 = '';
    this.address2 = '';
    this.city = '';
    this.state = '';
    this.zip = '';
    this.country = '';
    this.phone = '';
    this.profileImageName = '';
    this.isActive = 0;
    this.isguest = 0;
    this.createdOn = '';
    this.updatedOn = '';
}

method.saveUserAndSocialDetailWithOTP = function (data, fn) {
    try {

        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';

        var d = new Date();
        data.created_on = d.toMysqlFormat();
        data.validTill = data.created_on;
        data.created_by = 0;
        var cnn = require('./db');

        data.setActive = 0;
        data.isActive = 1;
        data.updatedOn = datestring;
        data.email = data.email.toLowerCase();

        checkOTPwithUserEmail(cnn, data, function (err, params) {
            if (!err) {
                if (params == 1) {
                    addDataTOUser(cnn, data, function (err1, rowc1) {
                        if (err1 == null && rowc1 > 0) {
                            data.user_id = rowc1;
                            if (data.media) {
                                data.detail = JSON.stringify(data.detail);
                                //inserting into social media table
                                addDataTOUserSocialMediaDetail(cnn, data, function (err2, rowc2) {
                                    if (err2 == null && rowc2 > 0) {
                                        cnn.end();
                                        fn(null, parseInt(data.user_id));
                                    } else {
                                        cnn.end();
                                        fn(null, parseInt(data.user_id));
                                    }
                                });
                            } else {
                                fn(null, parseInt(data.user_id));
                            }
                        } else {
                            cnn.end();
                            //user insert fails
                            fn(null, -1);
                        }
                    });
                } else {
                    cnn.end();
                    //otp fails
                    fn(null, -2);
                }
            } else {
                cnn.end();
                fn(err, 0);
            }
        })

    } catch (err) {
        fn(err, 0);
    }
}

//old
method.saveUserAndSocialDetail = function (data, fn) {
    try {
        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        var cnn = require('./db');
        //var data = req.body;
        data.created_on = datestring + ':00';
        data.created_by = 0;
        //data.user_type = 0;
        //data.is_guest = 0;
        //Check for unique email
        data.email = data.email.toLowerCase();
        checkForUniqueEmail(cnn, data.email, function (err, rowc) {
            if (err == null && rowc.length == 0) {
                //Inserting into user table
                addDataTOUser(cnn, data, function (err1, rowc1) {
                    if (err1 == null && rowc1 > 0) {
                        data.user_id = rowc1;
                        if (data.media) {
                            data.detail = JSON.stringify(data.detail);
                            //inserting into social media table
                            addDataTOUserSocialMediaDetail(cnn, data, function (err2, rowc2) {
                                if (err2 == null && rowc2 > 0) {
                                    cnn.end();
                                    fn(null, data.user_id);
                                } else {
                                    cnn.end();
                                    fn(null, data.user_id);
                                }
                            });
                        } else {
                            fn(null, data.user_id);
                        }
                    } else {
                        cnn.end();
                        fn(null, '-1');
                    }
                });
            } else {
                data.user_id = rowc[0].id;
                data.detail = JSON.stringify(data.detail);
                //inserting into social media table
                addDataTOUserSocialMediaDetail(cnn, data, function (err2, rowc2) {
                    if (err2 == null && rowc2 > 0) {
                        cnn.end();
                        fn(null, data.user_id);
                    } else {
                        cnn.end();
                        fn(null, '-1');
                    }
                });
            }
        });
    } catch (err) {
        fn(err, null);
    }
}

function checkOTPwithUserEmail(cnn, data, fn) {
    data.email = data.email.toLowerCase();
    try {
        var sqlquery = 'update tbl_user_otp set bln_is_active = :setActive,dt_updated_on = :updatedOn ';
        sqlquery += 'where str_email = :email and str_otp = :otp and ' +
            'bln_is_active = :isActive and dt_valid_till > :validTill';
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {

            if (!err && rows) {
                fn(err, rows.info.affectedRows);
            }
            else
                fn(err, null);
        });
    } catch (err) {
        fn(err, null);
    }
}

method.getUserFromUserEmail = function (email, fn) {
    try {
        email = email.toLowerCase();
        var cnn = require('./db');
        var prep = cnn.prepare('select int_id,int_user_type,str_first_name,str_last_name,str_email, str_phone from tbl_users ' +
            'where str_email = :email');
        cnn.query(prep({ email: email }), function (err, rows) {
            if (err) {
                console.log(err);
                fn(err, null);
            } else {
                var user = new users();

                for (i = 0; i < rows.length; i++) {
                    user.id = rows[i].int_id;
                    user.userType = rows[i].int_user_type;
                    user.firstName = rows[i].str_first_name;
                    user.lastName = rows[i].str_last_name;
                    user.email = rows[i].str_email;
                    user.phone = rows[i].str_phone;
                }
                fn(err, user);
            }
            //return rows[0].count;
        });
    }
    catch (err) {
        console.log(err);
        fn(err, 0);
    }
}

function checkForUniqueEmail(cnn, email, fn) {
    try {
        email = email.toLowerCase();
        var prep = cnn.prepare('select int_id,int_user_type,str_first_name,str_last_name,str_email,bln_is_guest from tbl_users ' +
            'where str_email = :email');
        cnn.query(prep({ email: email }), function (err, rows) {
            if (err) {
                console.log(err);
                fn(err, null);
            } else {
                fn(null, rows);
            }
            //return rows[0].count;
        });
    }
    catch (err) {
        console.log(err);
        fn(err, 0);
    }
}

function addDataTOUser(cnn, data, fn) {

    try {
        data.email = data.email.toLowerCase();
        var sqlquery = 'insert into tbl_users';
        sqlquery += '(int_user_type,str_first_name,str_last_name,str_email,str_phone,str_password,dt_created_on,dt_updated_on,bln_is_guest)';
        sqlquery += 'values(:user_type,:first_name,:last_name,:email,:phone,:password,:created_on,:created_on,:is_guest)';

        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data)).on("result", function (result) {

            if (result.info.affectedRows == 1) {
                fn(null, result.info.insertId);
                //return result.info.insertId;
            } else {
                fn(null, 0);
                //return 0;
            }
        });
    } catch (err) {
        console.log(err);
        //return 0;
        fn(e, 0);
    }
}

function SendUserRegistrationEmail(email, firstName, lastName, phoneNumber) {
    fs.readFile('./email_templates/RupeeFin_Registration.html', 'utf8', function (err, filedata) {
        if (err) {
            console.log(err);
        }

        filedata = filedata.replace('[FIRST_NAME]', firstName);
        filedata = filedata.replace('[USER_NAME]', 'Name: ' + firstName + ' ' + lastName);
        filedata = filedata.replace('[USER_PHONE_NUMBER]', 'Phone: ' + phoneNumber);

        var emailData = {
            'to': email,
            "from": 'RupeeFin Notification<no-reply@rupeefin.com>',
            'subject': 'RupeeFin One Time Password(OTP)',
            'html': filedata,
            'replyTo': ''
        };

        var mailgun = new mailguns();
        mailgun.sendmail(emailData, function (err, param1) {
            if (err) {
                console.log(err);
            }
        });
    });
}

method.addDataTOUserSocialMediaDetail = function (data, fn) {
    try {
        var cnn = require('./db');
        addDataTOUserSocialMediaDetail(cnn, data, fn);
    } catch (err) {
        console.log(err);
        fn(e, 0);
    }
}

function addDataTOUserSocialMediaDetail(cnn, data, fn) {
    try {
        var sqlquery1 = 'select int_id from tbl_user_social_media_detail ';
        sqlquery1 += 'where int_user_id=:user_id and str_media = :media';
        var prep1 = cnn.prepare(sqlquery1);

        cnn.query(prep1(data), function (err, rows) {
            var sqlquery2 = '';
            if (!err) {
                if (rows.length > 0) {
                    sqlquery2 = 'update tbl_user_social_media_detail ';
                    sqlquery2 += 'Set str_detail= :detail where id=:id';
                    data.id = rows[0].id;
                } else {
                    sqlquery2 = 'insert into tbl_user_social_media_detail';
                    sqlquery2 += '(int_user_id,str_media,str_media_id,str_detail)';
                    sqlquery2 += 'values(:user_id,:media,:mid,:detail)';
                }
                //db call
                var prep2 = cnn.prepare(sqlquery2);
                cnn.query(prep2(data))
                    .on("result", function (result) {
                        if (result.info.affectedRows == 1) {
                            fn(null, 1);
                        } else {
                            fn(null, 2);
                        }
                    });
            } else {
                fn(err, 0);
            }

        });
    } catch (err) {
        console.log(err);
        fn(e, 0);
    }
}

method.checkUserByMediaId = function (data, fn) {
    try {
        var cnn = require('./db');
        var sqlquery1 = 'select u.int_id,u.int_user_type,u.str_first_name,u.str_last_name,u.str_email from tbl_user_social_media_detail umd ';
        sqlquery1 += 'inner join tbl_users u on u.int_id = umd.int_user_id ';
        sqlquery1 += 'where umd.str_media_id=:mid';
        var prep1 = cnn.prepare(sqlquery1);
        cnn.query(prep1(data), function (err, rows) {
            if (!err && rows && rows.length > 0) {
                //fn(err, rows[0]);
                var user = new users();

                for (i = 0; i < rows.length; i++) {
                    user.id = rows[i].int_id;
                    user.userType = rows[i].int_user_type;
                    user.firstName = rows[i].str_first_name;
                    user.lastName = rows[i].str_last_name;
                    user.email = rows[i].str_email;
                }
                fn(err, user);
            }
            else
                fn(err, null);
        });
    } catch (err) {
        fn(err, null);
    }
}

method.checkEmailPassword = function (data, fn) {
    try {
        data.email = data.email.toLowerCase();
        var cnn = require('./db');
        var sqlquery1 = 'select int_id,int_user_type,str_first_name,str_last_name,str_email,str_phone,str_profile_image_name from tbl_users ';
        sqlquery1 += 'where str_email = :email and str_password = :password and int_user_type in (0,2) and bln_is_active = 1';
        var prep1 = cnn.prepare(sqlquery1);
        var sql = prep1(data);
        cnn.query(sql, function (err, rows) {
            if (!err && rows && rows.length > 0) {
                var user = new users();
                for (i = 0; i < rows.length; i++) {
                    user.id = rows[i].int_id;
                    user.userType = rows[i].int_user_type;
                    user.firstName = rows[i].str_first_name;
                    user.lastName = rows[i].str_last_name;
                    user.email = rows[i].str_email;
                    user.phone = rows[i].str_phone;
                    user.profileImageName = rows[i].str_profile_image_name;
                }
                fn(null, user);
            }
            else
                fn(err, null);
        });
    } catch (err) {
        fn(err, null);
    }
}

/* OPT */
method.saveOTPwithUser = function (data, fn) {
    try {
        if (data.email)
            data.email = data.email.toLowerCase();
        var cnn = require('./db');
        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';
        data.createdOn = datestring;
        data.updatedOn = datestring;
        //-1 for forgot password
        //0 to chec if user exists on sign up
        if (data.userId == 0 || data.userId == -1) {
            var prep = cnn.prepare('select * from tbl_users where str_email = :email');
            cnn.query(prep({ email: data.email }), function (err, rows) {
                if (err) {
                    console.log(err);
                    fn(err, null);
                } else {
                    if (rows.info.affectedRows == 0 && data.userId == -1) {
                        fn(err, -2);
                    } else if (rows.info.affectedRows == 0) {
                        insertOTPData(cnn, data, function (err, params) {
                            fn(err, params);
                        })
                    } else if (data.userId == -1) {
                        insertOTPData(cnn, data, function (err, params) {
                            params.firstName = rows[0].str_first_name;
                            params.mobile = rows[0].str_phone;
                            fn(err, params);
                        })
                    } else {
                        fn(err, -1);
                    }
                }
                //return rows[0].count;
            });
        } else {
            insertOTPData(cnn, data, function (err, params) {
                fn(err, params);
            })
        }

    } catch (err) {
        fn(err, null);
    }
}

function insertOTPData(cnn, data, fn) {
    var sqlquery = 'update tbl_user_otp set bln_is_active = 0,dt_updated_on = :updatedOn where int_user_id = :userId;'
    if (data.userId <= 0 && data.email) {
        data.email = data.email.toLowerCase();
        sqlquery = 'update tbl_user_otp set bln_is_active = 0,dt_updated_on = :updatedOn where str_email = :email;'
    }
    sqlquery += 'insert into tbl_user_otp (int_user_id,str_otp, str_email,dt_valid_till,dt_created_on,dt_updated_on)values';
    sqlquery += '(:userId,:otp,:email,:validTill, :createdOn, :updatedOn)';
    var prep = cnn.prepare(sqlquery);
    cnn.query(prep(data), function (err, rows) {
        if (!err && rows)
            fn(err, rows);
        else
            fn(err, null);
    });
}

method.saveReSendOTPwithUser = function (data, fn) {
    try {
        var cnn = require('./db');
        var sqlquery = 'update tbl_user_otp set bln_is_active = :set_active,dt_updated_on = :updatedOn where int_user_id = :user_id;'
        sqlquery += 'insert into tbl_user_otp (int_user_id,str_otp,dt_valid_till,dt_created_on,dt_updated_on)values';
        sqlquery += '(:userId,:otp,:validTill, :createdOn, :updatedOn)';
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {
            if (!err && rows[1].info.affectedRows)
                fn(err, rows);
            else
                fn(err, null);
        });
    } catch (err) {
        fn(err, null);
    }
}

method.checkOTPwithUser = function (data, fn) {
    try {
        var cnn = require('./db');

        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';

        data.updatedOn = datestring;

        var sqlquery = '';
        if (data.userId > 0 || data.userId != '-1') {
            sqlquery = 'update tbl_user_otp set bln_is_active = :setActive,dt_updated_on = :updatedOn ' +
                'where int_user_id = :userId and str_otp = :otp and ' +
                'bln_is_active = :isActive and dt_valid_till > :validTill';
        } else if ((data.userId == -1 || data.userId == '-1') && data.email) {
            data.email = data.email.toLowerCase();
            sqlquery = 'update tbl_user_otp set bln_is_active = :setActive,dt_updated_on = :updatedOn ' +
                'where str_email= :email and str_otp = :otp and ' +
                'bln_is_active = :isActive and dt_valid_till > :validTill';
        }
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {
            if (!err && rows)
                fn(err, rows);
            else
                fn(err, null);
        });
    } catch (err) {
        fn(err, null);
    }
}
/* /OPT */

method.changePassword = function (data, fn) {
    try {
        var cnn = require('./db');
        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';

        data.updatedOn = datestring;
        var sqlquery = '';
        if (data.userId > 0 && data.userId != '-1') {
            sqlquery = 'update tbl_users set ' +
                'str_password = :password, bln_is_guest = 0,dt_updated_on = :updatedOn where int_id = :userId';
        } else if ((data.userId == -1 && data.userId == '-1') && data.email) {
            data.email = data.email.toLowerCase();
            sqlquery = 'update tbl_users set ' +
                'str_password = :password, bln_is_guest = 0,dt_updated_on = :updatedOn where str_email = :email';
        }

        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {
            if (!err && rows)
                fn(err, rows);
            else
                fn(err, null);
        });
    } catch (err) {
        fn(err, null);
    }
}


//User by id
method.getUserById = function (data, fn) {
    try {
        var cnn = require('./db');
        var sqlquery = 'select int_id,int_user_type,str_first_name,str_last_name,str_email,str_phone, ' +
            'str_address1, str_address2, str_city, str_state, str_zip, str_country,str_password,str_profile_image_name, bln_is_active from tbl_users ';
        sqlquery += 'where int_id = :userId';
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {
            if (!err && rows) {
                //console.log(rows);
                var user = new users();

                for (i = 0; i < rows.length; i++) {
                    user.id = rows[i].int_id;
                    user.userType = rows[i].int_user_type;
                    user.firstName = rows[i].str_first_name;
                    user.lastName = rows[i].str_last_name;
                    user.email = rows[i].str_email;
                    user.phone = rows[i].str_phone;
                    user.address1 = rows[i].str_address1;
                    user.address2 = rows[i].str_address2;
                    user.city = rows[i].str_city;
                    user.state = rows[i].str_state;
                    user.zip = rows[i].str_zip;
                    user.country = rows[i].str_country;
                    user.password = rows[i].str_password;
                    user.isActive = rows[i].bln_is_active;
                    user.profileImageName = rows[i].str_profile_image_name;
                }
                console.log("2222222222",user);
                fn(err, user);
                //console.log(user);
            }
            else
                fn(err, null);
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.saveUseDetail = function (data, fn) {
    try {

        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

        var cnn = require('./db');
        //var data = req.body;
        if (typeof (data.created_on) != 'undefined')
            data.created_on = datestring + ':00';
        data.email = data.email.toLowerCase();

        //Check for unique email
        checkForUniqueEmail(cnn, data.email, function (err, rowc) {

            var parameters = {};
            parameters.user_id = 0;
            parameters.is_guest = 0;

            if (err == null && rowc.length == 0) {
                //Inserting into user table

                addDataTOUser(cnn, data, function (err1, rowc1) {

                    if (err1 == null && rowc1 > 0) {
                        parameters.user_id = rowc1;
                        parameters.is_guest = 1;

                        fn(null, parameters);
                        cnn.end();
                    } else {
                        parameters.user_id = '-1';
                        fn(null, parameters);
                        cnn.end();
                    }
                });
            } else {
                data.userId = rowc[0].int_id;
                if (typeof (data.userId) != 'undefined') {
                    updateUserPhone(cnn, data, function (err1, rowc1) {
                        if (err1) {
                            console.log(err1);
                        } else {
                        }
                    });
                }
                parameters.user_id = rowc[0].int_id;
                parameters.is_guest = rowc[0].bln_is_guest;
                fn(null, parameters);
                cnn.end();
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

function updateUserPhone(cnn, data, fn) {

    try {
        data.email = data.email.toLowerCase();
        var sqlquery = 'update tbl_users set str_phone= :mobile,dt_updated_on = :created_on where int_id = :userId;';

        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data)).on("result", function (result) {

            if (result.info.affectedRows == 1) {
                fn(null, result.info.insertId);
                //return result.info.insertId;
            } else {
                fn(null, 0);
                //return 0;
            }
        });
    } catch (err) {
        console.log(err);
        //return 0;
        fn(e, 0);
    }
}

method.updateUserDetail = function (data, fn) {
    try {

        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';
        data.updatedOn = datestring;

        if (data.email)
            data.email = data.email.toLowerCase();

        var cnn = require('./db');
        var sqlquery = 'update tbl_users set str_first_name = :firstName,' +
            'str_last_name = :lastName,str_email= :email,str_phone= :phone,' +
            'str_address1=:address1, str_address2=:address2, str_city=:city,' +
            'str_state=:state, str_zip=:zip, str_country=:country,dt_updated_on = :updatedOn where int_id = :userId;'
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {
            if (!err && rows.info.affectedRows)
                fn(err, rows);
            else
                fn(err, null);
        });

    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.updateUserEmail = function (data, fn) {
    try {
        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';
        data.updatedOn = datestring;

        if (data.email)
            data.email = data.email.toLowerCase();

        var cnn = require('./db');
        var sqlquery = 'update tbl_users set str_email= :email,dt_updated_on = :updatedOn where int_id = :userId;'
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {
            if (!err && rows.info.affectedRows)
                fn(err, rows);
            else
                fn(err, null);
        });

    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.updateProfileImage = function (data, fn) {
    try {
        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';
        data.updatedOn = datestring;

        var cnn = require('./db');
        var sqlquery = 'update tbl_users set str_profile_image_name= :profileImageName,dt_updated_on = :updatedOn where int_id = :userId;'
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {
            if (!err && rows.info.affectedRows)
                fn(err, rows);
            else
                fn(err, null);
        });

    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

method.saveUseDeviceDetail = function (data) {
    try {
        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';
        data.created_on = datestring;

        var cnn = require('./db');

        var sqlquery = 'insert into tbl_user_device_info';
        sqlquery += '(int_user_id,str_device_info,dt_created_on)';
        sqlquery += 'values(:user_id,:device_info,:created_on)';

        var prep = cnn.prepare(sqlquery);
        cnn.query( prep(data)).on("result", function (result) {

            if (result.info.affectedRows == 1) {
                console.info('user device_info', 'saved');
                //return result.info.insertId;
            } else {
                console.info('user device_info', 'fail to save');
                //return 0;
            }
        });
    } catch (err) {
        console.log(err);
    }
}

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
    //return this.getFullYear() + "-" + twoDigits(1 + this.getMonth()) + "-" + twoDigits(this.getDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + ":" + twoDigits(this.getSeconds());
};

module.exports = users;
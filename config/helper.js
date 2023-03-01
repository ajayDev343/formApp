const db = require('../models');
const user = db.users;
const config = require('./config');
const contant = require('../constant');
const crypto = require('crypto');
const path = require('path');
var uuid = require('uuid').v4;
const posts = db.posts;
const postsImages = db.postsImages;
const sequelize = require('sequelize');
const Op = sequelize.Op;
posts.hasMany(postsImages)
module.exports = {
	 isJson(item) {
    item = typeof item !== "string" ? JSON.stringify(item) : item;

    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (typeof item === "object" && item !== null) {
      return true;
    }

    return false;
  },
    vaildObject: async function (required, non_required, res) {
        let message = '';
        let empty = [];
        let table_name = (required.hasOwnProperty('table_name')) ? required.table_name : 'users';

        for (let key in required) {
            if (required.hasOwnProperty(key)) {
                if (required[key] == undefined || required[key] == '') {
                    empty.push(key);
                }
            }
        }

        if (empty.length != 0) {
            message = empty.toString();
            if (empty.length > 1) {
                message += " fields are required"
            } else {
                message += " field is required"
            }
            throw message

            res.status(400).json({
                'success': false,
                'message': message,
                'code': 400,
                'body': {}
            });
            return;
        } else {
            if (required.hasOwnProperty('security_key')) {
                if (required.security_key != "form@123$") {
                    message = "Invalid security key";
                    res.status(403).json({
                        'success': false,
                        'message': message,
                        'code': 403,
                        'body': []
                    });
                    res.end();
                    return false;
                }
            }

            if (required.hasOwnProperty('password')) {
                // const saltRounds = 10;
                // var myPromise = await new Promise(function (resolve, reject) {
                //     bcrypt.hash(required.password, saltRounds, function (err, hash) {
                //         if (!err) {

                //             resolve(hash);
                //         } else {
                //             reject('0');
                //         }
                //     });
                // });
                // // required.password= crypto.createHash('sha1').update(required.password).digest('hex');
                // required.password = myPromise;
                // required.password = await this.getBcryptHash(required.password);
            }

             if (required.hasOwnProperty('checkexit')) {
                if (required.checkexit === 1) {
                    if (required.hasOwnProperty('email')) {
                        required.email = required.email.toLowerCase();

                        if (await this.checking_availability(required.email, 'email', table_name)) {
                            message = "This email is already register kindly use another";
                            res.status(403).json({
                                'success': false,
                                'message': message,
                                'code': 403,
                                'body': []
                            });
                            res.end();
                            return false;
                        }
                    }
                    if (required.hasOwnProperty('phone') && required.phone != undefined) {
                        required.phone = required.phone.toLowerCase();

                        if (await this.checking_availability(required.phone, 'phone', table_phone)) {
                            message = "This phone number is already in use";
                            res.status(403).json({
                                'success': false,
                                'message': message,
                                'code': 403,
                                'body': []
                            });
                            return false;
                        }
                    }

                }
            }


            const marge_object = Object.assign(required, non_required);
            delete marge_object.checkexit;

            for (let data in marge_object) {
                if (marge_object[data] == undefined) {
                    delete marge_object[data];
                } else {
                    if (typeof marge_object[data] == 'string') {
                        marge_object[data] = marge_object[data].trim();
                    }
                }
            }

            return marge_object;
        }
    },
    checking_availability: async function (value, field, table_name) {

        try {
            const data = await table_name.findOne({
                where: {
                    field: value,
                }
            });
            return data;
        } catch (err) {
            throw err;
        }
    },

    error: function (res, err) {
        console.log(err);
        console.log('error');
        // console.log(JSON.stringify(ReferenceError));
        // console.log(ReferenceError);
        // return false;
        let code = (typeof err === 'object') ? ((err.statusCode) ? err.statusCode : ((err.code) ? err.code : 403)) : 403;
        let message = (typeof err === 'object') ? (err.message) : err;
        // console.log(code);
        // console.log(message);
        // return false;
        res.status(code).json({
            'success': false,
            'error_message': message,
            'code': code,
            'body': []
        });
    },

    getBcryptHash: async (keyword) => {
        const saltRounds = 10;
        var myPromise = await new Promise(function (resolve, reject) {
            bcrypt.hash(keyword, saltRounds, function (err, hash) {
                if (!err) {

                    resolve(hash);
                } else {
                    reject('0');
                }
            });
        });
        // required.password= crypto.createHash('sha1').update(required.password).digest('hex');
        keyword = myPromise;
        return keyword;
    },

    comparePass: async (requestPass, dbPass) => {
        const match = await bcrypt.compare(requestPass, dbPass);
        return match;
    },

    sendMail: function (object) {
        const nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport('gmail', contant.mail_auth);

        var mailOptions = object;
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                //console.log(info); 
                console.log('Email sent: ' + info.messageId);
            }
        });
    },
    Notification: async function (object) {
        var FCM = require('fcm-node');
        var serverKey = 'AAAAOc2KnHM:APA91bGZPJMFcwhK-TOpHN9yYlAzB_0S3B0Y_BcJgwpl65nYpx3ePgBAKxio4u7thneMMzXR_ROnaztlF1ujoSJS8IDhFfk4tb_nxh0-blNHVnDrD-IFBG2i9LI_Qc5dDLDrltCx6M9Q'; //put your server key here
        var fcm = new FCM(serverKey);

        const user_detail =await  user.findOne({
            attributes:['id','device_type','device_token'],
            where: {
              id: object.sent_to_id,
            }
          });
        // console.log(user_detail);

        if(!user_detail){
            return true;
        }else{
            // console.log(1);
            // user_detail.dataValues.device_token='dTSMuQYaTDuW-jKVWa3NmY:APA91bFq-WzLiNirbc_y670p9h_hzmJapXzzmjcfMRQPpDhtUN81sfElLIs2mqxFt-F06g7i2mJtNtf0q79lv5uOxKk644PW2fWOiSSorLNSCGoOm_GAvv3Q5SeNmizVh6NhVriH2GoS';
            if (user_detail.dataValues.device_token) {
                notification_obj = {
                        title: object.body,
                        badge:1,
                        sound: "default",
                        priority: "high",
                        notification_code: object.notification_code,
                        timeStamp:Math.floor(Date.now() / 1000),
                        Unread:""
                        // body: object.body
                };

                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    // to: 'fmjfYO5uTMOwziX3ZKO1zo:APA91bE6h0Q89zqO08gCN_p-RjuT5vZ0HZ0F0T35mR9aPwQJj4wH-F6CvuswrpHUpC0SJwpAqlhRDSYaNnZTAPHg14c6UcscIaZ6XjGepIIzzxl7gUFOuhX3LdebchC--b6rtEufQPrv',
                    prioriy: "high",                    
                    to : user_detail.dataValues.device_token,
                    notification: {
                                title: object.body,
                                badge:1,
                                sound: "default",
                                priority: "high",
                                notification_code: object.notification_code,
                                type: object.notification_code,
                                timeStamp:Math.floor(Date.now() / 1000),
                                Unread:""
                                // body: object.body
                        },

                    data: {
                      prioriy: "high",
                      body: {
                        type: object.notification_code,
                        data : object.sent_data,                        
                        title: object.body,
                        badge:1,
                        sound: "default",
                        notification_code: object.notification_code,
                        timeStamp:Math.floor(Date.now() / 1000),
                        Unread:""
                      },
                      notification:notification_obj,
                      type: object.notification_code,
                    },

                };
                // console.log(message);
                // return message;
                fcm.send(message, function (err, response) {
                    if (err) {
                        console.log(err);
                        console.log("Something has gone wrong!");
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });
            }
        }
        


    },
    userdetail: async function (userid) {

        try {
            const data = await user.findOne({
                attributes: [`id`, `username`,`socialId`,`loginType`,`register_time`,`user_type`,`gender`,`description`, `profile_image`, `phone`, `email`, `location`, `lat`,`lng`,`age`,`height`,`weight`,`position`,`relationship_status`,`looking_for`,`meet_at`,`accept_nsfw_pics`,`hiv`,`last_date`,`sexual_health_faq`,`instgram`,`twitter`,`facebook`, `device_type`, `device_token`],
                where: {
                    id: userid,
                }
            });
            return data;
        } catch (err) {
            throw err;
        }
    },
    postdetail: async function (userid,postid,req) {
    try {

            const postdata = await posts.findOne({
                attributes: [`id`, `userId`, `catId`, `description`, `status`,
                    [sequelize.literal('UNIX_TIMESTAMP(posts.createdAt)'), 'createdAt'],
                    [sequelize.literal('(SELECT ifnull(count(*),0)as count FROM `votecasting` WHERE `postId`=posts.id)'), 'totalvote'],
                    [sequelize.literal('(SELECT case when `profile_image`="" then "" else  CONCAT("http://' + req.get('host') + '/images/users/", profile_image) end as userimage FROM users where id = posts.userId)'), 'userimage'],
                    [sequelize.literal('(SELECT username FROM users where id = posts.userId)'), 'username'],
                    [sequelize.literal('(SELECT case when ifnull(count(*),0) = 0 then 0 else 1 end as count FROM `votecasting` WHERE `postId`=posts.id and userId=' + userid + ')'), 'is_vote'],
                ],
                where: {
                    status: 1,
                    id: postid,
                },
                include: [{
                    model: postsImages,
                    attributes: ['id',
                        [sequelize.literal('case when postsImages.`images`="" then "" else  CONCAT("http://' + req.get('host') + '/images/post/", postsImages.images) end'), 'images'],
                        [sequelize.literal('(SELECT case when ifnull(count(*),0) = 0 then 0 else 1 end as count FROM `votecasting` WHERE `imageId`=postsImages.id and userId=' + userid + ')'), 'is_imagevote'],
                        [sequelize.literal('(SELECT  ifnull(count(*),0) as count FROM `votecasting` WHERE `imageId`=postsImages.id)'), 'imagevote'],
                        [sequelize.literal('(SELECT ifnull(round((((SELECT ifnull(count(*),0)as count FROM `votecasting` WHERE `imageId`=postsImages.id) / (SELECT ifnull(count(*),0)as count FROM `votecasting` WHERE `postId`=posts.id)) * 100),2),0) )'), 'percentage'],
                    ],
                    on: {
                        col1: sequelize.where(sequelize.col('postsImages.postId'), '=', sequelize.col('posts.id')),
                    },
                }],
            });
            return postdata;
        } catch (err) {
            throw err;
        }
    },
    send_emails: function (otp, data, resu) {

        try {
            const nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'contactvcode007@gmail.com',
                    pass: '@Vcode@2021'
                }
            });
            var mailOptions = {
                from: app_name+' team',
                to: data.dataValues.email,
                subject: app_name+': Forgot password',
                html: 'Click here for change password <a href="http://localhost:1212/api/url_id/' + otp + '"> Click</a>'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(info);
                    res.send('Email send');
                }
            });
            return resu;
        } catch (err) {
            throw err;
        }
    },

    createSHA1: function () {
        let key = 'abc' + new Date().getTime();
        return crypto.createHash('sha1').update(key).digest('hex');
    },
    image_upload: function (image,table_name='users') {
        if (image) {
            var extension = path.extname(image.name);
            var filename = uuid() + extension;
            var sampleFile = image;
            sampleFile.mv(process.cwd() + '/public/images/'+table_name+'/' + filename, (err) => {
                if (err) throw err;
            });

            return filename;
        }

    },
    image_upload_post: function (image) {
        if (image) {
            var extension = path.extname(image.name);
            var filename = uuid() + extension;
            var sampleFile = image;
            sampleFile.mv(process.cwd() + '/public/images/post/' + filename, (err) => {
                if (err) throw err;
            });

            return filename;
        }

    },


}
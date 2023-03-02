const db = require('../models');
const user = db.users;
const category = db.category;
const faq = db.faq;
const terms = db.terms;
const likes = db.likes;
const inspections = db.inspections;
const postsImages = db.postsImages;
const notifcation = db.notifcations
// import ejs from "ejs";

var crypto = require('crypto');
var ejs = require('ejs');
const helper = require('../config/helper');
const jsonData = require('../config/jsonData');
const sequelize = require('sequelize');
// const superagent = require('superagent');

const Op = sequelize.Op;

/*user.belongsTo(user, {
        foreignKey : {
            name : "contractor_id",
            allowNull: false
        },
        targetKey: "id",
        as : "contractor"
    });*/

module.exports = {
    resetPassword: async function(req, res) {
        try {

            const pass = crypto.createHash('sha1').update(req.body.confirm_password).digest('hex');
            const save = await user.update({
                password: pass,
                forgotPassword: '',
            }, {
                where: {
                    forgotPassword: req.body.hash
                }
            });
            if (save) {
                res.render('success_page', {
                    msg: "Password Changed successfully"
                });
            } else {
                res.render('success_page', {
                    msg: "Invalid user"
                });
            }

        } catch (errr) {
            throw errr
        }

    },
    url_id: async function(req, res) {
        try {
            //  console.log(req.params.id, "=================req.params.id");
            const data = await user.findOne({
                attributes: ['forgotPassword'],
                where: {
                    forgotPassword: req.params.id,
                }
            });

            if (data) {
                // console.log(data.length); return false;
                res.render("reset_password", {
                    title: "instadate",
                    response: data.dataValues.forgot_password,
                    flash: "",
                    hash: req.params.id
                });
            } else {
                res.status(403).send("Link has been expired!");
            }

        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    forgot_password: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                email: req.body.email
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    email: requestdata.email
                }
            });
            if (data) {
                let otp = crypto.randomBytes(20).toString('hex');
                // helper.send_emails(otp, data);
                const save = await user.update({
                    forgotPassword: otp
                }, {
                    where: {
                        id: data.dataValues.id
                    }
                });
                let msg = 'Email sent successfully';
                var body = {}
                jsonData.true_status(res, body, msg)

            } else {
                let msg = 'Email does not exist';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            jsonData.wrong_status(res, errr)

        }

    },
    login: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                username: req.body.username,
                password: req.body.password
            };
            const non_required = {
                device_type: req.body.device_type,
                device_token: req.body.device_token
            };
            let requestdata = await helper.vaildObject(required, non_required, res);
            const password = crypto.createHash('sha1').update(requestdata.password).digest('hex');
            const user_data = await user.findOne({
                /*include : [
                            {
                                model : q_u_b,
                                attributes:['id','qualification_id','qualification_name'],
                                where:{
                                    type:1
                                }
                            }
                            ],*/
                where: {
                    username: requestdata.username,
                    password: password
                }
            });
            if (user_data) {
                if (user_data.dataValues.status == 0) {
                    throw "Your account is deactived by admin."
                }

                var auth_create = crypto.randomBytes(20).toString('hex');
                const update_details = await user.update({
                    auth_key: auth_create,
                    deviceType: requestdata.device_type,
                    deviceToken: requestdata.device_token
                }, {
                    where: {
                        id: user_data.dataValues.id,
                    }
                });
                    var data = await user.findOne({     
                        where: {
                            id: user_data.dataValues.id
                        }
                    });

                let msg = 'User Logged In successfully';
                jsonData.true_status(res, data, msg)

            } else {
                let msg = 'Incorrect Email or Password';
                jsonData.wrong_status(res, msg)
            }
        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    logout: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const user_data = await user.findOne({
                where: {
                    auth_key: requestdata.auth_key
                }
            });
            if (user_data) {
                const detail_data = await user.update({
                    auth_key: '',
                    deviceToken: ''
                }, {
                    where: {
                        id: user_data.dataValues.id
                    }
                });
                let msg = 'Logout Successfully';
                let data = {};
                jsonData.true_status(res, data, msg)
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },

    delete_Account: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const user_data = await user.findOne({
                where: {
                    auth_key: requestdata.auth_key
                }
            });
            if (user_data) {
               await user_data.destroy()
                let msg = 'Deleted Successfully';
                let data = {};
                jsonData.true_status(res, data, msg)
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    signUp: async function (req, res) {
		try {
			const required = {
				security_key: req.headers.security_key,
				email: req.body.email,
                username: req.body.username,
				dob: req.body.dob,
				password: req.body.password,
                gender: req.body.gender,
				register_time: Math.floor(new Date().getTime() / 1000),
			};
			const non_required = {
				phone: req.body.phone,
				eyeColor: req.body.eyeColor,
				hairColor: req.body.hairColor,
				height: req.body.height,
				weight: req.body.weight,
				tatto: req.body.tatto,
				tattoImage: req.body.tattoImage,
				bloodType: req.body.bloodType,
				chronic: req.body.chronic,
				allergies: req.body.allergies,
				surgeries: req.body.surgeries,

				deviceType: req.body.device_type,
				deviceToken: req.body.device_token,
				location: req.body.location,
				lat: req.body.lat,
				lng: req.body.lng,
				firstName: req.body.firstName,
				lastname: req.body.lastname,
			};
			let requestdata = await helper.vaildObject(required, non_required, res);
			const user_data = await user.findOne({
				where: {
					username: requestdata.username,
				}
			});
			if (user_data) {
				throw 'Username already exist';
			}
			if(requestdata.phone){
				const user_data_ = await user.findOne({
					where: {
						phone: requestdata.phone,
					}
				});
				if (user_data_) {
					throw 'Phone already exist';
				}
			}
			
			if(requestdata) {   
				save_data=requestdata;
				const password = crypto.createHash('sha1').update(requestdata.password).digest('hex');
				var auth_create = crypto.randomBytes(20).toString('hex');
				save_data.password=password;
				save_data.auth_key=auth_create;
				imageName = '';
				if (req.files && req.files.profile_image) {
					imageName = helper.image_upload(req.files.profile_image);
					save_data.profile_image= req.protocol + '://' + req.get('host') + '/images/users/' + imageName;
				}

                if (req.files && req.files.tattoImage) {
					imageName = helper.image_upload(req.files.tattoImage);
					save_data.tattoImage= req.protocol + '://' + req.get('host') + '/images/users/' + imageName;
				}
				const create_user = await user.create(save_data);
				if (create_user) {
					
                 let data = await user.findOne({       
                    where: {
                        id: create_user.dataValues.id
                    }
                });

				 let msg = 'Registered successfully';
				 jsonData.true_status(res, data, msg)
			 } else {
				 let msg = 'Try again Sometime';
				 jsonData.invalid_status(res, msg)
			 }
		 }

	 }
	 catch (error) {
        
		jsonData.wrong_status(res, error)
	}
},
 editprofile: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                email: req.body.email,
                username: req.body.username,
                dob: req.body.dob,
                password: req.body.password,
                gender: req.body.gender,
                register_time: Math.floor(new Date().getTime() / 1000),
            };
            const non_required = {
                phone: req.body.phone,
                eyeColor: req.body.eyeColor,
                hairColor: req.body.hairColor,
                height: req.body.height,
                weight: req.body.weight,
                tatto: req.body.tatto,
                tattoImage: req.body.tattoImage,
                bloodType: req.body.bloodType,
                chronic: req.body.chronic,
                allergies: req.body.allergies,
                surgeries: req.body.surgeries,
                bloodType: req.body.bloodType,
    
                deviceType: req.body.device_type,
                deviceToken: req.body.device_token,
                location: req.body.location,
                lat: req.body.lat,
                lng: req.body.lng,
                firstName: req.body.firstName,
                lastname: req.body.lastname,
            };
            let requestdata = await helper.vaildObject(required, non_required, res);
            const user_data = await user.findOne({
                where: {
                    auth_key: requestdata.auth_key
                }
            });
            if (user_data) {
                var userid = user_data.dataValues.id;

                const count = await user.count({
                    where: {
                        username: requestdata.username,
                        // user_type: requestdata.user_type,

                        [Op.not]: [{
                            id: userid
                        }, ],
                    }
                });
                if (count > 0) {
                    throw "Desired username is already used by another user.";
                }
                // console.log(userid);
                if (requestdata.phone) {
                    const count_ = await user.count({
                        where: {
                            phone: requestdata.phone,
                            // user_type: requestdata.user_type,

                            [Op.not]: [{
                                id: userid
                            }, ],
                        }
                    });
                    if (count_ > 0) {
                        throw "Desired phone is already used by another user.";
                    }
                }

                let imageName = user_data.dataValues.profile_image;
                if (req.files && req.files.profile_image) {
                    requestdata.profile_image = req.protocol + '://' + req.get('host') + '/images/users/' + helper.image_upload(req.files.profile_image);
                }

                if (req.files && req.files.tattoImage) {
                    imageName = helper.image_upload(req.files.tattoImage);
                    requestdata.tattoImage= req.protocol + '://' + req.get('host') + '/images/users/' + imageName;
                }
                const detail_data = await user.update(requestdata, {
                    where: {
                        id: userid
                    }
                });
                let msg = 'Updated Successfully';
                var data = await user.findOne({     
                       where: {
                           id: userid
                       }
                   });
                // let data = await helper.userdetail(userid);
                jsonData.true_status(res, data, msg)
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    getfaqlist: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            const faqdata = await faq.findAll({
                attributes: [`id`, `questions`, `answers`],
                where: {
                    status: 1,
                }
            });
            let msg = 'faq list';
            jsonData.true_status(res, faqdata, msg)

        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    getcontent: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            const Contentdata = await terms.findOne({
                attributes: [`termsContent`, `privacyPolicy`],
                where: {
                    status: 1,
                }
            });
            var ttt = Contentdata.dataValues.privacyPolicy.replace(/(\r\n|\n|\r|\t)/gm, "");
            var ttt2 = Contentdata.dataValues.termsContent.replace(/(\r\n|\n|\r|\t)/gm, "");
            Contentdata.dataValues.privacyPolicy = ttt
            Contentdata.dataValues.termsContent = ttt2

            let msg = 'Content';
            jsonData.true_status(res, Contentdata, msg)

        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    ChangePassword: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                old_password: req.body.old_password,
                new_password: req.body.new_password
            };
            const non_required = {};

            let requestdata = await helper.vaildObject(required, non_required, res);

            const data = await user.findOne({
                where: {
                    auth_key: requestdata.auth_key,
                }
            });

            if (data) {
                const password = crypto.createHash('sha1').update(requestdata.old_password).digest('hex');
                const data2 = await user.findOne({
                    where: {
                        password: password,
                        auth_key: requestdata.auth_key,
                    }
                });
                if (data2) {
                    const new_password = crypto.createHash('sha1').update(requestdata.new_password).digest('hex');
                    const save = await user.update({
                        password: new_password,
                    }, {
                        where: {
                            id: data.dataValues.id
                        }
                    });
                    let msg = 'Password Changed Successfully';
                    var save_data = {};
                    jsonData.true_status(res, save_data, msg);
                } else {
                    let msg = 'Current password does not matched';
                    jsonData.wrong_status(res, msg)
                }
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (errr) {
            jsonData.wrong_status(res, errr)
        }
    },
    changenotistatus: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                status: req.body.status, /// 1= on , 2= off
            };
            const non_required = {};

            let requestdata = await helper.vaildObject(required, non_required, res);

            const data = await user.findOne({
                where: {
                    auth_key: requestdata.auth_key,
                }
            });

            if (data) {
                const save = await user.update({
                    notificationStatus: requestdata.status,
                }, {
                    where: {
                        id: data.dataValues.id
                    }
                });
                let msg = "";
                if (requestdata.status == 1) {
                    msg = 'Notification On';
                } else {
                    msg = 'Notification Off';
                }

                var save_data = {
                    status: requestdata.status
                };
                jsonData.true_status(res, save_data, msg);

            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (errr) {
            jsonData.wrong_status(res, errr)
        }
    },

    myprofile: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const userdata = await user.findOne({
                where: {
                    auth_key: requestdata.auth_key,
                }
            });
            if (userdata) {
                let msg = 'My profile';
                jsonData.true_status(res, userdata, msg)
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    get_detail: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                user_id: req.body.user_id,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            let userid = requestdata.userid
            const userdata = await user.findOne({
                where: {
                    auth_key: requestdata.auth_key,
                }
            });
            if (userdata) {
                    var data = await user.findOne({
                        attributes: [`id`, `username`,`user_type`,`gender`,`description`, `profile_image`, `phone`, `email`, `location`, `lat`,`lng`,`age`,`height`,`weight`,`position`,`relationship_status`,`looking_for`,`meet_at`,`accept_nsfw_pics`,`hiv`,`last_date`,`sexual_health_faq`,`instgram`,`twitter`,`facebook`, `device_type`, `device_token`],
                        /* include: [{
                            model: q_u_b,
                            attributes: ['id', 'qualification_id', 'qualification_name'],
                            where: {
                                type: 1
                            }
                        }], */
                        where: {
                            id: requestdata.user_id
                        }
                    });
                
                if(!data){
                    data={};
                }
                let msg = 'Detail';
                jsonData.true_status(res, data, msg)
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },

    notifiactionlist: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const user_data = await user.findOne({
                where: {
                    auth_key: requestdata.auth_key,
                }
            });
            if (user_data) {
                var userId = user_data.dataValues.id
                var notifcation_data = await notifcation.findAll({
                    attributes: [`id`, `senderId`, `recieverId`, `data`, `notiType`, `message`, `isRead`, `createdAt`,
                        [sequelize.literal('(select username from users where id=notifcations.senderId)'), 'username'],
                        [sequelize.literal('(select profile_image from users where id=notifcations.senderId)'), 'userImage'],
                        [sequelize.literal('(SELECT count(*) FROM `notifcations` WHERE `recieverId`=' + userId + ' and `isRead`=0 )'), 'unreadcount'],
                    ],
                    where: {
                        recieverId: userId
                    }
                });
                notifcation_data = notifcation_data.map(notification => {
                    if (helper.isJson(notification.data)) {
                        notification.data = JSON.parse(notification.data);
                    } else {
                        notification.data = {};
                    }
                    return notification;
                });

                let notifcationupdate = await notifcation.update({
                    isRead: 1
                }, {
                    where: {
                        recieverId: userId
                    }
                });
                let msg = 'Notification List';
                jsonData.true_status(res, notifcation_data, msg)
            } else {
                let msg = 'Invalid authorization_key';
                jsonData.invalid_status(res, msg)
            }
        } catch (errr) {
            console.log(errr, "----errr");
            jsonData.wrong_status(res, errr)
        }
    },
    
   

}
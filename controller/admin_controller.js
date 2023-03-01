const db = require('../models');

var crypto = require('crypto')
var crypto = require('crypto')
const admin = db.admin;
const users = db.users;
const users_second = db.users;
const posts = db.posts;
const faq = db.faq
const vote = db.votecasting;
const category = db.category
const contracts = db.contracts
const inspections = db.inspections;
const key_pass = db.key_pass;

const database = require('../db/db');
const sequelize = require('sequelize');
const helper = require('../config/helper');
var moment = require('moment');
var path = require('path');
var uuid = require('uuid').v4;
const Op = sequelize.Op;

// contracts.belongsTo(users, {
//   foreignKey: 'user_id',
// });
// contracts.belongsTo(category, {
//   foreignKey: 'contract_type',
// });
// key_pass.belongsTo(users, {
//     foreignKey : {
//       name : "to_user_id",
//       allowNull: false
//     },
//     targetKey: "id",
//     as : "to_user_id_"
//   });
// key_pass.belongsTo(users, {
//     foreignKey : {
//       name : "from_user_id",
//       allowNull: false
//     },
//     targetKey: "id",
//     as : "from_user_id_"
//   });
// /*key_pass.belongsTo(users, {
//    as: 'users_second',
//   foreignKey: 'to_user_id',
// });*/
// key_pass.belongsTo(contracts, {
//   foreignKey: 'key_id',
// });

module.exports = {
  addcontract: async function (req, res) {

    var users_data =  await users.findAll({
          attributes:['id','username'],
          where : {
              admin_id: req.session.user.id,  

              status:1,              
              },  
        order: [
          ['id', 'DESC'],
      ],  
     });
     var cat_data =  await category.findAll({
          attributes:['id','name','pdf_file'],
          where : {
              admin_id: req.session.user.id, 

              status:1,              
              },
          order: [
            ['id', 'DESC'],
        ],     
       });
    
    if (req.session && req.session.auth == true) {
        res.render('admin/addcontract', {
         sessiondata: req.session,
         users_data:users_data,
         cat_data:cat_data,
          msg: req.flash('msg'),
        title: 'Contracts'});
    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
   endcontract: async function (req, res) {

    
    
    if (req.session && req.session.auth == true) {
        res.render('admin/endcontract', {
         sessiondata: req.session,
          contract_id:req.query.id,
          type:req.query.type,
          msg: req.flash('msg'),
        title: 'Contracts'});
    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  endcontract_: async function (req, res) {
    if (req.session && req.session.auth == true) {
      // console.log(req.body.start_date);
      // return;
        date = new Date(req.body.start_date);
        save_data={};
        var current_timestamp = new Date().getTime() / 1000;

        // save_data=req.body;
        save_data.status=2;
        save_data.end_date=current_timestamp;

        if (req.files && req.files.key_image) {
          image = await helper.image_upload(req.files.key_image,'keys');
          save_data.key_image=req.protocol + '://' + req.get('host') + '/images/keys/' +image;

        }
        if (req.files && req.files.end_client_sign) {
          image_ = await helper.image_upload(req.files.end_client_sign,'sign');
          save_data.end_client_sign=req.protocol + '://' + req.get('host') + '/images/sign/' +image_;

        }
        if (req.files && req.files.end_emp_sign) {
          image__ = await helper.image_upload(req.files.end_emp_sign,'users');
          save_data.end_emp_sign=req.protocol + '://' + req.get('host') + '/images/users/' +image__;

        }

        /*console.log(save_data);
        return;*/

        const addcontract = await contracts.update(
          save_data,
          {
            where:{
              id:req.body.id
            }  
          }
          
          );

       //console.log(addcontract, 'yioiutr===='); return
      if(addcontract){
        if(req.query.type==1){
          req.flash('msg', 'Contracts Successfully ended');
         res.redirect('/admin/contracts?t=1');
        }else{
          req.flash('msg', 'Key contract successfully ended');
          res.redirect('/admin/keys?t=1');
        }       
      }
      else{
       console.log(error)
      }
      } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }

  },
  createcontract: async function (req, res) {
    if (req.session && req.session.auth == true) {
        date = new Date(req.body.start_date);
        var cat_data =  await category.findOne({
          where : {
              id: req.body.contract_type,            
              },    
       });  
        save_data={};
        save_data=req.body;
        save_data.start_date=(date/1000);
        save_data.admin_id=req.session.user.id;
        save_data.file=cat_data.dataValues.pdf_file;
        save_data.entry_type=1;


        if (req.files && req.files.document) {
          image = await helper.image_upload(req.files.document,'keys');
          save_data.document=req.protocol + '://' + req.get('host') + '/images/keys/' +image;

        }
        if (req.files && req.files.key_image) {
          image = await helper.image_upload(req.files.key_image,'keys');
          save_data.key_image=req.protocol + '://' + req.get('host') + '/images/keys/' +image;

        }
        if (req.files && req.files.client_sign) {
          image_ = await helper.image_upload(req.files.client_sign,'sign');
          save_data.client_sign=req.protocol + '://' + req.get('host') + '/images/sign/' +image_;

        }
        if (req.files && req.files.employee_sign) {
          image__ = await helper.image_upload(req.files.employee_sign,'users');
          save_data.employee_sign=req.protocol + '://' + req.get('host') + '/images/users/' +image__;

        }
        // console.log(save_data);
        const addcontract = await contracts.create(save_data);

       //console.log(addcontract, 'yioiutr===='); return
      if(addcontract){
       req.flash('msg', 'Contracts Successfully Added');
      res.redirect('/admin/contracts?t=1');
      }
      else{
       console.log(error)
      }
      } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }

  },
  createkey: async function (req, res) {
    if (req.session && req.session.auth == true) {
        date = new Date(req.body.start_date);
        var cat_data =  await category.findOne({
          where : {
              id: req.body.contract_type,            
              },    
       });  
        save_data={};
        save_data=req.body;
        save_data.start_date=(date/1000);
        save_data.admin_id=req.session.user.id;
        save_data.file=cat_data.dataValues.pdf_file;
        save_data.entry_type=2;

        if (req.files && req.files.document) {
          image = await helper.image_upload(req.files.document,'keys');
          save_data.document=req.protocol + '://' + req.get('host') + '/images/keys/' +image;

        }
        if (req.files && req.files.key_image) {
          image = await helper.image_upload(req.files.key_image,'keys');
          save_data.key_image=req.protocol + '://' + req.get('host') + '/images/keys/' +image;

        }
        if (req.files && req.files.client_sign) {
          image_ = await helper.image_upload(req.files.client_sign,'sign');
          save_data.client_sign=req.protocol + '://' + req.get('host') + '/images/sign/' +image_;

        }
        if (req.files && req.files.employee_sign) {
          image__ = await helper.image_upload(req.files.employee_sign,'users');
          save_data.employee_sign=req.protocol + '://' + req.get('host') + '/images/users/' +image__;

        }
        // console.log(save_data);
        const addcontract = await contracts.create(save_data);

       //console.log(addcontract, 'yioiutr===='); return
      if(addcontract){
       req.flash('msg', 'Key Successfully Added');
      res.redirect('/admin/keys?t=1');
      }
      else{
       console.log(error)
      }
      } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }

  },
  addkey: async function (req, res) {

    var users_data =  await users.findAll({
          attributes:['id','username'],
          where : {
              admin_id: req.session.user.id,  

              status:1,              
              },  
        order: [
          ['id', 'DESC'],
      ],  
     });
     var cat_data =  await category.findAll({
          attributes:['id','name'],
          where : {
              admin_id: req.session.user.id,  

              status:1,              
              },
          order: [
            ['id', 'DESC'],
        ],     
       });
    
    if (req.session && req.session.auth == true) {
        res.render('admin/addkey', {
         sessiondata: req.session,
         users_data:users_data,
         cat_data:cat_data,
          msg: req.flash('msg'),
        title: 'Contracts'});
    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  updatecontract: async function (req, res) {
    if (req.session && req.session.auth == true) {
      // console.log(req.body.start_date);
      // return;
        var cat_data =  await category.findOne({
            where : {
                id: req.body.contract_type,            
                },    
         }); 

        date = new Date(req.body.start_date);
        save_data={};
        save_data=req.body;
        save_data.start_date=(date/1000);
        save_data.file=cat_data.dataValues.pdf_file;

        
        if (req.files && req.files.document) {
          image = await helper.image_upload(req.files.document,'keys');
          save_data.document=req.protocol + '://' + req.get('host') + '/images/keys/' +image;

        }
        if (req.files && req.files.key_image) {
          image = await helper.image_upload(req.files.key_image,'keys');
          save_data.key_image=req.protocol + '://' + req.get('host') + '/images/keys/' +image;

        }
        if (req.files && req.files.client_sign) {
          image_ = await helper.image_upload(req.files.client_sign,'sign');
          save_data.client_sign=req.protocol + '://' + req.get('host') + '/images/sign/' +image_;

        }
        if (req.files && req.files.employee_sign) {
          image__ = await helper.image_upload(req.files.employee_sign,'users');
          save_data.employee_sign=req.protocol + '://' + req.get('host') + '/images/users/' +image__;

        }

        /*console.log(save_data);
        return;*/

        const addcontract = await contracts.update(
          save_data,
          {
            where:{
              id:req.body.id
            }  
          }
          
          );

       //console.log(addcontract, 'yioiutr===='); return
      if(addcontract){
       req.flash('msg', 'Contracts Successfully Added');
      res.redirect('/admin/contracts?t=1');
      }
      else{
       console.log(error)
      }
      } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }

  },
  
  get_dashboard_count: async (req, res) => {

    try {
      var getYear = new Date().getFullYear();
      var getMonth = new Date().getMonth() + 1;
      var userData = [];

      var Totalmonth = 12

      for (i = 1; i <= Totalmonth; i++) {
        if (i < 10) {
          var day = "0" + i;
        }
        else {
          day = i;
        }
        var fromDate = getYear + "-" + day + "-01";

        var endDate = getYear + "-" + day + "-30";

      user_query = await database.query("select COUNT(*) as total from users where admin_id='"+req.session.user.id+"' and date((`created_at`)) between '" + fromDate + "' and '" + endDate + "' and  status=1", {

        model: users,
        mapToModel: true,
        type: database.QueryTypes.SELECT
      });
        if (user_query) {
                user_query = user_query.map(value => {
                  return value.toJSON();
                 });
                }

        userData.push(user_query[0].total);
      
      }

      var responseData = { userData: userData };
      res.json(responseData);
    } catch (error) {
      helpers.error(res, error);
    }
  },
  login: async function (req, res) {
    if (req.session && req.session.auth == true) {
      res.redirect('/admin/dashboard');  
    } else {
      res.render('admin/index',{ msg: req.flash('msg') });
    }
    
  },
  dashboard: async function (req, res) {

    // console.log(app_name);
    // return;
    if (req.session && req.session.auth == true) {
        

    var user_data =  await users.findAll({
            where:{
                
              },
          order: [
            ['id', 'DESC'],
        ], 
        limit:5    
       });
    user_data = user_data.map(value => {
        return value.toJSON();
    });
    
    const user_count = await users.count({
       where : {
                // user_type:1,
                //            
              
            }
    });
    const inspections_ = await inspections.count({
      where : {              
                
              
            }
    });
  //   var cat_data =  await category.count({
        
  //       where:{
            
  //         cat_id:0
          
  //       },    
  //     });
  //  var sub_cat_data =  await category.count({
      
  //       where:{
  //         [Op.not]: [
  //                  { cat_id: 0 },
  //                 ],
  //       },     
  //     });
  

     let countdata={
        user_count:user_count,
        inspections:inspections_, 
        // cat_data:cat_data,
        // sub_cat_data:sub_cat_data,
     }
     
     res.render('admin/dashboard', {sessiondata: req.session,countdata: countdata, msg: req.flash('msg'),  title: 'dashboard'});
    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  adminlogin: async function (req, res) {
    const admin_password = crypto.createHash('sha1').update(req.body.password).digest('hex');
    /*console.log(req.body,"==================body")*/
         get_details= await admin.findOne({
              where:{
                email:req.body.username,
                password:admin_password,
              }
         });
        if(get_details){
               res.session = req.session;
                req.session.user = get_details.dataValues;
                req.session.auth = true;
                res.redirect('userslist');   
         }else{
            req.flash('msg', 'Invalid username Or Password');
            res.redirect('/admin')
         }
  },
  logout: async function (req, res) {

    if (req.session && req.session.auth == true) {
      req.session.auth = false;

      res.redirect('/admin')
    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  adminprofile: async function (req, res) {
    if (req.session && req.session.auth == true) {
      var admin_data = await admin.findOne({
        where: {
          id: req.session.user.id
        },
      });
      res.render('admin/profile',
        {
          response: admin_data,
          msg: req.flash('msg'),
          sessiondata: req.session,
          title: 'profile'
        });

    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  updateadminprofile: async function( req, res) {
    old_image = req.body.hiddenimage;
     if (req.session && req.session.auth == true) {
      /*console.log(req.files,"--------------req.files");*/
          if (req.files && req.files.image) {
              
              let image = req.files.image;
              var extension = path.extname(image.name);
              var fileimage = uuid() + extension;
              image.mv(process.cwd() + '/public/images/admin/' + fileimage, function (err) {
              if(err)
                  return res.status(500).send(err);
              });
             old_image = req.protocol + '://' + req.get('host') + '/images/admin/' +fileimage;
              
          }
         /* if (req.files && req.files.image) {
              let image = req.files.image;
              image_url = req.files.image.name;

              image.mv(process.cwd() + '/public/images/admin/' + image.name, function (err) {
              if(err)
                  return res.status(500).send(err);
              });

              old_image = image_url;
          }*/
      let update = await admin.update({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                address:req.body.address,
                image:old_image,
            },
           {
            where: {
                  id: req.body.id,
            }
      });
      if(update) {
        get_details= await admin.findOne({
              where:{
                id:req.body.id,
              }
         });
        if(get_details){
               res.session = req.session;
                req.session.user = get_details.dataValues;   
         }
        req.flash('msg', 'Profile Successfully Updated');
          res.redirect('/admin/profile')
      } else {
        req.flash('msg', 'Something wrong please try again');
        res.redirect('/admin/profile')
      }
      } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  }, 
  updateadminpassword:async function( req, res) { 
     const newpass = crypto.createHash('sha1').update(req.body.NewPassword).digest('hex');
     let oldpass=crypto.createHash('sha1').update(req.body.oldPassword).digest('hex');
     let checkpass = await admin.findOne({
      where: {
        password: oldpass
      }
    });
    if (checkpass) {
     let update = await admin.update({
                password:newpass
            },
           {
            where: {
                  id: req.body.id,
            }
      });
     if(update) {
          req.flash('msg', 'Password Successfully Updated');
          res.redirect('/admin/profile')

     }
      } else {
        req.flash('msg', 'Current Password is not match');
        res.redirect('/admin/profile')
      }
  },
  contracts: async function (req, res) {
          if (req.session && req.session.auth == true) {
            console.log(req.query);
            if(req.query.u_id){
              var users_data = await contracts.findAll({
                include:[{
                  attributes:['id','username'],
                  model : users,
                },{
                  attributes:['id','name'],
                  model : category,
                }
                ],
                where: {
                 entry_type:1,
              admin_id: req.session.user.id,  

                 user_id: req.query.u_id,
                 status: req.query.t
               },  
               order: [
               ['id', 'DESC'],
               ],  
             });
              
            }else{
              if(req.query.t){
               var users_data = await contracts.findAll({
                 include:[{
                  attributes:['id','username'],
                  model : users,
                },
                {
                  attributes:['id','name'],
                  model : category,
                }],
                where: {
              admin_id: req.session.user.id,  
                 entry_type:1,
                 status: req.query.t

               },  
               order: [
               ['id', 'DESC'],
               ],  
             });
             }else{
               var users_data = await contracts.findAll({
                 include:[{
                  attributes:['id','username'],
                  model : users,
                },
                {
                  attributes:['id','name'],
                  model : category,
                }],
                where: {
                 entry_type:1,
                            // status: req.query.t
              admin_id: req.session.user.id,  

                          },  
                          order: [
                          ['id', 'DESC'],
                          ],  
                        });
             }
             
             
           }

               // console.log(users_data);
               res.render('admin/contracts_list',
               {
                response: users_data,
                type:req.query.t,
                msg: req.flash('msg'),
                sessiondata: req.session,
                title: 'Contracts'
              });
             } else {
              req.flash('msg', 'Please login first');
              res.redirect('/admin')
            }
          },
  viewcontract: async function (req, res) {
    if (req.session && req.session.auth == true) {
        
         var contract_ = await contracts.findOne({
           include:[
            {
              attributes:['id','username'],
              model : users,
            },
            {
              attributes:['id','name'],
              model : category,
            }
            ],
           where: {
             id:req.query.id,

            },
          });
         var users_data =  await users.findAll({
              attributes:['id','username'],
              where : {
                  status:1,              
                  },  
            order: [
              ['id', 'DESC'],
          ],  
         });
         var cat_data =  await category.findAll({
              attributes:['id','name'],
              where : {
                  status:1,              
                  },
              order: [
                ['id', 'DESC'],
            ],     
           });
          
       
        res.render('admin/viewcontract',
          {
            contract: contract_,
            users_data: users_data,
            cat_data: cat_data,
            type:req.query.t,
            moment:moment,
            msg: req.flash('msg'),
            sessiondata: req.session,
            title: 'Contracts'
          });
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  contract_detail: async function (req, res) {
    if (req.session && req.session.auth == true) {
        
         var users_data = await contracts.findOne({
           include:[{
              attributes:['id','username'],
              model : users,
            }],
           where: {
             id:req.query.id,

            },
          });
          
       
        res.render('admin/contract_detail',
          {
            response: users_data,
            type:req.query.t,
            msg: req.flash('msg'),
            sessiondata: req.session,
            title: 'Contracts'
          });
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },

     keys: async function (req, res) {
    if (req.session && req.session.auth == true) {
      console.log(req.query);
        if(req.query.u_id){
          var users_data = await contracts.findAll({
            where: {
             entry_type:2,
                           

              user_id: req.query.u_id,
              status: req.query.t
            },
          });
          
        }else{

          if(req.query.t){

            var users_data = await contracts.findAll({
             where: {
               entry_type:2,
               status: req.query.t,
                           

              },
            });
          }else{
            var users_data = await contracts.findAll({
             where: {
               entry_type:2,
                           

              },
            });
          }
          
        }
       
        res.render('admin/keys_list',
          {
            response: users_data,
            type:req.query.t,
            msg: req.flash('msg'),
            sessiondata: req.session,
            title: 'keys'
          });
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  key_record: async function (req, res) {
    if (req.session && req.session.auth == true) {
      console.log(req.query);
       
         var key_record = await key_pass.findAll({
          include : [
            {
              attributes:['id','name'],
              model : contracts,
            },
            {
              attributes:['id','username'],
              model : users,
              as: "from_user_id_"
            },
            {
              attributes:['id','username'],
              model : users,
              as: "to_user_id_"
            },
            
          ],
           where: {
             key_id:req.query.id,
            },
          });
        /* console.log(key_record);
         return;*/
       
        res.render('admin/key_record',
          {
            response: key_record,
            type:req.query.t,
            msg: req.flash('msg'),
            sessiondata: req.session,
            title: 'keys'
          });
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  notifiaction: async function (req, res) {
    if (req.session && req.session.auth == true) {
      console.log(req.query);
       
         var key_record = await key_pass.findAll({
          include : [
            {
              attributes:['id','name'],
              model : contracts,
            },
            {
              attributes:['id','username'],
              model : users,
              as: "from_user_id_"
            },
            {
              attributes:['id','username'],
              model : users,
              as: "to_user_id_"
            },
            
          ],
           where: {
                           

             status:0
             // key_id:req.query.id,
            },
          });
        /* console.log(key_record);
         return;*/
       
        res.render('admin/key_notifiaction',
          {
            response: key_record,
            type:req.query.t,
            msg: req.flash('msg'),
            sessiondata: req.session,
            title: 'keys_notification'
          });
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
   key_detail: async function (req, res) {
    if (req.session && req.session.auth == true) {
        
         var users_data = await contracts.findOne({
           where: {
             id:req.query.id,

            },
          });
          
       
        res.render('admin/key_detail',
          {
            response: users_data,
            type:req.query.t,
            msg: req.flash('msg'),
            sessiondata: req.session,
            title: 'keys'
          });
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
   pass_key_notification_statuschange: async function (req, res) {
    if (req.session && req.session.auth == true) {
      let update = await key_pass.update({
                status:req.body.status
            },
           {
            where: {
                  id: req.body.id,
            }
      });
      res.json(1);
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
   get_badge_count: async function (req, res) {
    if (req.session && req.session.auth == true) {
     const category_count = await key_pass.count({
        where : {
              admin_id: req.session.user.id,  
                status:0,
                
              }
      });
      res.json(category_count);
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
}
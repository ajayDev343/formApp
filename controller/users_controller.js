const db = require('../models');
const Helper = require('../config/helper');
var crypto = require('crypto')
const users = db.users
const inspections = db.inspections;
const sequelize = require('sequelize');
var path = require('path');
var uuid = require('uuid');
const Op = sequelize.Op;

module.exports = {
  adduser: async function (req, res) {

    if (req.session && req.session.auth == true) {
        res.render('admin/adduser', { sessiondata: req.session, msg: req.flash('msg'),  title: 'User'});
    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  createuser: async function (req, res) {
    if (req.session && req.session.auth == true) {
         image_name="";
         
              const count = await users.count({
                     where : {
                       email : req.body.email
                     }
               });
              if(count > 0) {
                req.flash('msg', 'Email already Exist');
                res.redirect('/admin/adduser');
                return;
              }
              const count_ = await users.count({
                     where : {
                       phone : req.body.phone
                     }
               });
              if(count_ > 0) {
                req.flash('msg', 'Phone already Exist');
                res.redirect('/admin/adduser');
                return;
              }
              if (req.files && req.files.image) {
              
                let image = req.files.image;
                var extension = path.extname(image.name);
                var fileimage = uuid() + extension;
                image.mv(process.cwd() + '/public/images/users/' + fileimage, function (err) {
                if(err)
                    return res.status(500).send(err);
                });
               image_name = req.protocol + '://' + req.get('host') + '/images/users/' + fileimage;

            }
       
        var auth_create = crypto.randomBytes(20).toString('hex');
      const password = crypto.createHash('sha1').update(req.body.password).digest('hex');

        const adduser= await users.create({
          username: req.body.name, 
          profileImage: image_name, 
           email: req.body.email, 
           password:password,
              // admin_id:req.session.user.id, 
              // dob:req.body.dob, 
              // gender:req.body.gender, 
              // address:req.body.address,
              phone:req.body.phone,
              // state:req.body.state,
              // lat: req.body.lat, 
              // lng: req.body.lng,
              auth_key:auth_create
       });
       //console.log(adduser, 'yioiutr===='); return
      if(adduser){
       req.flash('msg', 'User Successfully Added');
      res.redirect('/admin/userslist');
      }
      else{
       console.log(error)
      }
      } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }

  },
  userslist : async function (req, res) {
    if (req.session && req.session.auth == true) {
     var response =  await users.findAll({
         // attributes:['id','username','profileImage','email','status','phone','gender'  ],
       where:{
               //  
             // user_type: req.query.ut
             }  ,
         order: [
           ['id', 'DESC'],
       ],  
      });
      res.render('admin/userslist', { sessiondata: req.session,response, msg: req.flash('msg'),  title: 'User'});
   } else {
     req.flash('msg', 'Please login first');
     res.redirect('/admin')
   }
 },
 inspections : async function (req, res) {
  if (req.session && req.session.auth == true) {
   var users_data =  await inspections.findAll({
       // attributes:['id','username','profileImage','email','status','phone','gender'  ],
     where:{
             //  
           // user_type: req.query.ut
           }  ,
       order: [
         ['id', 'DESC'],
     ],  
    });
  //console.log(users_data); return false
    users_data = users_data.map(value => 
     {
         return value.toJSON();
     });       //console.log(data); return false
    res.render('admin/inspections', {user_type:req.query.ut, sessiondata: req.session,response:users_data, msg: req.flash('msg'),  title: 'Inspections'});
 } else {
   req.flash('msg', 'Please login first');
   res.redirect('/admin')
 }
},
 subscrption : async function (req, res) {
     if (req.session && req.session.auth == true) {
      var users_data =  await users.findAll({
          // attributes:['id','username','profileImage','email','status','phone','gender'  ],
        where:{
                //  
                subscription_status: 1
              }  ,
          order: [
            ['id', 'DESC'],
        ],  
       });
     //console.log(users_data); return false
       users_data = users_data.map(value => 
        {
            return value.toJSON();
        });       //console.log(data); return false
       res.render('admin/subscrption', { sessiondata: req.session,response:users_data, msg: req.flash('msg'),  title: 'User'});
    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },

    pass_key_notification_statuschange: async function (req, res) {
    if (req.session && req.session.auth == true) {
      let update = await users.update({
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
  users_statuschange: async function (req, res) {
    if (req.session && req.session.auth == true) {
      let update = await users.update({
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
  delete_user: async function (req, res) {
    if (req.session && req.session.auth == true) {
      const dlt = await users.destroy({
              where: {
                id: req.body.id
              }
            });
      res.json(1);
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  viewuser: async function (req, res) {
    if (req.session && req.session.auth == true) {
        var users_data = await users.findOne({
          where: {
            id: req.query.id
          },
        });
       
        res.render('admin/view_user',
          {
            response: users_data,
            msg: req.flash('msg'),
            sessiondata: req.session,
            title: 'User'
          });
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  view_inspection: async function (req, res) {
    if (req.session && req.session.auth == true) {
        
         var users_data = await inspections.findOne({
           where: {
             id:req.query.id,
            },
          });
          
       
        res.render('admin/view_inspection',
          {
            inspection_detail: users_data,
            msg: req.flash('msg'),
            sessiondata: req.session,
            title: 'keys'
          });
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
   update_user: async function (req, res) {
   
    if (req.session && req.session.auth == true) {
         image_name=req.body.hiddenimage;
         id=req.body.id;
        if (req.files && req.files.image) {
              
              let image = req.files.image;
              var extension = path.extname(image.name);
              var fileimage = uuid() + extension;
              image.mv(process.cwd() + '/public/images/users/' + fileimage, function (err) {
              if(err)
                  return res.status(500).send(err);
              });
             image_name = req.protocol + '://' + req.get('host') + '/images/users/' +fileimage;
              
          }
          const count = await users.count({
            where : {
              email : req.body.email,
              [Op.not]: [
                { id: req.body.id },
              ],
            }
      });
     if(count > 0) {
       req.flash('msg', 'Email already Exist');
       res.redirect('/admin/userslist');
       return;
     }
      const count_ = await users.count({
            where : {
              phone : req.body.phone,
              [Op.not]: [
                { id: req.body.id },
              ],
            }
      });
     if(count_ > 0) {
       req.flash('msg', 'Phone already Exist');
       res.redirect('/admin/userslist');
       return;
     }

     
     var update_obj={              
              username: req.body.name, 
              profileImage: image_name, 
              email: req.body.email, 
              // dob:req.body.dob, 
              // gender:req.body.gender, 
              phone:req.body.phone,       
              // address:req.body.address,
                    
            }
     if(req.body.password){
      update_obj.password = crypto.createHash('sha1').update(req.body.password).digest('hex');      
     }


      const update_users= await users.update(update_obj,
            {
            where: {
               id: req.body.id
            }

       });
      req.flash('msg', 'User Successfully Updated');
      res.redirect('/admin/userslist');
      } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }

  },
}
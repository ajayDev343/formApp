const db = require('../models');
const Helper = require('../config/helper');
var crypto = require('crypto')
const admins = db.admin;
const posts = db.posts;
const sequelize = require('sequelize');
var path = require('path');
var uuid = require('uuid');
const Op = sequelize.Op;

module.exports = {
  addadmin: async function (req, res) {

    if (req.session && req.session.auth == true) {
        res.render('admin/addadmin', { sessiondata: req.session, msg: req.flash('msg'),  title: 'admin'});
    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
  createadmin: async function (req, res) {
    if (req.session && req.session.auth == true) {
         image_name="";
         
              const count = await admins.count({
                     where : {
                       email : req.body.email
                     }
               });
              if(count > 0) {
                req.flash('msg', 'Email already Exist');
                res.redirect('/admin/addadmin');
                return;
              }
              const count_ = await admins.count({
                     where : {
                       phone : req.body.phone
                     }
               });
              if(count_ > 0) {
                req.flash('msg', 'Phone already Exist');
                res.redirect('/admin/addadmin');
                return;
              }
              if (req.files && req.files.image) {
              
                let image = req.files.image;
                var extension = path.extname(image.name);
                var fileimage = uuid() + extension;
                image.mv(process.cwd() + '/public/images/admin/' + fileimage, function (err) {
                if(err)
                    return res.status(500).send(err);
                });
               image_name = req.protocol + '://' + req.get('host') + '/images/admin/' + fileimage;

            }
       
        var auth_create = crypto.randomBytes(20).toString('hex');
      const password = crypto.createHash('sha1').update(req.body.password).digest('hex');

        const addadmin= await admins.create({
          name: req.body.name, 
          image: image_name, 
           email: req.body.email, 
           password:password,
              user_type:2, 
              address:req.body.address, 
              organization_number:req.body.organization_number, 
              // city:req.body.city,
              phone:req.body.phone,
              // state:req.body.state,
              // lat: req.body.lat, 
              // lng: req.body.lng,
              auth_key:auth_create
       });
       //console.log(addadmin, 'yioiutr===='); return
      if(addadmin){
       req.flash('msg', 'Admin Successfully Added');
      res.redirect('/admin/adminslist');
      }
      else{
       console.log(error)
      }
      } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }

  },
  adminslist : async function (req, res) {
     if (req.session && req.session.auth == true) {
      var admins_data =  await admins.findAll({
          attributes:['id','name','image','email','status','phone'         
        ],  
          order: [
            ['id', 'DESC'],
        ],  
       });
     //console.log(admins_data); return false
       admins_data = admins_data.map(value => 
        {
            return value.toJSON();
        });       //console.log(data); return false
       res.render('admin/adminslist', { sessiondata: req.session,response:admins_data, msg: req.flash('msg'),  title: 'admin'});
    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
    pass_key_notification_statuschange: async function (req, res) {
    if (req.session && req.session.auth == true) {
      let update = await admins.update({
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
  admins_statuschange: async function (req, res) {
    if (req.session && req.session.auth == true) {
      let update = await admins.update({
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
  delete_admin: async function (req, res) {
    if (req.session && req.session.auth == true) {
      const dlt = await admins.destroy({
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
  viewadmin: async function (req, res) {
    if (req.session && req.session.auth == true) {
        var admins_data = await admins.findOne({
          where: {
            id: req.query.id
          },
        });
       
        res.render('admin/editadmin',
          {
            admins_data: admins_data,
            msg: req.flash('msg'),
            sessiondata: req.session,
            title: 'admin'
          });
     } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }
  },
   update_admin: async function (req, res) {
   
    if (req.session && req.session.auth == true) {
         image_name=req.body.hiddenimage;
         id=req.body.id;
        if (req.files && req.files.image) {
              
              let image = req.files.image;
              var extension = path.extname(image.name);
              var fileimage = uuid() + extension;
              image.mv(process.cwd() + '/public/images/admin/' + fileimage, function (err) {
              if(err)
                  return res.status(500).send(err);
              });
             image_name = req.protocol + '://' + req.get('host') + '/images/admin/' +fileimage;
              
          }
          const count = await admins.count({
            where : {
              email : req.body.email,
              [Op.not]: [
                { id: req.body.id },
              ],
            }
      });
     if(count > 0) {
       req.flash('msg', 'Email already Exist');
       res.redirect('/admin/adminslist');
       return;
     }
      const count_ = await admins.count({
            where : {
              phone : req.body.phone,
              [Op.not]: [
                { id: req.body.id },
              ],
            }
      });
     if(count_ > 0) {
       req.flash('msg', 'Phone already Exist');
       res.redirect('/admin/adminslist');
       return;
     }

     
     var update_obj={              
              adminname: req.body.name, 
              image: image_name, 
              email: req.body.email, 
              address:req.body.address, 
              organization_number:req.body.organization_number, 
              // dob:req.body.dob, 
              // gender:req.body.gender, 
              phone:req.body.phone,             
            }
     if(req.body.password){
      update_obj.password = crypto.createHash('sha1').update(req.body.password).digest('hex');      
     }


      const update_admins= await admins.update(update_obj,
            {
            where: {
               id: req.body.id
            }

       });
      req.flash('msg', 'admin Successfully Updated');
      res.redirect('/admin/adminslist');
      } else {
      req.flash('msg', 'Please login first');
      res.redirect('/admin')
    }

  },
}
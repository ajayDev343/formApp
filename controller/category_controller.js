const db = require('../models');
const Helper = require('../config/helper');
var crypto = require('crypto')
const category = db.category
const sequelize = require('sequelize');
var path = require('path');
var uuid = require('uuid');
const helper = require('../config/helper');
const Op = sequelize.Op;
category.belongsTo(category, {
        foreignKey : {
            name : "cat_id",
            allowNull: false
        },
        targetKey: "id",
        as : "main_cat"
    });

module.exports = {

	categories: async function (req, res) {

		if (req.session && req.session.auth == true) {
			var cat_data =  await category.findAll({
				
				where:{
					  
					cat_id:0
					
				},

				order: [
				['id', 'DESC'],
				],     
			});
			cat_data = cat_data.map(value => {
				return value.toJSON();
			});

			res.render('admin/categories', { sessiondata: req.session,response:cat_data, msg: req.flash('msg'),  title: 'Types'});
		} else {
			req.flash('msg', 'Please login first');
			res.redirect('/admin')
		}
	},
	sub_categories: async function (req, res) {

		if (req.session && req.session.auth == true) {
			var cat_data =  await category.findAll({
				include: [{
                        attributes: ['id', 'name'],
                        model: category,
                                as: "main_cat"

                    }],
				where:{
					[Op.not]: [
	               	 { cat_id: 0 },
	              	],
				},

				order: [
				['id', 'DESC'],
				],     
			});
			cat_data = cat_data.map(value => {
				return value.toJSON();
			});
			/*console.log(cat_data);
			return;*/
			var all_cat_data =  await category.findAll({
				
				where:{
					  
					cat_id:0

				},

				order: [
				['id', 'DESC'],
				],     
			});

			res.render('admin/sub_categories', { sessiondata: req.session,response:cat_data,all_cat_data:all_cat_data, msg: req.flash('msg'),  title: 'Types'});
		} else {
			req.flash('msg', 'Please login first');
			res.redirect('/admin')
		}
	},
	addcategory: async function (req, res) {
		if (req.session && req.session.auth == true) {
			if(req.body.id=="") {
				const count = await category.count({
					where : {
						  
						
						name : req.body.catname
					}
				});
				if(count > 0) {
				 req.flash('msg', 'Category already Exist');
				 if(!req.body.cat_id){
				 	res.redirect('/admin/categories');
				 }else{
				 	res.redirect('/admin/sub_categories');
				 }

				 return;
			 }
			 if (req.files && req.files.image) {
				image = await helper.image_upload(req.files.image,'category');
				pdf_file_=req.protocol + '://' + req.get('host') + '/images/category/' +image;

			 }
			 if(!req.body.cat_id){
			 	req.body.cat_id=0;
			 }
			 const addcategory= await category.create({
				name: req.body.catname, 
				  
				image:pdf_file_,
				cat_id:req.body.cat_id
			});
			 req.flash('msg', 'Category Successfully Added');
			 if(!req.body.cat_id){
			 	res.redirect('/admin/categories');
			 }else{
			 	res.redirect('/admin/sub_categories');
			 }
		 } else {
			const count = await category.count({
				where : {
					name : req.body.catname,
					[Op.not]: [
	                { id: req.body.id },
	              ],
				}
			});
			if(count > 0) {
			 req.flash('msg', 'Category already Exist');
			 if(!req.body.cat_id){
				 	res.redirect('/admin/categories');
				 }else{
				 	res.redirect('/admin/sub_categories');
				 }
			 return;
		 }
		 update_={};
		 if(!req.body.cat_id){
			 	req.body.cat_id=0;
			 }
		 update_.name=req.body.catname;
		 update_.cat_id=req.body.cat_id;
		 if (req.files && req.files.image) {
				image = await helper.image_upload(req.files.image,'category');
				pdf_file_=req.protocol + '://' + req.get('host') + '/images/category/' +image;
				 update_.image=pdf_file_;

			}
			

		 let update = await category.update(update_,
		{
			where: {
				id: req.body.id,
			}
		});
		 req.flash('msg', 'Category Successfully Updated');
		 if(!req.body.cat_id){
		 	res.redirect('/admin/categories');
		 }else{
		 	res.redirect('/admin/sub_categories');
		 }
	 }
	 if(!req.body.cat_id){
				 	res.redirect('/admin/categories');
				 }else{
				 	res.redirect('/admin/sub_categories');
				 }
 } else {
	req.flash('msg', 'Please login first');
	res.redirect('/admin')
}
},
delete_cate: async function (req, res) {
	if (req.session && req.session.auth == true) {
		const dlt = await category.destroy({
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
cat_statuschange: async function (req, res) {
	if (req.session && req.session.auth == true) {
		let update = await category.update({
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
}
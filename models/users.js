/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		user_type: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0',
			field: 'user_type'
		},
		socialId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'socialId'
		},
		username: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'username'
		},
		firstName: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'firstName'
		},
		lastname: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'lastname'
		},
		profile_image: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'profile_image'
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: true,
			defaultValue: '',
			field: 'phone'
		},
		eyeColor: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'eyeColor'
		},
		height: {
			type: DataTypes.STRING(20),
			allowNull: true,
			defaultValue: '',
			field: 'height'
		},
		weight: {
			type: DataTypes.STRING(25),
			allowNull: true,
			defaultValue: '',
			field: 'weight'
		},
		hairColor: {
			type: DataTypes.STRING(50),
			allowNull: true,
			defaultValue: '',
			field: 'hairColor'
		},
		tatto: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '',
			field: 'tatto'
		},
		tattoImage: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'tattoImage'
		},
		email: {
			type: DataTypes.STRING(200),
			allowNull: true,
			defaultValue: '',
			field: 'email'
		}, 
		password: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'password'
		},
		forgotPassword: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'forgotPassword'
		},
		dob: {
			type: DataTypes.STRING(20),
			allowNull: true,
			defaultValue: '',
			field: 'dob'
		},
		
		location: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'location'
		},
		
		lat: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: '',
			field: 'lat'
		},
		lng: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: '',
			field: 'lng'
		},
		auth_key: {
			type: DataTypes.STRING(200),
			allowNull: true,
			defaultValue: '',
			field: 'auth_key'
		},
		deviceType: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'device_type'
		},
		loginType: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			field: 'loginType'
		},
		deviceToken: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'device_token'
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'description'
		},
		bloodType: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'bloodType'
		}, 
		chronic: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'chronic'
		},
		allergies : {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'allergies'
		},
		surgeries : {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'surgeries'
		},
		register_time: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '',
			field: 'register_time'
		},
		gender: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1',
			field: 'gender'
		},
		createdAt: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			// defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),

			defaultValue: Math.floor(new Date().getTime() / 1000),
			field: 'created_at'
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '1',
			field: 'status'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_at'
		}
	}, {
		tableName: 'users'
	});
};

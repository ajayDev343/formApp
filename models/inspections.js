/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('inspections', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},	
		user_id: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			field: 'user_id'
		},	
		title: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'title'
		},
		image: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'image'
		},		
		address: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'address'
		},
		pool_type: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'pool_type'
		},
		
		pool_data: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '',
			field: 'pool_data'
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'description'
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
		
		status: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '1',
			field: 'status'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			// defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			defaultValue: Math.floor(new Date().getTime() / 1000),

			field: 'created_at'
		},		
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_at'
		}
	}, {
		tableName: 'inspections'
	});
};

/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('qualifications_user_jobs', {
		id: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},

		qualification_id: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			field: 'qualification_id'
		},
		qualification_name: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			field: 'qualification_name'
		},
		type_id: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			field: 'type_id'
		},
		type: {
			type: DataTypes.INTEGER(1),
			field: 'type'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'createdAt'
		},		
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updatedAt'
		}
	}, {
		tableName: 'qualifications_user_jobs'
	});
};

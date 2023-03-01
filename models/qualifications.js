/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('qualifications', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		
		name: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'name'
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
		tableName: 'qualifications'
	});
};

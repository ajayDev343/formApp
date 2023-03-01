/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('likes', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userid: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			field: 'userid'
		},
		user2id: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			field: 'user2id'
		},
		type: {
			type: DataTypes.BIGINT(20),
			allowNull: true,
			field: 'type'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'createdAt'
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
			field: 'updatedAt'
		}
	}, {
		tableName: 'likes'
	});
};

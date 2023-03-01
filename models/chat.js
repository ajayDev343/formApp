/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('chat', {
		id: {
			type: DataTypes.BIGINT(20),
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
		/* chat_type: {
			type: DataTypes.BIGINT(20),
			allowNull: true,
			field: 'chat_type'
		}, */
		constantid: {
			type: DataTypes.BIGINT(20),
			allowNull: true,
			field: 'constantid'
		},
		message: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'message'
		},
		msg_type: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			field: 'msg_type'
		},
		deletedId: {
			type: DataTypes.BIGINT(20),
			allowNull: true,
			field: 'deletedId'
		},
		readStatus: {
			type: DataTypes.BIGINT(20),
			allowNull: true,
			field: 'readStatus'
		},
		createdAt: {
			type: DataTypes.BIGINT(20),
			allowNull: true,	
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.BIGINT(20),
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			
			field: 'updatedAt'
		}
	}, {
		tableName: 'chat'
	});
};

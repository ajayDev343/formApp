/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('chat_constant', {
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
		
		last_message_id: {
			type: DataTypes.BIGINT(20),
			allowNull: true,
			field: 'last_message_id'
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
		tableName: 'chat_constant'
	});
};

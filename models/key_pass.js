/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('key_pass', {
		id: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		admin_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'admin_id'
		},
		key_id: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			field: 'key_id'
		},
		from_user_id: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			field: 'from_user_id'
		},
		to_user_id: {
			type: DataTypes.BIGINT(20),
			allowNull: false,
			field: 'to_user_id'
		},
		owend: {
			type: DataTypes.BIGINT(4),
			allowNull: true,
			defaultValue: '1',
			field: 'owend'
		},		
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: '0',
			field: 'status'
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
		tableName: 'key_pass'
	});
};

/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('contracts', {
		id: {
			type: DataTypes.BIGINT,
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
		entry_type: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'entry_type'
		},
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '',
			field: 'user_id'
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'name'
		},
		file: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'file'
		},
		client_image: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'client_image'
		},
		document: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'document'
		},
		employee_sign: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'employee_sign'
		},
		key_image: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'key_image'
		},
		key_number: {
			type: DataTypes.STRING(20),
			allowNull: true,
			defaultValue: '',
			field: 'key_number'
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: true,
			defaultValue: '',
			field: 'phone'
		},
		email: {
			type: DataTypes.STRING(200),
			allowNull: true,
			defaultValue: '',
			field: 'email'
		},
		client_sign: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'client_sign'
		},
		end_client_sign: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'end_client_sign'
		},
		end_emp_sign: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'end_emp_sign'
		},
		start_date: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '',
			field: 'start_date'
		},
		end_date: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '',
			field: 'end_date'
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'address'
		},
		contract_type: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'contract_type'
		},
		notes: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'notes'
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '1',
			field: 'status'
		},
		key_type: {
			type: DataTypes.STRING(40),
			allowNull: true,
			field: 'key_type'
		},
		handed_key: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'handed_key'
		},
		contract_started: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '',
			field: 'contract_started'
		},
		receiver_name: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'receiver_name'
		},
		receiver_relationship: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			field: 'receiver_relationship'
		},
		
		
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_at'
		},
		
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_at'
		}
	}, {
		tableName: 'contracts'
	});
};

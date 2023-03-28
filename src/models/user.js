'use strict';
const {
  Model
} = require('sequelize');
const Allcode = require('./allcode')
const { getAllCode } = require('../controllers/userController');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, { foreignKey: "positionId", targetKey: "keyMap", as: "positionData" });
      User.belongsTo(models.Allcode, { foreignKey: "gender", targetKey: "keyMap", as: "genderData" });
      User.belongsTo(models.Allcode, { foreignKey: "roleId", targetKey: "keyMap", as: "roleData" });
      User.hasOne(models.Markdown, { foreignKey: "doctorId", as: 'markdownData' });
      User.hasOne(models.Doctor_Infor, { foreignKey: "doctorId", as: 'doctorInforData' });
      User.hasMany(models.Schedule, { foreignKey: "doctorId", as: 'doctorData' });
      User.hasMany(models.Booking, { foreignKey: "patientId", as: 'patientData' });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
    image: DataTypes.BLOB('medium')
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true
  });
  return User;
};
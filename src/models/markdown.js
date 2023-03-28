'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Markdown.belongsTo(models.User, { foreignKey: "doctorId", targetKey: "id", as: 'markdownData' });
    }
  }
  Markdown.init({
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdown: DataTypes.TEXT('long'),
    description: DataTypes.TEXT('long'),
    clinicId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Markdown',
    freezeTableName: true

  });
  return Markdown;
};
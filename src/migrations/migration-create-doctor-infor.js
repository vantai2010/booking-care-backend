'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Doctor_Infor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      doctorId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      priceId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      paymentId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      provinceId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      clinicId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      specialtyId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      addressClinic: {
        type: Sequelize.STRING
      },
      nameClinic: {
        allowNull: false,
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      count: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Doctor_Infor');
  }
};
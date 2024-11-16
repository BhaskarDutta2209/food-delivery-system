'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('items', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        restaurant_id: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          references: {
            model: { tableName: 'restaurants' },
            key: 'id',
          }
        },
        name: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING(250)
        },
        price: {
          type: Sequelize.FLOAT
        },
        type: {
          type: Sequelize.STRING
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deleted_at: {
          type: Sequelize.DATE
        }
      }, { transaction });

      await transaction.commit();
    } catch(error) {
      await transaction.rollback();
      throw error;
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('items');
  }
};
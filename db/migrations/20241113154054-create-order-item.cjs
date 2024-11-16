'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('order_items', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        order_id: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          references: {
            model: { tableName: 'orders' },
            key: 'id'
          }
        },
        item_id: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          references: {
            model: { tableName: 'items' },
            key: 'id'
          }
        },
        count: {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 1
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
    await queryInterface.dropTable('order_items');
  }
};
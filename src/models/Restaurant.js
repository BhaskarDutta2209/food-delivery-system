'use strict';
import { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtConfig from '../../config/jwt.js';

const Restaurant = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.RefreshToken, {
        foreignKey: 'resource_id',
        constraints: false,
        scope: {
          resource_type: 'restaurant'
        },
        as: 'refreshTokens'
      });

      this.hasMany(models.Item, {
        foreignKey: 'restaurant_id',
        as: 'items'
      });
      this.hasMany(models.Order, {
        foreignKey: 'restaurant_id',
        as: 'orders'
      });
    }

    static async findWithRefreshToken(refreshToken) {
      return (
        await Restaurant.findAll({
          where: { '$refreshTokens.token$': refreshToken },
          include: ['refreshTokens'],
        })
      )[0];
    }

    tokenPayload() {
      return {
        id: this.id,
        email: this.email,
        type: 'restaurant'
      }
    }

    generateAccessToken() {
      return jwt.sign(
        this.tokenPayload(),
        jwtConfig.accessToken.secret,
        jwtConfig.accessToken.options
      );
    }

    generateRefreshToken() {
      return jwt.sign(
        this.tokenPayload(),
        jwtConfig.refreshToken.secret,
        jwtConfig.refreshToken.options
      );
    }

    async authenticated(password) {
      return await bcrypt.compare(password, this.password);
    }

    async generateAndCreateRefreshToken() {
      const refreshToken = await this.createRefreshToken({
        token: this.generateRefreshToken()
      })

      return refreshToken.token;
    }

    async destroyRefreshToken(token) {
      await sequelize.models.RefreshToken.destroy({
        where: {
          token,
          resource_id: this.id,
          resource_type: 'restaurant'
        }
      });
    }
  }
  Restaurant.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 10));
      }
    },
    address: {
      type: DataTypes.STRING(500),
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'Restaurant',
  });
  return Restaurant;
};

export { Restaurant };
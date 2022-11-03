"use strict";
const bcrypt = require("bcryptjs");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // start of auth functions
    toSafeObject() {
      const { id, username, email } = this;
      return { id, username, email };
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }
    getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }
    static async login({ credentials, password }) {
      const { Op } = require("sequelize");
      const user = await User.scope("loginUser").findOne({
        where: {
          [Op.or]: {
            // when username match or email match
            username: credentials,
            email: credentials,
          },
        },
      });
      if (user && user.validatePassword(password)) {
        return await User.scope("currentUser").findByPk(user.id);
      }
    }
    static async signUp({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
      });
      return await User.scope("currentUser").findByPk(user.id);
    }

    // end of auth functions
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING(30),
        unique: true,
        allowNull: false,
        validate: {
          len: [4, 30],
          isEmail: false,
          isNull: false,
          isLessTHan30Char: (values) => {
            const isLessThan30Char = values.split("").length < 30;
            const isMoreThan4Char = values.split("").length > 4;
            if (!isLessThan30Char && !isMoreThan4Char) {
              throw new Error("UserName has to be under 30 Char ");
            }
          },
          isNoEmail: (value) => {
            if (validator.isEmail(value)) {
              throw new Error("User Name can;t be an email ");
            }
          },
          not: /.*@.*\..*/gi,
        },
      },
      email: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isNull: false,
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
          max60: (pass) => {
            const isMax60 = pass.split("").length > 60;
            if (isMax60) throw new Error("pass Hash is more tna 60 char");
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "updatedAt", "createdAt"],
        },
      },
      scopes: {
        currentUser: {
          attributes: {
            exclude: "hashedPassword",
          },
        },
        loginUser: {
          attributes: {},
        },
      },
    }
  );
  return User;
};

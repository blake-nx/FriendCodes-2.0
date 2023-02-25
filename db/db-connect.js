const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: true,
    native: true,
  },
});

const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    handle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    friend_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [10, 18],
          msg: "Your friend code must be between 12 and 20 numbers.",
        },
        is: {
          args: /^[\d\s\-]+$/i,
          msg: "Friend code must only contain numbers.",
        },
      },
    },
    switch_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^SW-\d{4}-\d{4}-\d{4}$/i,
          msg: "Switch code must match SW-xxxx-xxxx-xxxx format.",
        },
      },
    },
  },
  {
    tableName: "friends",
  }
);

module.exports = User;

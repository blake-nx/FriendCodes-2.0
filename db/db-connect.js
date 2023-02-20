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
        len: [12, 20],
      },
    },
    switch_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^SW-\d{4}-\d{4}-\d{4}$/i,
      },
    },
  },
  {
    tableName: "friends",
  }
);

module.exports = User;

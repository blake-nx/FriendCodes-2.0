const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv").config();

// Create a new instance of Sequelize and connect to the PostgreSQL database using the DATABASE_URL in the .env file
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: true,
    native: true,
  },
});

// User model that's used to interact with the "friends" table in the database
const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here.
    // The "handle" attribute is the Discord user's tag, and is used as the primary key for the table
    // The "friend_code" attribute is the user's Pokemon Go friend code
    // The "switch_code" attribute is the user's Nintendo Switch friend code
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

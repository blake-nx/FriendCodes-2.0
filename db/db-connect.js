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
      allowNull: false,
    },
  },
  {
    tableName: "friends",
  }
);

// const connect = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };
module.exports = User;

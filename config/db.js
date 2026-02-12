const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "thinkcode",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: 3306,
    dialect: "mysql",
    logging: false,
    define: { timestamps: false }
  }
);



sequelize.authenticate()
  .then(() => console.log("Database connected."))
  .catch(err => console.log("DB ERROR:", err));

module.exports = sequelize;

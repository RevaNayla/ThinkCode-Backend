const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "thinkcode",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    define: { timestamps: false }
  }
);

sequelize.authenticate()
  .then(() => console.log("Database connected."))
  .catch(err => console.log("DB ERROR:", err));

module.exports = sequelize;

const express = require("express");
const mysql = require("mysql2/promise"); // Utiliza 'mysql2/promise'
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "ImagesBaseDatos")));
app.use(express.static(path.join(__dirname, "ImagesAutorBD")));

const config = {
  host: "resenas.mysql.database.azure.com",
  port: 3306,
  user: "daniel@resenas",
  password: "pepito*89",
  database: "resenas",
  charset: 'utf8mb4',
};

const pool = mysql.createPool(config);

pool
  .getConnection()
  .then((connection) => {
    console.log("Conexión exitosa con la base de datos");
    connection.release();
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

process.on("SIGINT", () => {
  pool.end();
  process.exit(0);
});

app.use(require("./routes/Routes.js"));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log("Server Corriendo en el puerto", PORT);
});

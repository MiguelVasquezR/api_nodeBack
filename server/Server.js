const express = require("express");
const mysql = require("mysql2");
const connection = require("express-myconnection");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "ImagesBaseDatos")));
app.use(express.static(path.join(__dirname, "ImagesAutorBD")));

app.use(connection(mysql, {
    host: "resenas.mysql.database.azure.com",
    port: 3306,
    user: "daniel@resenas",
    password: "pepito*89",
    database: "resenas",
    charset: "utf8mb4",
}));

app.use(require("./routes/Routes.js"));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log("Server Corriendo en el puerto", PORT);
});

const express = require('express');
const mysql = require('mysql2')
const connection = require('express-myconnection');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, 'ImagesBaseDatos')));

app.use(connection(mysql, {
    host: 'localhost',
    port: 3306, 
    user: 'root',
    password: 'FormulaUno',
    database: 'RESENAS'
}));

app.use(require("./routes/Routes.js"));

app.listen(9000, () => {
    console.log("Server Corriendo en", "http://localhost:"+9000);
})


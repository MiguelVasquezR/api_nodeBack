const express = require('express');
const mysql = require('mysql2')
const connection = require('express-myconnection');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, 'ImagesBaseDatos')));
app.use(express.static(path.join(__dirname, 'ImagesAutorBD')));

app.use(connection(mysql, {
    host: 'resenas.mysql.database.azure.com',
    port: 3306, 
    user: 'daniel@resenas',
    password: 'pepito*89',
    database: 'resenas'
}));

app.use(require("./routes/Routes.js"));

app.listen(9000, () => {
    console.log("Server Corriendo en", 9000);
})




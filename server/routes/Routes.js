const { log, error } = require('console');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Crea una carpeta para poder guardar las imagenes reporalmente
const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const fileUpload = multer({
    storage: diskStorage,
}).single('image');

router.get("/", (req, res) => {
    res.send("Bienvenido al servidor");
});

router.post("/image/post", fileUpload, (req, res) => {
    try{
        req.getConnection((err, cont) => {
            if (err) return res.status(500).send("Error en el servidor al guardar la imagen");
            const ID = uuidv4();        
            const NOMBRE = req.file.filename;
            const IMAGEN = fs.readFileSync(path.join(__dirname, '../images/' + NOMBRE));
            cont.query('INSERT INTO IMAGENPERFIL SET ?', [{ ID, NOMBRE, IMAGEN }], (err, rows) => {
                if (err) { console.log("Error"); return res.status(500).send("Error en el servidor al guardar la imagen en la bd"); }
                const respuesta = {
                    IDImagen: ID,
                }            
                res.send(JSON.stringify(respuesta));
            })
        });
    }catch(err){
        console.log("Error en image post");
    }    
});

router.get("/image/get/:ID", (req, res) => {   
    try{
        req.getConnection((err, cont) => {
            if (err) return res.status(500).send("Error en el servidor al guardar la imagen");        
            const id = req.params.ID;                      
            cont.query(`SELECT * FROM IMAGENPERFIL WHERE ID IN (SELECT FOTO FROM Lista WHERE IDUsuario = ?);`, [id] ,(err, rows) => {
                if (err) { console.log("Error"); return res.status(500).send("Error en el servidor al guardar la imagen en la bd"); }            
                rows.map((img) => {
                    fs.writeFileSync(path.join(__dirname, '../ImagesBaseDatos/' + img.ID + ".png"), img.IMAGEN);
                });
                const nameImg = fs.readdirSync(path.join(__dirname, "../ImagesBaseDatos/"));                                
                console.log(nameImg);
                res.send(nameImg);
            })
        })
    }catch(err) {
        console.log("Error en el image get id");
    }

});

router.get("/image/:ID", (req, res) => {        
    try{
        req.getConnection((err, cont) => {
            if (err) return res.status(500).send("Error en el servidor al guardar la imagen");        
            const id = req.params.ID;                  
            cont.query(`SELECT * FROM IMAGENPERFIL WHERE ID = ?;`, [id] ,(err, rows) => {
                if (err) { console.log(err); return res.status(500).send("Error en el servidor al guardar la imagen en la bd"); }            
                rows.map((img) => {                
                    fs.writeFileSync(path.join(__dirname, '../ImagesBaseDatos/' + img.ID + ".png"), img.IMAGEN);
                });
                const nameImg = fs.readdirSync(path.join(__dirname, "../ImagesBaseDatos/"));                                            
                res.send(nameImg);
            })
        })
    }catch(err){
        console.log("Error image ID");
    }    
});


router.get("/getImages", (req, res) => {       
    try{
        req.getConnection((err, cont) => {
            if (err) return res.status(500).send("Error en el servidor al guardar la imagen");                                
            cont.query(`SELECT * FROM IMAGENPERFIL;`, [] ,(err, rows) => {
                if (err) { console.log(err); return res.status(500).send("Error en el servidor al guardar la imagen en la bd"); }            
                rows.map((img) => {                
                    fs.writeFileSync(path.join(__dirname, '../ImagesBaseDatos/' + img.ID + ".png"), img.IMAGEN);
                });
                const nameImg = fs.readdirSync(path.join(__dirname, "../ImagesBaseDatos/"));
                res.send(nameImg);
            })
        })
    }catch(err){
        console.log("Error get Images");
    }    
});


// router.put("/image/post", fileUpload, (req, res) => {    
//     req.getConnection((err, cont) => {
//         if (err) return res.status(500).send("Error en el servidor al guardar la imagen");
//         const ID = uuidv4();
//         const NOMBRE = req.file.filename;
//         const IMAGEN = fs.readFileSync(path.join(__dirname, '../images/' + NOMBRE));
//         cont.query('INSERT INTO IMAGENPERFIL SET ?', [{ ID, NOMBRE, IMAGEN }], (err, rows) => {
//             if (err) { console.log("Error"); return res.status(500).send("Error en el servidor al guardar la imagen en la bd"); }
//             const respuesta = {
//                 IDImagen: ID,
//             }
//             res.send(JSON.stringify(respuesta));
//         })
//     })
// });

router.delete("/image/delete/:ID", (req, res) => {
    try{
        req.getConnection((err, cont) => {
            if (err) return res.status(500).send("Error en el servidor al eliminar la imagen");
            const id = req.params.ID;
            cont.query(`DELETE FROM IMAGENPERFIL WHERE ID = ?`, [id], (err) => {
                if (err) {
                    console.log("Error");
                    return res.status(500).send("Error en el servidor al eliminar la imagen en la bd");
                }
    
                try {
                    fs.unlinkSync(path.join(__dirname, '../ImagesBaseDatos/' + id));
                    console.log(`Imagen con ID ${id} eliminada exitosamente.`);
                } catch (err) {
                    console.error('Error al eliminar el archivo:', err);
                }
                
                const nameImg = fs.readdirSync(path.join(__dirname, "../ImagesBaseDatos/"));
                res.send(nameImg);
            });
        });
    }catch(err){
        console.log("Error en delete ID");
    }
});


//Métodos para manejar las fotos de autores en la base de datos
router.get("/getImageAutor", (req, res) => {    

    try{
        req.getConnection((err, cont) => {
            if(err) return res.status(500).send("Error al guardar las imagenes del autores");
            cont.query('SELECT * FROM IMAGEAUTOR', (err, rows) => {
                if(err) return res.status(500).send("Error en la consulta");
                rows.map((img) => {
                    fs.writeFileSync(path.join(__dirname, "../ImagesAutorBD/" + img.NOMBRE + ".png"), img.IMAGEN);
                })
                const nameImg = fs.readdirSync(path.join(__dirname, "../ImagesAutorBD/"));
                res.send(nameImg);
            })
        });
    }catch(err){
        console.log("Error get images autor");
    }    

});

router.get("/savedImages", (req, res) => {    
    try{
        req.getConnection((err, cont) => {
            if (err){
                return res.status(500).send("Error al obtener la fotos de la base de datos");            
            }
            agregarFotosABD(cont);
            const respuesta = {
                mensaje: "Imágenes guardas"
            }
            res.send(JSON.stringify(respuesta))        
        })
    }catch(err){
        console.log("Error el saved images");
    }    
})

const agregarFotosABD = (cont) => {
    try{
        const imageFolder = path.join(__dirname, '../ImagenesPortadas/');    
        fs.readdir(imageFolder, (err, files) => {
            if (err) {
                console.error("Error al leer la carpeta de imágenes:", err);
                return;
            }
            files.forEach((filename) => {            
                const NOMBRE = path.parse(filename).name;
                const IMAGEN = fs.readFileSync(path.join(imageFolder, filename));
                cont.query('INSERT INTO IMAGEAUTOR SET ?', [{ ID: NOMBRE, NOMBRE, IMAGEN }], (err) => {
                    if (err) {
                        console.error("Error al guardar la imagen en la base de datos:", err);
                    }
                });
            });
        });   
    }catch(err){
        console.log("Erro en agregar foto");
    }    
};


module.exports = router;
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Creacion de la tabla para la BD
const dbPath = path.join(__dirname, 'solicitudes.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la BD', err.message);
    } else {
        console.log('Conexión a la BD exitosa');
        db.run(`CREATE TABLE IF NOT EXISTS solicitud (
            id INTEGER PRIMARY KEY,
            date TEXT,
            tipo TEXT,
            informacion TEXT
        )`, (err) => {
            if(err){
                console.log('Error al crear la tabla', err.message);
            } else {
                console.log('Tabla creada correctamente');
            }
        });

    }
});
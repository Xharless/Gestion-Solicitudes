const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Creación de la tabla para la BD
const dbPath = path.join(__dirname, 'solicitudes.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la BD:', err.message);
    } else {
        console.log('Conexión a la BD exitosa');
        db.run(`CREATE TABLE IF NOT EXISTS solicitud (
            id INTEGER PRIMARY KEY,
            date TEXT,
            tipo TEXT,
            telefono INTEGER,
            informacion TEXT,
            completado INTEGER DEFAULT 0
        )`, (err) => {
            if (err) {
                console.error('Error al crear la tabla:', err.message);
            } else {
                console.log('Tabla creada correctamente');
            }
        });
    }
});

module.exports = db;

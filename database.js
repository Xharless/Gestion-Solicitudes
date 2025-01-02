const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

function initializeDatabase(app) {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'solicitudes.sqlite');

    // Copiar la base de datos al directorio de datos del usuario si no existe
    if (!fs.existsSync(dbPath)) {
        fs.copyFileSync(path.join(__dirname, 'solicitudes.sqlite'), dbPath);
    }

    // Abrir la base de datos
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
                if(err){
                    console.log('Error al crear la tabla', err.message);
                } else {
                    console.log('Tabla creada correctamente');
                }
            });
        }
    });

    return db;
}

module.exports = initializeDatabase;
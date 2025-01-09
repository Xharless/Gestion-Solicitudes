const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

function initializeDatabase(app) {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'solicitudes.sqlite');


    console.log('Ruta de origen:', userDataPath);
    
    console.log('Ruta de destino:', dbPath);

    try {
        // Verificar si el archivo de base de datos ya existe
        if (!fs.existsSync(dbPath)) {
            const sourcePath = path.join(__dirname, 'solicitudes.sqlite');
            
            // Si no existe el archivo de origen, crear una nueva base de datos
            if (!fs.existsSync(sourcePath)) {
                console.warn('El archivo de base de datos no existe en el origen. Se creará una nueva base de datos.');
                const db = new sqlite3.Database(dbPath, (err) => {
                    if (err) {
                        console.error('Error al crear la nueva base de datos:', err.message);
                    } else {
                        console.log('Base de datos nueva creada exitosamente.');
                        db.run(`CREATE TABLE IF NOT EXISTS solicitud (
                            id INTEGER PRIMARY KEY,
                            date TEXT,
                            tipo TEXT,
                            telefono TEXT,
                            informacion TEXT,
                            completado INTEGER DEFAULT 0
                        )`, (err) => {
                            if (err) {
                                console.error('Error al crear la tabla en la nueva BD:', err.message);
                            } else {
                                console.log('Tabla creada correctamente en la nueva BD.');
                            }
                        });
                    }
                });
                return db;
            }

            // Si existe el archivo de origen, copiarlo
            fs.copyFileSync(sourcePath, dbPath);
            console.log('Base de datos copiada correctamente al directorio del usuario.');
        }
    } catch (err) {
        console.error('Error al preparar la base de datos:', err.message);
    }

    // Abrir la base de datos
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error al abrir la base de datos:', err.message);
        } else {
            console.log('Conexión a la base de datos exitosa.');
        }
    });

    return db;
}

module.exports = initializeDatabase;

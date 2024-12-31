const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database'); // Uso de la misma conexión

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
        icon: path.join(__dirname, 'IMG', 'logo.ico')
    });
    mainWindow.loadFile('index.html');

    mainWindow.maximize();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Llamar a sendSolicitudes cuando la ventana esté lista
    mainWindow.webContents.on('did-finish-load', () => {
        sendSolicitudes();
    });
};

app.on('ready', createWindow);

// Insertar los datos de la solicitud en la BD
ipcMain.on('add-solicitud', (event, solicitud) => {
    
    const query = `INSERT INTO solicitud (id, date, tipo, telefono, informacion, completado) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
        solicitud.id,
        solicitud.date,
        solicitud.tipo,
        solicitud.telefono,
        solicitud.informacion,
        solicitud.completado
    ];

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error al insertar datos:', err.message);
            event.reply('error', 'No se pudo insertar la solicitud.');
        } else {
            
            sendSolicitudes();
            
        }
    });
});


//-----------------------------   Edicion de datos    ----------------------------- //
ipcMain.on('edit-solicitud', (event, solicitud) => {
    const query = `UPDATE solicitud SET date = ?, tipo = ?, telefono = ?, informacion = ? WHERE id = ?`;
    const params = [
        solicitud.date, 
        solicitud.tipo, 
        solicitud.telefono, 
        solicitud.informacion, 
        solicitud.id
    ];
    db.run(query, params, function(err) {
        if (err) {
            console.error('Error al actualizar datos:', err.message);  
            event.reply('error', 'No se pudo actualizar la solicitud.');
        } else {
            
            sendSolicitudes();
            event.reply('solicitud-editada', 'La solicitud ha sido actualizada correctamente.');
        }
    });
});
//-----------------------------    FIN    ----------------------------- //

//-----------------------------   Delete    ----------------------------- //
ipcMain.on('delete-solicitud', (event, id) => {
    const query = `DELETE FROM solicitud WHERE id = ?`;
    db.run(query, id, function(err) {
        if (err) {
            console.error('Error al eliminar datos:', err.message);
            event.reply('error', 'No se pudo eliminar la solicitud.');
        } else {
            
            sendSolicitudes();
        }
    });
});
//-----------------------------    FIN    ----------------------------- //


ipcMain.on('update-completado', (event, { id, completado }) => {
    db.run(`UPDATE solicitud SET completado = ? WHERE id = ?`, [completado, id], function(err) {
        if (err) {
            return console.log('Error al actualizar datos', err.message);
        }
        
        sendSolicitudes();
    });
});

// Mostrar los datos en la tabla
function sendSolicitudes() {
    db.all(`SELECT * FROM solicitud`, [], (err, rows) => {
        if (err) {
            console.error('Error al recuperar datos:', err.message);
        } else {
            
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('solicitudes', rows);
            });
        }
    });
}



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

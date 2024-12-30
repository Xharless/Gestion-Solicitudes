const { app, BrowserWindow } = require('electron')
const path = require('path')
const sqlite3 = require('sqlite3').verbose();


const createWindow = () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
        icon: path.join(__dirname, 'IMG', 'logo.ico')
    })
    win.loadFile('index.html');
    
    win.maximize();
    win.on('closed', () => {
        win = null;
    });
}
app.on('ready', () => {
    createWindow();
    // Determinar la ruta de la base de datos
    const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
    // Copiar la base de datos al directorio de datos del usuario si no existe
    const fs = require('fs');
    if (!fs.existsSync(dbPath)) {
        fs.copyFileSync(path.join(__dirname, 'database.sqlite'), dbPath);
    }
    // Abrir la base de datos
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database', err.message);
        } else {
            console.log('Database opened successfully');
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', createWindow);
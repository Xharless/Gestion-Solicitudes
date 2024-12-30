const { app, BrowserWindow } = require('electron')

const path = require('node:path')

// modify your existing createWindow() function
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })
    win.loadFile('index.html');
    
    win.maximize();
    win.on('closed', () => {
        win = null;
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', createWindow);
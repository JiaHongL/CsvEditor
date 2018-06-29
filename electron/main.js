// src/electron/electron.js
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const path = require('path');
const url = require('url');
const electron = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWin;

function isDev() {
  return process.defaultApp ||
    /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
    /[\\/]electron[\\/]/.test(process.execPath);
}

function createWindow() {
  // Create the browser window.
  mainWin = new BrowserWindow({
    width: 750,
    height: 450
  })
  // and load the index.html of the app.
  if (isDev()) {
    mainWin.loadURL('http://localhost:4200/#/editor');
    mainWin.webContents.openDevTools();
  } else {
    mainWin.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
      hash: 'editor'
    }));
  };

  // Emitted when the window is closed.
  mainWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWin = null
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWin === null) {
    createWindow()
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on('create-dropzone-win-message', (event, message) => {
  let mainWindowId = message;
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let options = {
    width: 450,
    height: 250,
    show: false,
    x: width - 400,
    y: 0
  };
  let dropZoneWin = new BrowserWindow(options);
  
  if (isDev()) {
    dropZoneWin.loadURL('http://localhost:4200/#/dropzone');
    dropZoneWin.webContents.openDevTools();
  } else {
    dropZoneWin.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
      hash: 'dropzone'
    }));
  };

  dropZoneWin.once('ready-to-show', () => {
    dropZoneWin.show();
    dropZoneWin.webContents.send('main-win-id-message', mainWindowId);
  });

});

ipcMain.on('quit-message', (event, message) => {
  app.quit();
});

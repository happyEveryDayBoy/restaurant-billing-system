const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    title: 'Restaurant Billing System',
    icon: path.join(__dirname,'..','build','app-icon.png'),
    autoHideMenuBar: true,
    backgroundColor:"white",
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecution: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.maximize()

  // Remove menu options
  // win.removeMenu();

  // load the index.html from a url
  win.loadURL(
    isDev
    ? 'http://localhost:3000'
    : `file://${path.resolve(path.join(__dirname, '..','build','index.html'))}`
    );
    
    // Open the DevTools.
    // isDev && win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  // expressApp.listen(3000, () => {
  //   console.log("Started server on PORT 3000");
  // })

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
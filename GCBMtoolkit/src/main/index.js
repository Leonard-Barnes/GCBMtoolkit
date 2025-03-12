import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const path = require("path"); 

const fs = require("fs");

const configPath = path.join(app.getAppPath(), "GCBMTools", "LoadYourOwnData", "config", "walltowall_config.json");


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    resizable: false,
    show: false,
    autoHideMenuBar: true,
    frame:false,
    transparent:true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
    }
  })

  mainWindow.setAlwaysOnTop(true, "screen")

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  //ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on("close-window",()=>{
    const currentWIndow = BrowserWindow.getFocusedWindow()
    if(currentWIndow){
      currentWIndow.close()
    }

  })

  ipcMain.on("minimize-window",()=>{
    const currentWIndow = BrowserWindow.getFocusedWindow()
    if(currentWIndow){
      currentWIndow.minimize()
    }

  })

  ipcMain.handle("load-script", async () => {
    try {
      if (fs.existsSync(configPath)) {
        return fs.readFileSync(configPath, "utf-8");
      }
      return "";
    } catch (error) {
      console.error("Error loading script:", error);
      return "";
    }
  })
  
  ipcMain.on("save-script", (_, scriptContent) => {
    try {
      fs.writeFileSync(configPath, scriptContent, "utf-8");
    } catch (error) {
      console.error("Error saving script:", error);
    }
  })

  ipcMain.handle('open-in-default-editor', async () => {
    try {
      const filePath = path.resolve(configPath); // Ensure this is the correct path to your file
      await shell.openPath(filePath); // Open the file in the default editor
      console.log(`File opened in default editor: ${filePath}`);
    } catch (error) {
      console.error("Error opening file in default editor:", error);
    }
  });

  ipcMain.on("open-pdf", (event, pdfName) => {
    const pdfPath = join(app.getAppPath(), 'public', 'pdfs', pdfName)
    shell.openPath(pdfPath).catch(err => console.error("Failed to open PDF:", err));
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

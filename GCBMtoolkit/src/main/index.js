import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const path = require("path");
const { spawn } = require("child_process")
const fs = require("fs")

const configPath = path.join(app.getAppPath(), "GCBMTools", "DataFromTileSelect", "config", "walltowall_config.json")

const userDataPath = path.join(app.getAppPath(), "user_data.json")

const desktopPath = app.getPath("desktop")

const outputDirectory = path.join(app.getAppPath(), "GCBMTools", "DataFromTileSelect", "processed_output", "spatial")

const tileSelectionFile = path.join(app.getAppPath(), "selectedTiles.json")

// Construct the dynamic path
const batFilePath = path.join(
  desktopPath,
  "GCBMtoolkit",
  "GCBMtoolkit",
  "GCBMtoolkit",
  "GCBMTools",
  "DataFromTileSelect",
  "test.bat"
);

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

  ipcMain.handle("save-user-data", async (_, userData) => {
    try {
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2), "utf-8");
      console.log("User data saved to:", userDataPath);
      return { success: true };
    } catch (error) {
      console.error("Error saving user data:", error);
      return { success: false, error: error.message };
    }
  })

  ipcMain.handle("load-user-data", async () => {
    try {
      if (fs.existsSync(userDataPath)) {
        const data = fs.readFileSync(userDataPath, "utf-8");
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error("Error loading user data:", error);
      return null;
    }
  });

  ipcMain.handle("load-tile-data", async () => {
    try {
      if (fs.existsSync(tileSelectionFile)) {
        const data = fs.readFileSync(tileSelectionFile, "utf-8");
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error("Error loading user data:", error);
      return null;
    }
  });
  
  // Start the generation process
  ipcMain.handle("start-generation", async () => {
    return new Promise((resolve, reject) => {
      try {
        console.log("Starting generation process...");
  
        const batProcess = spawn("cmd.exe", ["/c", `"${batFilePath}"`], {
          cwd: path.dirname(batFilePath),
          shell: true,
        });
  
        let outputLogs = "";
  
        batProcess.stdout.on("data", (data) => {
          const output = data.toString();
          console.log(`Output: ${output}`);
          outputLogs += output; // Collect logs
        });
  
        batProcess.stderr.on("data", (data) => {
          const errorOutput = data.toString();
          console.error(`Error: ${errorOutput}`);
          outputLogs += errorOutput; // Collect errors too
        });
  
        batProcess.on("close", (code) => {
          console.log(`Batch file finished with exit code ${code}`);
          if (code === 0) {
            resolve({ success: true, message: "Batch process completed.", logs: outputLogs });
          } else {
            reject({ success: false, message: `Batch failed with exit code ${code}`, logs: outputLogs });
          }
        });
  
        batProcess.on("error", (err) => {
          console.error("Error starting batch process:", err);
          reject({ success: false, message: "Error starting batch process", error: err.message });
        });
  
      } catch (error) {
        console.error("Error during batch execution:", error);
        reject({ success: false, error: error.message });
      }
    })
  })

  ipcMain.handle("save-config", async (event, config) => {
    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      return { success: true };
    } catch (error) {
      console.error("Error saving config file:", error);
      return { success: false, error };
    }
  });

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

  ipcMain.handle("get-output-path", async () => {
    return outputDirectory;
  });
  
  ipcMain.handle("open-folder", async (_, folderPath) => {
    shell.openPath(folderPath);
  })

  ipcMain.handle("get-output-files", async () => {
    try {
      const files = fs.readdirSync(outputDirectory).map((file) => ({
        name: file,
        path: path.join(outputDirectory, file),
      }));
      return { success: true, files };
    } catch (error) {
      console.error("Error reading output directory:", error);
      return { success: false, error: error.message };
    }
  })

  ipcMain.handle("open-output-folder", async () => {
    try {
      await shell.openPath(outputDirectory);
      return { success: true };
    } catch (error) {
      console.error("Error opening output folder:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("select-file", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
    });
  
    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, filePath: result.filePaths[0] };
    }
    return { success: false };
  });

  ipcMain.handle("save-selected-tiles", async (_, tiles) => {
    try {
      fs.writeFileSync(tileSelectionFile, JSON.stringify(tiles));
      console.log("Tiles saved:", tiles);
    } catch (error) {
      console.error("Error saving tiles:", error);
    }
  });

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

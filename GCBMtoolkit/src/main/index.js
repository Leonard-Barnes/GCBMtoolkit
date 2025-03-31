import { app, shell, BrowserWindow, ipcMain, dialog, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const path = require("path");
const { spawn } = require("child_process")
const fs = require("fs")

const basePath = app.getAppPath();
const GCBMPath = path.join(basePath, "GCBMTools", "DataFromTileSelect");

const configPath = path.join(GCBMPath, "config", "walltowall_config.json");
const userDataPath = path.join(basePath, "user_data.json");
const outputDirectory = path.join(GCBMPath, "processed_output", "spatial");
const tileSelectionFile = path.join(basePath, "selectedTiles.json");

const GCBMDirectory = path.join(app.getAppPath(), "GCBMTools", "DataFromTileSelect")

// Construct the dynamic path
const batFilePath = path.join(
  app.getPath("desktop"),
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
  // Load the remote URL for development or the local html file for production

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

  protocol.registerFileProtocol("safe-file", (request, callback) => {
    const url = request.url.replace("safe-file://", "");
    callback({ path: path.normalize(url) });
  });

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const getCurrentWindow = () => BrowserWindow.getFocusedWindow();
  ipcMain.on("close-window", () => getCurrentWindow()?.close());
  ipcMain.on("minimize-window", () => getCurrentWindow()?.minimize());

  const readFile = (filePath) => {
    try {
      return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8")) : null;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  };
  
  const writeFile = (filePath, data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      return { success: true };
    } catch (error) {
      console.error(`Error writing file ${filePath}:`, error);
      return { success: false, error: error.message };
    }
  }

  ipcMain.handle("load-user-data", () => readFile(userDataPath));
  ipcMain.handle("save-user-data", (_, data) => writeFile(userDataPath, data));

  ipcMain.handle("load-tile-data", () => readFile(tileSelectionFile));
  ipcMain.handle("save-selected-tiles", (_, tiles) => writeFile(tileSelectionFile, tiles));

  ipcMain.handle("save-config", (_, config) => writeFile(configPath, config));

  ipcMain.handle('get-tiff-file', async (event, filePath) => {
    try {
      // Read the file as a binary buffer
      const buffer = fs.readFileSync(filePath);
      
      // Convert the buffer to an ArrayBuffer if needed
      const bufferArray = new Uint8Array(buffer).buffer;
  
      return bufferArray; // Return ArrayBuffer
    } catch (error) {
      console.error("Error reading TIFF file:", error);
      return { error: "File not found or invalid" };
    }
  });

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
  
  ipcMain.handle("get-output-files", async () => {
    try {
      // Get the path to the TIFF folder
      const tiffFolder = path.join(app.getAppPath(), "GCBMTools", "DataFromTileSelect", "processed_output", "spatial");
  
      // Read the directory and return full paths
      const files = fs.readdirSync(tiffFolder).map((file) => ({
        name: file,
        path: `${path.join(tiffFolder, file)}`,
      }));
  
      return { success: true, files };
    } catch (error) {
      console.error("Error fetching TIFF files:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("open-folder", async (_, folderPath) => {
    try {
      const fullPath = path.join(GCBMDirectory, folderPath)
      console.log("Path", fullPath);
      await shell.openPath(fullPath);
      return { success: true };
    } catch (error) {
      console.error("Error opening output folder:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("open-output-folder", async () => {
    try {
      await shell.openPath(outputDirectory);
      return { success: true };
    } catch (error) {
      console.error("Error opening output folder:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("select-file", async (_, directory) => {
    try {
        const fullPath = path.join(GCBMDirectory, directory);

        const result = await dialog.showOpenDialog({
            defaultPath: fullPath,
            properties: ["openFile"],
        });

        if (!result.canceled && result.filePaths.length > 0) {
            return { success: true, filePath: result.filePaths[0] };
        }
        return { success: false };
    } catch (error) {
        console.error("Error in select-file handler:", error);
        return { success: false, error: error.message };
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

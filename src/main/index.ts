import path from "node:path";
import { app, BrowserWindow, shell } from "electron";
import Scraper from "./lib/Scraper";
import { connectScraperProxy, disconnectScraperProxy } from "./proxy/scraper";

// Lock a window down: block navigation away from the app's own origin and never
// let it spawn Electron windows (genuine external https links open in the user's
// browser instead). Applied to the main window, which only loads local UI.
const hardenWindow = (window: BrowserWindow) => {
  window.webContents.on("will-navigate", (event, url) => {
    const currentOrigin = new URL(window.webContents.getURL()).origin;
    if (new URL(url).origin !== currentOrigin) {
      event.preventDefault();
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// electron-squirrel-startup is a CJS-only package that ships no type
// declarations, so it is loaded via require (the Forge-recommended form).
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require("electron-squirrel-startup")) {
  app.quit();
}

// The scraper window usually runs behind the main window or hidden (headless
// runs). Stop Chromium from throttling or freezing it when it is backgrounded
// or occluded, so timers, scrolling and lazy content keep working during a run.
app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");

// Dev-only escape hatch: expose a CDP port so external tooling can drive the
// app during development. Signed/packaged builds ignore this switch (macOS
// blocks remote debugging), which is fine — the scraper itself uses the
// in-process webContents.debugger and never needs a port.
if (process.env.STP_REMOTE_DEBUG) {
  app.commandLine.appendSwitch(
    "remote-debugging-port",
    process.env.STP_REMOTE_DEBUG
  );
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 800,
    minHeight: 500,
    // Frameless look on macOS: the traffic lights float over the sidebar and
    // the renderer marks its own drag regions. Other platforms keep their
    // native frame.
    ...(process.platform === "darwin"
      ? { titleBarStyle: "hiddenInset" as const }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // Explicit secure defaults (see electron-development skill): keep the
      // renderer isolated from Node and sandboxed.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  hardenWindow(mainWindow);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);

    // Open the DevTools if dev environment
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Initialize scraper instance (drives its own child window over CDP)
  const scraper = new Scraper(mainWindow);

  // Connect scraper ipcMain handles
  connectScraperProxy(scraper);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  // Remove scraper ipcMain handles
  disconnectScraperProxy();

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

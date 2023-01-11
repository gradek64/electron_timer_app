const { app, BrowserWindow } = require("electron")
const path = require("path")
const { debug } = require("./debug")
const { turnPins } = require("./setGpioPinsOn_Off")

debug("process.env.DEBUG set =>", process.env.DEBUG, "green")

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 480, //800x480 is resolution of the touch screen
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })
  //ren dev tool only in debug mode
  if (process.env.DEBUG === "true") {
    win.webContents.openDevTools()
  }

  win.on('closed',()=>{
    
  })

  win.loadFile("template.html")
}

app.whenReady().then(() => {
  // allow third-party libraries
  app.allowRendererProcessReuse = false
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})



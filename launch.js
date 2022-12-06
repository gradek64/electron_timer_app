const { app, BrowserWindow } = require('electron')
const path = require('path')


console.log('process.env in launch', process.env.DEBUG)

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar:true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  //ren dev tool only in debug mode
  if(process.env.DEBUG){ 
    win.webContents.openDevTools()
  }

  win.loadFile('template.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


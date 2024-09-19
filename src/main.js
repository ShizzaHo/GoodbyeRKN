const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron');
const path = require('node:path');
var platform = require("os").platform();

let tray = undefined;
let controlWindow = undefined;
let settingsWindow = undefined;
let setupWindow = undefined;



const createWindows = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  controlWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 460,
    y: height - 600,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    title: 'GoodbyeRKN',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  controlWindow.loadFile('./views/main/index.html');

  controlWindow.on('blur', () => {
    controlWindow.hide();
  });

  settingsWindow = new BrowserWindow({
    width: 900,
    height: 700,
    show: false,
    title: 'GoodbyeRKN | Настройки',
    icon: path.join(__dirname, 'icon.ico'),
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  
  settingsWindow.setMenu(null);
  settingsWindow.loadFile('./views/settings/index.html');

  // Переопределение поведения кнопки закрытия окна настроек
  settingsWindow.on('close', (event) => {
    if (!settingsWindow.isVisible()) {
      // Если окно уже скрыто, не предотвращаем закрытие
      settingsWindow = null;
    } else {
      // Предотвращаем закрытие окна и скрываем его
      event.preventDefault();
      settingsWindow.hide();
    }
  });

  controlWindow.on('blur', () => {
    controlWindow.hide();
  });

  setupWindow = new BrowserWindow({
    width: 900,
    height: 700,
    show: false,
    title: 'GoodbyeRKN | Первончальная настройка',
    icon: path.join(__dirname, 'icon.ico'),
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  
  //setupWindow.setMenu(null);
  setupWindow.loadFile('./views/setup/index.html');
};

const makeError = () => {
  let errorWindow = new BrowserWindow({
    width: 500,
    height: 180,
    title: 'GoodbyeRKN | Ошибка',
    icon: path.join(__dirname, 'icon.ico'),
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  
  errorWindow.setMenu(null);
  errorWindow.loadFile('./views/error/index.html');
}

app.whenReady().then(() => {
  createWindows();

  const iconPath = path.join(__dirname, 'icon.ico');
  tray = new Tray(iconPath);

  const trayMenu = Menu.buildFromTemplate([
    { label: 'Настройки приложения', click: () => { settingsWindow.show(); } },
    { label: 'О приложении', click: () => { require("electron").shell.openExternal("https://github.com/ShizzaHo/GoodbyeRKN") } },
    { label: 'Закрыть приложение', click: () => { app.quit(); } },
    { label: 'GoodbyeRKN | by ShizzaHo | v0.1.0', enabled: false },
  ]);

  tray.setToolTip('GoodbyeRKN');
  tray.setContextMenu(trayMenu);

  tray.on('click', () => {
    controlWindow.show();
  });
});

ipcMain.on('openSettings', () => {
  settingsWindow.show();
});

ipcMain.on('makeError', () => {
  makeError();
});

ipcMain.on('startSetup', () => {
  setupWindow.show();
});
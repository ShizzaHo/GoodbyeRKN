const { dataStore } = require('../../scripts/dataStore');
const handler = require('../../scripts/handler');

const { ipcRenderer } = require('electron');

document.title = "GoodbyeRKN | Настройки";

handler.registerNewClick("settings__block__item", (e) => {
    window.location = "../../views/configs/index.html";
});

// handler.registerNewClick("settings__block__item", (e) => {
    
// })

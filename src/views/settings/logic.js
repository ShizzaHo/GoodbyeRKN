const { dataStore } = require('../../scripts/dataStore');
const handler = require('../../scripts/handler');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { shell } = require('electron');

const { ipcRenderer } = require('electron');
const { exec } = require('child_process');

document.title = "GoodbyeRKN | Настройки";

handler.registerNewClick("settings-configs", (e) => {
    window.location = "../../views/configs/index.html";
});

handler.registerNewClick("settings-openBlackList", (e) => {
    const fileContent = fs.readFileSync(path.join(os.homedir(), 'Documents', 'GoodbyeRKN', 'configs', localStorage.getItem('config')), 'utf8');
    const config = JSON.parse(fileContent);
    const blacklistPath = config.params.filter((item) => item.param === '--blacklist <value>')[0].value;

    exec(handler.checkSpecialValues(blacklistPath));
})

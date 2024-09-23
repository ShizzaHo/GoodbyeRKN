const { dataStore } = require('../../scripts/dataStore');
const handler = require('../../scripts/handler');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { shell } = require('electron');

const { ipcRenderer } = require('electron');
const { exec } = require('child_process');

document.title = 'GoodbyeRKN | Настройки';

onload = () => {
    checkAutostart();
};

const checkAutostart = () => {
    if (
        fs.existsSync(
            path.join(
                os.homedir(),
                'AppData',
                'Roaming',
                'Microsoft',
                'Windows',
                'Start Menu',
                'Programs',
                'Startup',
                'GoodbyeRKN.lnk'
            )
        )
    ) {
        changeOnOffState(true, 'settings-autostart-toggle');
    } else {
        changeOnOffState(false, 'settings-autostart-toggle');
    }
}

const changeOnOffState = (state, id) => {
    if (state) {
        document.getElementById(id).innerHTML = '<span class="item__toggle_on">ВКЛ</span>';
    } else {
        document.getElementById(id).innerHTML = '<span class="item__toggle_off">ВЫКЛ</span>';
    }
}

handler.registerNewClick('settings-configs', (e) => {
    window.location = '../../views/configs/index.html';
});

handler.registerNewClick('settings-openBlackList', (e) => {
    const fileContent = fs.readFileSync(
        path.join(
            os.homedir(),
            'Documents',
            'GoodbyeRKN',
            'configs',
            localStorage.getItem('config')
        ),
        'utf8'
    );
    const config = JSON.parse(fileContent);
    const blacklistPath = config.params.filter(
        (item) => item.param === '--blacklist <value>'
    )[0].value;

    exec(handler.checkSpecialValues(blacklistPath));
});

handler.registerNewClick('settings-reset', (e) => {
    ipcRenderer.send('startSetup');
});

handler.registerNewClick(
    'settings-autostart',
    () => {handler.onClicksHandlers.toggleAutostart(() => {
        checkAutostart();
    });}
);

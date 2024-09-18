const { spawn } = require('child_process');
const kill = require('tree-kill');
const path = require('node:path');
const os = require('os');
const fs = require('fs');
const { ipcRenderer } = require('electron');

const { dataStore } = require('../dataStore');

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    localStorage.setItem('lastError', errorMsg + '\n======\n' + url + ' ' + lineNumber);
    ipcRenderer.send('makeError')
    return false;
}

const onClicksHandlers = {
    toggleOnDPI: () => {
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

        const appProcess = spawn(
            'C:\\Users\\ShizzaHo\\Desktop\\GoodbyeRKN\\gbdpi\\x86_64\\goodbyedpi.exe',
            generateAutoSpawnArgs(config),
            {
                detached: false,
                stdio: 'ignore',
            }
        );

        appProcess.unref();

        dataStore.GoodByeDPI.pid = appProcess.pid;
    },
    toggleOffDPI: () => {
        kill(dataStore.GoodByeDPI.pid);
        dataStore.GoodByeDPI.pid = undefined;
    },
};

const generateAutoSpawnArgs = (config) => {
    const args = [];
    for (const param of config.params) {
        if (param.active) {
            if (param.note == 'special') {
                param.value.split(' ').forEach((item) => {
                    args.push(item);
                });
            } else {
                if (param.value) {
                    args.push(`${param.param.replace(' <value>', '')}`);
                    args.push(`${checkSpecialValues(param.value)}`);
                } else {
                    args.push(param.param);
                }
            }
        }
    }
    return args;
};

const registerNewClick = (id, event, args) => {
    document.getElementById(id).addEventListener('click', () => {
        event(args);
    });
};

const checkSpecialValues = (value) => {
    switch (value) {
        case "%included%":
            return path.join(
                os.homedir(),
                'Documents',
                'GoodbyeRKN',
                'configs',
                localStorage.getItem('config').replace(".json", ".txt")
            );
        default:
            return value;
    }
}

const registerNewChange = (id, event, args) => {
    document.getElementById(id).addEventListener('change', (e) => {
        event(e, args);
    });
};

module.exports = {
    onClicksHandlers: onClicksHandlers,
    registerNewClick: registerNewClick,
    registerNewChange: registerNewChange,
};

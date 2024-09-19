const { spawn } = require('child_process');
const kill = require('tree-kill');
const path = require('node:path');
const os = require('os');
const fs = require('fs');

const { dataStore } = require('../dataStore');
const platform = require("os").platform();

const checkRunAdmin = () => {
    if (platform == "win32" || platform == "win64") {
        require('child_process').exec('net session', function(err, stdout, stderr) {
            if (err || (stdout.indexOf("Access is denied.") > -1)) {
                alert('Эта программа работает только только с правами администратора, перезапустите программу с правами администатора');
            }
        });
    }
};

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    localStorage.setItem(
        'lastError',
        errorMsg + '\n======\n' + url + ' ' + lineNumber
    );
    ipcRenderer.send('makeError');
    return false;
};

const onClicksHandlers = {
    toggleOnDPI: () => {
        checkRunAdmin();
        
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
        case '%included%':
            return path.join(
                os.homedir(),
                'Documents',
                'GoodbyeRKN',
                'configs',
                localStorage.getItem('config').replace('.json', '.txt')
            );
        default:
            return value;
    }
};

const registerNewChange = (id, event, args) => {
    document.getElementById(id).addEventListener('change', (e) => {
        event(e, args);
    });
};

module.exports = {
    onClicksHandlers: onClicksHandlers,
    registerNewClick: registerNewClick,
    registerNewChange: registerNewChange,
    checkSpecialValues: checkSpecialValues,
};

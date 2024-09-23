const { spawn } = require('child_process');
const childProcess = require('child_process');
const kill = require('tree-kill');
const path = require('node:path');
const os = require('os');
const fs = require('fs');
const platform = require('os').platform();
const { ipcRenderer } = require('electron');

const { dataStore } = require('../dataStore');

const checkRunAdmin = () => {
    if (platform == 'win32' || platform == 'win64') {
        require('child_process').exec(
            'net session',
            function (err, stdout, stderr) {
                if (err || stdout.indexOf('Access is denied.') > -1) {
                    alert(
                        'Эта программа работает только только с правами администратора, перезапустите программу с правами администатора'
                    );
                }
            }
        );
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
            path.join(ipcRenderer.sendSync('getAppPath').replace("GoodbyeRKN.exe", ""), 'gbdpi', 'goodbyedpi.exe'),
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
    toggleAutostart: (callback) => {
        checkRunAdmin();

        if (
            !fs.existsSync(
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
            if (
                confirm(
                    'Программа создаст ярлык в папке автозапуска с сылкой на эту программу. Если вы переместите программу в другую папку, то автозапуск больше не будет работать, и вам придется повторить действие.'
                )
            ) {
                const appPath = path.join(ipcRenderer.sendSync('getAppPath'));
                const startupFolder = path.join(
                    os.homedir(),
                    'AppData',
                    'Roaming',
                    'Microsoft',
                    'Windows',
                    'Start Menu',
                    'Programs',
                    'Startup'
                );

                const shortcutName = 'GoodbyeRKN.lnk';
                const shortcutPath = path.join(startupFolder, shortcutName);

                childProcess.exec(
                    `mklink "${shortcutPath}" "${appPath}"`,
                    {
                        windowsHide: true,
                        windowsVerbatimArguments: true,
                        stdio: 'ignore',
                        shell: true,
                    },
                    (err) => {
                        if (err) {
                            alert(`Ошибка создания ярлыка автозапуска: ${err}`);
                        } else {
                            alert('Ярлык автозапуска успешно создан!');
                            callback();
                        }
                    }
                );
            }
        } else {
            alert('Ярлык автозапуска успешно удален!');
            fs.unlinkSync(
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
            );
            callback();
        }
    },
    toggleAutorun: (callback) => {
        if (localStorage.getItem('autorun') == 'true') {
            localStorage.setItem('autorun', 'false');
            callback();
        } else {
            localStorage.setItem('autorun', 'true');
            callback();
        }
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

const { dataStore } = require('../../scripts/dataStore');
const handler = require('../../scripts/handler');

const { ipcRenderer } = require('electron');

document.title = 'GoodbyeRKN';

const togglePowerBtn = () => {
    if (dataStore.GoodByeDPI.pid == undefined) {
        handler.onClicksHandlers.toggleOnDPI();
    } else {
        handler.onClicksHandlers.toggleOffDPI();
    }

    reDrawState();

    console.log(dataStore.GoodByeDPI.pid);
};

const reDrawState = () => {
    if (dataStore.GoodByeDPI.pid == undefined) {
        document.querySelector('#powerBtn > h1').textContent = 'Выключено';
        document.querySelector('#powerBtn > h2').textContent =
            'Пакеты не обрабатываются';
        document
            .getElementsByClassName('main')[0]
            .classList.replace('main_on', 'main_off');
    } else {
        document.querySelector('#powerBtn > h1').textContent = 'Включено';
        document.querySelector('#powerBtn > h2').textContent =
            'Пакеты обрабатываются';
        document
            .getElementsByClassName('main')[0]
            .classList.replace('main_off', 'main_on');
    }
};

handler.registerNewClick('powerBtn', togglePowerBtn);

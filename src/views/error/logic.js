const { dataStore } = require('../../scripts/dataStore');
const handler = require('../../scripts/handler');

const { ipcRenderer } = require('electron');

document.title = "GoodbyeRKN | Ошибка";

onload = () => {
    document.getElementById('error-log').value = localStorage.getItem('lastError');
}
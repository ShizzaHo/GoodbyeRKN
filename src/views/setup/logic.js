const { ipcRenderer } = require('electron');
const handler = require('../../scripts/handler');
const { shell } = require('electron');
const extract = require('extract-zip')

document.title = 'GoodbyeRKN | Первончальная настройка';

onload = () => {
    if (localStorage.getItem("first-setup") == null) {
        //localStorage.setItem("first-setup", "true");
        ipcRenderer.send('startSetup');
    }

    ipcRenderer.send('startSetup');

    document.getElementById('main_01').style.display = 'none';
    document.getElementById('main_02').style.display = 'none';
    document.getElementById('main_03').style.display = 'none';

    step1();
}

const step1 = () => {
    document.getElementById('main_01').style.display = 'block';
    document.getElementById('main_02').style.display = 'none';
    document.getElementById('main_03').style.display = 'none';
}

const step2 = () => {
    document.getElementById('main_01').style.display = 'none';
    document.getElementById('main_02').style.display = 'block';
    document.getElementById('main_03').style.display = 'none';
}

const step3 = () => {
    document.getElementById('main_01').style.display = 'none';
    document.getElementById('main_02').style.display = 'none';
    document.getElementById('main_03').style.display = 'block';

    document.getElementById('m03_b1').style.display = 'none';

    document.getElementById('m03_text').innerHTML = "";

    setTimeout(() => {
        createDefaultConfig();
    }, 1000);
}

const createDefaultConfig = async () => {
    try {
        await extract("../defaultConfigs.zip", { dir: path.join(os.homedir(), 'Documents', 'GoodbyeRKN', 'configs') })
        document.getElementById('m03_text').innerHTML += "<span>Создание дефолтного конфига: <span style='color: #44FF00;'>✓</span></span>";
      } catch (err) {
        document.getElementById('m03_text').innerHTML += "<span>Создание дефолтного конфига: <span style='color: #FF0000;'>✕</span></span>";
      }
}

handler.registerNewClick('m01_b1', () => {
    shell.openExternal("https://github.com/ShizzaHo/GoodbyeRKN");
});

handler.registerNewClick('m01_b2', () => {
    shell.openExternal("https://github.com/ValdikSS/GoodbyeDPI");
});

handler.registerNewClick('m01_b3', () => {
    step2();
});

handler.registerNewClick('m02_b1', () => {
    step1();
});

handler.registerNewClick('m02_b2', () => {
    step3();
});
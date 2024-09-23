const { ipcRenderer } = require('electron');
const handler = require('../../scripts/handler');
const { shell } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

document.title = 'GoodbyeRKN | Первончальная настройка';

const configObjectTemplate = {
    desc: '',
    params: [
        {
            active: false,
            param: '-p',
            value: '',
        },
        {
            active: false,
            param: '-q',
            value: '',
        },
        {
            active: false,
            param: '-r',
            value: '',
        },
        {
            active: false,
            param: '-s',
            value: '',
        },
        {
            active: false,
            param: '-m',
            value: '',
        },
        {
            active: false,
            param: '-f <value>',
            value: '',
        },
        {
            active: false,
            param: '-k <value>',
            value: '',
        },
        {
            active: false,
            param: '-n',
            value: '',
        },
        {
            active: false,
            param: '-e <value>',
            value: '',
        },
        {
            active: false,
            param: '-a',
            value: '',
        },
        {
            active: false,
            param: '-w',
            value: '',
        },
        {
            active: false,
            param: '--port <value>',
            value: '',
        },
        {
            active: false,
            param: '--ip-id <value>',
            value: '',
        },
        {
            active: false,
            param: '--dns-addr <value>',
            value: '',
        },
        {
            active: false,
            param: '--dns-port <value>',
            value: '',
        },
        {
            active: false,
            param: '--dnsv6-addr <value>',
            value: '',
        },
        {
            active: false,
            param: '--dnsv6-port <value>',
            value: '',
        },
        {
            active: false,
            param: '--dns-verb',
            value: '',
        },
        {
            active: false,
            param: '--blacklist <value>',
            value: '',
        },
        {
            active: false,
            param: '--allow-no-sni',
            value: '',
        },
        {
            active: false,
            param: '--frag-by-sni',
            value: '',
        },
        {
            active: false,
            param: '--set-ttl <value>',
            value: '',
        },
        {
            active: false,
            param: '--auto-ttl',
            value: '',
        },
        {
            active: false,
            param: '--min-ttl <value>',
            value: '',
        },
        {
            active: false,
            param: '--wrong-chksum',
            value: '',
        },
        {
            active: false,
            param: '--wrong-seq',
            value: '',
        },
        {
            active: false,
            param: '--native-frag',
            value: '',
        },
        {
            active: false,
            param: '--reverse-frag',
            value: '',
        },
        {
            active: false,
            param: '--fake-from-hex <value>',
            value: '',
        },
        {
            active: false,
            param: '--fake-gen <value>',
            value: '',
        },
        {
            active: false,
            param: '--fake-resend <value>',
            value: '',
        },
        {
            active: false,
            param: '--max-payload <value>',
            value: '',
        },
        {
            active: false,
            param: '<value>',
            note: 'special',
            value: '',
        },
    ],
};

onload = () => {
    if (localStorage.getItem('first-setup') == null) {
        ipcRenderer.send('startSetup');
    }

    document.getElementById('main_01').style.display = 'none';
    document.getElementById('main_02').style.display = 'none';
    document.getElementById('main_03').style.display = 'none';

    step1();
};

const step1 = () => {
    document.getElementById('main_01').style.display = 'block';
    document.getElementById('main_02').style.display = 'none';
    document.getElementById('main_03').style.display = 'none';
};

const step2 = () => {
    document.getElementById('main_01').style.display = 'none';
    document.getElementById('main_02').style.display = 'block';
    document.getElementById('main_03').style.display = 'none';
};

const step3 = () => {
    document.getElementById('main_01').style.display = 'none';
    document.getElementById('main_02').style.display = 'none';
    document.getElementById('main_03').style.display = 'block';

    document.getElementById('m03_b1').style.display = 'none';

    document.getElementById('m03_text').innerHTML = '';

    setTimeout(() => {
        createDefaultConfig();
    }, 1000);
};

const createDefaultConfig = async () => {
    const filePath = path.join(
        os.homedir(),
        'Documents',
        'GoodbyeRKN',
        'configs',
        'default.json'
    );

    fs.writeFileSync(filePath, JSON.stringify(configObjectTemplate, null, 4));

    document.getElementById('m03_text').innerHTML +=
        "<span>Создание дефолтного конфига: <span style='color: #44FF00;'>✓</span></span><br/>";

    const result = confirm(
        'Хотите создать дополнительные базовые конфиги (обход замедления ютуба)'
    );

    if (result) {
        createDefaultConfigAddition();
        setTimeout(() => {
            document.getElementById('m03_text').innerHTML +=
                "<span>Создание дополнительных конфигов: <span style='color: #44FF00;'>✓</span></span><br/>";
            finallySetup();
        }, 1000);
    } else {
        document.getElementById('m03_text').innerHTML +=
            "<span>Создание дополнительных конфигов: <span style='color: #FF0000;'>✕</span></span><br/>";
        finallySetup();
    }
};

const createDefaultConfigAddition = () => {
    const russianYoutubeVariant1 = configObjectTemplate;
    russianYoutubeVariant1.desc = "Скажем РКН пока, ведь этот конфиг убирает замедление YouTube";

    changeParamValue(
        russianYoutubeVariant1,
        '--blacklist <value>',
        '%included%'
    );
    changeParamValue(russianYoutubeVariant1, '<value>', '-7 -e1');

    const filePath = path.join(
        os.homedir(),
        'Documents',
        'GoodbyeRKN',
        'configs',
        'russian-youtube-variant1.json'
    );

    const filePathTxt = path.join(
        os.homedir(),
        'Documents',
        'GoodbyeRKN',
        'configs',
        'russian-youtube-variant1.txt'
    );

    fs.writeFileSync(filePath, JSON.stringify(russianYoutubeVariant1, null, 4));
    fs.writeFileSync(
        filePathTxt,
        `youtube.com\nyoutu.be\ngooglevideo.com\nytimg.com\ni.ytimg.com\n`
    );

    const russianYoutubeVariant2 = configObjectTemplate;
    russianYoutubeVariant2.desc = "Скажем РКН пока, ведь этот конфиг убирает замедление YouTube";

    changeParamValue(
        russianYoutubeVariant2,
        '--blacklist <value>',
        '%included%'
    );
    changeParamValue(russianYoutubeVariant2, '<value>', '-5');

    const filePath2 = path.join(
        os.homedir(),
        'Documents',
        'GoodbyeRKN',
        'configs',
        'russian-youtube-variant2.json'
    );

    const filePathTxt2 = path.join(
        os.homedir(),
        'Documents',
        'GoodbyeRKN',
        'configs',
        'russian-youtube-variant2.txt'
    );

    fs.writeFileSync(
        filePath2,
        JSON.stringify(russianYoutubeVariant2, null, 4)
    );
    fs.writeFileSync(
        filePathTxt2,
        `youtube.com\nyoutu.be\ngooglevideo.com\nytimg.com\ni.ytimg.com\n`
    );
};

const finallySetup = () => {
    localStorage.setItem('first-setup', 'true');
    localStorage.setItem('config', 'default.json');

    setTimeout(() => {
        document.getElementById('m03_text').innerHTML +=
            "<span>Завершение первоначальной настройки: <span style='color: #44FF00;'>✓</span></span><br/>";

        document.getElementById('m03_b1').style.display = 'block';
    }, 1000);
};

const changeParamValue = (obj, param, value) => {
    obj.params.forEach((item) => {
        if (item.param === param) {
            item.value = value;
            item.active = true;
        }
    });
};

handler.registerNewClick('m01_b1', () => {
    shell.openExternal('https://github.com/ShizzaHo/GoodbyeRKN');
});

handler.registerNewClick('m01_b2', () => {
    shell.openExternal('https://github.com/ValdikSS/GoodbyeDPI');
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

handler.registerNewClick('m03_b1', () => {
    ipcRenderer.send('openMain');
    setTimeout(() => {
        ipcRenderer.send('stopSetup');
    }, 1000)
});

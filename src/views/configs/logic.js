const { dataStore } = require('../../scripts/dataStore');
const handler = require('../../scripts/handler');

const fs = require('fs');
const path = require('path');
const os = require('os');
const { shell } = require('electron');

document.title = 'GoodbyeRKN | Настройки > Настройки и конфиги GoodbyeDPI ';

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

const configObjectDesc = [
    {
        param: '-p',
        value: 'заблокировать пассивный DPI',
    },
    {
        param: '-q',
        value: 'заблокировать QUIC/HTTP3',
    },
    {
        param: '-r',
        value: 'заменить Host на hoSt',
    },
    {
        param: '-s',
        value: 'удалить пробел между заголовком host и его значением',
    },
    {
        param: '-m',
        value: 'изменить регистр заголовка Host (test.com -> tEsT.cOm)',
    },
    {
        param: '-f <value>',
        value: 'установить значение фрагментации HTTP',
    },
    {
        param: '-k <value>',
        value: 'включите постоянную фрагментацию HTTP (keep-alive) и установите для нее значение',
    },
    {
        param: '-n',
        value: 'не ждите подтверждения первого сегмента, когда -k включен',
    },
    {
        param: '-e <value>',
        value: 'установите для фрагментации HTTPS значение',
    },
    {
        param: '-a',
        value: 'дополнительный пробел между Method и Request-URI (включает -s, может нарушать работу сайтов)',
    },
    {
        param: '-w',
        value: 'попытаться найти и проанализировать HTTP-трафик на всех обрабатываемых портах (не только на порту 80)',
    },
    {
        param: '--port <value>',
        value: 'дополнительный TCP-порт для выполнения фрагментации (и HTTP-трюков с -w)',
    },
    {
        param: '--ip-id <value>',
        value: 'обрабатывает дополнительный IP-идентификатор (десятичный, перенаправляющий и TCP-RST с этим идентификатором).',
    },
    {
        param: '--dns-addr <value>',
        value: 'перенаправляет запросы UDP DNS на указанный IP-адрес (экспериментальный).',
    },
    {
        param: '--dns-port <value>',
        value: 'перенаправляет запросы UDP DNS на указанный порт (по умолчанию 53)',
    },
    {
        param: '--dnsv6-addr <value>',
        value: 'перенаправляет запросы UDPv6 DNS на указанный IPv6-адрес',
    },
    {
        param: '--dnsv6-port <value>',
        value: 'перенаправляет запросы UDPv6 DNS на указанный порт (по умолчанию 53)',
    },
    {
        param: '--dns-verb',
        value: 'выводит подробные сообщения о перенаправлении DNS',
    },
    {
        param: '--blacklist <value>',
        value: 'выполняет обходные действия только для имен хостов и поддоменов из предоставленного текстового файла (см. подсказку внизу окна)',
    },
    {
        param: '--allow-no-sni',
        value: 'выполнить обход, если TLS SNI не может быть обнаружен при включенном --blacklist.',
    },
    {
        param: '--frag-by-sni',
        value: 'если SNI обнаружен в TLS-пакете, фрагментируйте пакет прямо перед значением SNI',
    },
    {
        param: '--set-ttl <value>',
        value: 'активируйте режим ложного запроса и отправьте его с указанным значением TTL | ОПАСНО! Может привести к неожиданному повреждению веб-сайтов.',
    },
    {
        param: '--auto-ttl',
        value: 'активирует режим ложного запроса, автоматически определяет TTL и уменьшает это зависит от расстояния. Если расстояние меньше a2, TTL уменьшается на a2. Если оно длиннее, используется шкала (a1; a2), а в качестве веса используется расстояние',
    },
    {
        param: '--min-ttl <value>',
        value: 'минимальное расстояние TTL (128/64 TTL), на которое можно отправить ложный запрос',
    },
    {
        param: '--wrong-chksum',
        value: 'активирует режим ложного запроса и отправляет его с неверной контрольной суммой TCP. Может не работать на виртуальной машине или с некоторыми маршрутизаторами, но безопаснее, чем set-ttl.',
    },
    {
        param: '--wrong-seq',
        value: 'активировать режим поддельного запроса и отправлял его с помощью TCP SEQ/ACK.',
    },
    {
        param: '--native-frag',
        value: 'фрагментирует (разделяет) пакеты, отправляя их меньшими пакетами, без уменьшение размера окна. Работает быстрее (не замедляет соединение)',
    },
    {
        param: '--reverse-frag',
        value: 'фрагментирует (разделяет) пакеты так же, как и --native-frag, но отправляет их в обратном порядке. Работает с веб-сайтами, которые не смогли обработать сегментированный HTTPS TLS ClientHello (потому что они получают поток TCP "в сочетании").',
    },
    {
        param: '--fake-from-hex <value>',
        value: 'Загружает поддельные пакеты для режима поддельного запроса из шестнадцатеричных значений (например, 1234abcDEF)',
    },
    {
        param: '--fake-gen <value>',
        value: 'Генерирует произвольно заполненные поддельные пакеты для режима запроса поддельных данных, их значение(до 30)',
    },
    {
        param: '--fake-resend <value>',
        value: 'Отправляет значение каждого поддельного пакета несколько раз. По умолчанию: 1 (отправляет каждый пакет один раз).',
    },
    {
        param: '--max-payload <value>',
        value: 'Пакеты с данными полезной нагрузки TCP, превышающими [значение], обрабатываться не будут.',
    },
    {
        param: '<value>',
        value: 'Пользовательские аргмуенты, посмотреть можно в официальном github goodbyedpi (ValdikSS/GoodbyeDPI)',
    },
]

let editableName = '';
let editableConfig = null;

const updateConfigList = () => {
    const configFiles = getJsonFilesSync(
        path.join(os.homedir(), 'Documents', 'GoodbyeRKN', 'configs')
    );
    const configList = document.getElementById('config-list');
    configList.innerHTML = `<option value="new">- Создание нового конфига -</option>`;

    configFiles.map((item) => {
        configList.innerHTML += `<option value="${path.basename(
            item
        )}">${path.basename(item)} | ${getDescConfig(item)}</option>`;
    });
};

const getJsonFilesSync = (dir) => {
    try {
        const files = fs.readdirSync(dir);
        const jsonFiles = files
            .filter((file) => path.extname(file) === '.json')
            .map((file) => path.join(dir, file));

        return jsonFiles;
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
};

const getDescConfig = (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const config = JSON.parse(fileContent);
        return config.desc || 'Описание отсутствует';
    } catch (error) {
        console.error(`Ошибка при чтении файла ${filePath}:`, error);
        return 'Ошибка чтения файла';
    }
};

const onConfigSelect = (e) => {
    if (e.target.value == 'new') {
        changePageForNewConfig();
    } else {
        generateDomConfig(
            readConfigData(
                path.join(
                    os.homedir(),
                    'Documents',
                    'GoodbyeRKN',
                    'configs',
                    e.target.value
                )
            )
        );
        changePageForEditConfig();
        editableName = e.target.value;
    }
};

const changePageForNewConfig = () => {
    document.getElementById('config-new').style.display = 'block';
    document.getElementById('config-edit').style.display = 'none';
};

const changePageForEditConfig = () => {
    document.getElementById('config-new').style.display = 'none';
    document.getElementById('config-edit').style.display = 'block';
};

const createNewConfig = () => {
    const newConfig = configObjectTemplate;

    const name = document.getElementById('createConfig-name').value;
    const desc = document.getElementById('createConfig-desc').value;
    const filePath = path.join(
        os.homedir(),
        'Documents',
        'GoodbyeRKN',
        'configs',
        name + '.json'
    );

    newConfig.desc = desc;

    fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 4));
    updateConfigList();
};

const openConfigFolder = () => {
    shell.openPath(
        path.join(os.homedir(), 'Documents', 'GoodbyeRKN', 'configs')
    );
};

const readConfigData = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(fileContent);
    return config;
};

const generateDomConfig = (config) => {
    const configData = document.getElementById('config-data');
    configData.innerHTML = '';
    editableConfig = config;

    document.getElementById('editConfig-desc').value = editableConfig.desc || '';

    editableConfig.params.map((item) => {
        configData.innerHTML += `<div class="config__param">
                <div>
                    <input type="checkbox" id="config-param-${item.param}">
                </div>
                <div class="config__param__value">
                    <h1>${item.param}</h1>
                    <span>${findParamDesc(item.param)}</span>
                    <input placeholder="value" value="${item.value}" id="config-value-${item.param}" value="${item.value}" />
                </div>
            </div>`;

        setTimeout(() => { 
            handler.registerNewChange(`config-param-${item.param}`, (e) => {
                changeParamActive(item.param, e);
            });
    
            handler.registerNewChange(`config-value-${item.param}`, (e) => {
                changeParamValue(item.param, e);
            });

            document.getElementById(`config-param-${item.param}`).checked = item.active;
            console.log(item.param);
            
            document.getElementById(`config-value-${item.param}`).style.display = item.param.indexOf("<value>")  >= 0 ? 'block' : 'none';
        }, 100);
    });
};

const findParamDesc = (paramName) => {
    const config = configObjectDesc.find(item => item.param === paramName);
    return config ? config.value : "Описание не найдено";
}

const changeParamActive = (param, e) => {
    editableConfig.params.forEach((item) => {
        if (item.param === param) {
            item.active = e.target.checked;
        }
    });
};

const changeParamValue = (param, e) => {
    editableConfig.params.forEach((item) => {
        if (item.param === param) {
            item.value = e.target.value;
        }
    });
};

const changeConfigDesc = () => {
    editableConfig.desc = document.getElementById('editConfig-desc').value;
}

const saveConfig = () => {
    fs.writeFileSync(
        path.join(
            os.homedir(),
            'Documents',
            'GoodbyeRKN',
            'configs',
            editableName
        ),
        JSON.stringify(editableConfig, null, 4)
    );

    updateConfigList();
    changePageForNewConfig();
};

const selectConfig = (e) => {
    if (editableName.indexOf('.json') >= 0) {
        localStorage.setItem('config', editableName);
        alert("Конфигурация выбрана");
    }
}

window.onload = () => {
    updateConfigList();
    changePageForNewConfig();
};

handler.registerNewChange('config-list', onConfigSelect);
handler.registerNewClick('createConfig-create', createNewConfig);
handler.registerNewClick('config-openFolder', openConfigFolder);
handler.registerNewClick('editConfig-save', saveConfig);
handler.registerNewChange('editConfig-desc', changeConfigDesc);
handler.registerNewClick('config-selectConfig', selectConfig);
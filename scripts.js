let writtenIDs = []; // Ira almacenando los mensajes que ya escribio

function writeMessage(username, message, date, id) {
    if (writtenIDs.indexOf(id) !== -1) return;
    let cont = document.getElementById('chatcontainer');
    cont.innerHTML = `
    <div class="message">
        <div class="header">
            <div class="username">@${username}</div>
            <div class="date">${date}</div>
        </div>
        <div class="message">${message}</div>
    </div>` + cont.innerHTML;
    writtenIDs.push(id);
}

function loadMessages() {
    // console.log('Cargando mensajes desde el servidor');
    let xhr = new XMLHttpRequest();
    let password = new FormData();
    password.append('password', document.getElementById('password').value);
    xhr.open('POST', 'read.py');
    xhr.timeout = 300;
    xhr.onload = function (data) {
        // noinspection JSUnresolvedVariable
        let messages = JSON.parse(data.currentTarget.responseText);
        let keys = Object.keys(messages);
        keys = keys.reverse();
        for (let i = 0; i < keys.length; i += 1) {
            let key = keys[i];
            if (messages.hasOwnProperty(key)) {
                writeMessage(messages[key][0], messages[key][1], messages[key][2], messages[key][3]);
            }
        }
    }
    xhr.onerror = function () {
        console.warn('Error al cargar los mensajes');
    }
    xhr.send(password);
}

function initApp() {
    console.log('Iniciando la aplicación');
    setInterval(function () {
        loadMessages();
    }, 500);
    let pwd = document.getElementById('password');
    pwd.onchange = function () {
        let cont = document.getElementById('chatcontainer');
        cont.innerHTML = '';
        writtenIDs = [];
    }
}

function submitMessage() {
    let msgError = '';
    let nombre = document.getElementById('uname').value;
    let message = document.getElementById('message').value;
    let password = document.getElementById('password').value;

    if (nombre.length === 0 && message.length === 0) {
        mostrarError('Formulario vacío');
        return false;
    }

    let regex = /^[a-zA-Z ]*$/;
    if (nombre.length < 4 || nombre.length > 10 || !regex.test(nombre)) {
        msgError += 'Nombre invalido, ';
    }
    if (message.length < 1 || message.length > 256) {
        msgError += 'Mensaje invalido, ';
    }
    if (password.length < 4 || password.length > 32) {
        msgError += 'Password incorrecta';
    }

    mostrarError(msgError);
    if (msgError === '') {
        let formdata = new FormData();
        formdata.append('uname', nombre);
        formdata.append('message', message);
        formdata.append('password', password);
        let request = new XMLHttpRequest();
        request.open('POST', 'write.py');
        request.send(formdata);
        request.onload = function (data) {
            // noinspection JSUnresolvedVariable
            /** @type {string}*/ let datatext = data.currentTarget.responseText;
            if (datatext.includes('ERROR')) {
                mostrarError(datatext);
            } else {
                console.log('Mensaje escrito exitosamente');
                loadMessages();
                document.getElementById('message').value = '';

            }
        }
    }
    return false;
}

function mostrarError(msg) {
    let contenedor = document.getElementById('error');
    if (msg === '') {
        contenedor.style.display = 'none';
        return true;
    }
    contenedor.innerHTML = msg;
    contenedor.style.display = 'block';
    contenedor.style.fontWeight = '800';
    setTimeout(function () {
        contenedor.style.display = 'none';
    }, 5000); // Después de 5 segundos se oculta el error
}
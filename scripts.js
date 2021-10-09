let WRITTEN_IDS = []; // Stores read IDs

/**
 * String.format().
 */
if (!String.prototype.format) {
    String.prototype.format = function () {
        let $args = arguments;
        return this.replace(/{(\d+)}/g, function ($match, $number) {
            return typeof $args[$number] !== 'undefined' ? $args[$number] : $match;
        });
    };
}

/**
 * This method initializes the app and events.
 */
function init_app() {
    console.log('Init app');
    setInterval(function () {
        load_messages();
    }, 500);
    let pwd = document.getElementById('password');

    // If password is changed, the messages are cleared
    pwd.onchange = function () {
        let cont = document.getElementById('chatcontainer');
        cont.innerHTML = '';
        WRITTEN_IDS = [];
        load_messages(true);
    }

    // Computes the max height of the chat window based on the page size
    let get_chat_max_size = function () {
        // Get elements height
        let window_h = window.innerHeight;
        let form_h = document.getElementById('form').offsetHeight;
        let title_h = document.getElementById('title').offsetHeight;
        let margin = 110;
        let max_height = window_h - form_h - title_h - margin;
        document.getElementById('chatcontainer').style['max-height'] = '{0}px'.format(max_height);
    }
    window.onresize = get_chat_max_size;
    get_chat_max_size();

    // Disables the send button, as validate form is false on start
    load_messages(true);
}

/**
 * Load the messages from the server.
 */
function load_messages(show_no_messages = false) {
    // Creates the request
    let xhr = new XMLHttpRequest();
    let password = new FormData();
    password.append('password', document.getElementById('password').value);

    // Configures the xhr request
    xhr.open('POST', 'cgi-bin/read.py');
    xhr.timeout = 300;
    xhr.onload = function (data) {
        /** @type string */ let response = data.currentTarget.responseText.trim();
        let messages = {};
        let cont = document.getElementById('chatcontainer'); // Get the container

        if (response === '' || response === '{}') {
            if (show_no_messages) {
                let emojis = ['😢', '😰', '🙁', '😦', '🤤', '🤔', '🤫'];
                let emoji = emojis[Math.floor(Math.random() * emojis.length)]
                cont.innerHTML += '<div class="message-empty">There\'s no messages yet {0}</div>'.format(emoji);
            }
            return;
        }

        try {
            // noinspection JSUnresolvedVariable
            messages = JSON.parse(response);
        } catch (e) {
            write_error(response);
            return;
        }

        let keys = Object.keys(messages);
        keys = keys.reverse();
        for (let i = 0; i < keys.length; i += 1) {
            let key = keys[i];
            if (messages.hasOwnProperty(key)) {
                write_message(messages[key][0], messages[key][1], messages[key][2], messages[key][3]);
            }
        }
    }
    xhr.onerror = function () {
        write_error('An error has happened while loading the messages');
    }

    // Send the request
    xhr.send(password);
}

/**
 * Writes a message in the chat list.
 *
 * @param {string} username
 * @param {string} message
 * @param {string} date
 * @param {string} id
 */
function write_message(username, message, date, id) {
    if (WRITTEN_IDS.indexOf(id) !== -1) return;
    let cont = document.getElementById('chatcontainer');
    if (WRITTEN_IDS.length === 0) cont.innerHTML = '';
    cont.innerHTML = `
    <div class="message">
        <div class="header">
            <div class="username">@${username}</div>
            <div class="date">${date}</div>
        </div>
        <div class="message">${message}</div>
    </div>` + cont.innerHTML;
    WRITTEN_IDS.push(id);
}

/**
 * Validate the form inputs. Returns the error list.
 * If empty, there's no errors!
 *
 * @returns {string[]}
 */
function validate_form() {
    /** @type string[] */ let error = [];

    // Retrieve the form inputs
    let name = document.getElementById('uname').value;
    let message = document.getElementById('message').value;
    let password = document.getElementById('password').value;

    // Check data
    let regex = /^[a-zA-Z ]*$/;
    if (name.length < 4 || name.length > 10 || !regex.test(name)) {
        error.push('Invalid name')
    }
    if (message.length < 1 || message.length > 256) {
        error.push('Invalid message')
    }
    if (password.length < 4 || password.length > 32) {
        error.push('Invalid password')
    }

    // Set the button status
    document.getElementById('sendmessage').disabled = error.length !== 0;

    return error;
}

/**
 * Submit the message.
 *
 * @returns {boolean}
 */
function submit_message() {
    let name = document.getElementById('uname').value;
    let message = document.getElementById('message').value;
    let password = document.getElementById('password').value;
    let error = validate_form();

    if (error.length === 0) {
        // Create the data
        let formdata = new FormData();
        formdata.append('uname', name);
        formdata.append('message', message);
        formdata.append('password', password);

        // Create the request and send
        let request = new XMLHttpRequest();
        request.open('POST', 'cgi-bin/write.py');
        request.send(formdata);
        request.onload = function (data) {
            // noinspection JSUnresolvedVariable
            /** @type {string}*/ let datatext = data.currentTarget.responseText.trim();
            if (datatext !== 'OK') {
                write_error('The message could not be stored, an error has happened!');
            } else {
                console.log('Message uploaded successfully');
                load_messages();
                document.getElementById('message').value = '';
                validate_form(); // This disables the button
            }
        }
    } else {
        write_error(error.join()); // Writes the error by concatenating their elements with a comma
    }

    return false; // We don't want the form to trigger a page reload, thus, we return false
}

/**
 * Displays an error to the user.
 *
 * @param {string} msg - Message
 */
function write_error(msg) {
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
    }, 300000); // After 3 seconds the message dissapears
}
var ws = io.connect('https://chat.kieroth29.xyz');
var socketId;
var userId;

ws.on('connect', function () {
    socketId = ws.id;

    $("#users")
    .append(`
        <span class="user" id="${socketId}">
            <img src="images/ico_usuario.png">
            ${$("#username").val()}
        </span>
    `);
})

ws.on('clientLogin', function (data) {
    $("#messages")
    .append(`
        <div class="dialogo">
            <h4> ${data.username} </h4>
            <p> just logged in. </p>
        </div>
    `);

    if ($("#" + users).length == 0) {
        $("#users")
        .append(`
            <span class="user" id="${data.id}">
                <img src="images/ico_usuario.png">
                ${data.username}
                </span>
        `);
    }
});

$("#send").click(function () {
    let message = $("#message-input").val();
    $("#message-input").val("");

    ws.emit("clientMessage", { username: $("#username").val(), id: socketId, message: message });
});

$(document).keyup(function(e){ 
    let pressedKey = e.key;
    if(pressedKey==="Enter") e.preventDefault();
    if(pressedKey===" " || pressedKey==="Enter" || pressedKey===","|| pressedKey===";"){
        $("#send").trigger("click");
    }
});

ws.on('clientMessage', function (data) {
    $("#messages")
    .append(`
        <div class="dialogo">
            <h4> ${data.username} </h4>
            <p> ${data.message} </p>
        </div>
    `);

    window.scrollTo(0, document.body.scrollHeight);
});

ws.on('newConnection', function (data) {
    usersArray = data.onlineUsers;

    for (let i = 0; i < usersArray.length; i++) {
        if ($("#" + usersArray[i]).length == 0) {
            $("#users")
            .append(`
                <span class="user" id="${data.id}">
                    <img src="images/ico_usuario.png">
                    ${data.name}
                </span>
            `);
        }
    }
});

ws.on('userDisconnect', function (data) {
    $(`#${data.id}`).remove();
});
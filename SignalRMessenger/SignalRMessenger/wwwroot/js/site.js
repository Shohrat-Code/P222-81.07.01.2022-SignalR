"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
//document.getElementById("sendButton").disabled = true;

//connection.on("ReceiveMessage", function (user, message) {
//    var li = document.createElement("li");
//    document.getElementById("messagesList").appendChild(li);
//    li.textContent = `${user} says: ${message}`;
//});

connection.start().then(function () {
    document.getElementById("messengerButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendMessage", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});

document.getElementById("messengerButton").addEventListener("click", function (event) {
    var message = document.getElementById("messengerInput").value;
    var recieverId = document.getElementById("recieverId").value;

    connection.invoke("SendPrivateMessage", recieverId, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();

    var p = document.createElement("p");
    p.textContent = `${message}`;
    p.classList.add("sender");
    document.getElementsByClassName("messageContainer")[0].appendChild(p);

    document.getElementById("messengerInput").value = "";
});

connection.on("ReceiveMessage", function (senderName, message) {
    var p = document.createElement("p");
    p.textContent = `${message}`;
    p.classList.add("reciever");
    document.getElementsByClassName("messageContainer")[0].appendChild(p);
});

document.getElementById("messengerInput").addEventListener("focus", function (event) {
    var recieverId = document.getElementById("recieverId").value;

    connection.invoke("Typing", recieverId).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

connection.on("ShowTyping", function () {
    //<p class="typing">Typing...</p>
    var p = document.createElement("p");
    p.textContent = `Typing...`;
    p.classList.add("typing");
    document.getElementsByClassName("messageContainer")[0].appendChild(p);
});

document.getElementById("messengerInput").addEventListener("blur", function (event) {
    var recieverId = document.getElementById("recieverId").value;

    connection.invoke("HideTyping", recieverId).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

connection.on("HideTyping", function () {
    document.getElementsByClassName("typing")[0].remove();
});
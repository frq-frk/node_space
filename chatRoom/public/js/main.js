const chatForm = document.getElementById('chat-form');
const chatDiv = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users'); 

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})
// console.log(username, room);

const socket = io();

socket.emit('joinRoom', {username,room});

// get room and users
socket.on('roomUsers', ({room, users}) => {

    outputRoomName(room);
    outputUsers(users);

})


socket.on('message',(msg) => {
    // console.log(msg);
    outputMessage(msg);
    chatDiv.scrollTop = chatDiv.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // console.log(msg);
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})

// Outing functions

outputMessage = (msg) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.userName}<span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerHTML = room;
}

function outputUsers(users){
    usersList.innerHTML = `
        ${users.map( user => `<li>${user.userName}</li>`).join('')}
    `
}
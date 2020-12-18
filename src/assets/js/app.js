let socket = io();
let startButton = document.getElementById("startButton");
let loginSection = document.getElementById("loginSection");
let gameSection = document.getElementById("gameSection");
let updateButton = document.getElementById("testUpdate");
let killerCard = document.getElementById('killerCard');
let medicCard = document.getElementById('medicCard');
let passangerCard = document.getElementById('passangerCard');
let allPlayers = document.getElementsByClassName('player');
let timer = document.getElementById('timer');
rounds = 20;
roleA = "Passanger";

socket.on("connect", function() {

    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit('join', params, roleA, function(err) {
        if (err) {
            alert(err)
            window.location.href = '/';
        }
        else {
            console.log('No error.');
            console.log(roleA);
        }

    })
});
socket.on("updateUserList", (users) => {
    let players = document.getElementById('playerCol');
    //let colors = ["red", "blue", "black", "yellow", "green"]

    for(let i = 0; i < users.length-1; i++) {
        let playerDiv = document.createElement("DIV");
        let playerButton = document.createElement("BUTTON");
        let playerName = document.createElement("DIV");

        playerDiv.classList.add("col");
        playerButton.classList.add("playerButton");
        playerButton.classList.add("player");
        // playerButton.classList.add(users[i]);
        playerButton.id = users[i];
        playerName.innerHTML = users[i];
        //playerButton.style.backgroundColor = colors[i];

        playerDiv.appendChild(playerButton);
        playerDiv.appendChild(playerName);
        players.appendChild(playerDiv);
    }
});
socket.on("updateUserRole", () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', clickOnPlayer);
    }
})
function startGame() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit("startGame", params);
}









socket.on('killPlayer', () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', showIcon);
    }
    function showIcon() {
        let clickedUser = this.id;
        this.classList.add("fa");
        this.classList.add("fa-skull-crossbones");
        this.style.pointerEvents = "none";
        for(let a = 0; a<allPlayers.length; a++) {
            allPlayers[a].style.pointerEvents = "none";
        }
        console.log(clickedUser);
        socket.emit('isKilled', clickedUser);
    }
})

socket.on('testDeath', () => {
    window.alert('YOU ARE DEAD :XXX');
})
socket.on('updateDeadUser', (data) => {
    let a = document.getElementById(data);
    a.classList.remove('fa-skull-crossbones');
    a.classList.remove('player');
    a.classList.add('fa');
    a.classList.add('fa-3x');
    a.classList.add('fa-skull-crossbones');
    a.style.pointerEvents = "none";
})






socket.on('healPlayer', () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', showIcon);
    }
    function showIcon() {
        let clickedUser = this.id;
        this.classList.add("fa");
        this.classList.add("fa-heart");
        this.style.pointerEvents = "none";
        for(let a = 0; a<allPlayers.length; a++) {
            allPlayers[a].style.pointerEvents = "none";
        }
        console.log(clickedUser);
        socket.emit('isHealed', clickedUser);
    }
})
// socket.on('passPlayer', () => {
//     for(let i = 0; i<allPlayers.length; i++) {
//         allPlayers[i].style.pointerEvents = "none";
//     }
// })
function clickOnPlayer() {
    socket.emit('clickOnPlayer');
}



function endRound() {
    socket.emit('endRound');
}

function clearRoom() {
    for (let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].classList.remove('fa');
        allPlayers[i].classList.remove('fa-3x');
        allPlayers[i].classList.remove('fa-skull-crossbones');
        allPlayers[i].classList.remove('fa-heart');
        allPlayers[i].style.pointerEvents = "all";
    }
}

socket.on('clearRoom', () => {
    clearRoom();
})






socket.on('timerStart', () => {
    timerStart();
})
socket.on('blackScreen', () => {
    let blackScreen = document.getElementById('blackScreen');
    blackScreen.classList.remove("hideBlackScreen");
    blackScreen.classList.add("showBlackScreen");
})
socket.on('whiteScreen', () => {
    let blackScreen = document.getElementById('blackScreen');
    blackScreen.classList.remove("showBlackScreen");
    blackScreen.classList.add("hideBlackScreen");
})
socket.on('passangerCard', () => {
    killerCard.style.display = "none";
    medicCard.style.display = "none";
    passangerCard.style.display = "block";
})
socket.on('killerCard', () => {
    killerCard.style.display = "block";
    medicCard.style.display = "none";
    passangerCard.style.display = "none";
})
socket.on('medicCard', () => {
    killerCard.style.display = "none";
    medicCard.style.display = "block";
    passangerCard.style.display = "none";
})
function startRoundKiller() {
    socket.emit("blackScreenPassanger");
    socket.emit("blackScreenMedic");
    socket.emit("whiteScreenKiller");
    socket.emit('updateRounds', rounds);

    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].style.pointerEvents = "all";
    }
}
function startRoundMedic() {
    socket.emit("blackScreenKiller");
    socket.emit("blackScreenPassanger");
    socket.emit("whiteScreenMedic");
    socket.emit('updateRounds', rounds);

    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].style.pointerEvents = "all";
    }
}
function startRoundPassanger() {
    socket.emit("whiteScreenPassanger");
    socket.emit("whiteScreenKiller");
    socket.emit("whiteScreenMedic");
    socket.emit('updateRounds', rounds);
    endRound();

    // for(let i = 0; i<allPlayers.length; i++) {
    //     allPlayers[i].style.pointerEvents = "all";
    // }
}
socket.on('newRounds', (newRounds) => {
    rounds = newRounds;
    console.log(rounds);
    timerStart();
})
function timerStart() {

    if(rounds == 0) {
        let a = setInterval(function () {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(a);
                timer.innerHTML = 10;
                startRoundKiller();
            }
        }, 1000);
    }
    else if(rounds == 1) {
        let b = setInterval(function () {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(b);
                timer.innerHTML = 7;
                startRoundMedic();
            }
        }, 1000);
    }
    else if(rounds == 2) {
        let c = setInterval(function () {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(c);
                timer.innerHTML = 5;
                startRoundPassanger();
            }
        }, 1000);
    }
}

function testRole() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit('testRole', params);
}
socket.on('testRole', (data) => {
    console.log(data);
})
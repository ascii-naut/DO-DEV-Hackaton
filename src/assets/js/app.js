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
rounds = 0;
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

    for(let i = 0; i < users.length-1; i++) {
        let playerDiv = document.createElement("DIV");
        let playerButton = document.createElement("BUTTON");
        let playerName = document.createElement("DIV");

        playerDiv.classList.add("col");
        playerButton.classList.add("playerButton");
        playerButton.classList.add("player");
        playerName.innerHTML = users[i];

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
}

function startRoundMedic() {
    socket.emit("blackScreenKiller");
    socket.emit("blackScreenPassanger");
    socket.emit("whiteScreenMedic");
    socket.emit('updateRounds', rounds);
}

function startRoundPassanger() {
    socket.emit("whiteScreenPassanger");
    socket.emit("whiteScreenKiller");
    socket.emit("whiteScreenMedic");
    socket.emit('updateRounds', rounds);
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


socket.on('killPlayer', () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', showIcon);
    }
    function showIcon() {
        this.classList.add("fa");
        this.classList.add("fa-skull-crossbones");
        for(let a = 0; a<allPlayers.length; a++) {
            allPlayers[a].style.pointerEvents = "none";
        }
    }
})



function clickOnPlayer() {
    socket.emit('clickOnPlayer');
}




function killerScreen() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit('killerScreen', params);
}

socket.on('killerScreen', (data) => {
    console.log(data);
})
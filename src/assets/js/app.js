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

let isDiscussion = false;
rounds = 10;
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
    let colors = ["#ff7e7e", "#9393ff", "#f5ff80", "#91ff8c", "#ff8cf4", "#cb8cff", "black", "#a1ffe7", "#868686"]

    for(let i = 0; i < users.length-1; i++) {
        let playerDiv = document.createElement("DIV");
        let playerButton = document.createElement("BUTTON");
        let playerName = document.createElement("DIV");

        playerDiv.classList.add("col");
        playerButton.classList.add("playerButton");
        playerButton.classList.add("player");
        playerButton.id = users[i];
        playerDiv.id = `${users[i]}-col`
        playerName.innerHTML = users[i];
        playerButton.style.border = `3px solid ${colors[i]}`;

        playerDiv.appendChild(playerButton);
        playerDiv.appendChild(playerName);
        players.appendChild(playerDiv);
    }
});
socket.on('removeSelf', (user) => {
     let self = document.getElementById(`${user}-col`);
     self.style.display = "none";
    //console.log(`${user}-col`);
})
socket.on("updateUserRole", () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', clickOnPlayer);
    }
})
function clickOnPlayer() {
    socket.emit('clickOnPlayer', isDiscussion);
}
function startGame() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit("startGame", params);
}


socket.on('votePlayer', () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', showIcon);
    }

    function showIcon() {
        let searchQuery = window.location.search.substring(1);
        params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
        let clickedUser = this.id;
        this.classList.add("fa");
        this.classList.add("fa-times");
        this.style.pointerEvents = "none";
        for(let a = 0; a<allPlayers.length; a++) {
            allPlayers[a].style.pointerEvents = "none";
        }
        console.log(clickedUser + "is healed");
        socket.emit('isVoted', clickedUser, params);
    }
})




// function refreshRound() {
//     socket.emit('refreshRound', 0);
// }


socket.on('healPlayer', () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', showIcon);
    }

    function showIcon() {
        let searchQuery = window.location.search.substring(1);
        params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
        let clickedUser = this.id;
        this.classList.add("fa");
        this.classList.add("fa-heart");
        this.style.pointerEvents = "none";
        for(let a = 0; a<allPlayers.length; a++) {
            allPlayers[a].style.pointerEvents = "none";
        }
        console.log(clickedUser + "is healed");
        socket.emit('isHealed', clickedUser, params);
    }
})

socket.on('killPlayer', () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', showIcon);
    }
    function showIcon() {
        let searchQuery = window.location.search.substring(1);
        params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
        let clickedUser = this.id;
        this.classList.add("fa");
        this.classList.add("fa-skull-crossbones");
        this.style.pointerEvents = "none";
        for(let a = 0; a<allPlayers.length; a++) {
            allPlayers[a].style.pointerEvents = "none";
        }
        console.log(clickedUser + "is killed");
        socket.emit('isKilled', clickedUser, params);
    }
})

socket.on('alertOnDeath', () => {
    let status = document.querySelector('.status');
    status.style.color = "red";
    status.innerHTML = "dead";
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
socket.on('alertOnVote', () => {
    let status = document.querySelector('.status');
    status.style.color = "red";
    status.innerHTML = "jailed";
})
socket.on('updateVotedPlayer', (data) => {
    let a = document.getElementById(data);
    a.classList.remove('fa-times');
    a.classList.remove('player');
    a.classList.add('fa');
    a.classList.add('fa-3x');
    a.classList.add('fa-times');
    a.style.pointerEvents = "none";
})



function endRound() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('endRound', isDiscussion, params);
}

socket.on('clearRoom', () => {
    clearRoom();

    function clearRoom() {
        for (let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].classList.remove('fa');
            allPlayers[i].classList.remove('fa-3x');
            allPlayers[i].classList.remove('fa-skull-crossbones');
            allPlayers[i].classList.remove('fa-heart');
            allPlayers[i].classList.remove('fa-times');
            allPlayers[i].style.pointerEvents = "all";
        }
    }
})


socket.on('gameIsEnded', () => {
    let a = setInterval(function () {
        let victory = document.getElementById('victory');
        let notVictory = document.getElementById('notVictory');

        notVictory.style.display = "none";
        victory.style.display = "block";
        clearInterval(a);
    }, 1000);
    let b = setInterval(function () {
        window.location.href = "/";
        clearInterval(b);
    }, 5000)
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
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    isDiscussion = false;
    socket.emit("blackScreenPassanger", params);
    socket.emit("blackScreenMedic", params);
    socket.emit("whiteScreenKiller", params);
    socket.emit('updateRounds', rounds);

    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].style.pointerEvents = "all";
    }
}
function startRoundMedic() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit("blackScreenKiller", params);
    socket.emit("blackScreenPassanger", params);
    socket.emit("whiteScreenMedic", params);
    socket.emit('updateRounds', rounds);

    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].style.pointerEvents = "all";
    }
}
function startRoundPassanger() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    isDiscussion = true;
    socket.emit("whiteScreenPassanger", params);
    socket.emit("whiteScreenKiller", params);
    socket.emit("whiteScreenMedic", params);
    socket.emit('updateRounds', rounds);
}

function checkEndGame() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('checkEndGame', params);
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
                timer.innerHTML = 5;
                startRoundKiller();
            }
        }, 1000);
    }
    else if(rounds == 1) {
        let b = setInterval(function () {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(b);
                timer.innerHTML = 5;
                startRoundMedic();
            }
        }, 1000);
    }
    else if(rounds == 2) {
        let c = setInterval(function () {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(c);
                timer.innerHTML = 10;
                startRoundPassanger();
            }
        }, 1000);
    }
    else if(rounds == 3) {
        let d = setInterval(function () {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(d);
                timer.innerHTML = 10;
                endRound();
            }
        }, 1000)
    }
}

function testRole() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit('testRole', params);
}

// function setParams() {
//     let searchQuery = window.location.search.substring(1);
//     params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

//     return params;
// }
socket.on('testRole', (data) => {
    console.log(data);
})
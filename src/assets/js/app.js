let socket = io.connect('http://localhost:3000', {
    reconnection: false,
    transports: ['websocket'],
    upgrade: false
});
let startButton = document.getElementById("startButton");
let loginSection = document.getElementById("loginSection");
let gameSection = document.getElementById("gameSection");
let killerCard = document.getElementById('killerCard');
let medicCard = document.getElementById('medicCard');
let passangerCard = document.getElementById('passangerCard');
let allPlayers = document.getElementsByClassName('player');
let timer = document.getElementById('timer');
let startBtn = document.getElementById('startButton');

let isDiscussion = true;
let rounds = 30;

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
socket.on('removeUser', (data) => {
    let userButton = document.getElementById(data + "-col");
    userButton.style.display = 'none';
})
function startGame() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    let oldPlayers = document.getElementById('startingPlayers');
    let storyText = document.querySelector('.storyText');
    let nextText = document.getElementById('nextText');
    oldPlayers.parentNode.removeChild(oldPlayers);
    storyText.parentNode.removeChild(storyText);
    nextText.style.display = "block";

    socket.emit("startGame", params);
}
socket.on('updatePlayers', (users) => {
    let players = document.getElementById('startingPlayers');
    socket.emit('resetButtons');
    for(let i = 0; i < users.length; i++) {
        let playerDiv = document.createElement("DIV");
        let playerButton = document.createElement("BUTTON");
        let playerName = document.createElement("DIV");

        playerDiv.classList.add("col");
        playerButton.classList.add("playerButton");
        playerName.innerHTML = users[i];

        playerDiv.appendChild(playerButton);
        playerDiv.appendChild(playerName);
        players.appendChild(playerDiv);
    }
});
socket.on('resetButtons', () => {
    let players = document.getElementById('startingPlayers');
    let playersCol = document.getElementById('playerCol');
    players.innerHTML = "";
    playersCol.innerHTML = "";

})
socket.on("updateUserList", (users) => {
    let players = document.getElementById('playerCol');
    let colors = ["#ff7e7e", "#9393ff", "#f5ff80", "#91ff8c", "#ff8cf4", "#cb8cff", "black", "#a1ffe7", "#868686"]
    startBtn.style.display = "none";

    for(let i = 0; i < users.length; i++) {
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
        playerButton.addEventListener('click', clickOnPlayer);

        playerDiv.appendChild(playerButton);
        playerDiv.appendChild(playerName);
        players.appendChild(playerDiv);
    }
});
socket.on('removeSelf', (user) => {
     let self = document.getElementById(`${user}-col`);
     self.style.display = "none";
})

function clickOnPlayer() {
    socket.emit('clickOnPlayer', isDiscussion);
}

socket.on('votePlayer', () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', showIconVote);
    }
})
function showIconVote() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    let clickedUser = this.id;
    this.classList.remove("fa");
    this.classList.remove('fa-user-shield');
    this.classList.add("fa");
    this.classList.add("fa-times");
    this.style.pointerEvents = "none";
    for(let a = 0; a<allPlayers.length; a++) {
        allPlayers[a].style.pointerEvents = "none";
    }
    socket.emit('isVoted', clickedUser, params);
}
socket.on('healPlayer', () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', showIconHeal);
    }
})
function showIconHeal() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    let clickedUser = this.id;
    this.classList.remove("fa");
    this.classList.remove('fa-user-shield');
    this.classList.add("fa");
    this.classList.add("fa-laptop-medical");
    this.style.pointerEvents = "none";
    for(let a = 0; a<allPlayers.length; a++) {
        allPlayers[a].style.pointerEvents = "none";
    }
    socket.emit('isHealed', clickedUser, params);
}

socket.on('killPlayer', () => {
    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].addEventListener('click', showIconKill);
    }
})
function showIconKill() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    let clickedUser = this.id;
    this.classList.remove("fa");
    this.classList.remove('fa-user-shield'); // CONTINUE FROM HERE !!!!!
    this.classList.add("fa");
    this.classList.add("fa-skull-crossbones");
    this.style.pointerEvents = "none";
    for(let a = 0; a<allPlayers.length; a++) {
        allPlayers[a].style.pointerEvents = "none";
    }
    socket.emit('isKilled', clickedUser, params);
}


socket.on('medicIsDead', () => {
    let medicText = document.getElementById('medicStatus');
    medicText.innerHTML = "dead";
    medicText.classList.add('text-danger');
})

function endRound() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('endRound', params, isDiscussion);
}
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
function checkEndGame() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('checkEndGame', params);
}








function startRoundKiller() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('whiteScreenKiller', params);
    socket.emit("blackScreenPassanger", params);
    socket.emit("blackScreenMedic", params);

    socket.emit('updateRounds');

    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].style.pointerEvents = "all";
    }
}
function startRoundMedic() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit("blackScreenKiller", params);
    socket.emit('blackScreenPassanger', params);
    socket.emit("whiteScreenMedic", params);
    
    socket.emit('updateRounds');

    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].style.pointerEvents = "all";
    }
}

function startRoundPassanger() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit("whiteScreenKiller", params);
    socket.emit('whiteScreenMedic', params);
    socket.emit("whiteScreenPassanger", params);
    
    socket.emit('updateRounds');

    for(let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].style.pointerEvents = "all";
    }
}


socket.on('timerStart', () => {
    timerStatus();
})
socket.on('newRound', () => {
    rounds++;
    if(rounds == 4) {
        rounds = 0;
    }
    timerStatus();
})

function timerStatus() {
    if(rounds == 0) { // GET READY ROUND
        checkEndGame();
        let a = setInterval(() => {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(a);
                startRoundKiller();
                timer.innerHTML = 5;
            }
        }, 1000);
    }
    else if(rounds == 1) { // KILLER ROUND
        let b = setInterval(() => {
            for(let i = 0; i<allPlayers.length; i++) {
                allPlayers[i].removeEventListener('click', showIconVote);
                allPlayers[i].removeEventListener('click', showIconHeal);
                allPlayers[i].removeEventListener('click', showIconKill);
                allPlayers[i].removeEventListener('click', clickOnPlayer);
                isDiscussion = false;
                allPlayers[i].addEventListener('click', clickOnPlayer);
            }
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(b);
                startRoundMedic();
                timer.innerHTML = 5;
            }
        }, 1000);
    }
    else if(rounds == 2) { // MEDIC ROUND
        let b = setInterval(() => {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(b);
                endRound();
                for(let i = 0; i<allPlayers.length; i++) {
                    allPlayers[i].removeEventListener('click', showIconVote);
                    allPlayers[i].removeEventListener('click', showIconHeal);
                    allPlayers[i].removeEventListener('click', showIconKill);
                    allPlayers[i].removeEventListener('click', clickOnPlayer);
                    isDiscussion = true;
                    allPlayers[i].addEventListener('click', clickOnPlayer);
                }
                startRoundPassanger();
                timer.innerHTML = 15;
            }
        }, 1000);
    }
    else if(rounds == 3) { // PASSANGER ROUND
        resetStatus();
        let b = setInterval(() => {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(b);
                isDiscussion = true;
                endRound();
                socket.emit('updateRounds');
                timer.innerHTML = 5;
            }
        }, 1000);
    }
}


function resetStatus() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('resetStatus', params);
}







socket.on('updateDeadUser', (data) => {
    let a = document.getElementById(data);
    a.classList.remove('fa-skull-crossbones');
    a.classList.remove('fa-laptop-medical');
    a.classList.remove('fa-user-shield');
    a.classList.remove('fa');
    a.classList.remove('fa-3x');


    a.classList.add('fa');
    a.classList.add('fa-3x');
    a.classList.add('fa-skull-crossbones');
    a.classList.remove('player');
    a.style.pointerEvents = "none";
})
socket.on('updateVotedPlayer', (data) => {
    let a = document.getElementById(data);
    a.classList.remove('fa-times');
    a.classList.remove('fa-skull-crossbones');
    a.classList.remove('fa-laptop-medical');
    a.classList.remove('fa-user-shield');
    a.classList.remove('fa');
    a.classList.remove('fa-3x');


    a.classList.add('fa');
    a.classList.add('fa-3x');
    a.classList.add('fa-times');
    a.classList.remove('player');
    a.style.pointerEvents = "none";
})
socket.on('alertOnDeath', () => {
    let status = document.querySelector('.status');
    status.classList.add('text-danger');
    status.innerHTML = "dead";
})
socket.on('alertOnVote', () => {
    let status = document.querySelector('.status');
    status.style.color = "red";
    status.innerHTML = "jailed";
})
socket.on('clearRoom', () => {
    for (let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].classList.remove('fa');
        allPlayers[i].classList.remove('fa-3x');
        allPlayers[i].classList.remove('fa-skull-crossbones');
        allPlayers[i].classList.remove('fa-laptop-medical');
        allPlayers[i].classList.remove('fa-times');
        allPlayers[i].style.pointerEvents = "all";
    }
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
function testRole() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit('testRole', params);
}
socket.on('testRole', (data) => {
    console.log(data);
})
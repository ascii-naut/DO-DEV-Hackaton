let socket = io.connect('https://localhost', {
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

let isDiscussion = false;
let rounds = 0;

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
    oldPlayers.parentNode.removeChild(oldPlayers);

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
        playerName.style.fontSize = "30px";
        playerName.style.fontWeight = "800";
        playerName.classList.add("playerName");

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
        playerName.classList.add("playerName");
        playerName.style.fontSize = "30px";
        playerName.style.fontWeight = "800";
        playerButton.style.border = `5px solid black`;
        playerButton.style.backgroundColor = colors[i];
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

socket.on('medicIsJailed', () => {
    let medicText = document.getElementById('medicStatus');
    medicText.innerHTML = "down";
    medicText.classList.add('text-danger');
})

function endRound() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('endRound', params, isDiscussion);
}
function checkEndGame() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('checkEndGame', params);
}


socket.on('adminsWon', () => {
    rounds = 20
    let a = setInterval(function () {
        let victory = document.getElementById('notVictory');
        let story = document.getElementById('nextText');

        story.style.display = "none";

        victory.innerHTML = "Good job team. You caught the hacker. You <b class='text-success'>WON</b>!"
        clearInterval(a);
    }, 1000);
    let b = setInterval(function () {
        window.location.href = "/";
        clearInterval(b);
    }, 6000)
})

socket.on('killerLost', () => {
    rounds = 20
    let a = setInterval(function () {
        let victory = document.getElementById('notVictory');
        let story = document.getElementById('nextText');

        story.style.display = "none";
        

        victory.innerHTML = "The sysadmins managed to catch you. You <b class='text-danger'>LOST</b>."
        clearInterval(a);
    }, 1000);
    let b = setInterval(function () {
        window.location.href = "/";
        clearInterval(b);
    }, 6000)
})

socket.on('killerWon', () => {
    rounds = 20
    let a = setInterval(function () {
        let victory = document.getElementById('notVictory');
        let story = document.getElementById('nextText');

        story.style.display = "none";

        victory.innerHTML = "You are truly an outstanding mind. You managed to fool all of the sysadmins. You <b class='text-success'>WON</b>."
        clearInterval(a);
    }, 1000);
    let b = setInterval(function () {
        window.location.href = "/";
        clearInterval(b);
    }, 6000)
})

socket.on('adminsLost', () => {
    rounds = 20
    let a = setInterval(function () {
        let victory = document.getElementById('notVictory');
        let story = document.getElementById('nextText');

        story.style.display = "none";

        victory.innerHTML = "You did your best. However, the hacker is truly evasive and you did not catch him. You <b class='text-danger'>LOST</b>."
        clearInterval(a);
    }, 1000);
    let b = setInterval(function () {
        window.location.href = "/";
        clearInterval(b);
    }, 6000)
})



function startRoundKiller() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    let status = document.querySelector('.status');
    socket.emit('whiteScreenKiller', params);
    socket.emit("blackScreenPassanger", params);
    socket.emit("blackScreenMedic", params);

    socket.emit('updateRounds');

    if(status.innerHTML != 'alive') {
        for(let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].style.pointerEvents = "none";
        }
    }
    else if(status.innerHTML == 'alive') {
        for(let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].style.pointerEvents = "all";
        }
    }
}
function startRoundMedic() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    let status = document.querySelector('.status');
    socket.emit("blackScreenKiller", params);
    socket.emit('blackScreenPassanger', params);
    socket.emit("whiteScreenMedic", params);
    
    socket.emit('updateRounds');

    if(status.innerHTML != 'alive') {
        for(let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].style.pointerEvents = "none";
        }
    }
    else if(status.innerHTML == 'alive') {
        for(let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].style.pointerEvents = "all";
        }
    }
}

function startRoundPassanger() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    let status = document.querySelector('.status');
    socket.emit("whiteScreenKiller", params);
    socket.emit('whiteScreenMedic', params);
    socket.emit("whiteScreenPassanger", params);
    
    socket.emit('updateRounds');

    if(status.innerHTML != 'alive') {
        for(let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].style.pointerEvents = "none";
        }
    }
    else if(status.innerHTML == 'alive') {
        for(let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].style.pointerEvents = "all";
        }
    }
}

socket.on('gameStatusChange', () => {
    let gameStatus = document.getElementById('gameStatus');
    gameStatus.innerHTML = "Started";
    gameStatus.classList.add('text-success');

    let storyText = document.querySelector('.storyText');
    let nextText = document.getElementById('nextText');
    storyText.parentNode.removeChild(storyText);
    nextText.style.display = "block";
})

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
socket.on('alertOnVoteNotKiller', () => {
    let message = document.getElementById('jailMessage');
    message.style.display = "block";
    setTimeout(function() {
        message.style.display = "none";
    }, 2000)
})
socket.on('alertOnVoteKiller', () => {
    let message = document.getElementById('jailMessage');
    message.style.display = "block";
    message.innerHTML = "Good job, you caught the hacker!"
    message.classList.add("bg-success");
    message.classList.add("text-light");
    setTimeout(function() {
        message.style.display = "none";
    }, 2000)
})
socket.on('alertOnVoteMedic', () => {
    let message = document.getElementById('jailMessage');
    message.style.display = "block";
    message.innerHTML = "Oh no! The firewall has been hacked."
    message.classList.add("bg-warning");
    message.classList.add("text-dark");
    setTimeout(function() {
        message.style.display = "none";
    }, 2000)
})

function timerStatus() {
    if(rounds == 0) { // GET READY ROUND
        checkEndGame();
        for(let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].style.pointerEvents = "none";
        }
        let discuss = document.querySelector('.discuss');
        discuss.style.display = "none";
        let a = setInterval(() => {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 0) {
                clearInterval(a);
                startRoundKiller();
                timer.innerHTML = 10;
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
                timer.innerHTML = 10;
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
                timer.innerHTML = 120;
            }
        }, 1000);
    }
    else if(rounds == 3) { // PASSANGER ROUND
        resetStatus();
        checkEndGame();
        let discuss = document.querySelector('.discuss');
        discuss.style.display = "block";
        let b = setInterval(() => {
            timer.innerHTML -= 1;
            if(timer.innerHTML == 60) {
                let endButton = document.getElementById('endTimerButton');
                endButton.style.display = "block";
            }
            if(timer.innerHTML == 0) {
                clearInterval(b);
                isDiscussion = true;
                let endButton = document.getElementById('endTimerButton');
                endButton.style.display = "none";
                endRound();
                socket.emit('updateRounds');
                timer.innerHTML = 10;
            }
        }, 1000);
    }
}

function endTimerRound() {
    socket.emit('setTimerEnd');
}
socket.on('setTimerEnd', () => {
    timer.innerHTML = 1;
})


function resetStatus() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    socket.emit('resetStatus', params);
}


function startNightShift() {
    let nightBackground = document.getElementById('backgroundNight');
    nightBackground.classList.remove('slideUp');
    nightBackground.classList.add('slideDown');
}
function endNightShift() {
    let nightBackground = document.getElementById('backgroundNight');
    nightBackground.classList.remove('slideDown');
    nightBackground.classList.add('slideUp');
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
    let status = document.querySelector('.status');
    for (let i = 0; i<allPlayers.length; i++) {
        allPlayers[i].classList.remove('fa');
        allPlayers[i].classList.remove('fa-3x');
        allPlayers[i].classList.remove('fa-skull-crossbones');
        allPlayers[i].classList.remove('fa-laptop-medical');
        allPlayers[i].classList.remove('fa-times');
    }
    if(status.innerHTML != 'alive') {
        for(let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].style.pointerEvents = "none";
        }
    }
    else if(status.innerHTML == 'alive') {
        for(let i = 0; i<allPlayers.length; i++) {
            allPlayers[i].style.pointerEvents = "all";
        }
    }
})
socket.on('blackScreen', () => {
    //let blackScreen = document.getElementById('blackScreen');
    //blackScreen.classList.remove("hideBlackScreen");
    //blackScreen.classList.add("showBlackScreen");
    startNightShift();
})
socket.on('whiteScreen', () => {
    // let blackScreen = document.getElementById('blackScreen');
    // blackScreen.classList.remove("showBlackScreen");
    // blackScreen.classList.add("hideBlackScreen");
    endNightShift();
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
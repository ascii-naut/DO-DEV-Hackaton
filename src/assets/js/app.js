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

rounds = 30;
roleA = "Passanger";
let voteCount = 0;

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
        let data = i;
        allPlayers[i].addEventListener('click', votePlayer);
    }
})

function votePlayer() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    let clickedUser = this.id;
    //this.classList.add(`voted-${voteCount}`);
    this.style.pointerEvents = "none";
    for(let a = 0; a<allPlayers.length; a++) {
        allPlayers[a].style.pointerEvents = "none";
    }
    socket.emit('isVoted', clickedUser, params);
}




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
            allPlayers[i].style.pointerEvents = "all";
        }
    }
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
    socket.emit("whiteScreenPassanger", params);
    socket.emit("whiteScreenKiller", params);
    socket.emit("whiteScreenMedic", params);
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

// function setParams() {
//     let searchQuery = window.location.search.substring(1);
//     params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

//     return params;
// }
socket.on('testRole', (data) => {
    console.log(data);
})
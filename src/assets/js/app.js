let socket = io();
let startButton = document.getElementById("startButton");
let loginSection = document.getElementById("loginSection");
let gameSection = document.getElementById("gameSection");

let updateButton = document.getElementById("testUpdate");

roleA = 0;

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
            roleA++;
        }

    })
});

socket.on("updateUserList", (users) => {
    let players = document.getElementById('playerCol');
    

    for(let i = 0; i < users.length-1; i++) {
        let playerButton = document.createElement("BUTTON");
        let playerDiv = document.createElement("DIV");
        playerDiv.classList.add("col");
        playerButton.classList.add("playerButton");
        playerDiv.appendChild(playerButton);
        players.appendChild(playerDiv);
        console.log(users[i]);
    }
});

// socket.on("updateUserRole", (roles) => {
//     // let isKiller = false;
//     // let isMedic = false;
//     // let playerRole = [];

//     // for(let i = 0; i <= roles.length; i++) {
//     //     let random = Math.floor(Math.random() * 3)
//     //     if (random == 0 && !isKiller) {
//     //         playerRole[i] = "Killer";
//     //         isKiller = true;
//     //     }
//     //     else if (random == 1 && !isMedic) {
//     //         playerRole[i] = "Medic";
//     //         isMedic = true;
//     //     }
//     //     else {
//     //         playerRole[i] = "Passanger";
//     //     }
//     //     console.log(playerRole[i]);
//     //     socket.emit("getThis", (playerRole[i]));
//     // }

//     // for(let i=0; i<roles.length-1; i++) {
//     //     console.log(roles[1]);
//     // }

//     roles.forEach((role) => {
//         console.log(role);
//     })
// })

function hideLogin() {
  loginSection.style.display = "none";
  gameSection.style.display = "block";
}

socket.on("updateUserRole", (roles) => {

    let isKiller = false;
    let isMedic = false;
    let playerRole = [];

    for(let i = 0; i < roles.length; i++) {
        let random = Math.floor(Math.random() * 3)
        if (random == 0 && !isKiller) {
            playerRole[i] = "Killer";
            isKiller = true;
        }
        else if (random == 1 && !isMedic) {
            playerRole[i] = "Medic";
            isMedic = true;
        }
        else {
            playerRole[i] = "Passanger";
        }
    }
    for(let a = 0; a < playerRole.length-1; a++) {
        roles[a] = playerRole[a];
        console.log(roles[a]);
    }
    })

function updateFun() {
    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    let isKiller = false;
    let isMedic = false;
    let playerRole = [];

    socket.emit("testUpdate", params, playerRole);
    console.log("it works!");
}
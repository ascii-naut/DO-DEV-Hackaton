let playerCard = document.getElementById('playerCard');
let killPlayer = document.getElementsByClassName('player');

function hoverOnCard() {
    playerCard.addEventListener('mouseenter', () => {
        playerCard.classList.remove('playerCardHide');
        playerCard.classList.add('playerCardShow');
    });
    playerCard.addEventListener('mouseleave', () => {
        playerCard.classList.remove('playerCardShow');
        playerCard.classList.add('playerCardHide');
    });
}

function hoverOnKill() {
    for(let i=0; i<killPlayer.length; i++) {
        //this.killPlayer.classList.add('testClass');
        killPlayer[i].addEventListener('mouseenter', () => {
            killPlayer[i].classList.add('fa-skull');
            killPlayer[i].classList.add('killPlayer');
        });
        killPlayer[i].addEventListener('mouseleave', () => {
            killPlayer[i].classList.remove('fa-skull');
            killPlayer[i].classList.remove('killPlayer');
        })
    }
}

function hoverOnSave() {
    for(let i=0; i<killPlayer.length; i++) {
        //this.killPlayer.classList.add('testClass');
        killPlayer[i].addEventListener('mouseenter', () => {
            killPlayer[i].classList.add('fa-heart');
            killPlayer[i].classList.add('savePlayer');
        });
        killPlayer[i].addEventListener('mouseleave', () => {
            killPlayer[i].classList.remove('fa-heart');
            killPlayer[i].classList.remove('savePlayer');
        })
    }
}

function spawnBottomPlayer() {
    let playerButton = document.createElement("BUTTON");
    playerButton.classList.add('playerButton');
    document.getElementById('bottomPlayer').appendChild(playerButton);
};

function spawnEnemyPlayers() {
    let player = document.getElementsByClassName('playerCol');
    for (let i = 0; i < player.length; i++) {
        let playerButton = document.createElement("BUTTON");
        playerButton.classList.add('playerButton');
        console.log("it works!");
        player[i].appendChild(playerButton);
    }
}

function showRules() {
    console.log("It's working.");
}

function testThisFunction() {
    window.alert('Yes, it is somehow working.');
}

// function setReload() {
//     window.onbeforeunload = function(event)
//     {
//         return confirm("Confirm refresh");
//     };
// }

hoverOnCard();
// spawnBottomPlayer();
// spawnEnemyPlayers();
// hoverOnKill();
// hoverOnSave();
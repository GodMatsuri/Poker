let playerChips = 1000;
let currentBet = 0;
let won;
let bettingOpen = true;


function chipValue(){
    return playerChips
}

function betValue(){
    return currentBet
}

function bet(amount){
    if(amount > playerChips){
        return;
    }
    playerChips -= amount;
    currentBet += amount;

    displayChips();
}

function raise(amount) {

    if (amount > playerChips) {
        return;
    }

    playerChips -= amount;
    currentBet += amount;

    displayChips();
}

function payout(won){
    
    if (won){
        playerChips += (currentBet * 2)
    }
    currentBet = 0;

    displayChips();
}


function clearBet() {

    if (!bettingOpen) {
        return;
    }

    playerChips += currentBet;
    currentBet = 0;

    displayChips();
}

function displayChips(){
    document.getElementById("player-chips").textContent =
        chipValue();

    document.getElementById("player-bet").textContent =
        "$" + betValue();
}
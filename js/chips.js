let playerChips = 1000;
let opponentChips = 1000;
let playerBet = 0;
let opponentBet = 0;
let pot = 0;


let won;
let bettingOpen = true;


function chipValue(){
    return playerChips
}

function betPlayerValue(){
    return playerBet
}

function opponentChipValue(){
    return opponentChips
}

function opponentBetValue(){
    return opponentBet
}

function potValue() {
    return pot
}

function bet(amount){
    if(amount > playerChips){
        return;
    }
    playerChips -= amount;
    playerBet += amount;

    displayChips();
}

// Texas Poker Bot Bet
function betOpponent(amount){
    if(amount > opponentChips){
        return;
    }
    opponentChips -= amount;
    opponentBet += amount;

    displayChipsOpponent();
}

function raise(amount) {

    if (amount > playerChips) {
        return;
    }

    playerChips -= amount;
    playerBet += amount;

    displayChips();
}


function calculatePot() {
    pot = 0;
    pot = playerBet + opponentBet;

    displayChips();
    displayChipsOpponent();
    displayPot();
}


function payout(won){
    
    if (won){
        playerChips += pot
    }
    playerBet = 0;
    opponentBet = 0;

    displayChips();
}

// Texas Poker Bot Payout
function payoutOpponent(won){
    
    if (won){
        opponentChips += pot
    }
    playerBet = 0;
    opponentBet = 0;

    displayChipsOpponent();
}

function splitPot() {

    const halfPot = pot / 2;

    playerChips += halfPot;
    opponentChips += halfPot;

    playerBet = 0;
    opponentBet = 0;
    pot = 0;

    displayChips();
    displayChipsOpponent();
    displayPot();
}



function clearPot() {
    pot = 0;

    displayChips();
    displayChipsOpponent();
    displayPot();
}


function clearBet() {

    if (!bettingOpen) {
        return;
    }

    playerChips += playerBet;
    playerBet = 0;

    displayChips();
}

function displayChips(){
    document.getElementById("player-chips").textContent =
        "$" + chipValue();

    document.getElementById("player-bet").textContent =
        "$" + betPlayerValue();
}

// Texas Poker Bot Display Chips
function displayChipsOpponent(){
    document.getElementById("opponent-chips").textContent =
        "$" + opponentChipValue();

    document.getElementById("opponent-bet").textContent =
        "$" + opponentBetValue();
}

// Texas Poker Display Pot
function displayPot() {
    document.getElementById("pot-value").textContent =
        "$" + potValue();
}

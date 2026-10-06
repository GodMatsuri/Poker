const playerHand = [];
const dealerHand = [];

let dealerHiddenCard;
let raiseAmount = 20;

function dealStartingHand(dealerHand, playerHand, deck){
    for (let i = 0; i < 2; i++) {

        playerHand.push(dealCard(deck));
        dealerHand.push(dealCard(deck));
    }
}

function hit(hand, deck) {
    hand.push(dealCard(deck));
}


function calculateHandValue(hand){
    let total = 0
    let aces = 0

    for(let card of hand){
        
        if (card.rank === "A"){
            total += 11;
            aces++;

        }else {
            total += card.value
        }

        if (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }

    }
    return total
}


function stand(dealerHand, playerHand, deck){
    dealerTurn(dealerHand, deck);
    checkWinner(dealerHand, playerHand);
}

function dealerTurn(hand, deck){
    let handValue = calculateHandValue(hand);
    
    while (handValue < 17) {
        hit(hand, deck);
        handValue = calculateHandValue(hand)
    }

    revealDealerCard();
}
 
function double(){ 
    let doubleBet = playerBet;

    if(doubleBet > playerChips){ 
        return false;
    }

    bet(doubleBet);

    return true;
}

    
function checkWinner(dealerHand, playerHand) {
    const totalA = calculateHandValue(dealerHand);
    const totalB = calculateHandValue(playerHand);

    const result = document.getElementById("game-result");

    if (totalA > 21 && totalB <= 21) {
        result.textContent = "Dealer Busted! You Win";
        payout(true)
    } else if (totalB > 21 && totalA <= 21) {
        result.textContent = "You Busted! Dealer Wins";
        payout(false)
    } else if (totalA > totalB) {
        result.textContent = "Dealer " + totalA + ", Player " + totalB +", Dealer wins";
        payout(false)
    } else if (totalB > totalA) {
        result.textContent = "Dealer " + totalA + ", Player " + totalB +", Player wins";
        payout(true)
    } else { 
        result.textContent = "Tie"; 

        playerChips += playerBet;
        playerBet = 0;

        displayChips();
        calculatePot();
    }


    document.getElementById("game-buttons").style.display = "none";
    startCountdown();
    
    setTimeout(() => {
        startNewRound();
    }, 5000);
}

function newGame(dealerHand, playerHand, deck) {

    while (playerHand.length > 0) {
        deck.push(playerHand.pop());
    }

    while (dealerHand.length > 0) {
        deck.push(dealerHand.pop());
    }

    shuffleDeck(deck);
    dealStartingHand(dealerHand, playerHand, deck);

    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
}

function startNewRound() {

    document.getElementById("game-result").textContent = "";

    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("player-cards").innerHTML = "";

    document.getElementById("dealer-value").textContent = "";
    document.getElementById("player-value").textContent = "";

    document.getElementById("betting-controls").style.display = "flex";

    document.getElementById("game-result").textContent = "";
    document.getElementById("betting-controls").style.display = "flex";
}

function displayGame() {
    document.getElementById("player-value").textContent =
        calculateHandValue(playerHand);

    document.getElementById("dealer-value").textContent =
        calculateHandValue(dealerHand);
    
    displayHand(playerHand, "player-cards");
    

}

function revealDealerCard() {
    displayHand(dealerHand, "dealer-cards");
}

function startCountdown() {
    let seconds = 5;

    const result = document.getElementById("countdown");

    const timer = setInterval(() => {
        seconds--;

        if (seconds > 0) {
            result.textContent = `New round in ${seconds}...`;
        } else {
            clearInterval(timer);
            startNewRound();
        }
    }, 1000);
}


document.getElementById("ready-button").addEventListener("click", function() {
    playerChips = 1000;

    document.getElementById("betting-controls").style.display = "flex";
    document.getElementById("ready-buttons").style.display = "none";
});

document.getElementById("hit-button").addEventListener("click", function() {

    const playerValue = calculateHandValue(playerHand);

    if (playerValue >= 21) {
        return;
    }

    hit(playerHand, deck);
    displayGame();

    const newValue = calculateHandValue(playerHand);

    if (newValue > 21) {
        revealDealerCard();

        checkWinner(dealerHand, playerHand);
        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
    }

});
document.getElementById("stand-button").addEventListener("click", function() {
    stand(dealerHand, playerHand, deck);
    displayGame();
});

document.getElementById("double-button").addEventListener("click", function() {
    double();
    hit(playerHand, deck);
    stand(dealerHand, playerHand, deck);
    displayGame();
});


document.getElementById("min-button").addEventListener("click", () => {
    raiseAmount = 20;
    updateRaiseDisplay();
});

document.getElementById("quarter-button").addEventListener("click", function() {
    raiseAmount = playerChips *1/4

    updateRaiseDisplay();
});

document.getElementById("half-button").addEventListener("click", function() {
    raiseAmount = playerChips *1/2

    updateRaiseDisplay();
});

document.getElementById("three-quarter-button").addEventListener("click", function() {
    raiseAmount = playerChips *3/4

    updateRaiseDisplay();
});

document.getElementById("all-in-button").addEventListener("click", function() {
    raiseAmount = playerChips 

    updateRaiseDisplay();
});

document.getElementById("decrease-button").addEventListener("click", () => {

    raiseAmount -= 5;

    if (raiseAmount < 20) {
        raiseAmount = 20;
    }

    updateRaiseDisplay();
});

document.getElementById("increase-button").addEventListener("click", () => {

    raiseAmount += 5;

    if (raiseAmount > playerChips) {
        raiseAmount = playerChips;
    }

    if(raiseAmount < 20) {
        raiseAmount = 20;
    }

    updateRaiseDisplay();


});

document.getElementById("bet-confirm-button").addEventListener("click", function() {
    if (raiseAmount <= 0) { 
    document.getElementById("game-result").textContent = 
        "Please place a bet first!"; 
    return; 
    }
    bet(raiseAmount);
    calculatePot();

    newGame(dealerHand, playerHand, deck);
    displayGame();
    displayDealerHand(dealerHand, "red", "dealer-cards");

    document.getElementById("game-buttons").style.display = "flex";
    document.getElementById("betting-controls").style.display = "none";
});


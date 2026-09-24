
const playerHand = [];
const dealerHand = [];

let dealerHiddenCard;

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
    let doubleBet = currentBet * 2
    if(doubleBet <= playerChips){
        
        playerChips -= currentBet;
        currentBet *= 2;
    }else {
        return;
    }


    displayChips()
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
        playerChips += currentBet;
        currentBet = 0;
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

    displayGame();
    displayDealerHand(dealerHand, "red", "dealer-cards");

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


document.getElementById("chip-5").addEventListener("click", function() {
    bet(5);
});

document.getElementById("chip-10").addEventListener("click", function() {
    bet(10);
});

document.getElementById("chip-25").addEventListener("click", function() {
    bet(25);
});

document.getElementById("chip-50").addEventListener("click", function() {
    bet(50);
});

document.getElementById("chip-100").addEventListener("click", function() {
    bet(100);
});

document.getElementById("clear-button").addEventListener("click", function() {
    clearBet();
});

document.getElementById("bet-button").addEventListener("click", function() {
    if (currentBet === 0) {
        document.getElementById("game-result").textContent =
            "Please place a bet first!";
        return;
    }
    newGame(dealerHand, playerHand, deck);
    displayGame();
    displayDealerHand(dealerHand, "red", "dealer-cards");

    document.getElementById("game-buttons").style.display = "flex";
    document.getElementById("betting-controls").style.display = "none";
});




const playerHand = [];
const dealerHand = [];
const deck = [
    { suit: "spades", rank: "2", value: 2 },
    { suit: "spades", rank: "3", value: 3 },
    { suit: "spades", rank: "4", value: 4 },
    { suit: "spades", rank: "5", value: 5 },
    { suit: "spades", rank: "6", value: 6 },
    { suit: "spades", rank: "7", value: 7 },
    { suit: "spades", rank: "8", value: 8 },
    { suit: "spades", rank: "9", value: 9 },
    { suit: "spades", rank: "10", value: 10 },
    { suit: "spades", rank: "J", value: 10 },
    { suit: "spades", rank: "Q", value: 10 },
    { suit: "spades", rank: "K", value: 10 },
    { suit: "spades", rank: "A", value: [1,11] },

    { suit: "hearts", rank: "2", value: 2 },
    { suit: "hearts", rank: "3", value: 3 },
    { suit: "hearts", rank: "4", value: 4 },
    { suit: "hearts", rank: "5", value: 5 },
    { suit: "hearts", rank: "6", value: 6 },
    { suit: "hearts", rank: "7", value: 7 },
    { suit: "hearts", rank: "8", value: 8 },
    { suit: "hearts", rank: "9", value: 9 },
    { suit: "hearts", rank: "10", value: 10 },
    { suit: "hearts", rank: "J", value: 10 },
    { suit: "hearts", rank: "Q", value: 10 },
    { suit: "hearts", rank: "K", value: 10 },
    { suit: "hearts", rank: "A", value: [1,11] },

    { suit: "clubs", rank: "2", value: 2 },
    { suit: "clubs", rank: "3", value: 3 },
    { suit: "clubs", rank: "4", value: 4 },
    { suit: "clubs", rank: "5", value: 5 },
    { suit: "clubs", rank: "6", value: 6 },
    { suit: "clubs", rank: "7", value: 7 },
    { suit: "clubs", rank: "8", value: 8 },
    { suit: "clubs", rank: "9", value: 9 },
    { suit: "clubs", rank: "10", value: 10 },
    { suit: "clubs", rank: "J", value: 10 },
    { suit: "clubs", rank: "Q", value: 10 },
    { suit: "clubs", rank: "K", value: 10 },
    { suit: "clubs", rank: "A", value: [1,11] },

    { suit: "diamonds", rank: "2", value: 2 },
    { suit: "diamonds", rank: "3", value: 3 },
    { suit: "diamonds", rank: "4", value: 4 },
    { suit: "diamonds", rank: "5", value: 5 },
    { suit: "diamonds", rank: "6", value: 6 },
    { suit: "diamonds", rank: "7", value: 7 },
    { suit: "diamonds", rank: "8", value: 8 },
    { suit: "diamonds", rank: "9", value: 9 },
    { suit: "diamonds", rank: "10", value: 10 },
    { suit: "diamonds", rank: "J", value: 10 },
    { suit: "diamonds", rank: "Q", value: 10 },
    { suit: "diamonds", rank: "K", value: 10 },
    { suit: "diamonds", rank: "A", value: [1,11] }
];



function shuffleDeck(deck){
    
    for (let i = deck.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
    
        // Swap elements using array destructuring
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  return deck;
}


function dealStartingHand(dealerHand, playerHand, deck){

    for (let i = 0; i < 2; i++) {

        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());
    }
}

function hit(hand, deck) {
    hand.push(dealCard(deck));
}

function dealCard(deck) {
    return deck.pop();
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


/* 
displayCard()

displayHand()
*/

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
}
    
    
function checkWinner(dealerHand, playerHand) {
    const totalA = calculateHandValue(dealerHand);
    const totalB = calculateHandValue(playerHand);

    const result = document.getElementById("game-result");

    if (totalA > 21 && totalB <= 21) {
        result.textContent = "Your Hand Won";
    } else if (totalB > 21 && totalA <= 21) {
        result.textContent = "Your Hand Lost";
    } else if (totalA > totalB) {
        result.textContent = "Your Hand Lost";
    } else if (totalB > totalA) {
        result.textContent = "Your Hand Won";
    } else {
        result.textContent = "Tie";
    }
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
}

function displayGame() {
    document.getElementById("player-value").textContent =
        calculateHandValue(playerHand);

    document.getElementById("dealer-value").textContent =
        calculateHandValue(dealerHand);
}

document.getElementById("hit-button").addEventListener("click", function() {

    const playerValue = calculateHandValue(playerHand);

    if (playerValue >= 21) {
        return;
    }

    hit(playerHand, deck);
    displayGame();

    const newValue = calculateHandValue(playerHand);

    if (newValue > 21) {
        document.getElementById("game-result").textContent =
            "You Busted! Dealer Wins";

        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
    }

});
document.getElementById("stand-button").addEventListener("click", function() {
    stand(dealerHand, playerHand, deck);
    displayGame();
});

document.getElementById("new-game-button").addEventListener("click", function() {
    newGame(dealerHand, playerHand, deck);
    displayGame();
});

newGame(dealerHand, playerHand, deck);

console.log("Player:", playerHand);
console.log("Dealer:", dealerHand);

console.log("Player value:", calculateHandValue(playerHand));
console.log("Dealer value:", calculateHandValue(dealerHand));
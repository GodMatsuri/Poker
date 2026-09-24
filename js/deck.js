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

const cardColor = [
    "red",
    "black"
]

function shuffleDeck(deck){
    
    for (let i = deck.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
    
        // Swap elements using array destructuring
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  return deck;
}

function dealCard(deck) {
    return deck.pop();
}

function getCardImage(card) {
    return `../assets/cards/${card.rank}_of_${card.suit}.png`;
}

function getCardBack(color){
    return `../assets/images/card_back_${color}.png`;
}

function createCardElement(card) {
    const img = document.createElement("img");

    img.src = getCardImage(card);
    img.classList.add("card-image");

    return img;
}

function createCardBack(color) {
    const img = document.createElement("img");

    img.src = getCardBack(color);
    img.classList.add("card-image");

    return img;
}


function displayHand(hand, elementId) {
    const container = document.getElementById(elementId);

    container.innerHTML = "";

    for (let card of hand) {
        const cardElement = createCardElement(card);
        container.appendChild(cardElement);
    }
}


function displayDealerHand(hand, cardColor, elementID) {

    const container = document.getElementById(elementID);

    container.innerHTML = "";

    hand.forEach((card, index) => {

        const cardElement = createCardElement(card);

        if (index === 0) {
            const cardBack = createCardBack(cardColor);
            container.appendChild(cardBack);
        } else {
            container.appendChild(cardElement);
        }

    });
}

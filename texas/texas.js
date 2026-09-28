const playerHand = [];
const opponentHand = [];
const boardHand = [];
const rankValues = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14
};

let flopRevealed = false;

function dealStartingHand(player, opponent, deck){
    for (let i = 0; i < 2; i++) {

        player.push(dealCard(deck));
        opponent.push(dealCard(deck));
    
    }
}

function dealFlop(board, deck){
    for (let i = 0; i < 3; i++) {
        board.push(dealCard(deck));
    }
}

function dealTurn(board, deck){
    board.push(dealCard(deck));
}

function dealRiver(board, deck){
    board.push(dealCard(deck));
}

function dealNextCommunityCard(board, deck){
    
    if (board.length === 0){
        dealFlop(board, deck);

    }else if(board.length === 3){
        dealTurn(board, deck);

    }else if(board.length === 4){
        dealRiver(board, deck);
    }

}

function startRound(player, opponent, board, deck) {

    shuffleDeck(deck);

    dealStartingHand(player, opponent, deck);

    dealFlop(board, deck);
}

function cardRankValue (hand) {
    let ranks = hand.map(card => card.rank);

    let values = ranks.map(rank => rankValues[rank]);

    values = [...new Set(values)];
    values.sort((a, b) => a - b);

    return values;
}

function countRanks(hand) {

    cardRankValue(hand)
    
    const rankCount = {};

    for (let card of hand) {

        if (rankCount[card.rank]) {
            rankCount[card.rank]++;
        } else {
            rankCount[card.rank] = 1;
        }
    }

    return rankCount;
}

function stud(hand, board){
    return hand.concat(board);
}

function highCard(player, board) {
    const cards = stud(player, board);
    const values = cardRankValue(cards);

    return values[values.length - 1];
}

function pair(player, board) {

    const rankCount = countRanks(stud(player, board));

    for (let rank in rankCount) {
        if (rankCount[rank] === 2) {
            return true;
        }
    }

    return false;
}

function twoPair(player, board) {

    const rankCount = countRanks(stud(player, board));
    let pairs = 0;

    for (let rank in rankCount) {
        if (rankCount[rank] === 2) {
            pairs++;
        }
    }

    return pairs >= 2;
}

function threeOfAKind(player, board){
    const rankCount = countRanks(stud(player, board));

    for (let rank in rankCount) {
        if (rankCount[rank] === 3) {
            return true;
        }
    }

    return false;
}

function straight(player, board) {

    const values = cardRankValue(stud(player, board));

    // A-2-3-4-5
    if (
        values.includes(14) &&
        values.includes(2) &&
        values.includes(3) &&
        values.includes(4) &&
        values.includes(5)
    ) {
        return true;
    }

    for (let i = 0; i <= values.length - 5; i++) {

        if (
            values[i + 1] === values[i] + 1 &&
            values[i + 2] === values[i] + 2 &&
            values[i + 3] === values[i] + 3 &&
            values[i + 4] === values[i] + 4
        ) {
            return true;
        }
    }

    return false;
}

function flush(player, board){
    const cards = stud(player, board);
    const suitCount = {};

    for (let card of cards) {

        if (suitCount[card.suit]) {
            suitCount[card.suit]++;
        } else {
            suitCount[card.suit] = 1;
        }
    }

    for (let suit in suitCount) {
        if (suitCount[suit] >= 5) {
            return true;
        }
    }

}

function fullHouse(player, board) {
    const rankCount = countRanks(stud(player, board));

    let trips = 0;
    let pairs = 0;

    for (let rank in rankCount) {
        if (rankCount[rank] >= 3) {
            trips++;
        } else if (rankCount[rank] >= 2) {
            pairs++;
        }
    }

    return (trips >= 1 && (pairs >= 1 || trips >= 2));
}


function fourOfAKind (player, board){
    const rankCount = countRanks(stud(player, board));

    for (let rank in rankCount) {
        if (rankCount[rank] === 4) {
            return true;
        }
    }

    return false;
}

function straightFlush(player, board) {
    const cards = stud(player, board);

    // Group cards by suit
    const suits = {};

    for (let card of cards) {
        if (!suits[card.suit]) {
            suits[card.suit] = [];
        }

        suits[card.suit].push(rankValues[card.rank]);
    }

    // Check each suit
    for (let suit in suits) {
        let values = [...new Set(suits[suit])];
        values.sort((a, b) => a - b);

        // A-2-3-4-5 straight flush
        if (
            values.includes(14) &&
            values.includes(2) &&
            values.includes(3) &&
            values.includes(4) &&
            values.includes(5)
        ) {
            return 5;
        }

        // Normal straight flush
        for (let i = 0; i <= values.length - 5; i++) {
            if (
                values[i + 1] === values[i] + 1 &&
                values[i + 2] === values[i] + 2 &&
                values[i + 3] === values[i] + 3 &&
                values[i + 4] === values[i] + 4
            ) {
                return values[i + 4];
            }
        }
    }

    return 0;
}

function checkHand(player, board) {

    if (straightFlush(player, board)) return 8;
    if (fourOfAKind(player, board)) return 7;
    if (fullHouse(player, board)) return 6;
    if (flush(player, board)) return 5;
    if (straight(player, board)) return 4;
    if (threeOfAKind(player, board)) return 3;
    if (twoPair(player, board)) return 2;
    if (pair(player, board)) return 1;

    return 0;
}

function checkWinner(player, opponent, board) {
    const playerScore = checkHand(player, board);
    const opponentScore = checkHand(opponent, board);

    if (playerScore > opponentScore) {
        payout(true);
        payoutOpponent(false);
        return "Player Wins";
    } else if (opponentScore > playerScore) {
        payout(false);
        payoutOpponent(true);
        return "Opponent Wins";
    } else {
        playerBet = 0;
        return "Tie";
    }
}

function checkKickers(player, board) {

    const cards = stud(player, board);
    const rankCount = countRanks(cards);
    const score = checkHand(player, board);

    switch (score) {

        case 1: { // Pair 

            const pairRank = [];

            // Find the pair
            for (let rank in rankCount) {
                if (rankCount[rank] === 2) {
                    pairRank.push(rankValues[rank]);
                }
            }

            // Remove cards belonging to the pair
            const kickers = cards.filter(card => 
                !pairRank.includes(rankValues[card.rank])
            );

            // Get kicker values
            const kickerValues = kickers.map(card =>
                rankValues[card.rank]
            );

            // Highest first
            kickerValues.sort((a, b) => b - a);

            // Only need the best 3 kickers
            return kickerValues.slice(0, 3);
        }

        case 2: { // 2Pair

            const pairRank = [];

            // Find the pair
            for (let rank in rankCount) {
                if (rankCount[rank] === 2) {
                    pairRank.push(rankValues[rank]);
                }
            }

            // Remove cards belonging to the pair
            const kickers = cards.filter(card => 
                !pairRank.includes(rankValues[card.rank])
            );

            // Get kicker values
            const kickerValues = kickers.map(card =>
                rankValues[card.rank]
            );

            // Highest first
            kickerValues.sort((a, b) => b - a);

            // Only need the best kickers
            return kickerValues.slice(0, 1);
        }

        case 3: { // Trips

            const tripsRank = [];

            // Find the pair
            for (let rank in rankCount) {
                if (rankCount[rank] === 3) {
                    tripsRank.push(rankValues[rank]);
                }
            }

            // Remove cards belonging to the pair
            const kickers = cards.filter(card => 
                !tripsRank.includes(rankValues[card.rank])
            );

            // Get kicker values
            const kickerValues = kickers.map(card =>
                rankValues[card.rank]
            );

            // Highest first
            kickerValues.sort((a, b) => b - a);

            // Only need the best 2 kickers
            return kickerValues.slice(0, 2);
        }

        case 7: {
            const quadRank = [];

            // Find the pair
            for (let rank in rankCount) {
                if (rankCount[rank] === 4) {
                    quadRank.push(rankValues[rank]);
                }
            }

            // Remove cards belonging to the pair
            const kickers = cards.filter(card => 
                !quadRank.includes(rankValues[card.rank])
            );

            // Get kicker values
            const kickerValues = kickers.map(card =>
                rankValues[card.rank]
            );

            // Highest first
            kickerValues.sort((a, b) => b - a);

            // Only need the best kickers
            return kickerValues.slice(0, 1);
        }
    }
}

function checkTie(player, opponent, board) {
    const rankPlayer = countRanks(stud(player, board));
    const rankOpponent = countRanks(stud(opponent, board));
    const score = checkHand(player, board);

    

    if (score === 0){   
    const cardsPlayer = stud(player, board);
    const cardsOpponent = stud(opponent, board);

    cardsPlayer.sort((a, b) => rankValues[b.rank] - rankValues[a.rank]);
    cardsOpponent.sort((a, b) => rankValues[b.rank] - rankValues[a.rank]);

    const topPlayer = cardsPlayer.slice(0, 5);
    const topOpponent = cardsOpponent.slice(0, 5);

    for (let i = 0; i < 5; i++) {

        const playerValue = rankValues[topPlayer[i].rank];
        const opponentValue = rankValues[topOpponent[i].rank];

        if (playerValue > opponentValue) {
            payout(true);
            return "Player Wins";
        }

        if (opponentValue > playerValue) {
            payout(false);
            return "Opponent Wins";
        }
    }

    return "Tie";

    } else if (score === 1) {
    
        let rank1, rank2;

        for (let rank in rankPlayer) {
            if (rankPlayer[rank] === 2) {
                rank1 = rankValues[rank];
            }
        }

        for (let rank in rankOpponent) {
            if (rankOpponent[rank] === 2) {
                rank2 = rankValues[rank];
            }
        }

        if (rank1 > rank2) {
            payout(true);
            return "Player Wins";

        } else if (rank2 > rank1) {
            payout(false);
            return "Opponent Wins";

        } else {
            // Pair is identical → compare kickers
            const playerKickers = checkKickers(player, board);
            const opponentKickers = checkKickers(opponent, board);

            for (let i = 0; i < 3; i++) {

                if (playerKickers[i] > opponentKickers[i]) {
                    payout(true);
                    return "Player Wins";
                }

                if (opponentKickers[i] > playerKickers[i]) {
                    payout(false);
                    return "Opponent Wins";
                }
            }

            return "Tie";
        }
    } else if (score === 2) {
        const pairsPlayer = [];
        const pairsOpponent = [];

        for (let rank in rankPlayer) {
            if (rankPlayer[rank] === 2) {
                pairsPlayer.push(rankValues[rank]);
            }
        }

        for (let rank in rankOpponent) {
            if (rankOpponent[rank] === 2) {
                pairsOpponent.push(rankValues[rank]);
            }
        }
        pairsPlayer.sort((a, b) => b - a);
        pairsOpponent.sort((a, b) => b - a);

        // Compare Highest Pair
        if (pairsPlayer[0] > pairsOpponent[0]) {
            payout(true);
            return "Player Wins";

        } else if (pairsPlayer[0] < pairsOpponent[0]) {
            payout(false);
            return "Opponent Wins";

        // Compare Second Pair
        } else if(pairsPlayer[0] === pairsOpponent[0]){
            if (pairsPlayer[1] > pairsOpponent[1]) {
                payout(true);
                return "Player Wins";

            } else if (pairsPlayer[1] < pairsOpponent[1]) {
                payout(false);
                return "Opponent Wins";
            } else {
                // Pair is identical → compare kickers
                const playerKickers = checkKickers(player, board);
                const opponentKickers = checkKickers(opponent, board);

                for (let i = 0; i < 1; i++) {

                    if (playerKickers[i] > opponentKickers[i]) {
                        payout(true);
                        return "Player Wins";
                    }

                    if (opponentKickers[i] > playerKickers[i]) {
                        payout(false);
                        return "Opponent Wins";
                    }   
                }
                return "Tie";
            } 
        }

    } else if (score === 3) {
        for (let rank in rankPlayer) {
            if (rankPlayer[rank] === 3) {
                rank1 = rankValues[rank];
            }
        }

        for (let rank in rankOpponent) {
            if (rankOpponent[rank] === 3) {
                rank2 = rankValues[rank];
            }
        }

        if (rank1 > rank2) {
            payout(true);
            return "Player Wins";

        } else if (rank2 > rank1) {
            payout(false);
            return "Opponent Wins";

        } else {
            // Pair is identical → compare kickers
            const playerKickers = checkKickers(player, board);
            const opponentKickers = checkKickers(opponent, board);

            for (let i = 0; i < 2; i++) {

                if (playerKickers[i] > opponentKickers[i]) {
                    payout(true);
                    return "Player Wins";
                }

                if (opponentKickers[i] > playerKickers[i]) {
                    payout(false);
                    return "Opponent Wins";
                }
            }

            return "Tie";
        }
    } else if (score === 4) {

        let straightHighPlayer;
        let straightHighOpponent;

        const playerValues = cardRankValue(stud(player, board));
        const opponentValues = cardRankValue(stud(opponent, board));

        // PLAYER
        if (
            playerValues.includes(14) &&
            playerValues.includes(2) &&
            playerValues.includes(3) &&
            playerValues.includes(4) &&
            playerValues.includes(5)
        ) {
            straightHighPlayer = 5;

        } else {
            for (let i = 0; i <= playerValues.length - 5; i++) {
                if (
                    playerValues[i + 1] === playerValues[i] + 1 &&
                    playerValues[i + 2] === playerValues[i] + 2 &&
                    playerValues[i + 3] === playerValues[i] + 3 &&
                    playerValues[i + 4] === playerValues[i] + 4
                ) {
                    straightHighPlayer = playerValues[i + 4];
                }
            }
        }

        // OPPONENT
        if (
            opponentValues.includes(14) &&
            opponentValues.includes(2) &&
            opponentValues.includes(3) &&
            opponentValues.includes(4) &&
            opponentValues.includes(5)
        ) {
            straightHighOpponent = 5;

        } else {
            for (let i = 0; i <= opponentValues.length - 5; i++) {
                if (
                    opponentValues[i + 1] === opponentValues[i] + 1 &&
                    opponentValues[i + 2] === opponentValues[i] + 2 &&
                    opponentValues[i + 3] === opponentValues[i] + 3 &&
                    opponentValues[i + 4] === opponentValues[i] + 4
                ) {
                    straightHighOpponent = opponentValues[i + 4];
                }
            }
        }

        console.log("Player values:", playerValues);
        console.log("Opponent values:", opponentValues);
        console.log("Player straight high:", straightHighPlayer);
        console.log("Opponent straight high:", straightHighOpponent);

        if (straightHighPlayer > straightHighOpponent) {
            payout(true);
            return "Player Wins";

        } else if (straightHighOpponent > straightHighPlayer) {
            payout(false);
            return "Opponent Wins";

        } else {
            return "Tie";
        }

    } else if (score === 5) {

        const playerStud = stud(player, board);
        const opponentStud = stud(opponent, board);

        const suitCountPlayer = {};
        const suitCountOpponent = {};

        // Count player suits
        for (let card of playerStud) {
            if (suitCountPlayer[card.suit]) {
                suitCountPlayer[card.suit]++;
            } else {
                suitCountPlayer[card.suit] = 1;
            }
        }

        // Count opponent suits
        for (let card of opponentStud) {
            if (suitCountOpponent[card.suit]) {
                suitCountOpponent[card.suit]++;
            } else {
                suitCountOpponent[card.suit] = 1;
            }
        }

        // Find flush suits
        let flushSuitPlayer;
        let flushSuitOpponent;

        for (let suit in suitCountPlayer) {
            if (suitCountPlayer[suit] >= 5) {
                flushSuitPlayer = suit;
            }
        }

        for (let suit in suitCountOpponent) {
            if (suitCountOpponent[suit] >= 5) {
                flushSuitOpponent = suit;
            }
        }

        // Get only flush cards
        const playerFlushCards = playerStud.filter(
            card => card.suit === flushSuitPlayer
        );

        const opponentFlushCards = opponentStud.filter(
            card => card.suit === flushSuitOpponent
        );

        // Get sorted rank values
        const playerValues = cardRankValue(playerFlushCards).slice(-5);
        const opponentValues = cardRankValue(opponentFlushCards).slice(-5);

        console.log("Player flush:", playerValues);
        console.log("Opponent flush:", opponentValues);

        // Compare highest → lowest
        for (let i = 4; i >= 0; i--) {

            if (playerValues[i] > opponentValues[i]) {
                payout(true);
                return "Player Wins";
            }

            if (opponentValues[i] > playerValues[i]) {
                payout(false);
                return "Opponent Wins";
            }
        }

        return "Tie";
    } else if (score === 6) {
        
        let pairsPlayer = [];
        let pairsOpponent = [];
        let tripsPlayer = [];
        let tripsOpponent = [];

        for (let rank in rankPlayer) {
            if (rankPlayer[rank] >= 2) {
                pairsPlayer.push(rankValues[rank]);
            }
            
            if (rankPlayer[rank] >= 3) {
                tripsPlayer.push(rankValues[rank]);
            }
        }

        tripsPlayer.sort((a, b) => b - a);
        pairsPlayer.sort((a, b) => b - a);

        for (let rank in rankOpponent) {
            if (rankOpponent[rank] >= 2) {
                pairsOpponent.push(rankValues[rank]);
            }
            
            if (rankOpponent[rank] >= 3) {
                tripsOpponent.push(rankValues[rank]);
            }
        }

        tripsOpponent.sort((a, b) => b - a);
        pairsOpponent.sort((a, b) => b - a);

        const tripRankPlayer = tripsPlayer[0];

        const pairRankPlayer = pairsPlayer.find(
            rank => rank !== tripRankPlayer
        );

        const tripRankOpponent = tripsOpponent[0];

        const pairRankOpponent = pairsOpponent.find(
            rank => rank !== tripRankOpponent
        );


        if (tripRankPlayer > tripRankOpponent) {
            payout(true);
            return "Player Wins";

        } else if (tripRankOpponent > tripRankPlayer) {
            payout(false);
            return "Opponent Wins";

        } else {
            if (pairRankPlayer > pairRankOpponent) {
                payout(true);
                return "Player Wins";

            } else if (pairRankOpponent > pairRankPlayer) {
                payout(false);
                return "Opponent Wins";

            }

            return "Tie";

        }

    } else if (score === 7) {
        let quadsPlayer, quadsOpponent;

        for (let rank in rankPlayer) {
            if (rankPlayer[rank] === 4) {
                quadsPlayer = rankValues[rank];
            }
        }

        for (let rank in rankOpponent) {
            if (rankOpponent[rank] === 4) {
                quadsOpponent = rankValues[rank];
            }
        }

                // Compare Highest Pair
        if (quadsPlayer > quadsOpponent) {
            payout(true);
            return "Player Wins";

        } else if (quadsOpponent > quadsPlayer) {
            payout(false);
            return "Opponent Wins";

        // Compare Second Pair
        } else if(quadsPlayer === quadsOpponent){
                // Pair is identical → compare kickers
                const playerKickers = checkKickers(player, board);
                const opponentKickers = checkKickers(opponent, board);

                for (let i = 0; i < 1; i++) {

                    if (playerKickers[i] > opponentKickers[i]) {
                        payout(true);
                        return "Player Wins";
                    }

                    if (opponentKickers[i] > playerKickers[i]) {
                        payout(false);
                        return "Opponent Wins";
                    }   
                }
                return "Tie";
        }

    } else if (score === 8) {

    const straightFlushPlayer = straightFlush(player, board);
    const straightFlushOpponent = straightFlush(opponent, board);

    if (straightFlushPlayer > straightFlushOpponent) {
        payout(true);
        return "Player Wins";

    } else if (straightFlushOpponent > straightFlushPlayer) {
        payout(false);
        return "Opponent Wins";

    } else {
        return "Tie";
    }
}


}

function endGame (player, opponent, board){
    let result = checkWinner(player, opponent, board);

    if (result === "Tie") {
        result = checkTie(player, opponent, board);
    }

    console.log("Player:", checkHand(player, board));
    console.log("Opponent:", checkHand(opponent, board));

    document.getElementById("game-result").textContent = result;
    document.getElementById("game-buttons").style.display = "none";

    startCountdown();
}

function displayGame(player, opponent, board) {
    
    displayHand(player, "player-cards");
    displayHand(opponent, "opponent-cards");
    displayHand(board, "board-cards");
    
}

/*
function newGame(player, opponent, board, deck) {

    while (player.length > 0) {
        deck.push(player.pop());
    }

    while (opponent.length > 0) {
        deck.push(opponent.pop());
    }

    while (board.length > 0) {
        deck.push(board.pop());
    }

    shuffleDeck(deck);
    startRound(player, opponent, board, deck);

    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
}
    */

function startCountdown() {
    let seconds = 5;

    const countdown = document.getElementById("countdown");

    countdown.textContent = `New round in ${seconds}...`;

    const timer = setInterval(() => {
        seconds--;

        if (seconds > 0) {
            countdown.textContent = `New round in ${seconds}...`;
        } else {
            clearInterval(timer);
            countdown.textContent = "";
            startNewRound();
        }

    }, 1000);
}

function startNewRound() {
    playerHand.length = 0;
    opponentHand.length = 0;
    boardHand.length = 0;

    document.getElementById("player-cards").innerHTML = "";
    document.getElementById("opponent-cards").innerHTML = "";
    document.getElementById("board-cards").innerHTML = "";

    document.getElementById("game-result").textContent = "";

    // Deal new hand
    startRound(playerHand, opponentHand, boardHand, deck);

    // Reset flop visibility
    flopRevealed = false;

    // Display player/opponent cards and board
    displayGame(playerHand, opponentHand, boardHand);

    // Hide the already-dealt flop
    document.getElementById("board-cards").style.visibility = "hidden";

    // Allow betting
    document.getElementById("betting-controls").style.display = "flex";
    document.getElementById("game-buttons").style.display = "none";
}

function testPair() {

    const player = [
        { rank: "2", suit: "spades" },
        { rank: "10", suit: "hearts" }
    ];

    const opponent = [
        { rank: "2", suit: "clubs" },
        { rank: "J", suit: "spades" }
    ];

    const board = [
        { rank: "9", suit: "spades" },
        { rank: "4", suit: "diamonds" },
        { rank: "5", suit: "diamonds" },
        { rank: "6", suit: "diamonds" },
        { rank: "7", suit: "diamonds" }
    ];

    displayGame(player, opponent, board);
    endGame(player, opponent, board);
}

let raiseAmount = 20;

const raiseValue = document.getElementById("raise-value");

function updateRaiseDisplay() {
    raiseValue.textContent = "$" + raiseAmount;
}

document.getElementById("ready-button").addEventListener("click", function() {

    playerChips = 1000;
    playerBet = 0;
    
    startRound(playerHand, opponentHand, boardHand, deck);

    flopRevealed = false;

    displayGame(playerHand, opponentHand, boardHand);

    document.getElementById("board-cards").style.visibility = "hidden";

    displayChips();
    displayChipsOpponent();
    displayPot()

    document.getElementById("betting-controls").style.display = "flex";
    document.getElementById("ready-buttons").style.display = "none";
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
    bet(raiseAmount);
    calculatePot();

    if (raiseAmount === 0) {
        document.getElementById("game-result").textContent =
            "Please place a bet first!";
        return;
    }

if (!flopRevealed) {

    // Reveal the already-dealt flop
    flopRevealed = true;

    document.getElementById("board-cards").style.visibility = "visible";

} else if (boardHand.length < 5) {

    // Deal the next community card
    dealNextCommunityCard(boardHand, deck);

    displayGame(playerHand, opponentHand, boardHand);
}

    document.getElementById("betting-controls").style.display = "none";
    document.getElementById("game-buttons").style.display = "flex";
});
/*
document.getElementById("test-button").addEventListener("click", function() {
    testPair();
});
*/


document.getElementById("raise-button").addEventListener("click", function() {
    
    if(playerChips < 20){
        document.getElementById("game-result").textContent =
            "You do not have sufficient chips to make a raise";
        return;
    } else {
        document.getElementById("betting-controls").style.display = "flex";
        document.getElementById("game-buttons").style.display = "none";
        raiseAmount = 20;
        updateRaiseDisplay();
    }
    
    
});

document.getElementById("check-button").addEventListener("click", function() {

    if (boardHand.length < 5) {

        dealNextCommunityCard(boardHand, deck);
        displayGame(playerHand, opponentHand, boardHand);

    } else {
        endGame(playerHand, opponentHand, boardHand);
    }

});

document.getElementById("fold-button").addEventListener("click", function() {

});



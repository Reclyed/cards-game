const gameNode = document.querySelector('#game-board');
const victoryText = document.querySelector('#victory-message');
const startGameBtn = document.querySelector('#new-game-btn');

const cardFlipTimeoutMs = 500;

const cardElements = ['🍓', '🍇', '🍉', '🍋', '🍌', '🥝'];
const cardAmount = 12;

let visibleCards = [];

startGameBtn.addEventListener('click', startGame);

function startGame() {
    [gameNode, victoryText].forEach((node) => (node.innerHTML = ""));

    const cardValues = generateArray(cardElements, cardAmount);

    cardValues.forEach(renderCard);

    const renderedCards = document.querySelectorAll('.card');
    renderedCards.forEach(card => card.classList.add('visible'));
    
    setTimeout(() => {
        renderedCards.forEach(card => card.classList.remove('visible'));
    }, 800)
}

function generateArray(emojis, cardAmount) {
    const randomArray = [];
    const elementCounts = [];

    for (const emoji of emojis) {
        elementCounts[emoji] = 0;
    }

    while (randomArray.length < cardAmount) {
        const randomIndex = Math.floor(Math.random() * emojis.length);
        const randomElement = emojis[randomIndex];

        if (elementCounts[randomElement] < 2) {
            randomArray.push(randomElement);
            elementCounts[randomElement]++;
        }
    }

    return randomArray;
}

function renderCard(emoji) {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card__inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    cardFront.textContent = "?";
    cardBack.textContent = emoji;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', () => {
        handleCardClick(card);
    });

    gameNode.appendChild(card);
}

function handleCardClick(card) {
    if (card.classList.contains('visible')) {
        return;
    }

    const checkVictory = () => {
        const visibleCardNodes = document.querySelectorAll('.visible');

        const isVictory = visibleCardNodes.length == cardAmount;

        if (isVictory) {
            victoryText.textContent = 'Поздравляю, вы выиграли!';
        }
    }

    card.querySelector('.card__inner').addEventListener('transitionend', checkVictory);

    card.classList.add('visible');

    visibleCards.push(card);

    if (visibleCards.length % 2 !== 0) {
        return;
    }

    const [prelastCard, lastCard] = visibleCards.slice(-2);

    if (prelastCard.textContent !== lastCard.textContent) {
        visibleCards = visibleCards.slice(0, visibleCards.length - 2);

        setTimeout(() => {
            lastCard.classList.remove('visible');
            prelastCard.classList.remove('visible');
        }, cardFlipTimeoutMs);
    }
}

startGame();
let mainContainer;
let cardContainer;
let counterContainer;

let labels = [];
let cards = [];
let mainLabelIndices = [];
let freshFlashcard = false;
let previousCardRendered = false;
let counter = 0;
let cardContainerCenter;
let currentCard = {};
let previousCard = {};

addEventListener('DOMContentLoaded', loadCards);

function loadCards() {
  const client = new XMLHttpRequest();
  client.open('GET', './words.txt');
  client.onreadystatechange = function() {
    if (client.readyState === 4) {
      const words = client.responseText;
      const lines = words.split(`\n`);
      lines.reduce((card, line, i) => {
        if (i % 5 === 0) {
          if (card.length) {
            cards.push(card);
          }
          card = [];
        }
        card.push(line);
        return card;
      }, []);
      console.log(cards);
      labels = cards.shift();
      labels.forEach((label, labelIndex) => {
        if (label.startsWith('!')) {
          mainLabelIndices.push(labelIndex);
          labels[labelIndex] = label.replace('!', '');
        }
      });
      if (mainLabelIndices.length === 0) {
        mainLabelIndices.push(0);
      }

      const fontSizeByHeight = mainContainer.clientHeight / (labels.length + 2);
      const fontSizeByWidth = (mainContainer.clientWidth / 4) / Math.max(...labels.map(l => l.length));
      cardContainer.style.fontSize = `${Math.min(fontSizeByHeight, fontSizeByWidth)}px`;

      handleContainerClick();
    }
  }
  client.setRequestHeader('Content-type', "text/plain; charset=utf-8");
  client.send();

  mainContainer = document.getElementsByClassName('container')[0];
  cardContainer = document.getElementsByClassName('card')[0];
  const cardContainerRect = cardContainer.getBoundingClientRect()
  cardContainerCenter = cardContainerRect.left + (cardContainerRect.right - cardContainerRect.left) / 2;
  counterContainer = document.getElementsByClassName('counter')[0];

  mainContainer.addEventListener('click', handleContainerClick);
  mainContainer.addEventListener('dblclick', () => {});
}

function handleContainerClick(event) {
  if (event?.clientX < cardContainerCenter) {
    back();
  } else {
    if (previousCardRendered) {
      forward();
      freshFlashcard = true;
    }
    else if (!freshFlashcard) {
      drawNewFlashcard();
      increaseCounter();
      freshFlashcard = !freshFlashcard;
    } else {
      const answearElements = document.getElementsByClassName('answear');
      Array.from(answearElements).forEach((element) => element.style.opacity = 1);
      freshFlashcard = !freshFlashcard;
    }
  }
}

function back() {
  if (previousCardRendered || !previousCard.card) {
    return;
  }
  decreaseCounter();
  renderFlashcard(previousCard.card);
  previousCardRendered = true;
}

function forward() {
  if (!currentCard.card) {
    drawNewFlashcard();
    increaseCounter();
  } else {
    increaseCounter();
    renderFlashcard(currentCard.card, currentCard.index);
  }
  previousCardRendered = false;
}

function decreaseCounter() {
  counter--;
  counterContainer.innerHTML = counter;
}

function increaseCounter() {
  counter++;
  counterContainer.innerHTML = counter;
}

function drawNewFlashcard() {
  previousCard = currentCard;

  const randomCardIndex = Math.floor(Math.random() * cards.length);
  const randomCard = cards[randomCardIndex];
  const randomLabelIndex = mainLabelIndices[Math.floor(Math.random() * mainLabelIndices.length)];

  currentCard = {
    card: randomCard,
    index: randomLabelIndex,
  };

  renderFlashcard(randomCard, randomLabelIndex);
  previousCardRendered = false;
}

function renderFlashcard(randomCard, randomLabelIndex) {
  if (!randomCard) {
    return;
  }

  cardContainer.innerHTML = '';
  labels.forEach((label, labelIndex) => {
    const labelElement = document.createElement('span');
    labelElement.classList.add('label');
    if (randomLabelIndex === labelIndex) {
      labelElement.classList.add('main');
    }
    labelElement.innerHTML = label;
    const valueElement = document.createElement('span');
    valueElement.innerHTML = randomCard[labelIndex];
    valueElement.classList.add('answear');
    if (randomLabelIndex === labelIndex || typeof randomLabelIndex === 'undefined') {
      valueElement.classList.add('main');
      valueElement.style.opacity = 1;
    } else {
      valueElement.style.opacity = 0;
    }

    cardContainer.appendChild(labelElement);
    cardContainer.appendChild(valueElement);
  });
}

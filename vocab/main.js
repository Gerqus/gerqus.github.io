let mainContainer;
let cardContainer;

let labels;
let cards;
let mainLabelIndices = [];
let freshFlashcard = false;

addEventListener('DOMContentLoaded', loadCards);

function loadCards() {
  const client = new XMLHttpRequest();
  client.open('GET', './words.txt');
  client.onreadystatechange = function() {
    if (client.readyState === 4) {
      const words = client.responseText;
      cards = words.split(`\n\n`).map(c => c.split(`\n`));
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

      handleContainerClick();
    }
  }
  client.send();

  mainContainer = document.getElementsByClassName('container')[0];
  cardContainer = document.getElementsByClassName('card')[0];

  mainContainer.addEventListener('click', handleContainerClick);
  mainContainer.addEventListener('dblclick', () => {});
}

function handleContainerClick() {
  if (!freshFlashcard) {
    cardContainer.innerHTML = '';
    drawNewFlashcard();
  } else {
    const answearElements = document.getElementsByClassName('answear');
    Array.from(answearElements).forEach((element) => element.style.opacity = 1);
  }
  freshFlashcard = !freshFlashcard;
}

function drawNewFlashcard() {
  const randomCard = cards[Math.floor(Math.random() * cards.length)];

  labels.forEach((label, labelIndex) => {
    const labelElement = document.createElement('span');
    labelElement.classList.add('label');
    if (mainLabelIndices.includes(labelIndex)) {
      labelElement.classList.add('main');
    }
    labelElement.innerHTML = label;
    const valueElement = document.createElement('span');
    valueElement.innerHTML = randomCard[labelIndex];
    valueElement.classList.add('answear');
    if (mainLabelIndices.includes(labelIndex)) {
      valueElement.classList.add('main');
    } else {
      valueElement.style.opacity = 0;
    }

    cardContainer.appendChild(labelElement);
    cardContainer.appendChild(valueElement);
  });
}

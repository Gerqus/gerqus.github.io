let mainContainer;
let cardContainer;

let labels = [];
let cards = [];
let mainLabelIndices = [];
let freshFlashcard = false;

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
  const randomLabelIndex = mainLabelIndices[Math.floor(Math.random() * mainLabelIndices.length)]

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
    if (randomLabelIndex === labelIndex) {
      valueElement.classList.add('main');
      valueElement.style.opacity = 1;
    } else {
      valueElement.style.opacity = 0;
    }

    cardContainer.appendChild(labelElement);
    cardContainer.appendChild(valueElement);
  });
}

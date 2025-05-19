const player1 = [];
const player2 = [];
const usedCards = new Set();

function addCard(player) {
  const value = document.getElementById("cardValue").value;
  const suit = document.getElementById("cardSuit").value;

  if (value === "--" || suit === "--") {
    alert("Molimo izaberite i broj i znak karte.");
    return;
  }

  const card = value + suit;

  if (usedCards.has(card)) {
    alert("Ova karta je već podeljena! Izaberite drugu.");
    return;
  }

  if (player === 1) {
    if (player1.length < 5) {
      player1.push(card);
      usedCards.add(card);
    } else {
      alert("Igrač 1 već ima 5 karata!");
    }
  } else {
    if (player2.length < 5) {
      player2.push(card);
      usedCards.add(card);
    } else {
      alert("Igrač 2 već ima 5 karata!");
    }
  }

  document.getElementById("cardValue").value = "--";
  document.getElementById("cardSuit").value = "--";
}

function getCardValue(card) {
  const value = card.slice(0, -1);
  const map = {A: 14, K: 13, Q: 12, J: 11};
  return map[value] || parseInt(value);
}

function evaluateHand(hand) {
  const values = hand.map(getCardValue).sort((a, b) => b - a);
  const suits = hand.map(c => c.slice(-1));
  const counts = {};
  for (let v of values) counts[v] = (counts[v] || 0) + 1;

  const uniqueVals = Object.keys(counts).map(Number).sort((a, b) => b - a);
  const countVals = Object.entries(counts)
    .map(([val, count]) => ({ val: parseInt(val), count }))
    .sort((a, b) => b.count - a.count || b.val - a.val);

  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = values.every((v, i, arr) => i === 0 || arr[i - 1] - v === 1);
  const isLowAceStraight = values.toString() === '14,5,4,3,2';

  // Royal flush
  if (isFlush && values.toString() === '14,13,12,11,10') return { rank: 9, name: "Royal Flush", values };

  // Straight flush
  if ((isStraight || isLowAceStraight) && isFlush)
    return { rank: 8, name: "Straight Flush", values: isLowAceStraight ? [5,4,3,2,1] : values };

  // Four of a kind
  if (countVals[0].count === 4)
    return { rank: 7, name: "Four of a Kind", values: countVals.map(c => c.val) };

  // Full house
  if (countVals[0].count === 3 && countVals[1].count === 2)
    return { rank: 6, name: "Full House", values: countVals.map(c => c.val) };

  // Flush
  if (isFlush) return { rank: 5, name: "Flush", values };

  // Straight
  if (isStraight || isLowAceStraight)
    return { rank: 4, name: "Straight", values: isLowAceStraight ? [5,4,3,2,1] : values };

  // Three of a kind
  if (countVals[0].count === 3)
    return { rank: 3, name: "Three of a Kind", values: countVals.map(c => c.val) };

  // Two pair
  if (countVals[0].count === 2 && countVals[1].count === 2)
    return { rank: 2, name: "Two Pair", values: countVals.map(c => c.val) };

  // One pair
  if (countVals[0].count === 2)
    return { rank: 1, name: "One Pair", values: countVals.map(c => c.val) };

  // High card
  return { rank: 0, name: "High Card", values };
}

function compareHands(hand1, hand2) {
  const h1 = evaluateHand(hand1);
  const h2 = evaluateHand(hand2);

  if (h1.rank > h2.rank) return { winner: 1, name: h1.name };
  if (h1.rank < h2.rank) return { winner: 2, name: h2.name };

  for (let i = 0; i < h1.values.length; i++) {
    if (h1.values[i] > h2.values[i]) return { winner: 1, name: h1.name };
    if (h1.values[i] < h2.values[i]) return { winner: 2, name: h2.name };
  }

  return { winner: 0, name: h1.name }; // Tie
}

function showResult() {
  const resultEl = document.getElementById("result");

  if (player1.length < 5 || player2.length < 5) {
    resultEl.textContent = "Oba igrača moraju imati po 5 karata.";
    return;
  }

  const result = compareHands(player1, player2);
  let output = `Igrač 1: ${player1.join(", ")}\n`;
  output += `Igrač 2: ${player2.join(", ")}\n\n`;

  if (result.winner === 1) {
    output += `🏆 Igrač 1 pobeđuje sa kombinacijom: ${result.name}`;
  } else if (result.winner === 2) {
    output += `🏆 Igrač 2 pobeđuje sa kombinacijom: ${result.name}`;
  } else {
    output += `🤝 Nerešeno – oba igrača imaju: ${result.name}`;
  }

  resultEl.textContent = output;
}

function resetGame() {
  player1.length = 0;
  player2.length = 0;
  usedCards.clear();
  document.getElementById("result").textContent = "";
}
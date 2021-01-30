function processOR(query, mtr, filesIDs, type) {
  const words = query.split('or').map(x => x.trim());
  const [word1, word2] = words;
  const occur1 = mtr.get(word1) || [];
  const occur2 = mtr.get(word2) || [];

  return [...new Set([...occur1, ...occur2]).values()];
}

function processAND(query, mtr, type) {
  const [word1, word2] = query.split('and').map(x => x.trim());
  const occur1 = mtr.get(word1);
  const occur2 = mtr.get(word2);
  if (!occur1 || !occur2) return [];
  return [...occur1].filter(x => [...occur2].includes(x));
}

function processNOT(query, mtr, filesIDs, type) {
  const word = query.split('not')[1].trim();
  const occur = mtr.get(word) || [];
  const ids = new Array(filesIDs).fill().map((_, i) => i);

  return ids.filter(x => ![...occur].includes(x));
}

module.exports = {
  processAND,
  processOR,
  processNOT,
}

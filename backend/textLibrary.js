const texts = {
  easy: [
     "The sun rises each morning and fills the sky with warm light.",
     "A little bird hops across the yard searching for tiny seeds.",
     "Tom plays outside with his dog until the streetlights turn on.",
     "Jess likes to paint bright pictures and hang them on her wall.",
     "The breeze moves the leaves gently as children play in the park.",
     "A small robot rolls across the floor picking up toys along the way.",
     "Warm cookies cool on the table, filling the room with a sweet smell.", 
     "A fox trots quietly across the forest path without making a sound.",
     "Soft rain patters on the window while Mia reads her favorite book.", 
     "Sam shares his lunch with a friend who forgot theirs at home."
  ],

  medium: [
     "Technology evolves so quickly that devices we use today may feel outdated within a few years.",
     "Learning a new skill requires patience, consistent practice, and a willingness to make mistakes along the way.",
     "Forests play a vital role in regulating the Earth's climate and supporting diverse ecosystems.",
     "Traveling exposes us to new cultures, broadening our understanding of the world and its people.",
     "Writers often draw inspiration from everyday experiences, turning ordinary moments into compelling stories.",
     "Typing with accuracy helps improve long-term speed by reducing the need for corrections.",
     "A healthy routine includes exercise, balanced meals, and time to unwind both mentally and physically.",
     "The night sky reveals countless stars, each one potentially hosting planets of its own.",
     "Even small acts of kindness can create positive ripples within a community.",
     "Cities preserve historical monuments to maintain cultural identity across generations."
  ],

  hard: [
     "Quantum field theory unifies particle interactions under a mathematical framework that challenges classical interpretations of physical reality.",
     "The emergence of artificial general intelligence raises complex philosophical debates regarding consciousness, autonomy, and ethical alignment.",
     "Archaeological discoveries frequently revise long-held assumptions about ancient civilizations, revealing intricate social structures and technological innovations.",
     "The dialectic between individual freedom and collective responsibility lies at the heart of modern political philosophy.",
     "Astrobiology investigates the biochemical prerequisites for life, probing whether self-sustaining ecosystems could emerge on extraterrestrial worlds.",
     "Contemporary cosmology explores dark matter and dark energy, elusive components that shape the large-scale structure of the universe.", 
     "Neuroscientific research continues to challenge simplistic models of cognition, revealing the brain as a dynamic network of adaptive processes.", 
     "Linguistic relativity suggests that the structure of language influences human perception, cognition, and cultural worldview.", 
     "Innovations in cryptographic protocols promise unprecedented security, yet also introduce new vulnerabilities in distributed systems.", 
     "Speculative science fiction imagines futures shaped by interstellar travel, synthetic biology, and radical human-machine integration.", 
  ],
};

function getRandomText(difficulty = 'medium') {
  const textArray = texts[difficulty] || texts.medium;
  return textArray[Math.floor(Math.random() * textArray.length)];
}

module.exports = { getRandomText };

export type Difficulty = "easy" | "medium" | "hard";
export type Theme =
  | "general"
  | "nature"
  | "technology"
  | "history"
  | "science"
  | "philosophy"
  | "sci-fi";

interface TextEntry {
  text: string;
  theme: Theme;
}

export const TEXT_LIBRARY: Record<Difficulty, TextEntry[]> = {
  easy: [
    { text: "The sun rises each morning and fills the sky with warm light.", theme: "nature" },
    { text: "A little bird hops across the yard searching for tiny seeds.", theme: "nature" },
    { text: "Tom plays outside with his dog until the streetlights turn on.", theme: "general" },
    { text: "Jess likes to paint bright pictures and hang them on her wall.", theme: "general" },
    { text: "The breeze moves the leaves gently as children play in the park.", theme: "nature" },
    { text: "A small robot rolls across the floor picking up toys along the way.", theme: "technology" },
    { text: "Warm cookies cool on the table, filling the room with a sweet smell.", theme: "general" },
    { text: "A fox trots quietly across the forest path without making a sound.", theme: "nature" },
    { text: "Soft rain patters on the window while Mia reads her favorite book.", theme: "general" },
    { text: "Sam shares his lunch with a friend who forgot theirs at home.", theme: "general" }
  ],

  medium: [
    { text: "Technology evolves so quickly that devices we use today may feel outdated within a few years.", theme: "technology" },
    { text: "Learning a new skill requires patience, consistent practice, and a willingness to make mistakes along the way.", theme: "philosophy" },
    { text: "Forests play a vital role in regulating the Earth's climate and supporting diverse ecosystems.", theme: "science" },
    { text: "Traveling exposes us to new cultures, broadening our understanding of the world and its people.", theme: "history" },
    { text: "Writers often draw inspiration from everyday experiences, turning ordinary moments into compelling stories.", theme: "general" },
    { text: "Typing with accuracy helps improve long-term speed by reducing the need for corrections.", theme: "technology" },
    { text: "A healthy routine includes exercise, balanced meals, and time to unwind both mentally and physically.", theme: "general" },
    { text: "The night sky reveals countless stars, each one potentially hosting planets of its own.", theme: "science" },
    { text: "Even small acts of kindness can create positive ripples within a community.", theme: "philosophy" },
    { text: "Cities preserve historical monuments to maintain cultural identity across generations.", theme: "history" }
  ],

  hard: [
    { text: "Quantum field theory unifies particle interactions under a mathematical framework that challenges classical interpretations of physical reality.", theme: "science" },
    { text: "The emergence of artificial general intelligence raises complex philosophical debates regarding consciousness, autonomy, and ethical alignment.", theme: "technology" },
    { text: "Archaeological discoveries frequently revise long-held assumptions about ancient civilizations, revealing intricate social structures and technological innovations.", theme: "history" },
    { text: "The dialectic between individual freedom and collective responsibility lies at the heart of modern political philosophy.", theme: "philosophy" },
    { text: "Astrobiology investigates the biochemical prerequisites for life, probing whether self-sustaining ecosystems could emerge on extraterrestrial worlds.", theme: "science" },
    { text: "Contemporary cosmology explores dark matter and dark energy, elusive components that shape the large-scale structure of the universe.", theme: "science" },
    { text: "Neuroscientific research continues to challenge simplistic models of cognition, revealing the brain as a dynamic network of adaptive processes.", theme: "science" },
    { text: "Linguistic relativity suggests that the structure of language influences human perception, cognition, and cultural worldview.", theme: "philosophy" },
    { text: "Innovations in cryptographic protocols promise unprecedented security, yet also introduce new vulnerabilities in distributed systems.", theme: "technology" },
    { text: "Speculative science fiction imagines futures shaped by interstellar travel, synthetic biology, and radical human-machine integration.", theme: "sci-fi" }
  ],
};

// prevent repeating same text twice
const lastUsedText: Record<Difficulty, string | null> = {
  easy: null,
  medium: null,
  hard: null,
};

export function getRandomText(
  difficulty: Difficulty,
  theme?: Theme
): string {
  let texts = TEXT_LIBRARY[difficulty];

  // optional: filter by theme
  if (theme && theme !== "general") {
    const themed = texts.filter((t) => t.theme === theme);
    if (themed.length > 0) texts = themed;
  }

  // avoid repeating the previous text
  const available = texts.filter((entry) => entry.text !== lastUsedText[difficulty]);

  // fallback: allow repeat only if no alternative available
  const finalList = available.length > 0 ? available : texts;

  const selected = finalList[Math.floor(Math.random() * finalList.length)];
  lastUsedText[difficulty] = selected.text;

  return selected.text;
}

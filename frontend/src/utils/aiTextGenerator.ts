// utils/aiTextGenerator.ts
export type Difficulty = "easy" | "medium" | "hard";
export type TextType = "normal" | "code" | "quotes" | "words";
export type Language = 'javascript' | 'python' | 'java' | 'cpp';

interface TypingError {
  character: string;
  position: number;
  timestamp: number;
  expectedChar: string;
  actualChar: string;
}

interface WeakArea {
  pattern: string;
  errorRate: number;
  frequency: number;
  lastSeen: number;
}

class TypingAnalytics {
  private errors: TypingError[] = [];
  private weakAreas: Map<string, WeakArea> = new Map();

  addError(error: TypingError) {
    this.errors.push(error);
    this.updateWeakAreas(error);
  }

  private updateWeakAreas(error: TypingError) {
    const pattern = error.expectedChar;
    const existing = this.weakAreas.get(pattern) || {
      pattern,
      errorRate: 0,
      frequency: 0,
      lastSeen: 0
    };

    existing.frequency++;
    existing.errorRate = this.calculateErrorRate(pattern);
    existing.lastSeen = Date.now();
    this.weakAreas.set(pattern, existing);
  }

  private calculateErrorRate(pattern: string): number {
    const patternErrors = this.errors.filter(e => e.expectedChar === pattern);
    return patternErrors.length / Math.max(1, this.getPatternOccurrences(pattern));
  }

  private getPatternOccurrences(pattern: string): number {
    return this.errors.filter(e => e.expectedChar === pattern).length + 
           this.errors.filter(e => e.actualChar === pattern).length;
  }

  getWeakAreas(): WeakArea[] {
    return Array.from(this.weakAreas.values())
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 5);
  }
}

class AITextGenerator {
  private analytics: TypingAnalytics;
  
  constructor(analytics: TypingAnalytics) {
    this.analytics = analytics;
  }

  generateText(difficulty: Difficulty, textType: TextType = 'normal', language?: Language, length: number = 100): string {
    if (textType === 'code' && language) {
      return this.generateCodeText(difficulty, language);
    }
    if (textType === 'quotes') {
      return this.generateQuoteText(difficulty);
    }
    if (textType === 'words') {
      return this.generateWordsText(difficulty, length);
    }
    return this.generateNormalText(difficulty, length);
  }

  private generateQuoteText(difficulty: Difficulty): string {
    const quotes = {
      easy: [
        "The only way to do great work is to love what you do.",
        "Life is what happens when you're busy making other plans.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "It is during our darkest moments that we must focus to see the light.",
        "The best time to plant a tree was twenty years ago. The second best time is now.",
        "Your time is limited, don't waste it living someone else's life.",
        "If you want to lift yourself up, lift up someone else.",
        "The mind is everything. What you think you become.",
        "Strive not to be a success, but rather to be of value.",
        "I have not failed. I've just found ten thousand ways that won't work.",
        "The only impossible journey is the one you never begin.",
        "Everything you've ever wanted is on the other side of fear."
      ],
      medium: [
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "In the middle of every difficulty lies opportunity. What lies behind us is not as important.",
        "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "Tell me and I forget. Teach me and I remember. Involve me and I learn something new.",
        "It does not matter how slowly you go as long as you do not stop moving forward daily.",
        "The way to get started is to quit talking and begin doing something meaningful today.",
        "If life were predictable it would cease to be life, and be without flavor entirely.",
        "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
        "When you reach the end of your rope, tie a knot in it and hang on with all your might.",
        "Always remember that you are absolutely unique. Just like everyone else in the world."
      ],
      hard: [
        "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor.",
        "The question isn't who is going to let me; it's who is going to stop me from achieving greatness.",
        "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel about themselves.",
        "Whether you think you can or you think you can't, you're right. It's all about perspective.",
        "I attribute my success to this: I never gave or took any excuse for my failures throughout life.",
        "You miss one hundred percent of the shots you don't take in life, so always take your shot.",
        "The most difficult thing is the decision to act, the rest is merely tenacity and hard work.",
        "There is only one way to avoid criticism: do nothing, say nothing, and be absolutely nothing."
      ]
    };

    const quoteList = quotes[difficulty];
    return quoteList[Math.floor(Math.random() * quoteList.length)];
  }

  private generateWordsText(difficulty: Difficulty, count: number): string {
    const words = this.getBaseWords(difficulty);
    const result: string[] = [];
    
    for (let i = 0; i < Math.ceil(count / 5); i++) {
      result.push(words[Math.floor(Math.random() * words.length)]);
    }
    
    return result.join(' ');
  }

  private generateNormalText(difficulty: Difficulty, length: number): string {
    const weakAreas = this.analytics.getWeakAreas();
    const baseWords = this.getBaseWords(difficulty);
    
    if (weakAreas.length === 0) {
      return this.generateRandomText(baseWords, length);
    }

    return this.generateTargetedText(baseWords, weakAreas, length);
  }

  private generateCodeText(difficulty: Difficulty, language: Language): string {
    const weakAreas = this.analytics.getWeakAreas();
    
    if (weakAreas.length === 0) {
      return this.generateBasicCode(language, difficulty);
    }

    return this.generateTargetedCodeText(language, difficulty, weakAreas);
  }

  private generateBasicCode(language: Language, difficulty: Difficulty): string {
    const generators = {
      javascript: () => this.generateJSCode(difficulty),
      python: () => this.generatePythonCode(difficulty),
      java: () => this.generateJavaCode(difficulty),
      cpp: () => this.generateCppCode(difficulty)
    };
    return generators[language]();
  }

  private generateTargetedCodeText(language: Language, difficulty: Difficulty, weakAreas: WeakArea[]): string {
    const targetChars = weakAreas.map(w => w.pattern);
    const code = this.generateBasicCode(language, difficulty);
    
    return this.injectTargetChars(code, targetChars);
  }

  private injectTargetChars(code: string, targetChars: string[]): string {
    let enhanced = code;
    targetChars.forEach(char => {
      if (char.match(/[a-zA-Z]/)) {
        enhanced = enhanced.replace(/\btemp\b/g, `${char}${char}temp`);
      }
    });
    return enhanced;
  }

  private generateJSCode(difficulty: Difficulty): string {
    const patterns = {
      easy: [
        () => `const ${this.randomVar()} = "${this.randomString()}";\nconsole.log(${this.randomVar()});`,
        () => `function ${this.randomFunc()}(${this.randomParam()}) {\n  return ${this.randomParam()} + 1;\n}`,
        () => `let ${this.randomVar()} = ${Math.floor(Math.random() * 100)};\n${this.randomVar()}++;`
      ],
      medium: [
        () => `const ${this.randomVar()} = [{${this.randomProp()}: "${this.randomString()}"}];\nconst result = ${this.randomVar()}.map(item => item.${this.randomProp()});`,
        () => `async function ${this.randomFunc()}() {\n  const response = await fetch("/${this.randomString()}");\n  return response.json();\n}`,
        () => `const ${this.randomFunc()} = (${this.randomParam()}) => {\n  return ${this.randomParam()}.filter(item => item.active);\n};`
      ],
      hard: [
        () => `class ${this.randomClass()} {\n  constructor(${this.randomParam()}) {\n    this.${this.randomProp()} = ${this.randomParam()};\n  }\n  ${this.randomMethod()}() {\n    return this.${this.randomProp()};\n  }\n}`,
        () => `const ${this.randomFunc()} = (${this.randomParam()}, delay) => {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => ${this.randomParam()}(...args), delay);\n  };\n};`
      ]
    };
    
    const options = patterns[difficulty];
    return options[Math.floor(Math.random() * options.length)]();
  }

  private generatePythonCode(difficulty: Difficulty): string {
    const patterns = {
      easy: [
        () => `${this.randomVar()} = "${this.randomString()}"\nprint(${this.randomVar()})`,
        () => `def ${this.randomFunc()}(${this.randomParam()}):\n    return ${this.randomParam()} + 1`,
        () => `${this.randomVar()} = ${Math.floor(Math.random() * 100)}\n${this.randomVar()} += 1`
      ],
      medium: [
        () => `${this.randomVar()} = [{"${this.randomProp()}": "${this.randomString()}"}]\nresult = [item["${this.randomProp()}"] for item in ${this.randomVar()}]`,
        () => `import asyncio\n\nasync def ${this.randomFunc()}():\n    await asyncio.sleep(1)\n    return {"${this.randomProp()}": "${this.randomString()}"}`,
        () => `def ${this.randomFunc()}(${this.randomParam()}):\n    def wrapper(*args, **kwargs):\n        print(f"Calling {${this.randomParam()}.__name__}")\n        return ${this.randomParam()}(*args, **kwargs)\n    return wrapper`
      ],
      hard: [
        () => `class ${this.randomClass()}:\n    def __init__(self, ${this.randomParam()}):\n        self.${this.randomProp()} = ${this.randomParam()}\n    \n    def ${this.randomMethod()}(self):\n        return self.${this.randomProp()}`
      ]
    };
    
    const options = patterns[difficulty];
    return options[Math.floor(Math.random() * options.length)]();
  }

  private generateJavaCode(difficulty: Difficulty): string {
    const patterns = {
      easy: [
        () => `public class ${this.randomClass()} {\n    public static void main(String[] args) {\n        System.out.println("${this.randomString()}");\n    }\n}`,
        () => `int ${this.randomVar()} = ${Math.floor(Math.random() * 100)};\nint ${this.randomVar()}2 = ${Math.floor(Math.random() * 100)};\nint sum = ${this.randomVar()} + ${this.randomVar()}2;`
      ],
      medium: [
        () => `public class ${this.randomClass()} {\n    public int ${this.randomMethod()}(int ${this.randomParam()}) {\n        return ${this.randomParam()} * 2;\n    }\n}`
      ],
      hard: [
        () => `public class ${this.randomClass()}<T> {\n    private List<T> ${this.randomProp()} = new ArrayList<>();\n    \n    public void ${this.randomMethod()}(T item) {\n        ${this.randomProp()}.add(item);\n    }\n}`
      ]
    };
    
    const options = patterns[difficulty];
    return options[Math.floor(Math.random() * options.length)]();
  }

  private generateCppCode(difficulty: Difficulty): string {
    const patterns = {
      easy: [
        () => `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "${this.randomString()}" << endl;\n    return 0;\n}`,
        () => `int ${this.randomVar()} = ${Math.floor(Math.random() * 100)};\nint ${this.randomVar()}2 = ${Math.floor(Math.random() * 100)};\nint sum = ${this.randomVar()} + ${this.randomVar()}2;`
      ],
      medium: [
        () => `class ${this.randomClass()} {\nprivate:\n    int ${this.randomProp()};\npublic:\n    ${this.randomClass()}(int ${this.randomParam()}) : ${this.randomProp()}(${this.randomParam()}) {}\n    int ${this.randomMethod()}() { return ${this.randomProp()}; }\n};`
      ],
      hard: [
        () => `template<typename T>\nclass ${this.randomClass()} {\nprivate:\n    T* ${this.randomProp()};\npublic:\n    ${this.randomClass()}(T* p) : ${this.randomProp()}(p) {}\n    T& operator*() { return *${this.randomProp()}; }\n};`
      ]
    };
    
    const options = patterns[difficulty];
    return options[Math.floor(Math.random() * options.length)]();
  }

  private randomVar(): string {
    const vars = ['data', 'value', 'item', 'result', 'temp', 'count', 'index', 'total'];
    return vars[Math.floor(Math.random() * vars.length)];
  }

  private randomFunc(): string {
    const funcs = ['process', 'handle', 'create', 'update', 'fetch', 'parse', 'build', 'execute'];
    return funcs[Math.floor(Math.random() * funcs.length)];
  }

  private randomClass(): string {
    const classes = ['Manager', 'Handler', 'Builder', 'Factory', 'Service', 'Controller', 'Helper', 'Processor'];
    return classes[Math.floor(Math.random() * classes.length)];
  }

  private randomMethod(): string {
    const methods = ['getValue', 'process', 'execute', 'handle', 'create', 'update', 'delete', 'fetch'];
    return methods[Math.floor(Math.random() * methods.length)];
  }

  private randomProp(): string {
    const props = ['name', 'value', 'data', 'id', 'type', 'status', 'config', 'options'];
    return props[Math.floor(Math.random() * props.length)];
  }

  private randomParam(): string {
    const params = ['item', 'data', 'value', 'config', 'options', 'params', 'args', 'input'];
    return params[Math.floor(Math.random() * params.length)];
  }

  private randomString(): string {
    const strings = ['Hello', 'World', 'Test', 'Demo', 'Sample', 'Example', 'Data', 'Info'];
    return strings[Math.floor(Math.random() * strings.length)];
  }

  private generateTargetedText(baseWords: string[], weakAreas: WeakArea[], length: number): string {
    const targetChars = weakAreas.map(w => w.pattern);
    const words: string[] = [];
    let currentLength = 0;

    while (currentLength < length) {
      const word = this.selectWordWithTargetChars(baseWords, targetChars);
      words.push(word);
      currentLength += word.length + 1;
    }

    return words.join(' ').substring(0, length);
  }

  private selectWordWithTargetChars(baseWords: string[], targetChars: string[]): string {
    const wordsWithTargets = baseWords.filter(word => 
      targetChars.some(char => word.includes(char))
    );
    
    if (wordsWithTargets.length > 0) {
      return wordsWithTargets[Math.floor(Math.random() * wordsWithTargets.length)];
    }
    
    return baseWords[Math.floor(Math.random() * baseWords.length)];
  }

  private generateRandomText(words: string[], length: number): string {
    const result: string[] = [];
    let currentLength = 0;

    while (currentLength < length) {
      const word = words[Math.floor(Math.random() * words.length)];
      result.push(word);
      currentLength += word.length + 1;
    }

    return result.join(' ').substring(0, length);
  }

  private getBaseWords(difficulty: Difficulty): string[] {
    const wordSets = {
      easy: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'],
      medium: ['about', 'after', 'again', 'before', 'being', 'between', 'could', 'during', 'every', 'first', 'found', 'great', 'group', 'hand', 'help', 'here', 'home', 'house', 'important', 'keep', 'know', 'large', 'last', 'leave', 'life', 'line', 'little', 'long', 'make', 'might', 'move', 'much', 'must', 'name', 'need', 'never', 'next', 'night', 'number', 'often', 'open', 'order', 'over', 'own', 'part', 'people', 'place', 'point', 'problem', 'program', 'public', 'question', 'right', 'room', 'same', 'school', 'seem', 'several', 'should', 'show', 'small', 'social', 'some', 'start', 'state', 'still', 'system', 'take', 'tell', 'than', 'that', 'their', 'them', 'there', 'these', 'they', 'thing', 'think', 'this', 'those', 'through', 'time', 'today', 'together', 'turn', 'under', 'until', 'very', 'want', 'water', 'well', 'what', 'where', 'which', 'while', 'will', 'with', 'without', 'work', 'world', 'would', 'write', 'year', 'young'],
      hard: ['according', 'actually', 'although', 'another', 'anything', 'approach', 'available', 'because', 'become', 'business', 'certainly', 'character', 'community', 'company', 'complete', 'computer', 'consider', 'continue', 'control', 'country', 'course', 'create', 'current', 'decision', 'development', 'different', 'difficult', 'economic', 'education', 'environment', 'especially', 'establish', 'example', 'experience', 'federal', 'financial', 'following', 'function', 'general', 'government', 'however', 'include', 'increase', 'individual', 'information', 'instead', 'interest', 'international', 'language', 'leadership', 'management', 'material', 'measure', 'medical', 'meeting', 'member', 'message', 'military', 'million', 'minute', 'modern', 'moment', 'morning', 'national', 'natural', 'necessary', 'nothing', 'office', 'organization', 'original', 'particular', 'pattern', 'personal', 'physical', 'political', 'popular', 'position', 'possible', 'practice', 'prepare', 'present', 'president', 'pressure', 'prevent', 'private', 'probably', 'process', 'produce', 'product', 'professional', 'project', 'property', 'protect', 'provide', 'purpose', 'quality', 'quickly', 'rather', 'reality', 'reason', 'receive', 'recognize', 'recommend', 'record', 'reduce', 'reflect', 'region', 'relate', 'relationship', 'religious', 'remain', 'remember', 'remove', 'report', 'represent', 'require', 'research', 'resource', 'respond', 'result', 'return', 'reveal', 'science', 'scientist', 'security', 'serious', 'service', 'similar', 'simple', 'simply', 'single', 'situation', 'society', 'someone', 'something', 'sometimes', 'source', 'special', 'specific', 'standard', 'station', 'strategy', 'structure', 'student', 'study', 'subject', 'success', 'successful', 'suddenly', 'support', 'surface', 'technology', 'television', 'themselves', 'theory', 'thousand', 'throughout', 'tonight', 'toward', 'treatment', 'understand', 'university', 'various', 'violence', 'western', 'whatever', 'whether', 'window', 'within', 'yourself']
    };
    return wordSets[difficulty];
  }

  getWeakAreas() {
    return this.analytics.getWeakAreas();
  }

  recordError(expectedChar: string, actualChar: string, position: number) {
    this.analytics.addError({
      character: expectedChar,
      position,
      timestamp: Date.now(),
      expectedChar,
      actualChar
    });
  }
}

export const personalizedTextLibrary = new AITextGenerator(new TypingAnalytics());
export { TypingAnalytics, AITextGenerator, type TypingError, type WeakArea };

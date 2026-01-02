class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = true;
  private initialized = false;

  constructor() {
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
  }

  private async initAudio() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.initialized = true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  private async playTone(frequency: number, duration: number, volume: number = 0.1) {
    if (!this.enabled) return;

    await this.initAudio();
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  async keyPress() {
    await this.playTone(800, 0.1, 0.05);
  }

  async correctKey() {
    await this.playTone(1000, 0.08, 0.03);
  }

  async incorrectKey() {
    await this.playTone(300, 0.15, 0.08);
  }

  async testComplete() {
    await this.playTone(600, 0.2, 0.1);
    setTimeout(() => this.playTone(800, 0.2, 0.1), 100);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();

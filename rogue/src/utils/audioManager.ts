// Simple audio manager for game sound effects

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;

  constructor() {
    // Initialize audio context on first user interaction
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    // Create envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Sound effects
  playMove(): void {
    this.createTone(220, 0.1, 'sine');
  }

  playAttack(): void {
    this.createTone(330, 0.2, 'sawtooth');
  }

  playEnemyHit(): void {
    this.createTone(150, 0.3, 'square');
  }

  playLevelUp(): void {
    // Play ascending sequence
    setTimeout(() => this.createTone(262, 0.15, 'sine'), 0);
    setTimeout(() => this.createTone(330, 0.15, 'sine'), 100);
    setTimeout(() => this.createTone(392, 0.15, 'sine'), 200);
    setTimeout(() => this.createTone(523, 0.3, 'sine'), 300);
  }

  playGameOver(): void {
    // Play descending sequence
    setTimeout(() => this.createTone(523, 0.2, 'sine'), 0);
    setTimeout(() => this.createTone(392, 0.2, 'sine'), 150);
    setTimeout(() => this.createTone(330, 0.2, 'sine'), 300);
    setTimeout(() => this.createTone(262, 0.5, 'sine'), 450);
  }

  playStairs(): void {
    // Upward arpeggio
    setTimeout(() => this.createTone(262, 0.1, 'triangle'), 0);
    setTimeout(() => this.createTone(330, 0.1, 'triangle'), 80);
    setTimeout(() => this.createTone(392, 0.1, 'triangle'), 160);
    setTimeout(() => this.createTone(523, 0.2, 'triangle'), 240);
  }

  playPickup(): void {
    this.createTone(440, 0.15, 'sine');
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // Resume audio context if needed (for mobile browsers)
  resumeAudioContext(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Global audio manager instance
export const audioManager = new AudioManager();
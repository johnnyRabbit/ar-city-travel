// Sistema de sons do jogo
// Usa Web Audio API para gerar sons proceduralmente

class SoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Sons do jogo
  playDiscover() {
    // Som de descoberta - acorde ascendente
    this.playTone(523.25, 0.1, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.2, 'sine'), 200); // G5
  }

  playCollectItem() {
    // Som de coletar item - beep agudo
    this.playTone(880, 0.1, 'square'); // A5
    setTimeout(() => this.playTone(1108.73, 0.15, 'square'), 50); // C#6
  }

  playKillZombie() {
    // Som de eliminar zombie - impacto
    this.playTone(220, 0.1, 'sawtooth'); // A3
    setTimeout(() => this.playTone(110, 0.2, 'sawtooth'), 50); // A2
  }

  playDamage() {
    // Som de dano - tom grave
    this.playTone(150, 0.15, 'square');
    setTimeout(() => this.playTone(100, 0.2, 'square'), 100);
  }

  playLevelUp() {
    // Som de level up - fanfarra
    this.playTone(523.25, 0.1, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.1, 'sine'), 200); // G5
    setTimeout(() => this.playTone(1046.50, 0.3, 'sine'), 300); // C6
  }

  playBossSpawn() {
    // Som de boss spawn - dramático
    this.playTone(110, 0.3, 'sawtooth'); // A2
    setTimeout(() => this.playTone(130.81, 0.3, 'sawtooth'), 200); // C3
    setTimeout(() => this.playTone(164.81, 0.4, 'sawtooth'), 400); // E3
  }

  playBossDefeat() {
    // Som de boss derrotado - vitória
    this.playTone(523.25, 0.15, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 150); // E5
    setTimeout(() => this.playTone(783.99, 0.15, 'sine'), 300); // G5
    setTimeout(() => this.playTone(1046.50, 0.15, 'sine'), 450); // C6
    setTimeout(() => this.playTone(1318.51, 0.4, 'sine'), 600); // E6
  }

  playQuestComplete() {
    // Som de missão completa - sucesso
    this.playTone(783.99, 0.1, 'sine'); // G5
    setTimeout(() => this.playTone(987.77, 0.1, 'sine'), 100); // B5
    setTimeout(() => this.playTone(1174.66, 0.2, 'sine'), 200); // D6
  }

  playGameOver() {
    // Som de game over - descendente
    this.playTone(440, 0.2, 'sawtooth'); // A4
    setTimeout(() => this.playTone(349.23, 0.2, 'sawtooth'), 200); // F4
    setTimeout(() => this.playTone(293.66, 0.2, 'sawtooth'), 400); // D4
    setTimeout(() => this.playTone(220, 0.4, 'sawtooth'), 600); // A3
  }

  playUseItem() {
    // Som de usar item - mágico
    this.playTone(659.25, 0.1, 'sine'); // E5
    setTimeout(() => this.playTone(880, 0.15, 'sine'), 100); // A5
  }
}

// Instância global
export const soundSystem = new SoundSystem();

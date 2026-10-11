import { playZenChime, ChimeOptions } from './chimeSynthesizer';

export interface IntervalBellConfig {
  intervalSeconds: number;
  enabled: boolean;
  chimeOptions?: ChimeOptions;
  onChime?: () => void;
}

export class IntervalBellScheduler {
  private config: IntervalBellConfig;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private lastChimeTimestamp: number = 0;
  private isTimerRunning: boolean = false;

  constructor(config: Partial<IntervalBellConfig> = {}) {
    this.config = {
      intervalSeconds: config.intervalSeconds ?? 300, // 5 minutes default
      enabled: config.enabled ?? true,
      chimeOptions: config.chimeOptions,
      onChime: config.onChime,
    };
  }

  public start(): boolean {
    if (this.isTimerRunning || !this.config.enabled || this.config.intervalSeconds <= 0) {
      return false;
    }

    this.isTimerRunning = true;
    this.lastChimeTimestamp = Date.now();

    this.timerId = setInterval(() => {
      this.triggerChime();
    }, this.config.intervalSeconds * 1000);

    return true;
  }

  public stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isTimerRunning = false;
  }

  public triggerChime(): Promise<void> {
    this.lastChimeTimestamp = Date.now();
    this.config.onChime?.();
    return playZenChime(this.config.chimeOptions);
  }

  public isRunning(): boolean {
    return this.isTimerRunning;
  }

  public getSecondsUntilNextChime(): number {
    if (!this.isTimerRunning) return 0;
    const elapsedSeconds = (Date.now() - this.lastChimeTimestamp) / 1000;
    const remaining = this.config.intervalSeconds - elapsedSeconds;
    return Math.max(0, Math.round(remaining));
  }

  public updateConfig(newConfig: Partial<IntervalBellConfig>): void {
    const wasRunning = this.isTimerRunning;
    if (wasRunning) {
      this.stop();
    }
    this.config = { ...this.config, ...newConfig };
    if (wasRunning && this.config.enabled) {
      this.start();
    }
  }
}

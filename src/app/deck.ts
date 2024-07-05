import { shuffleArray } from './shuffle';

export class Deck {
  // choices to select from.
  // user chooses 1
  private options: string[] = [];

  // max number of options to show in a choosing.
  // show=-1 means show everything.
  private show: number = -1;

  constructor(options: string[], settings: { show: number }) {
    this.options = options;
    this.show = settings.show;
  }

  static parse(s: string): Deck {
    const { options, show } = JSON.parse(s);
    return new Deck(options, { show });
  }

  getVisibleOptions() {
    return this.options.slice(0, this.show === -1 ? undefined : this.show);
  }

  choose(optionIndex: number): Deck | undefined {
    if (this.show !== -1 && optionIndex >= this.show) {
      throw new Error('cannot choose an non-visible option');
    }

    if (optionIndex >= this.options.length) {
      throw new Error('cannot choose an out-of-index option');
    }

    const newOptions = [...this.options];
    newOptions.splice(optionIndex, 1);

    // deck is depleted
    if (newOptions.length === 0) return;

    // shuffle all options that will be visible in new deck
    shuffleArray(newOptions, this.show);

    // TODO: shuffle all options not visible? Decide.

    return new Deck(newOptions, { show: this.show });
  }

  serialize(): string {
    return JSON.stringify({
      options: this.options,
      show: this.show,
    });
  }
}

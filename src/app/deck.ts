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
    // deck does not have enough options to show
    if (newOptions.length < this.show) return;

    const visibleDeck = newOptions.slice(0, this.show);
    const invisibleDeck = newOptions.slice(this.show);

    // shuffle all options that will be visible in the new deck
    shuffleArray(visibleDeck);

    // shuffle non-visible deck so who sees what isn't predetermined at start of game,
    // so if state is introspected it isn't too much trouble.
    shuffleArray(invisibleDeck);

    return new Deck([...visibleDeck, ...invisibleDeck], { show: this.show });
  }

  serialize(): string {
    return JSON.stringify({
      options: this.options,
      show: this.show,
    });
  }
}

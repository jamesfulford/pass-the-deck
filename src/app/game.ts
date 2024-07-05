export class Game {
  constructor(
    public title: string,
    public playerIDs: string[],
    private currentChooserIndex: number
  ) {}

  currentPlayerID() {
    return this.playerIDs.at(this.currentChooserIndex);
  }

  next(): Game | undefined {
    const nextChooserIndex = this.currentChooserIndex + 1;
    if (nextChooserIndex >= this.playerIDs.length) return;
    return new Game(this.title, this.playerIDs, nextChooserIndex);
  }

  serialize(): string {
    return JSON.stringify({
      title: this.title,
      players: this.playerIDs,
      chooser: this.currentChooserIndex,
    });
  }
  static parse(s: string): Game {
    const { title, players, chooser } = JSON.parse(s);
    return new Game(title, players, chooser);
  }
}

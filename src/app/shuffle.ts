// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffleArray<T>(array: T[], shuffleBefore?: number): void {
  if (shuffleBefore === undefined) shuffleBefore = array.length;
  for (let i = shuffleBefore - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

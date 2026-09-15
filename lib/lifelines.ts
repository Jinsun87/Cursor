export function fiftyFiftyHidden(
  answerIndex: number,
  choiceCount = 4,
  random = Math.random,
): number[] {
  const wrong = Array.from({ length: choiceCount }, (_, i) => i).filter((i) => i !== answerIndex);
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
  }
  return wrong.slice(0, Math.min(2, wrong.length)).sort((a, b) => a - b);
}

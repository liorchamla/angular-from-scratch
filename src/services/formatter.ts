export class Formatter {
  constructor(name: string = "global") {
    console.log(`Je suis le formatter ${name}`);
  }

  formatNumber(
    initialValue: string,
    length: number,
    groupLength: number,
    willHaveSpaces: boolean = true
  ) {
    const value = initialValue.replace(/[^\d]/g, "").substring(0, length);

    const groups: string[] = [];

    for (let i = 0; i < value.length; i += groupLength) {
      groups.push(value.substring(i, i + groupLength));
    }

    return groups.join(willHaveSpaces ? " " : "");
  }
}

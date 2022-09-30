export class CreditCardDirective {
  static selector = "[credit-card]";

  constructor(public element: HTMLElement) {}

  formatCreditCardNumber(element: HTMLInputElement) {
    const value = element.value.replace(/[^\d]/g, "").substring(0, 16);

    const groups: string[] = [];

    for (let i = 0; i < value.length; i += 4) {
      groups.push(value.substring(i, i + 4));
    }

    element.value = groups.join(" ");
  }

  init() {
    this.element.style.borderColor = "blue";

    this.element.addEventListener("input", (event) => {
      this.formatCreditCardNumber(event.target as HTMLInputElement);
    });
  }
}

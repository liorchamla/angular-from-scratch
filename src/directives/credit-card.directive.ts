/**
 * Directive CreditCardDirective
 *
 * Permet de formater un input avec le format d'une carte bleue
 */
export class CreditCardDirective {
  /**
   * Le sélecteur CSS qui permettra de brancher la directive à des éléments HTML
   */
  static selector = "[credit-card]";

  constructor(public element: HTMLElement) {}

  /**
   * Formate la valeur d'un <input> en suivant les règles d'une
   * carte bleue
   *
   * @param element L'<input> dont on veut formater la valeur
   */
  formatCreditCardNumber(element: HTMLInputElement) {
    const value = element.value.replace(/[^\d]/g, "").substring(0, 16);

    const groups: string[] = [];

    for (let i = 0; i < value.length; i += 4) {
      groups.push(value.substring(i, i + 4));
    }

    element.value = groups.join(" ");
  }

  init() {
    // Changer la couleur de la bordure en bleu
    this.element.style.borderColor = "blue";

    // Ajouter une action à chaque frappe au clavier
    this.element.addEventListener("input", (event) => {
      this.formatCreditCardNumber(event.target as HTMLInputElement);
    });
  }
}

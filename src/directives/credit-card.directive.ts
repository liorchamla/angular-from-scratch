import { CreditCardVerifier } from "../services/credit-card-verifier";
import { Formatter } from "../services/formatter";

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

  constructor(
    public element: HTMLElement,
    private verifier: CreditCardVerifier,
    private formatter: Formatter
  ) {}

  /**
   * Formate la valeur d'un <input> en suivant les règles d'une
   * carte bleue
   *
   * @param element L'<input> dont on veut formater la valeur
   */
  formatCreditCardNumber(element: HTMLInputElement) {
    element.value = this.formatter.formatNumber(element.value, 16, 4);
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

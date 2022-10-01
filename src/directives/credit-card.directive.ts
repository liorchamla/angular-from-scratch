import { Directive } from "../decorators/directive";
import { HostBinding } from "../decorators/host-binding";
import { HostListener } from "../decorators/host-listener";
import { CreditCardVerifier } from "../services/credit-card-verifier";
import { Formatter } from "../services/formatter";

/**
 * Directive CreditCardDirective
 *
 * Permet de formater un input avec le format d'une carte bleue
 */
@Directive({
  /**
   * Le sélecteur CSS qui permettra de brancher la directive à des éléments HTML
   */
  selector: "[credit-card]",
})
export class CreditCardDirective {
  constructor(
    public element: HTMLElement,
    private verifier: CreditCardVerifier,
    private formatter: Formatter
  ) {}

  /**
   * Formate la valeur d'un <input> en suivant les règles d'une
   * carte bleue
   *
   * @param value La valeur actuelle de l'<input>
   */
  @HostListener("input", ["event.target.value"])
  formatCreditCardNumber(value: string) {
    this.value = this.formatter.formatNumber(value, 16, 4);
  }

  /**
   * Fait le lien entre la propriété "value" de la directive
   * et l'attribut "value" de l'<input> HTML
   */
  @HostBinding("value")
  value = "";

  /**
   * Fait le lien entre la propriété "borderColor" de la directive
   * et la propriété "style.borderColor" de l'<input> HTML
   */
  @HostBinding("style.borderColor")
  borderColor = "blue";
}

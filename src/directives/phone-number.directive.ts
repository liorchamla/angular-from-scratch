import { Directive } from "../decorators/directive";
import { HostBinding } from "../decorators/host-binding";
import { HostListener } from "../decorators/host-listener";
import { Input } from "../decorators/input";
import { Formatter } from "../services/formatter";

/**
 * Directive PhoneNumberDirective
 *
 * Permet de formater un input avec le format d'un numéro de téléphone
 */
@Directive({
  /**
   * Le sélecteur CSS qui permettra de brancher la directive à des éléments HTML
   */
  selector: "[phone-number]",

  /**
   * Les définitions de service dont a besoin cette directive spécifiquement
   */
  providers: [
    {
      provide: "formatter",
      construct: () => new Formatter("spécifique"),
    },
  ],
})
export class PhoneNumberDirective {
  /**
   * Permet de savoir si on souhaite formater avec des espaces ou non
   */
  @Input("with-spaces")
  willHaveSpaces = true;

  /**
   * Permet de connaître la couleur de la bordure
   */
  @Input("border-color")
  @HostBinding("style.borderColor")
  borderColor = "red";

  @HostBinding("value")
  value = "";

  constructor(public element: HTMLElement, private formatter: Formatter) {}

  /**
   * Formate la valeur d'un <input> en suivant les règles d'un
   * numéro de téléphone
   *
   * @param element L'<input> dont on veut formater la valeur
   */
  @HostListener("input", ["event.target.value"])
  formatPhoneNumber(value: string) {
    this.value = this.formatter.formatNumber(value, 10, 2, this.willHaveSpaces);
  }
}

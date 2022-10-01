import { Formatter } from "../services/formatter";

/**
 * Directive PhoneNumberDirective
 *
 * Permet de formater un input avec le format d'un numéro de téléphone
 */
export class PhoneNumberDirective {
  /**
   * Le sélecteur CSS qui permettra de brancher la directive à des éléments HTML
   */
  static selector = "[phone-number]";

  /**
   * Les définitions de service dont a besoin cette directive spécifiquement
   */
  static providers = [
    {
      provide: "formatter",
      construct: () => new Formatter("spécifique"),
    },
  ];

  /**
   * Permet de savoir si on souhaite formater avec des espaces ou non
   */
  willHaveSpaces = true;

  /**
   * Permet de connaître la couleur de la bordure
   */
  borderColor = "red";

  constructor(public element: HTMLElement, private formatter: Formatter) {}

  /**
   * Formate la valeur d'un <input> en suivant les règles d'un
   * numéro de téléphone
   *
   * @param element L'<input> dont on veut formater la valeur
   */
  formatPhoneNumber(element: HTMLInputElement) {
    element.value = this.formatter.formatNumber(
      element.value,
      10,
      2,
      this.willHaveSpaces
    );
  }

  init() {
    // Si on a un attribut "with-spaces" : <input phone-number with-spaces="true|false">
    if (this.element.hasAttribute("with-spaces")) {
      // On récupère l'attribut sous forme de boolean
      this.willHaveSpaces = this.element.getAttribute("with-spaces") === "true";
    }

    // Si on a un attribut "border-color" : <input phone-number border-color="green">
    if (this.element.hasAttribute("border-color")) {
      // On récupère l'attribut sous forme de string
      this.borderColor = this.element.getAttribute("border-color")!;
    }

    // On positionne la couleur de la bordure
    this.element.style.borderColor = this.borderColor;

    // On ajoute une action à chaque frappe au clavier sur l'<input>
    this.element.addEventListener("input", (event) => {
      this.formatPhoneNumber(event.target as HTMLInputElement);
    });
  }
}

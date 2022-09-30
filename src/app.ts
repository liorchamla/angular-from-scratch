import { CreditCardDirective } from "./directives/CreditCardDirective";
import { PhoneNumberDirective } from "./directives/PhoneNumberDirective";

const directives = [PhoneNumberDirective, CreditCardDirective];

/**
 * Notre framework : il met en relation les directives et les éléments HTML.
 *
 * Il est extensible. Il suffit d'ajouter ou de supprimer des directives
 * à partir du tableau ci-dessus et le framework sera capable de faire les rattachements
 * avec les éléments HTML concernés par les SELECTORS de nos directives
 */
directives.forEach((directive) => {
  // Pour chaque directive, on récupère les éléments concernés par le sélecteur
  const elements = document.querySelectorAll<HTMLElement>(directive.selector);

  // On boucle sur chaque élément HTML et on lui "greffe" une instance la directive
  elements.forEach((element) => {
    const directiveInstance = new directive(element);
    directiveInstance.init();
  });
});

import { CreditCardDirective } from "./directives/credit-card.directive";
import { PhoneNumberDirective } from "./directives/phone-number.directive";
import { Angular } from "./framework/framework";
import { CreditCardVerifier } from "./services/credit-card-verifier";
import { Formatter } from "./services/formatter";

/**
 * Notre framework : il met en relation les directives et les éléments HTML.
 *
 * Il est extensible. Il suffit d'ajouter ou de supprimer des directives
 * à partir du tableau ci-dessus et le framework sera capable de faire les rattachements
 * avec les éléments HTML concernés par les SELECTORS de nos directives
 */
Angular.bootstrapApplication({
  /**
   * La liste des directives que le Framework devra connaître et
   * mettre en oeuvre
   */
  declarations: [PhoneNumberDirective, CreditCardDirective],
  /**
   * La liste des définitions de services que la Framework devra créer si les
   * directives lui demandent ces services par injection de dépendances
   */
  providers: [
    {
      provide: "formatter",
      construct: () => new Formatter("global"),
    },
    {
      provide: "verifier",
      construct: () => new CreditCardVerifier(),
    },
  ],
});

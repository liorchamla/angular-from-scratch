import { DirectiveMetadata } from "../framework/types";

/**
 * Ce décorateur permet de facilement configurer une Directive en s'assurant de ne rien oublier
 * tout en ayant une autocomplétion et une correction de bugs
 *
 * @param metadata Un objet qui contient le sélecteur CSS de la directive et les éventuels providers de la directive
 *
 * Exemple :
 * {
 *  selector: '[credit-card]',
 *  providers: [
 *      {
 *          provide: "formatter",
 *          construct: () => new Formatter("specifique")
 *      }
 *  ]
 * }
 */
export const Directive = (metadata: DirectiveMetadata) => {
  // La fonction qui va recevoir et décorer la classe spécifiée
  return (decoratedClass) => {
    // On ajoute une propriété statique à la classe qui reprend le sélector
    decoratedClass["selector"] = metadata.selector;
    // On ajoute une propriété statique à la classe qui reprend les providers ou alors un tableau vide
    decoratedClass["providers"] = metadata.providers || [];

    return decoratedClass;
  };
};

import set from "lodash/set";
import { Bindings } from "../framework/types";

/**
 * Décorateur @HostBinding : permet de lier une propriété de notre Directive avec une propriété de l'élément
 * HTML avec lequel la directive sera liée
 *
 * Exemple #1 :
 *
 * @HostBinding("textContent")
 * text = "Mon contenu textuel"
 *
 * Exemple #2 :
 *
 * @HostBinding('style.backgroundColor)
 * bgColor = "red"
 *
 *
 * @param attrName Le nom de la propriété de l'élément HTML que l'on souhaite impacter avec la propriété
 * de notre Directive
 */
export const HostBinding = (attrName: string) => {
  // La fonction que Typescript appellera en lui donnant la classe à décorer
  // et la propriété qui est décorée
  return (decoratedClass, decoratedPropName: string) => {
    // On récupère les Bindings existant (ou un tableau vide) sur la Directive
    const originalBindings: Bindings = decoratedClass["bindings"] || [];

    // On ajouter ce nouveau binding :
    originalBindings.push({
      attrName,
      propName: decoratedPropName,
    });

    // On remplace les anciens bindings par les bindings mis à jour
    decoratedClass["bindings"] = originalBindings;

    // On récupère l'ancienne fonction init()
    const originalInitFunction: Function =
      decoratedClass["init"] || function () {};

    // On redéfinit la fonction init()
    decoratedClass["init"] = function () {
      // On appelle l'ancienne fonction init() pour ne pas sacrifier de traitements éventuels
      originalInitFunction.call(this);

      // On utilise la fonction set() de Lodash pour mettre à jour :
      // - sur l'élément HTML
      // - la propriété attrName
      // - avec la valeur de notre propriété
      set(this.element, attrName, this[decoratedPropName]);
    };
  };
};

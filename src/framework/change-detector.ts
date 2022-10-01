import set from "lodash/set";
import get from "lodash/get";
import { DetectorBindings } from "./types";

/**
 * Permet d'enregistrer les changements qui doivent avoir lieu sur les propriétés / attributs d'éléments HTML
 * et de les effectuer en fin de traitement (en optimisant)
 */
export class ChangeDetector {
  /**
   * Un tableau des mises à jour à effectuer en fin de traitement
   */
  private bindings: DetectorBindings = [];

  /**
   * Ajoute une mise à jour à faire sur un attributt / une propriété d'un élément HTML
   *
   * @param element L'élément HTML dont on souhaite modifier un attribut / une propriété
   * @param attrName La propriété / l'attribut de l'élément que l'on souhaite modifier
   * @param value La valeur qu'il faudra donner à l'attribut / la propriété de l'élément HTML
   */
  addBinding(element: HTMLElement, attrName: string, value: any) {
    // On nettoie le tableau de toutes les mises à jour qui portaient sur le même élément HTML
    // et la même propriété / le même attribut
    this.bindings = this.bindings.filter(
      (b) => !(b.element === element && b.attrName === attrName)
    );

    // On ajoute cette mise à jour au tableau
    this.bindings.push({
      element,
      attrName,
      value,
    });
  }

  /**
   * Parcourt le tableau des mises à jour à faire sur des éléments HTML et
   * les fait si nécessaire
   */
  digest() {
    console.group("Digest");
    // Tant qu'il y a des mises à jour à faire
    while (this.bindings.length > 0) {
      // On récupère une mise à jour
      const { element, attrName, value } = this.bindings.pop();

      // On vérifie que la valeur actuelle de l'a propriété / l'attribut de l'élément
      // HTML n'est pas DEJA celle qu'on souhaite lui donner
      const actualValue = get(element, attrName);
      if (actualValue === value) {
        // Si c'est le cas, on passe à la mise à jour suivante
        continue;
      }

      console.log({
        element,
        attrName,
        value,
      });

      // On met à jour la propriété / l'attribut de l'élément HTML avec cette valeur
      set(element, attrName, value);
    }
    console.groupEnd();
  }
}

export const Detector = new ChangeDetector();

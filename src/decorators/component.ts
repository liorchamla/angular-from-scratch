import { ComponentMetadata } from "../framework/types";

/**
 * Ce décorateur permet de facilement configurer un Composant en s'assurant de ne rien oublier
 * tout en ayant une autocomplétion et une correction de bugs
 *
 * @param metadata Un objet qui contient le sélecteur CSS du composant, le template HTML du composant et les éventuels providers
 *
 * Exemple :
 * {
 *  selector: 'my-component',
 *  template: "<h3>Hello {{ firstName }}</h3>",
 *  providers: [
 *      {
 *          provide: "formatter",
 *          construct: () => new Formatter("specifique")
 *      }
 *  ]
 * }
 */
export const Component = (metadata: ComponentMetadata) => {
  // La fonction qui va recevoir et décorer la classe spécifiée
  return (decoratedClass) => {
    // On ajoute une propriété statique à la classe qui reprend le sélector
    decoratedClass["selector"] = metadata.selector;
    // On ajoute une propriété statique à la classe qui reprend les providers ou alors un tableau vide
    decoratedClass["providers"] = metadata.providers || [];

    // On donne à la classe sa propriété template
    decoratedClass.prototype.template = metadata.template;

    // On récupère l'ancienne fonction init() si elle existe
    const originalInitFunction: Function =
      decoratedClass.prototype.init || function () {};

    // On remplace la fonction init (ou on la créé si il n'y en a pas)
    decoratedClass.prototype.init = function () {
      // On rappelle l'ancienne fonction (pour ne pas sacrifier de traitements)
      originalInitFunction.call(this);

      // On appelle render() dès le départ pour intégrer le template dans le HTML
      this.render();
    };

    /**
     * Insère dans le HTML de notre élément le template dont on a au préalable remplacé les interpolations
     * et les events bindings
     */
    decoratedClass.prototype.render = function () {
      // On remplace les interpolations par les vraies valeurs (exemple : {{ firstName}} devient "Lior")
      const renderedTemplate = this.updateInterpolations(this.template);

      // On va chercher les événements à créer et on remplace toutes ces indications par des identifiants uniques
      // Exemple <h3 (click)="onClickH3">Hello</h3>
      // devient <h3 id="event-listener-2033">Hello</h3>
      const [eventsToBind, templateWithEvents] =
        this.updateEventBindings(renderedTemplate);

      // On insère le HTML dans notre élément
      this.element.innerHTML = templateWithEvents;

      // On va créer les listeners nécessaires
      this.bindEventsToDOMElements(eventsToBind);
    };

    /**
     * Créé les event listeners nécessaire et fait le lien entre les événements
     * sur les éléments du DOM et les méthodes de la classe
     *
     * @param eventsToBind Le tableau contenant les informations des listeners à créer
     */
    decoratedClass.prototype.bindEventsToDOMElements = function (
      eventsToBind: {
        elementId: string;
        eventName: string;
        methodName: string;
      }[]
    ) {
      // Pour chaque event listener à créer, on récupère les informations
      eventsToBind.forEach(({ elementId, eventName, methodName }) => {
        // On va chercher l'élément HTML qui a cet identifiant
        this.element
          .querySelector("#" + elementId)
          // On créé un event listener sur l'événement voulu et on le lie à la méthode de la classe
          .addEventListener(eventName, () => {
            this[methodName].call(this);
            this.render();
          });
      });
    };

    /**
     * Repère les events bindings dans un template donné, créé un tableau contenant les informations à connaitre
     * pour recréer les listeners nécessaires et remplace dans le template toutes les informations liées
     * aux événements par des identifiants aléatoires
     *
     * Exemple :
     * Avec le template
     * <h3 (click)="onClickH3">Hello</h3>
     *
     * La méthode renverra :
     * 1) Un tableau contenant [{ elementId: "event-listener-2033", eventName: "click", methodName="onClickH3"}]
     * 2) Le template modifié tel que <h3 id="event-listener-2033">Hello</h3>
     *
     * @param template Le template dans lequel on veut trouver les event bindings
     * @returns Un tableau qui contient en premier élément un tableau d'informations sur les événements à binder et en deuxième élément le template qui a été débarassé des eventsBindings mais qui a gagné des identifiants
     */
    decoratedClass.prototype.updateEventBindings = function (
      template: string
    ): [any[], string] {
      // Trouvons d'abords toutes les balises qui possèdent des event bindings
      // Exemple <h3 (click)="onClickH3">
      const openingTags = template.match(/<.*? \(.*?\)=\".*?\".*?>/gm);

      // Créons une variable qui nous servira à modifier le template de base
      let templateWithEvents = template;

      // Ce tableau contiendra les informations sur les événements à écouter dans le DOM
      const eventsToBind: any[] = [];

      // Pour chaque balise ouvrante qu'on a trouvé avec des event Bindings
      openingTags.forEach((openingTag) => {
        // On créé un identifiant aléatoire (exemple : event-listener-2033)
        const randomId = "event-listener-" + Math.ceil(Math.random() * 10000);

        // on recherche les event bindings qui existent dans la balise ouvrante
        const events = openingTag.match(/\((.*?)\)=\"(.*?)\"/gm);

        // Pour chaque event binding qu'on trouve (exemple: (click)="onClickH3")
        events.forEach((event) => {
          // On extrait le nom de l'événément (click) et la méthode qu'on veut lier (onClickH3)
          const [str, eventName, methodName] = /\((.*?)\)=\"(.*?)\"/gm.exec(
            event
          );
          // On ajoute ces informations au tableau des futurs listeners à créer
          eventsToBind.push({
            eventName,
            methodName,
            elementId: randomId,
          });
        });

        // On remplace dans la balise ouvrante toutes les informations d'event binding par l'identifiant
        // aléatoire (exemple : <h3 (click)="onClickH3"> devient <h3 id="event-listener-2033">)
        const finalOpeningTag = openingTag.replace(
          /\((.*?)\)=\"(.*?)\"/gm,
          `id="${randomId}"`
        );

        // On remplace la balise ouvrante originale par la balise ouvrante modifiée dans le template
        // Exemple <h3 (click)="onClickH3">Hello World</h3>
        // devient <h3 id="event-listener-2033">Hello World</h3>
        templateWithEvents = templateWithEvents.replace(
          openingTag,
          finalOpeningTag
        );
      });

      // On retourne la liste des listeners à mettre en place et le nouveau template
      // avec les identifiants uniques
      return [eventsToBind, templateWithEvents];
    };

    /**
     * Retourne un template dont les interpolations ont été remplacées par de vraies valeurs
     *
     * Exemple :
     * <h3>{{ firstName }} {{ lastName }}</h3>
     *
     * Deviendra :
     *
     * <h3>Lior Chamla</h3>
     *
     * @param template Le template HTML dans lequel on veut remplacer les interpolations
     * @returns Le template dont les interpolations ont été remplacées par de vraies valeurs
     */
    decoratedClass.prototype.updateInterpolations = function (
      template: string
    ) {
      // On cherche toutes les chaines de type {{ variable }}
      return template.replace(
        /{{.*?}}/gm,
        // On remplace par this[variable]
        (str) => this[str.replace(/{{|}}|\s/g, "")]
      );
    };

    return decoratedClass;
  };
};

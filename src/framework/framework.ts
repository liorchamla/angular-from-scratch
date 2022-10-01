import { Detector } from "./change-detector";
import {
  Binding,
  Bindings,
  FrameworkModule,
  Providers,
  ServiceInstances,
} from "./types";
import { NgZone } from "./zone";

/**
 * La classe qui représente notre framework. Son but est de facilement connaître l'ensemble des directives
 * et providers existants et de faire la connexion entre toutes nos directives et les éléments de la page
 */
export class Framework {
  /**
   * Un tableau qui contient l'ensemble des directives créées par les devs du projet
   */
  directives: any[] = [];
  /**
   * Un tableau qui contient l'ensemble des définitions se services dont dépendent les directives
   */
  providers: Providers = [];
  /**
   * Un tableau qui contient les services déjà instanciés afin de ne pas les réinstancier indéfiniment
   */
  services: ServiceInstances = [];

  /**
   * Permet de lancer l'application qui va brancher chaque directive aux éléments ciblés
   * @param metadata Un objet qui contient les informations utilses : les directives et les providers
   */
  bootstrapApplication(metadata: FrameworkModule) {
    this.directives = metadata.declarations;
    this.providers = metadata.providers || [];

    // On lance le Framework à l'intérieur d'ue Zone dans laquelle on a
    // précisé qu'après chaque traitement appelé par le navigateur, on demanderait
    // au Detector de mettre à jour ce qui doit l'être dans le HTML
    NgZone.run(() => {
      this.instanciateAndAttachDirectives();
    });
  }

  /**
   * Parcourt le tableau des directives existantes pour les instancier et les rattacher aux
   * élement HTML qu'elles ciblent !
   */
  private instanciateAndAttachDirectives() {
    this.directives.forEach((directive) => {
      // Pour chaque directive, on récupère les éléments concernés par le sélecteur
      const elements = document.querySelectorAll<HTMLElement>(
        directive.selector
      );

      // On boucle sur chaque élément HTML et on lui "greffe" une instance la directive
      elements.forEach((element) => {
        // On analyse les paramètres du constructeur de la directive et
        // on les récupère
        const params = this.analyseDirectiveConstructor(directive, element);
        // Grâce à l'API Reflect, on construit une instance de la directive en lui passant les
        // bons paramètres
        const directiveInstance = Reflect.construct(directive, params);

        // On créé un Proxy de la directive qui nous permettra d'intervenir à chaque
        // modification d'une propriété
        const directiveProxy = this.createProxyForDirective(
          directiveInstance,
          element
        );

        // On initialise la directive qui va agir sur l'élément HTML lié
        directiveProxy.init();
      });
    });
  }

  /**
   * Créé un Proxy pour une instance d'une directive et surveille les évolutions des propriétés
   * de cette instance.
   *
   * Si la propriété qui est touchée est un binding (décorateur @HostBinding), alors on prévient le
   * Detector qu'il faudra mettre à jour en fin de traitement (Zone.js) l'élément HTML lié
   * à la Directive
   *
   * @param directive La classe de la Directive pour laquelle on créé un proxy
   * @param directiveInstance L'instance de la Directive qui sera surveillée par ce proxy
   * @param element L'élément HTML concerné
   * @returns Le proxy de l'instance de la Directive
   */
  private createProxyForDirective(directiveInstance, element: HTMLElement) {
    // On retourne un nouveau Proxy qui va surveiller l'instance de la Directive
    return new Proxy(directiveInstance, {
      // A chaque modification d'une propriété de l'instance de la directive
      set: (directiveInstance, touchedPropName, newValue, proxy) => {
        // On s'assure que la propriété touchée prend bien la nouvelle valeur :
        directiveInstance[touchedPropName] = newValue;

        // On regarde si la directive possède un Binding pour la propriété qui a été touchée
        const binding = this.getDirectiveBinding(
          directiveInstance,
          touchedPropName
        );
        // Si la directive ne possède pas de binding pour la propriété
        // qui a été touchée
        if (!binding) {
          return true;
        }

        // Si un binding existe, alors on prévient le Detector qu'il y a eu un changement
        // pour cet élément HTML, pour cet attribut et cette valeur
        Detector.addBinding(element, binding.attrName, newValue);

        return true;
      },
    });
  }

  private getDirectiveBinding(
    directiveInstance: { bindings: Bindings },
    propName: string | symbol
  ) {
    if (!directiveInstance.bindings) {
      return false;
    }

    return directiveInstance.bindings.find(
      (b: Binding) => b.propName === propName
    );
  }

  /**
   * Analyse le constructeur d'une directive et nous donne les paramètres à passer à son constructeur
   *
   * @param directive La classe de la Directive qui nous intéresse
   * @param element L'élement HTML auquel la directive devait être greffée
   * @returns Un tableau des paramètres à donner au constructeur de la Directive
   */
  private analyseDirectiveConstructor(directive, element: HTMLElement) {
    // On vérifie que la directive a bien un constructeur
    const hasConstructor = /constructor\(.*?\)/g.test(directive.toString());
    // Si elle n'en a pas, on n'a donc aucun paramètre à lui passer pour sa construction
    if (!hasConstructor) {
      return [];
    }

    // Sinon, on va aller chercher les noms des paramètres à lui passer
    const paramsNames = this.extractParamNamesFromDirective(directive);

    // Pour chaque nom
    const params = paramsNames.map((name) => {
      // Si le nom est "element", alors on donne l'Elément HTML reçu
      if (name === "element") {
        return element;
      }

      // Si la directive a des providers, il faut regarder si elle fournit elle même une définition
      // pour le service
      const directiveProviders: Providers = directive.providers || [];
      // On cherche un provider dans la directive pour le service demandé
      const directiveProvider = directiveProviders.find(
        (p) => p.provide === name
      );

      // Si la directive possède un provider pour le service demandé
      if (directiveProvider) {
        // On construit le service et on le renvoie
        return directiveProvider.construct();
      }

      // Si la directive n'a pas de définition précise, alors on regarde si le service a déjà été instancié
      const service = this.services.find((s) => s.name === name);
      // Si c'est le cas, on retourne l'instance déjà existante de ce service
      if (service) {
        return service.instance;
      }

      // On cherche un provider pour le service demandé
      const provider = this.providers.find((p) => p.provide === name);

      // Si on n'en a pas, alors il y a un problème : on est incapable de construire ce service
      if (!provider) {
        throw new Error(
          `Le service ${name} n'a pas pu être construit, aucun fournisseur n'a été défini pour la framework ou la directive elle même`
        );
      }

      // Si on a un provider, on peut instancier le service
      const instance = provider.construct();
      // On l'ajoute aux services déjà instanciés pour que les prochaines directives qui demandent ce
      // service l'obtiennent plus rapidement
      this.services.push({
        name,
        instance,
      });

      // On retourne l'instance du service demandé
      return instance;
    });

    return params;
  }

  /**
   * Analyse un constructeur et retourne un tableau avec les nom des paramètres du constructeur
   *
   * @param directive La classe de la directive dont on veut vérifier les paramètres du constructeur
   * @returns Un tableau de chaînes de caractères représantant les noms des paramètres du constructeur
   */
  private extractParamNamesFromDirective(directive) {
    const params = /constructor\((.*)\)/g.exec(directive.toString());

    if (!params) {
      return [];
    }

    return params[1].split(", ");
  }
}

/**
 * On exporte une constante déjà créée pour faciliter encore plus l'utilisation du Framework
 * Les dévs n'ont même pas besoin de l'instancier, c'est déjà fait.
 */
export const Angular = new Framework();

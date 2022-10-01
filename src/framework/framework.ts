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
  providers: { provide: string; construct: Function }[] = [];
  /**
   * Un tableau qui contient les services déjà instanciés afin de ne pas les réinstancier indéfiniment
   */
  services: { name: string; instance: any }[] = [];

  /**
   * Permet de lancer l'application qui va brancher chaque directive aux éléments ciblés
   * @param metadata Un objet qui contient les informations utilses : les directives et les providers
   */
  bootstrapApplication(metadata: { declarations: any[]; providers?: any[] }) {
    this.directives = metadata.declarations;
    this.providers = metadata.providers || [];

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
        // On initialise la directive qui va agir sur l'élément HTML lié
        directiveInstance.init();
      });
    });
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
      const directiveProviders = directive.providers || [];
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

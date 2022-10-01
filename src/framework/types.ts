/**
 * Un Provider est un objet qui spécifie le nom du service à fournir (provide)
 * ainsi qu'une fonction qui permet de le construire (construct)
 *
 * Exemple :
 * {
 *   provide: "formatter",
 *   construct: () => new Formatter("global")
 * }
 *
 */
export type Provider = {
  /**
   * Le nom du service que l'on cherche à fournir
   *
   * Exemple :
   * {
   *  provide: "formatter"
   * }
   */
  provide: string;
  /**
   * La fonction qui permettra au framework d'obtenir l'instance du service
   * à fournir
   *
   * Exemple :
   * {
   *  provide: "formatter",
   *  construct: () => new Formatter("global")
   * }
   */
  construct: () => any;
};

/**
 * Un tableau d'objets de type Provider
 */
export type Providers = Provider[];

/**
 * Représente une instance de service déjà créée par le Framework
 */
export type ServiceInstance = {
  /**
   * Le nom du service que le framework a instancié
   */
  name: string;
  /**
   * L'instance du service que le framework a créé
   */
  instance: any;
};

/**
 * Représente un binding (liaison) entre une propriété de la Directive et un attribut / propriété de
 * l'élément HTML sur lequel la directive est greffée
 */
export type Binding = {
  /**
   * L'attribut ou la propriété de l'élément HTML que l'on souhaite impacter
   */
  attrName: string;
  /**
   * La propriété de la Directive que l'on souhaite lier à l'attribut / la propriété de l'élément HTML
   */
  propName: string;
};

/**
 * Un tableau d'objets de type Bindings
 */
export type Bindings = Binding[];

/**
 * Représente un Binding du point de vue du Detecteur de changements
 */
export type DetectorBinding = {
  /**
   * L'élement HTML sur lequel le changement devrait avoir lieu
   */
  element: HTMLElement;

  /**
   * La propriété / l'attribut de l'élément HTML sur lequel il y aura un changement
   */
  attrName: string;

  /**
   * La nouvelle valeur à donner à la propriété / l'attribut de l'élément HTML
   */
  value: any;
};

/**
 * Représente un tabelau de DetectorBinding
 */
export type DetectorBindings = DetectorBinding[];

/**
 * Un tableau de services déjà instanciés par le Framework
 */
export type ServiceInstances = ServiceInstance[];

export type DirectiveMetadata = {
  /**
   * Le sélecteur CSS grâce auquel on connaît les éléments HTML à qui on devra
   * greffer une instance de la directive
   *
   * Exemple #1 : '.phone' (tous les éléments dont la classe est "phone")
   * Exemple #2 : 'input[phone]' (tous les éléments <input> qui ont l'attribut "phone")
   */
  selector: string;
  /**
   * Les définitions de services dont la directive a spécifiquement besoin.
   * Ne pas utiliser si on peut se contenter des providers globaux, uniquement si la Directive
   * a besoin de spécifier une définition particulière
   *
   * Exemple :
   *
   * {
   *    provide: "formatter",
   *    construct: () => return new Formatter("spécifique")
   * }
   */
  providers?: Providers;
};

/**
 * Représente l'objet que l'on doit envoyer à la fonction bootstrapApplication du Framework
 *
 * Il doit contenir un ensemble de directives ainsi qu'un ensemble de providers
 */
export type FrameworkModule = {
  /**
   * Un tableau qui déclare l'ensemble des directives que le Framework devra connaître et faire
   * fonctionner
   *
   * Exemple:
   *
   * {
   *  declarations: [MyFirstDirective, MySecondDirective]
   * }
   */
  declarations: any[];
  /**
   * Un tableaui qui représente l'ensemble des définitions de services à fournir par le
   * framework aux différentes directives
   *
   * Exemple :
   *
   * {
   *  providers: [
   *      {
   *          provide: "formatter",
   *          construct: () => new Formatter("global")
   *      }
   *  ]
   * }
   */
  providers?: Providers;
};

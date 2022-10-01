/**
 * Décorateur HostListener qui permet de dire au Framework qu'il faudra appeler une méthode de ma
 * directive lorsqu'un événement spécifié se produira sur l'élément HTML
 *
 * Exemple #1 :
 * @HostListener('click')
 * onClick() {
 *  // ...
 * }
 *
 * #Exemple #2 :
 * @HostListener('input', ['event.target.value', 'event.target.name'])
 * onKeyDown(value: string, name: string) {
 *  // ...
 * }
 *
 * @param eventName Le nom de l'événement auquel on veut lier la méthode de notre Directive
 * @param params Les paramètres que le listener devra passer à la méthode
 */
export const HostListener = (
  eventName: string,
  params: (string | number)[] = []
) => {
  // Typescript appellera cette fonction avec la classe à décorer
  // et le nom de la méthode que l'on décore
  return (decoratedClass, decoratedMethodName: string) => {
    // On récupère le traitement init() original
    const originalInitFunction: Function =
      decoratedClass["init"] || function () {};

    // On rédéfinit la méthode init() afin d'inclure la création d'un listener
    decoratedClass["init"] = function () {
      // On rappelle la fonction init() originale afin de ne pas "sacrifier" de traitements
      // existant dans la directive
      originalInitFunction.call(this);

      // On ajoute un listener sur l'élément HTML
      this.element.addEventListener(eventName, (event: Event) => {
        // On créé les paramètres dont la méthode a besoin
        const paramsToSendToMethod = params.map((param) =>
          eval(param.toString())
        );
        // On appelle la méthode en lui passant les paramètres
        this[decoratedMethodName](...paramsToSendToMethod);
      });
    };
  };
};

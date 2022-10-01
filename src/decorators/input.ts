/**
 * Décorateur de propriété @Input : il permet de spécifier au framework que l'on souhaite
 * récupérer une information dans un attribut HTML et la positionner dans une propriété
 * de ma directive
 *
 * Exemple :
 *
 *  @Input('color')
 *  myColor = "red"
 *
 * @param attrName Le nom de l'attribut HTML à partir duquel on veut récupérer une information
 */
export const Input = (attrName: string) => {
  // Le décorateur reçoit le nom de l'attribut dans lequel on veut récupérer l'information
  // et retourne une fonction qui va décorer la classe
  return (decoratedClass, decoratedPropName: string) => {
    // On récupère la fonction init() qui pourrait déjà exister et contenir des traitements
    const originalInitFunction: Function =
      decoratedClass["init"] || function () {};

    // On remplace la fonction init() par une nouvelle fonction (qui appellera toujours l'ancienne pour
    // ne pas perdre de traitements éventuels)
    decoratedClass["init"] = function () {
      /**
       * Parfois, l'attribut sera entre crochets pour signifier que c'est une valeur JS que l'on
       * souhaite récupérer
       *
       * Exemple :
       *
       * <div [attribut]="false" [age]="35" [eleves]="['Lior', 'Magali']"></div>
       *
       * Cela veut dire que la valeur doit être vue comme du JS (un boolean, un number, un array)
       */
      const javascriptAttrName = `[${attrName}]`;

      // Si l'élément a bien cet attribut
      if (this.element.hasAttribute(javascriptAttrName)) {
        // On le récupère dans notre propriété grâce à un eval()
        this[decoratedPropName] = eval(
          this.element.getAttribute(javascriptAttrName)
        );
      }

      // Sinon, si l'attribut existe sans les crochets
      if (this.element.hasAttribute(attrName)) {
        // On le récupère par défaut sous forme de string
        this[decoratedPropName] = this.element.getAttribute(attrName);
      }

      // On appelle l'ancienne fonction init() pour s'assurer de ne pas "sacrifier" de traitements
      // déjà existants
      originalInitFunction.call(this);
    };
  };
};

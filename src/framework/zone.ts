import "zone.js";
import { Detector } from "./change-detector";

/**
 * Nous créons une nouvelle Zone dans laquelle le Framework va se lancer.
 *
 * A partir de là, chaque fois que le navigateur voudra appeler une fonction :
 * - Event Listeners
 * - Interval
 * - Timeout
 * - Promesses
 *
 * La fonction onInvokeTask nous permettra de le savoir et de réagir
 */
export const NgZone = Zone.current.fork({
  name: "NgZone",
  onInvokeTask: (parent, current, target, task, applyThis, applyArgs) => {
    // On lance véritablement la tâche appelée par le Navigateur
    parent.invokeTask(target, task, applyThis, applyArgs);
    // Mais on appelle à la fin le Detector, ainsi, si la tâche
    // implique des changements de valeurs dans nos Directive, le Detector
    // qui connait ces mises à jour, pourra les mettre en oeuvre
    Detector.digest();
  },
});

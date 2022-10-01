import { Directive } from "../decorators/directive";
import { HostBinding } from "../decorators/host-binding";
import { HostListener } from "../decorators/host-listener";

/**
 * Directive ChronoDirective : créé une interval qui dispose un compteur dans un élément HTML
 */
@Directive({
  selector: "div[chrono]",
})
export class ChronoDirective {
  /**
   * La donnée "count" sera constamment projetée dans la propriété "textContent"
   * de l'élément HTML
   */
  @HostBinding("textContent")
  count = 0;

  /**
   * Permet de suivre l'interval et de la stoper si necessaire
   */
  intervalId?: number;

  constructor(public element: HTMLElement) {}

  /**
   * Relie la méthode onClick() de la Directive à l'événement "click"
   * de l'élément HTML
   */
  @HostListener("click")
  onClick() {
    // Si l'interval est en train de tourner (on a son identifiant)
    if (this.intervalId) {
      // On arrête l'interval
      this.stopInterval();
      return;
    }

    // Si aucune interval ne tourne, on lance l'interval
    this.runInterval();
  }

  /**
   * Permet de stoper l'interval et de remettre le compteur à 0
   */
  stopInterval() {
    window.clearInterval(this.intervalId);
    this.count = 0;
    this.intervalId = undefined;
  }

  /**
   * Lance l'intervale
   */
  runInterval() {
    // Toutes les secondes, on incrément la propriété count
    this.intervalId = window.setInterval(() => this.count++, 1000);
  }

  /**
   * Lorsque la directive est créée et prête à travailler
   */
  init() {
    // On lance l'interval
    this.runInterval();
  }
}

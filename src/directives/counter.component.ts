import { Component } from "../decorators/component";
import { Input } from "../decorators/input";

@Component({
  selector: "counter",
  template: `
    <h3>Compteur : {{ count }}</h3>
    <button (click)="increment">+ Incrémenter</button>
    <button (click)="decrement">- Décrémenter</button>
  `,
})
export class CounterComponent {
  @Input("initial-value") count = 0;
  @Input("step") step = 1;

  constructor(public element: HTMLElement) {}

  increment() {
    this.count += this.step;
  }

  decrement() {
    this.count -= this.step;
  }
}

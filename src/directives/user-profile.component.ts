import { Component } from "../decorators/component";
import { Input } from "../decorators/input";

@Component({
  selector: "user-profile",
  template: `
    <h3 (click)="onClickH3">{{ firstName }} {{ lastName }}</h3>
    <strong>Job: </strong> {{ job }}
    <button (click)="onClickButton" (dblclick)="onDblClickButton">
        Changer le prénom
    </button>
`,
})
export class UserProfileComponent {
  @Input("first-name") firstName: string;
  @Input("last-name") lastName: string;
  @Input("job") job: string;

  constructor(public element: HTMLElement) {}

  onClickH3() {
    console.log("Click H3");
  }

  onDblClickButton() {
    this.firstName = "Magali";
  }

  onClickButton() {
    this.firstName = "Roger";
  }
}

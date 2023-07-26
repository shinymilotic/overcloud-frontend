import { OnInit, Input, Injector, Component } from "@angular/core";
import { ReactBidirectionalApplication } from "./react-bidirectional/react-bidirectional-application";

@Component({
  selector: "app-react-owc-renderer",
  template: `<div class="react-container" id="react-owc-renderer"></div>`,
  standalone: true,
})
export class ReactBidirectionalRendererComponent implements OnInit {
  // Hire we get data from the parent component, but of course, we can also subscribe this data directly from HeroService if we prefer this way

  constructor(public injector: Injector) {}

  ngOnInit() {
    // We add only one parameter into initialize function
    ReactBidirectionalApplication.initialize(
      "react-owc-renderer",
      this.injector
    );
  }
}

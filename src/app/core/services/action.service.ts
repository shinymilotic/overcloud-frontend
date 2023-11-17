import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged } from "rxjs";

@Injectable({ providedIn: "root" })
export class ActionService {
  actionEmitter = new EventEmitter<string>();
  action: string = "/";
  private currentActionSubject = new BehaviorSubject<string>("");
  public currentSubject = this.currentActionSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor() {}

  toggleAction(action: string) {
    this.actionEmitter.emit(action);
  }
}

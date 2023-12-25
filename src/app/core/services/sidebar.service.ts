import { EventEmitter, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class SidebarService {
  isToggleSidebar = new EventEmitter<void>();

  constructor() {}

  toggleSidebar() {
    this.isToggleSidebar.emit();
  }
}

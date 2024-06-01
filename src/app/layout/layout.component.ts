import { Component, Renderer2 } from '@angular/core';
import { HeaderComponent } from "../features/header/header.component";
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SideBarComponent } from "../features/side-bar/side-bar.component";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { Subscription, filter } from 'rxjs';
import { LayoutService } from './service/app.layout.service';
import { AppMenuComponent } from "./app.menu.component";

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
    imports: [
        HeaderComponent,
        RouterModule,
        SideBarComponent,
        SidebarModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        FormsModule,
        // BrowserModule,
        FormsModule,
        AppMenuComponent
    ]
})
export class LayoutComponent {

  menuOutsideClickListener: any;

  constructor(public layoutService: LayoutService, public renderer: Renderer2, public router: Router) { }
  get containerClass() {
    return {
        'layout-theme-light': this.layoutService.config().colorScheme === 'light',
        'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
        'layout-overlay': this.layoutService.config().menuMode === 'overlay',
        'layout-static': this.layoutService.config().menuMode === 'static',
        'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
        'layout-overlay-active': this.layoutService.state.overlayMenuActive,
        'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
        'p-input-filled': this.layoutService.config().inputStyle === 'filled',
        'p-ripple-disabled': !this.layoutService.config().ripple
    }
}
}

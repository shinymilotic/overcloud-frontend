import { Component, ElementRef, OnInit, Signal, ViewChild, computed, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MenuModule } from 'primeng/menu';
import { UserService } from '../core/services/user.service';
import { Router } from "@angular/router";

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    standalone: true,
    imports: [
        RouterLink,
        MenubarModule,
        InputGroupModule,
        InputGroupAddonModule,
        OverlayPanelModule,
        MenubarModule,
        MenuModule
    ]
})
export class TopBarComponent implements OnInit {

    
    items: Signal<MenuItem[]> = computed(() => {
        const user = this.userService.userSignal();
        if (user != null) {
            return [
                {
                    label: 'Settings',
                    icon: 'pi pi-cog',
                    routerLink: '/settings'
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        this.logout();
                    }
                }
            ]
        } else {
            return [
                {
                    label: 'Login',
                    icon: 'pi pi-sign-in',
                    routerLink: '/login'
                },
                {
                    label: 'Register',
                    icon: 'pi pi-user-plus',
                    routerLink: '/register'
                }
            ]
        }
    });

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public readonly layoutService: LayoutService,
        public readonly userService: UserService,
        public readonly router: Router
    ) { }
    ngOnInit(): void {
    }

    logout(): void {
        this.userService.logout()
        .subscribe({
          next: (isLogout) => {
            if (isLogout) {
              this.userService.purgeAuth();
              void this.router.navigate(["/"]);
            }
          }
        });
      }
}

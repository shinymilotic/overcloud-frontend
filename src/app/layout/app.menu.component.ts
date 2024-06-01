import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppMenuitemComponent } from './app.menuitem.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [
        AppMenuitemComponent
    ]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Articles', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Tests', icon: 'pi pi-fw pi-home', routerLink: ['/tests'] },
                    { label: 'Chat', icon: 'pi pi-fw pi-home', routerLink: ['/chat'] },
                ]
            },
        ];
    }
}

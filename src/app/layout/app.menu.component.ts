import { ElementRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
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

    constructor(public layoutService: LayoutService, public el: ElementRef) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Articles', icon: 'pi pi-fw pi-book', routerLink: ['/'] },
                    { label: 'Tags', icon: 'pi pi-fw pi-tags', routerLink: ['/tags'] },
                    { label: 'Tests', icon: 'pi pi-fw pi-home', routerLink: ['/tests'] },
                    // { label: 'Chat', icon: 'pi pi-fw pi-home', routerLink: ['/chat'] },
                ]
            },
        ];
    }
}

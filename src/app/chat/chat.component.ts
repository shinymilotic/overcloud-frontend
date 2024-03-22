import { Component } from '@angular/core';
import { SideBarComponent } from "../features/side-bar/side-bar.component";

@Component({
    selector: 'app-chat',
    standalone: true,
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
    imports: [SideBarComponent]
})
export class ChatComponent {

}

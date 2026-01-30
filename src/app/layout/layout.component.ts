import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../components/loader/loader.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent,RouterModule,LoaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}

import { Routes } from '@angular/router';
import { NewPageComponent } from './new-page/new-page.component';
import { PickerPageComponent } from './picker-page/picker-page.component';

export const routes: Routes = [
  {
    path: 'new',
    component: NewPageComponent,
  },
  {
    path: 'pick',
    component: PickerPageComponent,
  },
];

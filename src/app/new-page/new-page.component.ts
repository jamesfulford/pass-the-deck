import { Component } from '@angular/core';
import type { Option } from '../option.types';
import { shuffleArray } from '../shuffle';

@Component({
  selector: 'app-new-page',
  standalone: true,
  imports: [],
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css',
})
export class NewPageComponent {
  public href() {
    const options: Option[] = [
      {
        id: '1',
        name: 'A',
      },
      {
        id: '2',
        name: '2',
      },
      {
        id: '3',
        name: '3',
      },
    ];
    shuffleArray(options);
    return `/pick?options=${btoa(JSON.stringify(options))}`;
  }
}

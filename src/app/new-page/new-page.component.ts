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
        name: 'Angular',
      },
      {
        id: '2',
        name: 'React',
      },
      {
        id: '3',
        name: 'Vue',
      },
      {
        id: '4',
        name: 'Svelte',
      },
      {
        id: '5',
        name: 'Lit',
      },
      {
        id: '6',
        name: 'Stencil',
      },
      {
        id: '7',
        name: 'Polymer',
      },
    ];
    shuffleArray(options);
    return `/pick?options=${btoa(JSON.stringify(options))}`;
  }
}

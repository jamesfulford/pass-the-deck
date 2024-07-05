import { Component } from '@angular/core';
import { shuffleArray } from '../shuffle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Deck } from '../deck';

@Component({
  selector: 'app-new-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css',
})
export class NewPageComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const optionsString = params.get('options');
      const options = optionsString ? optionsString.split(',') : [];
      this.options = options;
    });
  }

  options: string[] = [];

  addOption() {
    this.options.push('');
    this.updateQueryParams();
  }
  removeOption(i: number) {
    this.options.splice(i, 1);
    this.updateQueryParams();
  }
  trackByFn(index: number, _item: string): number {
    return index;
  }
  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        options: this.options.join(','),
      },
      queryParamsHandling: 'merge',
    });
  }
  setOptions(options: string[]) {
    this.options = options;
    this.updateQueryParams();
  }

  public href() {
    const options = [...this.options];
    shuffleArray(options);
    const deck = new Deck(options, { show: 2 });

    return `/pick?deck=${btoa(deck.serialize())}`;
  }
}

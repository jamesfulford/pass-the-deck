import { Component } from '@angular/core';
import { shuffleArray } from '../shuffle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Deck } from '../deck';

const defaultOptions = [
  'Goose',
  'Bobcat',
  'Goat',
  'Fox',
  'Deer',
  'Wolf',
  'Elk',
  'Racoon',
  'Bear',
  'Moose',
  'Duck',
  // 'Rabbit', // TODO: include if 3+ players
];

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
      if (optionsString === null) {
        this.options = [...defaultOptions];
        this.updateQueryParams();
      } else {
        const options = optionsString ? optionsString.split(',') : [];
        this.options = options;
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      const choicesString = params.get('choices');

      let rawChoicesPerChoosing = choicesString
        ? Number.parseInt(choicesString)
        : this.defaultChoicesPerChoosing;

      if (!Number.isFinite(rawChoicesPerChoosing)) {
        rawChoicesPerChoosing = this.defaultChoicesPerChoosing;
      }
      if (rawChoicesPerChoosing > this.maxChoicesPerChoosing) {
        rawChoicesPerChoosing = this.maxChoicesPerChoosing;
      }
      if (rawChoicesPerChoosing < this.minChoicesPerChoosing) {
        rawChoicesPerChoosing = this.minChoicesPerChoosing;
      }

      this.choicesPerChoosing = rawChoicesPerChoosing;
      this.onChoicesPerChoosingChange();
    });
  }

  options: string[] = [];

  defaultChoicesPerChoosing: number = 2;
  choicesPerChoosing: number = 2;
  maxChoicesPerChoosing: number = 5;
  minChoicesPerChoosing: number = 1;

  onChoicesPerChoosingChange() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        choices: String(this.choicesPerChoosing),
      },
      queryParamsHandling: 'merge',
    });
  }

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
    const deck = new Deck(options, { show: this.choicesPerChoosing });

    return `/pick?deck=${btoa(deck.serialize())}`;
  }
}

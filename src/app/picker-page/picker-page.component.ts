import { CommonModule } from '@angular/common';
import { Component, computed, isDevMode, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { Option } from '../option.types';
import { shuffleArray } from '../shuffle';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-picker-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    ClipboardModule,
  ],
  templateUrl: './picker-page.component.html',
  styleUrl: './picker-page.component.css',
})
export class PickerPageComponent {
  isDev = isDevMode();
  undoDisabled = false;

  options = signal<Option[] | undefined>(undefined);
  choiceID = signal<string | undefined>(undefined);

  choice = computed(() => {
    const choiceID = this.choiceID();
    if (!choiceID) return;
    return this.options()?.find((o) => o.id === choiceID);
  });

  unchosenOptions = computed(() => {
    const choiceID = this.choiceID();
    const options = this.options();
    if (!choiceID || !options) return;
    return options.filter((o) => o.id !== choiceID);
  });

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const optionsString = params.get('options');
      if (!optionsString) return;
      const options = JSON.parse(atob(optionsString)) as Option[];

      this.options.set(options);
    });

    this.route.queryParamMap.subscribe((params) => {
      const choiceID = params.get('choice');
      this.choiceID.set(choiceID ? atob(choiceID) : undefined);
    });
  }

  onPick(opt: Option) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        choice: btoa(opt.id),
      },
      queryParamsHandling: 'merge',
    });
  }

  undoChoice() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        choice: undefined,
      },
      queryParamsHandling: 'merge',
    });
  }

  newHref() {
    const options = this.unchosenOptions() as Option[];
    shuffleArray(options);
    return `${window.location.origin}/pick?options=${btoa(
      JSON.stringify(options)
    )}`;
  }

  nextPlayerMessage() {
    return `Here are [your choices](${this.newHref()}).`;
  }

  disableUndo() {
    this.undoDisabled = true;
  }
}

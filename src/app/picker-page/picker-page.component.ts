import { CommonModule } from '@angular/common';
import { Component, computed, isDevMode, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { shuffleArray } from '../shuffle';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Deck } from '../deck';
import { Game } from '../game';

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
  undoDisabled = false;
  showSplashPage = true;
  goBeyondSplashPage() {
    this.showSplashPage = false;
  }

  deck = signal<Deck | undefined>(undefined);
  choiceIndex = signal<number | undefined>(undefined);

  game = signal<Game | undefined>(undefined);

  currentPlayerID = computed(() => {
    const game = this.game();
    if (!game) return;
    return game.currentPlayerID();
  });

  choice = computed(() => {
    const choiceIndex = this.choiceIndex();
    if (choiceIndex === undefined) return;
    return this.deck()?.getVisibleOptions()[choiceIndex];
  });

  options = computed(() => {
    const deck = this.deck();
    if (deck === undefined) return;
    return deck.getVisibleOptions();
  });

  nextDeck = computed(() => {
    const choiceIndex = this.choiceIndex();
    if (choiceIndex === undefined) return;
    const deck = this.deck();
    if (deck === undefined) return;
    return deck.choose(choiceIndex);
  });
  nextGame = computed(() => {
    const game = this.game();
    if (game === undefined) return;
    return game.next();
  });

  nextHref = computed(() => {
    const nextDeck = this.nextDeck();
    if (nextDeck === undefined) return;
    const nextGame = this.nextGame();
    if (nextGame === undefined) return;

    return `${window.location.origin}/pick?deck=${btoa(
      nextDeck.serialize()
    )}&game=${btoa(nextGame.serialize())}`;
  });

  nextPlayerMessage = computed(() => {
    const nextHref = this.nextHref();
    if (nextHref === undefined) return;
    return `Here are [your choices](${nextHref}).`;
  });

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const deckString = params.get('deck');
      if (!deckString) return;
      const deck = Deck.parse(atob(deckString));
      this.deck.set(deck);
    });

    this.route.queryParamMap.subscribe((params) => {
      const choiceIndexString = params.get('choice');
      this.choiceIndex.set(
        choiceIndexString ? Number(choiceIndexString) : undefined
      );

      if (this.choice() && this.showSplashPage) {
        // choice is locked in. Disable changing
        this.disableUndo();
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      const gameString = params.get('game');
      if (!gameString) return;
      const game = Game.parse(atob(gameString));
      this.game.set(game);
    });
  }

  onPick(optionIndex: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        choice: String(optionIndex),
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

  disableUndo() {
    this.undoDisabled = true;
  }
}

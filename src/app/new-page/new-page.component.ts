import { Component } from '@angular/core';
import { shuffleArray } from '../shuffle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Deck } from '../deck';
import { Game } from '../game';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

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
].sort();

@Component({
  selector: 'app-new-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css',
})
export class NewPageComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}

  // principle: game setup settings go in the URL so can share with other groups
  // but group-specific settings go in localStorage for faster re-play

  ngOnInit() {
    // options: what cards are we playing with?
    // game setup -> lives in URL
    this.route.queryParamMap.subscribe((params) => {
      const optionsString = params.get('options');
      if (optionsString === null) {
        this.options = [...defaultOptions];
      } else {
        const options = optionsString ? optionsString.split(',') : [];
        this.options = options;
      }
      this.onOptionsUpdated();
    });

    // choices: how many cards do you get to see when it is your turn?
    // higher is even better for first picker and worse for last picker.
    // game setup -> lives in URL
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

    this.loadPlayers();
  }

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

  options: string[] = [];

  addOption() {
    this.options.push('');
    this.onOptionsUpdated();
  }
  removeOption(i: number) {
    this.options.splice(i, 1);
    this.onOptionsUpdated();
  }
  trackByFn(index: number, _item: string): number {
    return index;
  }
  onOptionsUpdated() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        options: this.options.join(','),
      },
      queryParamsHandling: 'merge',
    });
  }

  enoughOptionsForPlayersAndChoosing() {
    // # of cards needed are: initial draw size + players-1 (for replenishing)
    return (
      this.options.length >= this.players.length + this.choicesPerChoosing - 1
    );
  }

  public href() {
    const options = [...this.options];
    shuffleArray(options);
    const deck = new Deck(options, { show: this.choicesPerChoosing });

    const game = new Game('Hunting Game', this.players, 0);

    return `/pick?deck=${btoa(deck.serialize())}&game=${btoa(
      game.serialize()
    )}`;
  }

  players: string[] = [];
  addPlayer() {
    this.players.push(`Player ${this.players.length + 1}`);
    this.onPlayersUpdated();
  }
  removePlayer(i: number) {
    this.players.splice(i, 1);
    this.onPlayersUpdated();
  }
  onPlayersUpdated() {
    const playersString = JSON.stringify(this.players);
    localStorage.setItem('players', playersString);
  }
  shufflePlayers() {
    shuffleArray(this.players);
    this.onPlayersUpdated();
  }
  loadPlayers() {
    const playersString = localStorage.getItem('players');
    if (playersString) {
      this.players = JSON.parse(playersString);
    } else {
      this.addPlayer();
      this.addPlayer();
    }
  }
}

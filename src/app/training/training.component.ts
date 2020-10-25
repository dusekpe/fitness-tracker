import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TrainingService } from './training.service';

import * as fromTraining from './training.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {

  ongoinTraining$: Observable<boolean>;

  constructor(private trainingService: TrainingService,
              private store: Store<fromTraining.State>
    ) { }

  ngOnInit() {
    this.ongoinTraining$ = this.store.select(fromTraining.getIsTraining);
  }
}

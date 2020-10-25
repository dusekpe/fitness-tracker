import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  excercises$: Observable<Excercise[]>;
  isLoading$: Observable<boolean>;

  constructor(private trainingService: TrainingService,
              private uiService: UIService,
              private store: Store<fromTraining.State>
              ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.excercises$ = this.store.select(fromTraining.getAvalilableExcercises);
    this.fetchExcercises();
  }

  fetchExcercises(){
    this.trainingService.fetchAvailableExcercises();
  }

  onStartTrainig(form: NgForm) {
    this.trainingService.startExcercise(form.value.excercise);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  excercises: Excercise[];
  excerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.excerciseSubscription = this.trainingService.excercisesChanged.subscribe(
      excercises => this.excercises = excercises);
    this.trainingService.fetchAvailableExcercises();
  }

  onStartTrainig(form: NgForm) {
    this.trainingService.startExcercise(form.value.excercise);
  }

  ngOnDestroy(){
    this.excerciseSubscription.unsubscribe();
  }
}

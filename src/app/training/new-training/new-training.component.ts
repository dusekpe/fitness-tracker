import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  excercises: Excercise[];
  private excerciseSubscription: Subscription;
  private loadingSubscription: Subscription;
  isLoading = true;

  constructor(private trainingService: TrainingService,
              private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading =>{
        this.isLoading = isLoading;
      });
    this.excerciseSubscription = this.trainingService.excercisesChanged.subscribe(
      excercises => this.excercises = excercises);

    this.fetchExcercises();
  }

  fetchExcercises(){
    this.trainingService.fetchAvailableExcercises();
  }

  onStartTrainig(form: NgForm) {
    this.trainingService.startExcercise(form.value.excercise);
  }

  ngOnDestroy(){
    if(this.excerciseSubscription)
    {
      this.excerciseSubscription.unsubscribe();
    }
    if(this.loadingSubscription)
    {
      this.loadingSubscription.unsubscribe();
    }
  }
}

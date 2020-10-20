import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {

  ongoinTraining = false;
  excerciseSubscription: Subscription

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.excerciseSubscription = this.trainingService.excerciseChanged.subscribe(
      excercise => {
        if(excercise){
          this.ongoinTraining = true;
        }else{
          this.ongoinTraining = false;
        }
      }
    );
  }

  ngOnDestroy(){
    if(this.excerciseSubscription)
    {
      this.excerciseSubscription.unsubscribe();
    }
  }

}

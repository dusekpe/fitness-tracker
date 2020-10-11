import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  excercises: Excercise[] = [];

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.excercises = this.trainingService.getAvailableExcercises();
  }

  onStartTrainig(form: NgForm){
    this.trainingService.startExcercise(form.value.excercise);
  }
}

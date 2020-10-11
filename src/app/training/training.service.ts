import { Subject } from 'rxjs/Subject';

import { Excercise } from './excercise.model';

export class TrainingService {

  excerciseChanged = new Subject<Excercise>();

  private availableExcercises: Excercise [] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private runningExcercise: Excercise;
  private excercises: Excercise[] = [];

  getAvailableExcercises(){
    return this.availableExcercises.slice();
  }

  startExcercise(selectedId: string){
    this.runningExcercise = this.availableExcercises.find(ex => ex.id === selectedId)
    this.excerciseChanged.next({...this.runningExcercise});
  }

  completeExcercise(){
    this.excercises.push({
      ... this.runningExcercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExcercise = null;
    this.excerciseChanged.next(null);
  }

  cancelExcercise(progress: number){
    this.excercises.push({
      ... this.runningExcercise,
      duration: this.runningExcercise.duration * (progress/100),
      calories: this.runningExcercise.calories * (progress/100),
      date: new Date(),
      state: 'canceled'
    });
    this.runningExcercise = null;
    this.excerciseChanged.next(null);
  }

  getCurrentExcercise(){
    return { ...this.runningExcercise };
  }

  getCompletedExcercises(){
    return this.excercises.slice();
  }
}

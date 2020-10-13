import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs/Subject';
import { Excercise } from './excercise.model';
import { map } from 'rxjs/operators';
import { Subscription} from 'rxjs';

@Injectable()
export class TrainingService {

  excerciseChanged = new Subject<Excercise>();
  excercisesChanged = new Subject<Excercise[]>();
  finishedExercisesChanged = new Subject<Excercise[]>();
  private availableExcercises: Excercise [] = [];
  private runningExcercise: Excercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) { }

  fetchAvailableExcercises() {
    this.fbSubs.push(this.db
    .collection<Excercise>('availabelExcercises')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          name: doc.payload.doc.data().name,
          duration: doc.payload.doc.data().duration,
          calories: doc.payload.doc.data().calories
        };
      });
    }))
    .subscribe((exercises: Excercise[]) => {
      this.availableExcercises = exercises;
      this.excercisesChanged.next([...this.availableExcercises]);
    }));
  }

  startExcercise(selectedId: string) {
    /*this.db.doc('availabelExcercises' + selectedId).update({
      lastSelected: new Date()
    });*/
    this.runningExcercise = this.availableExcercises.find(ex => ex.id === selectedId)
    this.excerciseChanged.next({...this.runningExcercise});
  }

  completeExcercise() {
    this.addDataToDatabase({
      ... this.runningExcercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExcercise = null;
    this.excerciseChanged.next(null);
  }

  cancelExcercise(progress: number){
    this.addDataToDatabase({
      ... this.runningExcercise,
      duration: this.runningExcercise.duration * (progress/100),
      calories: this.runningExcercise.calories * (progress/100),
      date: new Date(),
      state: 'canceled'
    });
    this.runningExcercise = null;
    this.excerciseChanged.next(null);
  }

  getCurrentExcercise() {
    return { ...this.runningExcercise };
  }

  fetchCompletedExcercises() {
    this.fbSubs.push(this.db.collection('finishExcercises').valueChanges().subscribe((excercises: Excercise[]) => {
      this.finishedExercisesChanged.next(excercises);
    }));
  }

  cancelSubscriptions(){
    this.fbSubs.forEach(element => {
      element.unsubscribe();
    });
  }
  addDataToDatabase(excercise: Excercise) {
    this.db.collection('finishExcercises').add(excercise);
  }
}

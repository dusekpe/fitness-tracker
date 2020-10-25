import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Excercise } from './excercise.model';
import { map, take } from 'rxjs/operators';
import { Subscription} from 'rxjs';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Training from  './training.actions'
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService,
              private store: Store<fromTraining.State>
    ) { }

  fetchAvailableExcercises() {
    this.store.dispatch(new UI.StartLoading());
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
    .subscribe((excercises: Excercise[]) => {
      this.store.dispatch(new UI.StopLoading());
      this.store.dispatch(new Training.SetAvailableTrainings(excercises));
    }, error => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackBar('Fetching failed, please try later!', null, 3000);
    }));
  }

  startExcercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExcercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ... ex,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExcercise(progress: number){
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ... ex,
        duration: ex.duration * (progress/100),
        calories: ex.calories * (progress/100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedExcercises() {
    this.fbSubs.push(this.db.collection('finishExcercises').valueChanges().subscribe((excercises: Excercise[]) => {
      this.store.dispatch(new Training.SetFinishedTrainings(excercises));
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

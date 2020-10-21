import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { UIService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()
export class AuthService{
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router,
              private afauth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UIService,
              private store: Store<fromRoot.State>
              ){ }

  initAuthListener(){
    this.afauth.authState.subscribe(user => {
      if(user){
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      }else{
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData){
    this.store.dispatch(new UI.StartLoading())
    //this.uiService.loadingStateChanged.next(true);
    this.afauth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    )
    .then(result => {
      this.store.dispatch(new UI.StopLoading())
      //this.uiService.loadingStateChanged.next(false);
      console.log(result);
    })
    .catch(error => {
      this.store.dispatch(new UI.StopLoading())
      //his.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackBar(error.message, null ,3000);
    });
  }

  login(authData: AuthData){
    //this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading())
    this.afauth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    )
    .then(result => {
      this.uiService.loadingStateChanged.next(false);
      console.log(result);
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackBar(error.message, null ,3000);
    });
  }

  logout(){
    this.afauth.signOut();

  }

  isAuth(){
    return this.isAuthenticated;
  }
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()

export class AuthService{
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private afauth: AngularFireAuth, private trainingService: TrainingService){ }

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
    this.afauth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    )
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });
  }

  login(authData: AuthData){
    this.afauth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    )
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });
  }

  logout(){
    this.afauth.signOut();

  }

  isAuth(){
    return this.isAuthenticated;
  }
}

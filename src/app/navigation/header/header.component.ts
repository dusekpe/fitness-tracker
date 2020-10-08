import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy  {
  @Output() sidenavTogle = new EventEmitter<void>();
  isAuth = false;
  authSubsctiption: Subscription;

  constructor(private authService: AuthService ) { }

  ngOnInit(): void {
    this.authSubsctiption = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  ngOnDestroy(){
    this.authSubsctiption.unsubscribe();
  }

  onTogleSidenav(){
    this.sidenavTogle.emit();
  }
}

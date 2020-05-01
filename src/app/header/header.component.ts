import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy{
  userIsauthenticated = false;
  private authListenerSubs: Subscription;
  constructor(public authservice: AuthService){}

  ngOnInit()
  {
    this.userIsauthenticated = this.authservice.getIsAuth();
    this.authListenerSubs = this.authservice.getAuthStatusListener().subscribe(isauthenticated => {
    this.userIsauthenticated = isauthenticated;
    });
  }

  onLogout()
  {
    this.authservice.logout();
  }

  ngOnDestroy()
  {
    this.authListenerSubs.unsubscribe();
  }
}

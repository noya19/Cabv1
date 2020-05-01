import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { book } from 'src/app/Booking/booking.model';
import { driverservice } from 'src/app/Driver/driver.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class profileComponent implements OnInit, OnDestroy
{

  displaydata: AuthData[] = [];
  bookingdata: book[] = [];
  id: string;
  private getdata: Subscription;
  private getbook: Subscription;

  constructor(public aservice: AuthService, public bservice: driverservice){}

  ngOnInit()
  {
    this.aservice.ongetUser();
    this.getdata = this.aservice.ongetUpdatedUser().subscribe((user: AuthData[]) => {
       this.displaydata = user;
       this.id = user[0].id;
    });
    this.bservice.ongetbook();
    this.getbook = this.bservice.ongetUpdatedbook().subscribe((book: book[]) => {
      this.bookingdata = book;
   });

  }
  ngOnDestroy()
  {
    this.getdata.unsubscribe();
    this.getbook.unsubscribe();
  }
}

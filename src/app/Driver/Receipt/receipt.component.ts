import { Component, OnInit, OnDestroy } from '@angular/core';
import { book } from 'src/app/Booking/booking.model';
import { driverservice } from '../driver.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  templateUrl: './receipt.component.html',
  styleUrls: ["./receipt.component.css"]
})
export class receiptComponent implements OnInit, OnDestroy{

  private getdata: Subscription;
  bookinginfo: book[] = [];
  displaydata: any = [];
  constructor( public dservice: driverservice, public router: Router){}
  ngOnInit()
  {
    this.bookinginfo = this.dservice.ongetData();
    //console.log(this.bookinginfo);    //the fact that this dosent print but weirdly has data is due to the fact that both arrays bookinginfo and display data has same Subject(observable) that updates its values
    this.displaydata = this.dservice.ongetDispData();
    this.getdata = this.dservice.ongetUpdateData().subscribe((data: book[]) => { this.bookinginfo = data});
  }

  onreturn()
  {
    this.router.navigate(["./book"]);
    alert("TO CANCEL, PLEASE VISIT YOUR PROFILE");
  }

  ngOnDestroy()
  {
    this.getdata.unsubscribe();
  }
}

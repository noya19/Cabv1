import { Component, OnInit, OnDestroy } from '@angular/core';
import { frontservice } from '../Frontpage/frontpage.service';
import { Subscription } from 'rxjs';
import { finfo } from '../Frontpage/frontpage.model';
import * as L from 'leaflet';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { driverservice } from '../Driver/driver.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookingpage',
  templateUrl: './booking.component.html',
  styleUrls: ["./booking.component.css"]
})
export class BookingComponent implements OnInit, OnDestroy{
  form : FormGroup;
  private getdata: Subscription;
  private d_front: finfo[] = [];
  flag = false;

    constructor( public fservice: frontservice, public dservice: driverservice, public router: Router) {}

    ngOnInit() {
      //map
      const map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
      }).addTo(map);

      this.dservice.onReInitialize();

      //this is for initializing the form
      this.form = new FormGroup({
        tt: new FormControl(null, {validators: [Validators.required]}),
        pickup: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        dest: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        date: new FormControl(null, {validators: [Validators.required]}),
        time: new FormControl(null, {validators: [Validators.required]}),
        ct: new FormControl(null, {validators: [Validators.required]}),
      });

      //for subscribing to service of the frontpage
      this.d_front = this.fservice.getInfo();
      this.getdata = this.fservice.getUpdatedInfo().subscribe
      (
        (response)=>
        {
          this.d_front = response;
        }
      );

      if(this.d_front)
      {
        this.form.setValue({
          tt: this.d_front[0].tt,
          pickup: this.d_front[0].pickup,
          dest: this.d_front[0].dest,
          date: null,
          time: null,
          ct: null,
        });
      }



    }



  onBook()
  {
    if(this.form.invalid)
    {
      return;
    }
    this.dservice.onbooking(this.form.value.tt, this.form.value.pickup, this.form.value.dest, this.form.value.date, this.form.value.time, this.form.value.ct);
    this.form.reset();
    this.router.navigate(['/driverselect']);
  }


  ngOnDestroy() {
      this.getdata.unsubscribe();
    }
}

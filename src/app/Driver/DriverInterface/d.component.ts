import { Component, OnInit, OnDestroy } from '@angular/core';
import { driverservice } from '../driver.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dvr } from '../dvr.model';

@Component({
  selector: 'app-driver',
  templateUrl: './d.component.html',
  styleUrls: ['./d.component.css']
})
export class DriverComponent implements OnInit, OnDestroy{
  dl: Dvr[] =[];
  private getdata: Subscription;

  constructor(public dservice: driverservice, public router: Router){}

  ngOnInit()
  {
     this.dservice.ongetDriverData(); //simply trigger the get request
     this.getdata = this.dservice.ongetUpdatedDriverdata().subscribe((driver: Dvr[]) => {  //get the updated driver  list
        this.dl = driver;  // copies it
     });

  }

  onselect(id: string, name: string, cname: string, phone: string, plate: string, imagePath: string)  //sends the details of selelcted driver to the driver service
  {
    this.dservice.onConfirm(id,name,cname,phone,plate,imagePath);
    this.router.navigate(['/checkout']);
  }


  ngOnDestroy()
  {
    this.getdata.unsubscribe();
  }
}

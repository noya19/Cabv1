import { Dvr } from './dvr.model';
import { Injectable } from '@angular/core';
import { book } from '../Booking/booking.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class driverservice{
  private book: book[] = [];
  private driver: Dvr[] = [];
  private bookdet: book[] = [];
  private dispdata: any = [];
  private Updater = new Subject<book[]>(); // this variable is of type subscriptions
  private Updatedriver = new Subject<Dvr[]>(); // this variable is of type subscriptions
  private Updatebook = new Subject<book[]>(); //this is for getting booking details

  constructor(private http: HttpClient, public router: Router, public aservice: AuthService){}

  tt: string;
  pickup: string;
  dest: string;
  date: Date;
  time: string;
  ct: string ;

  //this part is for the driver interface

  ongetDriverData()  //receiver data from server and stores it in the service in an arrary and updates it.
  {
    this.http.get<{message: string, dvr: any}>('http://localhost:3000/api/driver')  //added the type of cars to be loaded
    .pipe(map((driverData) =>{
        return driverData.dvr.map(d => {
          return {
            id: d._id,
            name: d.name,
            phone: d.phone,
            email: d.email,
            ctype: d.ctype,
            cname: d.cname,
            plate: d.plate,
            rating: d.rating,
            imagePath: d.imagePath,
          }
        });
    }))
    .subscribe((Tdriverdata) => {
      this.driver = Tdriverdata
      console.log(this.driver);
      this.Updatedriver.next([...this.driver]);
    });
  }

  ongetUpdatedDriverdata()
  {
    return this.Updatedriver.asObservable();
  }


  onAddDriver( name: string, phone: string,email: string,ctype: string,cname: string, plate: string, image: File)  //this is for driver input
  {
    const d = new FormData();
    d.append("name", name);
    d.append("phone", phone);
    d.append("email", email);
    d.append("ctype", ctype);
    d.append("cname", cname);
    d.append("plate", plate);
    d.append("image", image, name);
    this.http.post<{message: string}>('http://localhost:3000/api/driver',d).subscribe((responseData) => {
        console.log(responseData);
        //this.driver.p
        //this.Updatedriver.next([...this.driver]);
    });
  }

  //this part is for the booking and the receipt
  //----------------------------------------------------------------------------------------------------------------------
  ongetUpdatedbook()
  {
    return this.Updatebook.asObservable();
  }
  ongetbook()
  {
    const authinfo =this.aservice.getAuthData();
    const id = authinfo.id;
    console.log(id);
    this.http.get<{message: string, bk: any}>('http://localhost:3000/api/book/' + id)  //added the type of cars to be loaded
    .pipe(map((bookData) =>{
        return bookData.bk.map(u => {
          return {
            bookid: u._id,
            tt : u.tt,
            pickup: u.pickup,
            dest: u.dest,
            date: u.date,
            time: u.time,
            ct: u.ct,
            did: u.did,
            dname: u.dname,
            status: u.status,
            creator: u.creator
          }
        });
    }))
    .subscribe((Tuserdata) => {
      this.book = Tuserdata
      console.log(this.book);
      this.Updatebook.next([...this.book]);
    });

  }

  //----------------------------------------------------------------------------------------------------------------------------
  ongetData()
  {
    return [...this.bookdet]
  }
  ongetDispData()  //for displaying
  {
    return [...this.dispdata]
  }

  ongetUpdateData()
  {
    return this.Updater.asObservable();
  }

  onbooking( tt : string, pickup: string, dest: string, date: Date, time: string, CT: string) //this is for booking in the bookingpage
  {
      this.tt = tt,
      this.pickup = pickup,
      this.dest = dest,
      this.date = date,
      this.time = time,
      this.ct = CT

  }
  onConfirm( did: string, dname: string, cname: string, phone: string, plate: string, imagePath: string)    //this is for booking in the driverinterface
  {
    const temp: book = {
      bookid : null,
      tt : this.tt,
      pickup: this.pickup,
      dest: this.dest,
      date: this.date,
      time: this.time,
      ct: this.ct,
      did: did,    //received property from driverinterface
      dname : dname, //received property from driverinterface
      status: "ok",
      creator: null,
      }

    const disp ={  //this array is just for displaying data
      did: did,
      dname: dname,
      cname: cname,
      phone: phone,
      plate: plate,
      imagePath: imagePath,
    }
    this.http.post<{message: string, bookid: string}>('http://localhost:3000/api/book',temp).subscribe((responseData) => {
      const id = responseData.bookid;  //received bookingid
      temp.bookid = id
      this.bookdet.push(temp);
      this.Updater.next([...this.bookdet]);
  });
  this.dispdata.push(disp);
  this.Updater.next([...this.dispdata]);
  }

  onReInitialize()
  {
    this.bookdet = [];
    this.dispdata = [];
  }
}

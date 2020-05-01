import { finfo } from './frontpage.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn:'root'})
export class frontservice{
  private firstsearch: finfo[] = [];
  private Updater = new Subject<finfo[]>();   // this variable is of type subscriptions

  getInfo()
  {
    return [...this.firstsearch];
  }
  getUpdatedInfo()
  {
    return this.Updater.asObservable();       //now no component can emit data to this service but can avail data to from it by subscribing
  }

  onAddinfo(tt: string, pickup:string, dest: string){
    this.firstsearch = []
    const temp = {
      tt: tt,
      pickup: pickup,
      dest: dest,
    }
    this.firstsearch.push(temp);
    this.Updater.next([...this.firstsearch]);   //this updates the info
    // console.log(this.firstsearch)
  }


}

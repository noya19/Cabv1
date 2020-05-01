import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { frontservice } from './frontpage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ["./frontpage.component.css"]
})
export class FrontComponent implements OnInit{
  form: FormGroup;

  constructor(public fservice: frontservice, public router: Router){}

  ngOnInit()
  {
    this.form = new FormGroup({
      tt: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      pickup: new FormControl(null, {validators: [Validators.required]}),
      dest: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})
    });
  }

  onSearch(){
    if(this.form.invalid){
      return;
    }
    // console.log(this.form.value.tt);
    // console.log(this.form.value.pickup);
    // console.log(this.form.value.dest);
    this.fservice.onAddinfo(this.form.value.tt, this.form.value.pickup, this.form.value.dest);
    this.form.reset();
    this.router.navigate(['/book']);
  }
}

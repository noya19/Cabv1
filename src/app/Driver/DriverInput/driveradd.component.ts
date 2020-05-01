import { Component, OnInit } from '@angular/core';
import { Dvr } from '../dvr.model';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { driverservice } from '../driver.service';
import { mimeType } from './mime-type-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driveradd',
  templateUrl: './driveradd.component.html',
  styleUrls: ['./driveradd.component.css']
})
export class driveraddComponent implements OnInit{
  form : FormGroup;
  imagePreview : string;
  driver: Dvr[] = []

  constructor(public driverservice: driverservice, public router: Router){}

  ngOnInit()
  {
    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      phone: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      ctype: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      cname: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      plate: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
  }

  onImagePicked(event: Event)
  {
      const file = (event.target as HTMLInputElement).files[0];    //[0] becuase we need only the first out of the choosen image
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () =>
      {
        this.imagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);
  }

  AddUser()
  {
      if (this.form.invalid)
      {
        return;
      }
      this.driverservice.onAddDriver(this.form.value.name, this.form.value.phone, this.form.value.email, this.form.value.ctype, this.form.value.cname, this.form.value.plate, this.form.value.image);
      this.form.reset();
      this.router.navigate(['/']);

  }
}

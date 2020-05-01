import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { mimeType } from 'src/app/Driver/DriverInput/mime-type-validator';
import { Router } from '@angular/router';

@Component({
  selector: '<app-signup>',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']

})
export class SignupComponent implements OnInit{
  form : FormGroup;
  imagePreview : string;

  constructor(public authservice: AuthService, public router: Router){}


  ngOnInit()
  {
    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      phone: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
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


  onSignup()
  {
    if(this.form.invalid)
    {
      return;
    }
    this.authservice.createUser(this.form.value.name, this.form.value.phone, this.form.value.email, this.form.value.password, this.form.value.image);
    this.form.reset();
    this.router.navigate['/login'];
  }


}

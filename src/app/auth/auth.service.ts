import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { loginData } from './login-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({providedIn:'root'})

export class AuthService{
  private user: AuthData[] = [];
  private email: any;    //this is for profile
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private Updateuser = new Subject<AuthData[]>();
  constructor( public http: HttpClient, public router: Router){}

  ongetUpdatedUser()
  {
    return this.Updateuser.asObservable();
  }
  ongetUser()
  {
    const authinfo =this.getAuthData();
    const id = authinfo.id;
    this.http.get<{message: string, usr: any}>('http://localhost:3000/api/user/' + id)  //added the type of cars to be loaded
    .pipe(map((userData) =>{
        return userData.usr.map(u => {
          return {
            id: u._id,
            name: u.name,
            phone: u.phone,
            email: u.email,
            imagePath: u.imagePath,
          }
        });
    }))
    .subscribe((Tuserdata) => {
      this.user = Tuserdata
      console.log(this.user);
      this.Updateuser.next([...this.user]);
    });

  }

  //---------------------------------------------------------
  getToken()
  {
    return this.token;
  }

  getAuthStatusListener()
  {
    return this.authStatusListener.asObservable();
  }

  getIsAuth()
  {
    return this.isAuthenticated;
  }

  createUser(name: string, phone: string, email: string, password: string, image: File)
  {
      const authData = new FormData();
      authData.append('name', name);
      authData.append('phone', phone);
      authData.append('email', email);
      authData.append('password', password);
      authData.append('image', image, name);
      this.http.post<{message: string}>("http://localhost:3000/api/user/signup", authData).subscribe(response => {
        console.log(response.message);
      });
  }

  login(email: string, password: string)
  {
      this.email = email;
      const logindata: loginData ={
        email: email,
        password: password
      }
      this.http.post<{token: string, expiresIn: number, id: string}>("http://localhost:3000/api/user/login", logindata).subscribe(response => {
          const id= response.id;
          const token = response.token;
          this.token =token;
          if(token)
          {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate, id);
            this.router.navigate(['/book']);
          }
        });
  }

  autoAuthUser()
  {
    const authInformation = this.getAuthData();
    if(!authInformation)
    {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if( expiresIn > 0)
    {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout()
  {
    this.token = null;
    this.isAuthenticated =false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duartion: number)
  {
    this.tokenTimer = setTimeout(() => {     this.logout()   }, duartion * 1000 );

  }

  private saveAuthData(token: string, expirationDate: Date, id: string)
  {
      localStorage.setItem("token",token),
      localStorage.setItem("expiration", expirationDate.toISOString()),
      localStorage.setItem("id", id)
  }

  private clearAuthData()
  {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("id");
  }

  public getAuthData()
  {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const id = localStorage.getItem("id");
    if(!token || !expirationDate)
    {
      return;
    }
    return{
      token: token,
      expirationDate : new Date(expirationDate),
      id: id
    }
  }
}

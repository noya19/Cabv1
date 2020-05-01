import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontComponent } from './Frontpage/frontpage.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { driveraddComponent } from './Driver/DriverInput/driveradd.component';
import { BookingComponent } from './Booking/booking.component';
import { DriverComponent } from './Driver/DriverInterface/d.component';
import { receiptComponent } from './Driver/Receipt/receipt.component';
import { profileComponent } from './auth/profile/profile.component';
import { AuthGaurd } from './auth/auth.gaurd';


const routes: Routes = [
  { path: '', component: FrontComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'driver', component: driveraddComponent},
  { path: 'book', component: BookingComponent, canActivate:[AuthGaurd]},
  { path: 'driverselect', component: DriverComponent, canActivate:[AuthGaurd]},
  { path: 'checkout', component: receiptComponent, canActivate:[AuthGaurd]},
  { path: 'profile', component: profileComponent, canActivate:[AuthGaurd]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGaurd]
})
export class AppRoutingModule { }

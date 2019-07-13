import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApiComponent } from './api.component';
import { AuthGuard } from '../account/shared/auth.guard';

const routes: Routes = [
    { path: 'api', component: ApiComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ApiRoutingModule { }

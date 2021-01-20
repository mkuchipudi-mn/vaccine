import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';
import { VaccineCreateComponent } from '@app/vaccine/vaccine-create.component';
import { GetVaccineComponent } from '@app/get-vaccine/get-vaccine.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { title: marker('Home') } },
    { path: 'vaccine', component: VaccineCreateComponent },
    { path: 'get_Vaccine', component: GetVaccineComponent },
    { path: 'vaccine/:id', component: VaccineCreateComponent },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}

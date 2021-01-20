import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VaccineService } from '@app/servies/vaccine.service';
import { PropertyOf_Vaccine } from '@app/vaccine/PropertyOf_Vaccine';

@Component({
  selector: 'app-get-vaccine',
  templateUrl: './get-vaccine.component.html',
  styleUrls: ['./get-vaccine.component.scss'],
})
export class GetVaccineComponent implements OnInit {
  public vaccine_Data: any = [];
  model = new PropertyOf_Vaccine(1, '', '', '', '', '', '', '');
  public valbutton = 'Save';
  public getVaccine_param: PropertyOf_Vaccine[];
  products: PropertyOf_Vaccine[] = [];
  constructor(
    private vaccine_Serives: VaccineService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.vaccine_Serives.Get_Vaccine().subscribe((data) => (this.vaccine_Data = data));
  }

  ngOnInit(): void {}

  vaccine_Edit = function (kk: any) {
    this.valbutton = 'Update';
    this._router.navigate(['/vaccine', kk._id]);
  };

  vaccine_Delete = function (id: any) {
    this.vaccine_Serives.delete_Vaccine(id).subscribe(
      (data: any) => {},
      (error: any) => (this.errorMessage = error)
    );
    alert('Conifrm this row');
    this.vaccine_Serives.Get_Vaccine().subscribe((data: any) => (this.vaccine_Data = data));
  };
}

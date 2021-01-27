import { Component, Input, OnInit } from '@angular/core';
import { VaccineService } from '../servies/vaccine.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PropertyOf_Vaccine } from './PropertyOf_Vaccine';
import form_template from '../data/form.json';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-vaccine-create',
  templateUrl: './vaccine-create.component.html',
  styleUrls: ['./vaccine-create.component.scss'],
})
export class VaccineCreateComponent implements OnInit {
  vaccine_FormGroup: FormGroup;
  model: any = new PropertyOf_Vaccine('', '', '', '', '', '', new Date(), new Date());
  formTemplate: any = form_template;

  public valbutton = 'Save';
  vaccineStartDate: string | number | Date;
  vaccinendDate: string | number | Date;

  constructor(
    private vaccine_Service: VaccineService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    let group = {};
    console.log(form_template);

    this.formTemplate.form_template.forEach((input_template: any) => {
      group[input_template.label] = new FormControl('');

      console.log(input_template.label);
    });

    this.vaccine_FormGroup = new FormGroup(group);

    this.vaccine_FormGroup = this.fb.group(
      {
        id: this.model.id,
        vaccineName: ['', Validators.required],
        vaccineDescription: ['', Validators.required],
        vaccinePurpose: ['', Validators.required],
        vaccineUsedge: ['', Validators.required],
        vaccineBrand: ['', Validators.required],
        vaccineStartDate: ['', Validators.required],
        vaccinendDate: ['', Validators.required],
      },
      { validator: this.dateLessThan('vaccineStartDate', 'vaccinendDate') }
    );

    let id = this._activatedRoute.snapshot.params['id'];

    if (id) {
      this.vaccine_Service.getVaccine_param(id).subscribe((data) => {
        this.model = data[0];
        (this.model.vaccineStartDate = data[0].vaccineStartDate.split('T')[0]),
          (this.model.vaccinendDate = data[0].vaccinendDate.split('T')[0]),
          this.vaccine_FormGroup.patchValue({ id: this.model._id });
      });
    }
  }

  dateLessThan(from: string, to: string): any {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: 'Date from should be less than Date to',
        };
      }
      return {};
    };
  }

  onSubmit = function (vaccine: any) {
    vaccine.mode = this.valbutton;
    console.log(this.vaccine_FormGroup.value);

    if (vaccine.id) {
      this.vaccine_Service.update_Vaccine(vaccine).subscribe(
        (data: { data: any }) => {
          alert(data.data);
        },
        (error: any) => (this.errorMessage = error)
      );
    } else {
      this.vaccine_Service.save_Vaccine(vaccine).subscribe(
        (data: { data: any }) => {
          alert(data.data);
        },
        (error: any) => (this.errorMessage = error)
      );
    }
    this.router.navigate(['/get_Vaccine']);
  };
}

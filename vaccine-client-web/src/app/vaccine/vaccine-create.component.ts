import { Component, Input, OnInit } from '@angular/core';
import { VaccineService } from '../servies/vaccine.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PropertyOf_Vaccine } from './PropertyOf_Vaccine';
import form_template from '../data/form.json';

@Component({
  selector: 'app-vaccine-create',
  templateUrl: './vaccine-create.component.html',
  styleUrls: ['./vaccine-create.component.scss'],
})
export class VaccineCreateComponent implements OnInit {
  vaccine_FormGroup: FormGroup;
  model = new PropertyOf_Vaccine(1, '', '', '', '', '', '', '');
  formTemplate: any = form_template;
  public Repdata: any = [];
  valbutton = 'Save';

  constructor(private vaccine_Service: VaccineService) {
    this.vaccine_Service.Get_Vaccine().subscribe((data) => (this.Repdata = data));
  }

  ngOnInit() {
    let group = {};
    console.log(form_template);

    this.formTemplate.form_template.forEach((input_template: any) => {
      group[input_template.label] = new FormControl('');

      console.log(input_template.label);
    });

    this.vaccine_FormGroup = new FormGroup(group);

    this.vaccine_FormGroup = new FormGroup({
      vaccine_Name: new FormControl(null, Validators.required),
      vaccine_Description: new FormControl(null, Validators.required),
      vaccine_Purpose: new FormControl(null, Validators.required),
      vaccine_Usedge: new FormControl(null, Validators.required),
      vaccine_Brand: new FormControl(null, Validators.required),
      vaccine_Created_Date: new FormControl(null, Validators.required),
      vaccine_Updated_Date: new FormControl(null, Validators.required),
    });
  }

  // onSubmit(){

  //   console.log(this.myFormGroup.value);
  // }

  onSubmit = function (vaccine: any) {
    console.log(this.vaccine_FormGroup.value);
    vaccine.mode = this.valbutton;
    this.vaccine_Service.save_Vaccine(vaccine).subscribe(
      (data: { data: any }) => {
        alert(data.data);
      },
      (error: any) => (this.errorMessage = error)
    );
  };

  //   public Repdata:any=[];
  //   valbutton ="Save";

  //   constructor(private newService :VaccineService) {
  //     this.newService.GetUservaccine()
  //     .subscribe(data =>  this.Repdata = data)
  //   }

  // ngOnInit() {

  // }

  // onSave = function(user) {
  //     user.mode= this.valbutton;
  //     this.newService.saveUser(user)
  //     .subscribe(data =>
  //       {
  //         alert(data.data);
  //         console.log("ravi"+user)
  //         // this.ngOnInit();
  //     },
  //      error => this.errorMessage = error )

  // }
  // edit = function(kk) {
  // this.id = kk._id;
  // this.name= kk.name;
  // this.address= kk.address;
  // this.valbutton ="Update";
  // }

  // delete = function(id) {
  //   this.newService.deleteUser(id)
  //   .subscribe(data =>
  //     {
  //       alert(this.data) ;
  //       console.log("Conifrm this id"+this.data);
  //       // this.ngOnInit();
  //     },
  //     error => this.errorMessage = error )
  //   }
}

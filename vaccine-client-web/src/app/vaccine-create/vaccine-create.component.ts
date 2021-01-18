import { Component, Input, OnInit } from '@angular/core';
import { VaccineService } from './vaccine.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { superhero } from './superhero';
import form_template from '../data/form.json';

@Component({
  selector: 'app-vaccine-create',
  templateUrl: './vaccine-create.component.html',
  styleUrls: ['./vaccine-create.component.scss'],
})
export class VaccineCreateComponent implements OnInit {
  myFormGroup: FormGroup;
  model = new superhero(1, '', '', '', '', '', '', '');
  formTemplate: any = form_template;
  public Repdata: any = [];
  valbutton = 'Save';

  constructor(private newService: VaccineService) {
    this.newService.GetUser().subscribe((data) => (this.Repdata = data));
  }

  ngOnInit() {
    let group = {};
    console.log(form_template);

    this.formTemplate.form_template.forEach((input_template: any) => {
      group[input_template.label] = new FormControl('');

      console.log(input_template.label);
    });

    this.myFormGroup = new FormGroup(group);

    this.myFormGroup = new FormGroup({
      vaccinename: new FormControl(null, Validators.required),
      Description: new FormControl(null, Validators.required),
      Purpose: new FormControl(null, Validators.required),
      Usedage: new FormControl(null, Validators.required),
      Brand: new FormControl(null, Validators.required),
      Created_Date: new FormControl(null, Validators.required),
      Updated_Date: new FormControl(null, Validators.required),
    });
  }

  // onSubmit(){

  //   console.log(this.myFormGroup.value);
  // }

  onSubmit = function (vaccine: any) {
    console.log(this.myFormGroup.value);
    vaccine.mode = this.valbutton;
    this.newService.saveUser(vaccine).subscribe(
      (data: { data: any }) => {
        alert(data.data);
        console.log('ravi' + vaccine);
        // this.ngOnInit();
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

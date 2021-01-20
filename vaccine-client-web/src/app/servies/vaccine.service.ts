import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VaccineService {
  constructor(private http: HttpClient) {}

  // private _url1:string ='http://localhost:8081/vaccine/GetUservaccine/ ';

  // GetUservaccine():Observable<any>{
  //  return this.http.get<any>(this._url1)
  // }

  public save_Vaccine(vaccine: any): Observable<any> {
    return this.http.post('/vaccine/save', vaccine).map((response: Response) => response.json());
  }

  public Get_Vaccine(): Observable<any> {
    return this.http.get<any>('/vaccine/get_Vaccine');
  }

  getVaccine_param(id: any): Observable<any> {
    let parm1 = new HttpParams().set('id', id);
    return this.http.get('/vaccine/get_Vaccine', { params: parm1 });
  }

  public delete_Vaccine(id: any) {
    return this.http.post('/vaccine/delete', { id: id }).map((response: Response) => response.json());
  }
}

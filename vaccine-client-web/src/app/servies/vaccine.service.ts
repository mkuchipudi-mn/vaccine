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

  private _url1: string = 'http://localhost:8080/api/getUser/ ';

  public Get_Vaccine(): Observable<any> {
    return this.http.get<any>(this._url1);
  }
}

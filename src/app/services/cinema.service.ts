import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  public host:string="http://localhost:8080";

  constructor(private http:HttpClient) {}

  public getVilles(){
    return this.http.get(this.host+"/villes");
  }

  public getCinemas(v){
    return this.http.get(v._links.cinemas.href)
  }

  public getSalles(c){
    return this.http.get(c._links.salles.href)
  }

  public getProjections(salle){
    let url=salle._links.projections.href.replace("{?projection}","")
    return this.http.get(url+"?projection=p1")
  }

  public getTicketsPlaces(p){
    let url=p._links.tickets.href.replace("{?projection}","?projection=ticketproj");
    console.log(url);
    return this.http.get(url);
  }

  public getTickets(pp): Observable<any>{
    let url=pp._links.tickets.href.replace("{?projection}","?projection=ticketproj");
    return this.http.get<any>(url);
  }

  public payerTickets(dataForm){
    return this.http.post(this.host+"/payerTickets",dataForm);
  }
}

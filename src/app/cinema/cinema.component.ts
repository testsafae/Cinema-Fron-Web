import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes;
  public cinemas;
  public salles: any;
  public currentVille;
  public currentCinema;
  public currentProjection;
  public selectedTickets = [];
  public test: any;


  constructor(public cinemaService: CinemaService) {
  }

  ngOnInit() {
    this.cinemaService.getVilles()
      .subscribe(data => {
        this.villes = data;
      }, err => {
        console.log(err);
      });
  }

  onGetCinemas(v) {
    this.currentVille = v;
    this.salles = undefined;
    this.currentCinema = undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data => {
        this.cinemas = data;

      }, err => {
        console.log(err);
      });
  }

  onGetSalles(c) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(salle => {
          this.cinemaService.getProjections(salle)
            .subscribe(data => {
              salle.projections = data;

            }, err => {
              console.log(err);
            });

        });

      }, err => {
        console.log(err);
      });

  }

  onGetTicketsPlaces(p) {

    this.test = p;
    console.log(p);
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data => {
        console.log("data: ", data);
        this.test.tickets = data;
        console.log('tickets: ', this.test.tickets);
        this.selectedTickets = [];

        // console.log("tickets:"+JSON.stringify(this.currentProjection.tickets._embedded.tickets[0].place.numero));
      }, err => {
        console.log(err);
      });
  }

  getTickets(pp) {
    this.test = pp;
    this.cinemaService.getTickets(pp).subscribe(data => {
      console.log("data", data);
      this.test = data._embedded;
      console.log("test: ", this.test);
      console.log(this.test.tickets[0].place.numero);
    }, error => console.log("error", error));
  }

  onSelectTicket(t) {
    t.selected = !t.selected;
    if (t.selected) {
      this.selectedTickets.push(t);
    } else {
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
    console.log(this.selectedTickets);
  }

  // onSelectTicket(t){
  //   if(!t.selected){
  //     t.selected=true;
  //     this.selectedTickets.push(t);
  //   }else{
  //     t.selected=false;
  //     this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
  //   }
  //---- add
// console.log(this.selectedTickets);
//   }

  getTicketClass(t) {
    if (t.reserve === true) {
       return 'btn-danger ';
    } else if (t.selected) {
      return 'btn-warning ';
    } else {
      return 'btn-success ';
    }
  }

  onPayTickets(dataForm) {
    let tickets = [];
    this.selectedTickets.forEach(t => {
      tickets.push(t.id);
    });

    dataForm.tickets = tickets;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(data => {
        alert('Tickets réservés avec succès!');
        this.onGetTicketsPlaces(this.currentProjection);
      }, err => {
        console.log("error:", err);
      });
  }


}

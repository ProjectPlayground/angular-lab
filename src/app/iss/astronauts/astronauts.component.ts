import {Component, OnInit} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {visible} from '../../shared/animations';
import {Astronaut, IssService} from '../shared/iss.service';


@Component({
	selector: 'rj-astronauts',
	templateUrl: './astronauts.component.html',
	styleUrls: [
		'./astronauts.component.scss'
	],
	animations: [
		visible
	]
})
export class AstronautsComponent implements OnInit {
	isLoading = true;

	private peopleSource: BehaviorSubject<Astronaut[]> = new BehaviorSubject<Astronaut[]>([]);
	people: Observable<Astronaut[]> = this.peopleSource.asObservable(); // tslint:disable-line:member-ordering

	constructor(private iss: IssService) {}

	trackByAstronaut(_: number, astronaut: Astronaut): string {
		return astronaut.name;
	}

	ngOnInit(): void {
		this.iss.astronauts()
			.subscribe((people) => {
				this.peopleSource.next(people);
				this.isLoading = false;
			});
	}
}

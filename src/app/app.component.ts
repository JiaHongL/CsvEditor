import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private title: Title, private router: Router) {
    this.router.events.pipe(
      filter((event: Event) => event instanceof ActivationEnd)
    ).subscribe((event:ActivationEnd) => {
      this.title.setTitle(event.snapshot.data.title);
    });
  }

}

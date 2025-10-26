import { filter } from 'rxjs/operators';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-confirm-register',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './confirm-register.component.html',
  styleUrl: './confirm-register.component.css',
})
export class ConfirmRegisterComponent {
  email: string = '';
  public appName = environment.appName;

  public constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.pipe(filter((params) => params['email'])).subscribe((params) => {
      this.email = params['email'];
    });
  }
}

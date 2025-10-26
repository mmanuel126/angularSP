import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resetpwd-confirm',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './resetpwd-confirm.component.html',
  styleUrl: './resetpwd-confirm.component.css',
})
export class ResetpwdConfirmComponent {
  public appLogoText = environment.appLogoText;
  public constructor() {
    /* to do document why this constructor is empty */
  }
}

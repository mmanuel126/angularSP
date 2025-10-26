import { Routes } from '@angular/router';

/* account components */
import { LoginComponent } from './features/account/login/login.component';
import { ForgotpwdComponent } from './features/account/forgotpwd/forgotpwd.component';
import { ChangepwdComponent } from './features/account/changepwd/changepwd.component';
import { RegisterComponent } from './features/account/register/register.component';
import { CompleteRegisterComponent } from './features/account/complete-register/complete-register.component';
import { ConfirmRegisterComponent } from './features/account/confirm-register/confirm-register.component';
import { ResetpwdComponent } from './features/account/resetpwd/resetpwd.component';
import { ResetpwdConfirmComponent } from './features/account/resetpwd-confirm/resetpwd-confirm.component';
import { ReactivateComponent } from './features/account/reactivate/reactivate.component';
import { AuthGuardService } from './core/services/general/auth-guard-service';
import { HomeComponent } from './features/home/home.component';

/* contacts */
import { MyContactsComponent } from './features/contacts/my-contacts/my-contacts.component';
import { RequestsComponent } from './features/contacts/requests/requests.component';
import { FindContactsComponent } from './features/contacts/find-contacts/find-contacts.component';
import { PeopleIFollowComponent } from './features/contacts/people-i-follow/people-i-follow.component';
import { PeopleFollowingMeComponent } from './features/contacts/people-following-me/people-following-me.component';
import { SearchResultsComponent } from './features/contacts/search-results/search-results.component';

/* messages */
import { ViewMessagesComponent } from './features/messages/view-messages/view-messages.component';

/* members */
import { UpdateProfileComponent } from './features/members/edit-profile/update-profile/update-profile.component';
import { ShowProfileComponent } from './features/members/view-profile/show-profile/show-profile.component';

/* settings */
import { AccountSettingComponent } from './features/settings/account-setting/account-setting.component';
import { PrivacySettingComponent } from './features/settings/privacy-setting/privacy-setting.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'complete-register', component: CompleteRegisterComponent },
  { path: 'forgotpwd', component: ForgotpwdComponent },
  { path: 'changepwd', component: ChangepwdComponent },
  { path: 'confirm-register', component: ConfirmRegisterComponent },
  { path: 'resetpwd', component: ResetpwdComponent },
  { path: 'resetpwd-confirm', component: ResetpwdConfirmComponent },
  { path: 'reactivate', component: ReactivateComponent },

  //home route
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },

  //contacts routes
  { path: 'features/contacts/my-contacts', component: MyContactsComponent },
  { path: 'contacts/requests', component: RequestsComponent },
  { path: 'contacts/find-contacts', component: FindContactsComponent },
  { path: 'contacts/people-following-me', component: PeopleFollowingMeComponent },
  { path: 'contacts/people-i-follow', component: PeopleIFollowComponent },
  { path: 'contacts/search-results', component: SearchResultsComponent },

  //messages
  { path: 'messages/view-messages', component: ViewMessagesComponent },

  //members route
  { path: 'members/edit-profile', component: UpdateProfileComponent },
  { path: 'members/view-profile/show-profile', component: ShowProfileComponent },

  //settings route
  { path: 'settings/account-setting', component: AccountSettingComponent },
  { path: 'settings/privacy-setting', component: PrivacySettingComponent },
];

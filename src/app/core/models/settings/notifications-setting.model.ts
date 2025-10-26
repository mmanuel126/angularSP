export class NotificationsSetting {
  MemberID: number = 0;
  lG_SendMsg: boolean = false;
  lG_AddAsFriend: boolean = false;
  lG_ConfirmFriendShipRequest: boolean = false;
  gP_InviteYouToJoin: boolean = false;
  gP_MakesYouAGPAdmin: boolean = false;
  gP_RepliesToYourDiscBooardPost: boolean = false;
  gP_ChangesTheNameOfGroupYouBelong: boolean = false;
  eV_InviteToEvent: boolean = false;
  eV_DateChanged: boolean = false;
  hE_RepliesToYourHelpQuest: boolean = false;
}

export class NotificationBody {
  memberId: string = '0';
  sendMsg: boolean = false;
  addAsFriend: boolean = false;
  confirmFriendShipRequest: boolean = false;
  repliesToYourHelpQuest: boolean = false;
}

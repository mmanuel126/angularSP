export class Posts {
  postID: string = '';
  description: string = '';
  datePosted: string = '';
  picturePath: string = '';
  memberName: string = '';
  firstName: string = '';
  memberID: string = '';
  children!: Array<PostResponses>;
}

export class PostResponses {
  postResponseID: string = '';
  postID: string = '';
  description: string = '';
  dateResponded: string = '';
  memberID: string = '';
  memberName: string = '';
  firstName: string = '';
  picturePath: string = '';
}

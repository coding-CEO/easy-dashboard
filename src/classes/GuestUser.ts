export class GuestUser {
  private email: String;
  constructor(newEmail: String) {
    this.email = newEmail;
  }
  public getEmail = (): String => {
    return this.email;
  };
}

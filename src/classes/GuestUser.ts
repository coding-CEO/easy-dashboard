export class GuestUser {
  private email: string;
  constructor(newEmail: string) {
    this.email = newEmail;
  }
  public getEmail = (): string => {
    return this.email;
  };
}

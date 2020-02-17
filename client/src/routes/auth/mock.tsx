import { LoginInfo, RegisterInfo, User } from 'src/types/auth';

interface MockAuthType {
  login(info: LoginInfo): Promise<User>;
  register(info: RegisterInfo): Promise<User>;
  loggedIn(): Promise<User>;
  logout(): Promise<undefined>;

  next: Promise<User>;
  nextLogout: Promise<undefined>;
}

class MockAuth implements MockAuthType {
  next: Promise<User> = new Promise(resolve =>
    resolve({ email: 'test@test.com' })
  );
  nextLogout: Promise<undefined> = new Promise(resolve => resolve());
  constructor() {
    this.loggedIn = this.loggedIn.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.resolveNext = this.resolveNext.bind(this);
    this.rejectNext = this.rejectNext.bind(this);

    return this;
  }

  resolveNext(): void {
    this.nextLogout = new Promise(resolve => resolve(undefined));
  }

  resolveNextUser(user: User): void {
    this.next = new Promise(resolve => resolve(user));
  }

  rejectNext(reason: string): void {
    this.next = new Promise((_, reject) => reject(reason));
    this.nextLogout = new Promise((_, reject) => reject(reason));
  }

  loggedIn(): Promise<User> {
    return this.next;
  }

  login(info: LoginInfo): Promise<User> {
    return this.next;
  }

  logout(): Promise<undefined> {
    return this.nextLogout;
  }

  register(info: RegisterInfo): Promise<User> {
    return this.next;
  }
}

const mockAuth = new MockAuth();

export default mockAuth;

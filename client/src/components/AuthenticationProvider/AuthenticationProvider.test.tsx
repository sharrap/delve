import React from 'react';

import {
  act,
  getByText,
  messagePrefix,
  queryByText,
  render,
  screen,
  userEvent,
  wait,
} from 'src/test-utils';
import {
  useAuthentication,
  useAuthenticated,
  useUser,
} from './AuthenticationProvider';

import routes from 'src/routes';

interface ConsumerProps {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

const Consumer: React.FunctionComponent<ConsumerProps> = ({
  email = 'test@test.com',
  password = '',
  rememberMe = false,
}: ConsumerProps) => {
  const authenticated = useAuthenticated();
  const user = useUser();

  const { login, logout, register, loggedIn } = useAuthentication();

  const noop = () => undefined;

  return (
    <div data-testid="consumer">
      <span data-testid="authenticated">
        {authenticated ? 'true' : 'false'}
      </span>
      <span data-testid="user">{user ? user.email : 'nouser'}</span>
      <button
        data-testid="login"
        onClick={() => {
          login({ email, password, rememberMe }).catch(noop);
        }}
      />
      <button
        data-testid="register"
        onClick={() => {
          register({ email, password }).catch(noop);
        }}
      />
      <button
        data-testid="logout"
        onClick={() => {
          logout().catch(noop);
        }}
      />
      <button
        data-testid="loggedIn"
        onClick={() => {
          loggedIn().catch(noop);
        }}
      />
    </div>
  );
};

const message = messagePrefix('notifications.Auth');

// These tests don't actually test the AuthenticationProvider: it's already
// automatically wrapped around all tests. Instead, they test a simple
// Consumer above which has access to everything it provides
describe('<AuthenticationProvider/>', () => {
  it('Renders without crashing', () => {
    const dom = render(<Consumer />);
    expect(dom.queryByTestId('consumer')).toBeInTheDocument();
  });

  it('Displays no user, not logged in by default', () => {
    const dom = render(<Consumer />);

    expect(
      queryByText(dom.getByTestId('authenticated'), 'false')
    ).toBeInTheDocument();
    expect(queryByText(dom.getByTestId('user'), 'nouser')).toBeInTheDocument();
  });

  it('Can fail to check loggedIn status', async () => {
    const dom = render(<Consumer />);

    routes.auth.mock.rejectNext('crash');
    act(() => userEvent.click(dom.queryByTestId('loggedIn')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'false')
      ).toBeInTheDocument()
    );
    expect(queryByText(dom.getByTestId('user'), 'nouser')).toBeInTheDocument();
  });

  it('Can succeed to check loggedIn status', async () => {
    const email = 'result@test.com';

    const dom = render(<Consumer />);

    routes.auth.mock.resolveNextUser({ email: email });
    act(() => userEvent.click(dom.queryByTestId('loggedIn')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'true')
      ).toBeInTheDocument()
    );
    expect(queryByText(dom.getByTestId('user'), email)).toBeInTheDocument();
    await wait(() =>
      expect(screen.queryByText(message('loggedInSuccess'))).toBeInTheDocument()
    );
  });

  it('Can fail to log out', async () => {
    const email = 'test@test.com';
    const dom = render(<Consumer />);

    routes.auth.mock.resolveNextUser({ email: email });
    act(() => userEvent.click(dom.queryByTestId('login')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'true')
      ).toBeInTheDocument()
    );

    routes.auth.mock.rejectNext('crash');

    act(() => userEvent.click(dom.queryByTestId('logout')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'true')
      ).toBeInTheDocument()
    );
    expect(queryByText(dom.getByTestId('user'), email)).toBeInTheDocument();
    await wait(() =>
      expect(screen.queryByText(message('logoutError'))).toBeInTheDocument()
    );
  });

  it('Can succeed to log out', async () => {
    const email = 'test@test.com';
    const dom = render(<Consumer />);

    routes.auth.mock.resolveNextUser({ email: email });
    act(() => userEvent.click(dom.queryByTestId('login')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'true')
      ).toBeInTheDocument()
    );

    routes.auth.mock.resolveNext();
    act(() => userEvent.click(dom.queryByTestId('logout')));

    await wait(() =>
      expect(
        getByText(dom.getByTestId('authenticated'), 'false')
      ).toBeInTheDocument()
    );
    expect(getByText(dom.getByTestId('user'), 'nouser')).toBeInTheDocument();
    await wait(() =>
      expect(screen.queryByText(message('logoutSuccess'))).toBeInTheDocument()
    );
  });

  it('Can crash on log in', async () => {
    const dom = render(<Consumer />);

    routes.auth.mock.rejectNext('crash');
    act(() => userEvent.click(dom.queryByTestId('login')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'false')
      ).toBeInTheDocument()
    );
    expect(getByText(dom.getByTestId('user'), 'nouser')).toBeInTheDocument();
    await wait(() =>
      expect(screen.queryByText(message('loginError'))).toBeInTheDocument()
    );
  });

  it('Can fail to to log in', async () => {
    const dom = render(<Consumer />);

    routes.auth.mock.rejectNext('login-failed');
    act(() => userEvent.click(dom.queryByTestId('login')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'false')
      ).toBeInTheDocument()
    );
    expect(getByText(dom.getByTestId('user'), 'nouser')).toBeInTheDocument();
    await wait(() =>
      expect(screen.queryByText(message('loginFail'))).toBeInTheDocument()
    );
  });

  it('Can succeed to log in', async () => {
    const email = 'test@test.com';
    const dom = render(<Consumer />);

    routes.auth.mock.resolveNextUser({ email: email });
    act(() => userEvent.click(dom.queryByTestId('login')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'true')
      ).toBeInTheDocument()
    );
    expect(getByText(dom.getByTestId('user'), email)).toBeInTheDocument();
    await wait(() =>
      expect(screen.queryByText(message('loginSuccess'))).toBeInTheDocument()
    );
  });

  it('Can crash on register', async () => {
    const dom = render(<Consumer />);

    routes.auth.mock.rejectNext('crash');
    act(() => userEvent.click(dom.queryByTestId('register')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'false')
      ).toBeInTheDocument()
    );
    expect(getByText(dom.getByTestId('user'), 'nouser')).toBeInTheDocument();
    await wait(() =>
      expect(screen.queryByText(message('registerError'))).toBeInTheDocument()
    );
  });

  it('Can fail to to log in', async () => {
    const dom = render(<Consumer />);

    routes.auth.mock.rejectNext('email-taken');
    act(() => userEvent.click(dom.queryByTestId('register')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'false')
      ).toBeInTheDocument()
    );
    expect(getByText(dom.getByTestId('user'), 'nouser')).toBeInTheDocument();
    await wait(() =>
      expect(screen.queryByText(message('registerFail'))).toBeInTheDocument()
    );
  });

  it('Can succeed to log in', async () => {
    const email = 'test@test.com';
    const dom = render(<Consumer />);

    routes.auth.mock.resolveNextUser({ email: email });
    act(() => userEvent.click(dom.queryByTestId('register')));

    await wait(() =>
      expect(
        queryByText(dom.getByTestId('authenticated'), 'true')
      ).toBeInTheDocument()
    );
    expect(getByText(dom.getByTestId('user'), email)).toBeInTheDocument();
    await wait(() =>
      expect(screen.queryByText(message('registerSuccess'))).toBeInTheDocument()
    );
  });
});

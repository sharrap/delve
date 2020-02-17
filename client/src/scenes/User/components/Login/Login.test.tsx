import React from 'react';

import { Login } from './Login';

import {
  act,
  messagePrefix,
  queryByText,
  render,
  screen,
  userEvent,
  wait,
} from 'src/test-utils';

const message = messagePrefix('scenes.User.Login');

describe('<Login/>', () => {
  it('Should render without crashing', () => {
    const dom = render(<Login />);

    expect(dom.getByTestId('login-container')).toBeInTheDocument();
  });

  it('Should render a redirect if authenticated', () => {
    const dom = render(<Login authenticated={true} />);

    global.window = { location: { pathname: null } };
    expect(dom.queryByTestId('login-container')).not.toBeInTheDocument();
    expect(global.window.location.pathname).toEqual('/');
  });

  it('Should render all form fields', () => {
    const dom = render(<Login />);

    expect(dom.queryByTestId('email-field-input')).toBeInTheDocument();
    expect(dom.queryByTestId('password-field-input')).toBeInTheDocument();
    expect(dom.queryByTestId('loading-button')).toBeInTheDocument();
    expect(dom.queryByTestId('remember-me-checkbox')).toBeInTheDocument();
    expect(dom.queryByText(message('rememberMeCheckbox'))).toBeInTheDocument();
    expect(
      queryByText(dom.getByTestId('loading-button'), message('loginButton'))
    ).toBeInTheDocument();
  });

  it('Should render the heading', () => {
    const dom = render(<Login />);
    expect(dom.queryByTestId('login-lock-icon')).toBeInTheDocument();
    expect(dom.queryByTestId('login-title')).toBeInTheDocument();

    expect(
      queryByText(dom.getByTestId('login-title'), message('title'))
    ).toBeInTheDocument();
  });

  it('Should render and redirect with the redirect link', async () => {
    const dom = render(<Login />);
    expect(dom.queryByTestId('login-register-link')).toBeInTheDocument();
    expect(dom.queryByText(message('registerLink'))).toBeInTheDocument();

    global.window = { location: { pathname: null } };
    act(() => userEvent.click(dom.queryByTestId('login-register-link')));
    wait(() => expect(global.window.location.pathname).toEqual('/register'));
  });

  it('Should submit accurate form values with rememberMe', async () => {
    const email = 't@test.com',
      password = 'a1c7a2z7123',
      rememberMe = true;
    const login = jest.fn(
      ({ email }) => new Promise(resolve => resolve({ email: email }))
    );
    const dom = render(<Login login={login} />);

    await act(() =>
      userEvent.type(dom.queryByTestId('email-field-input'), email)
    );
    await act(() =>
      userEvent.type(dom.queryByTestId('password-field-input'), password)
    );
    act(() => userEvent.click(dom.queryByTestId('remember-me-checkbox')));
    act(() => userEvent.click(dom.queryByTestId('loading-button')));

    expect(login).toBeCalledWith({
      email: email,
      password: password,
      rememberMe: rememberMe,
    });
  });

  it('Should submit accurate form values without rememberMe', async () => {
    const email = 't@test.com',
      password = 'a1c7a2z7123',
      rememberMe = false;
    const login = jest.fn(
      ({ email }) => new Promise(resolve => resolve({ email: email }))
    );
    const dom = render(<Login login={login} />);

    await act(() =>
      userEvent.type(dom.queryByTestId('email-field-input'), email)
    );
    await act(() =>
      userEvent.type(dom.queryByTestId('password-field-input'), password)
    );
    act(() => userEvent.click(dom.queryByTestId('loading-button')));

    expect(login).toBeCalledWith({
      email: email,
      password: password,
      rememberMe: rememberMe,
    });
  });

  it('Should display a warning when the password is empty', async () => {
    const dom = render(<Login />);

    expect(
      screen.queryByText(message('emptyPasswordTooltip'))
    ).not.toBeInTheDocument();

    const passwordField = dom.queryByTestId('password-field-input');
    act(() => passwordField.focus());

    expect(
      screen.queryByText(message('emptyPasswordTooltip'))
    ).not.toBeInTheDocument();

    act(() => passwordField.blur());

    await wait(() =>
      expect(
        screen.queryByText(message('emptyPasswordTooltip'))
      ).toBeInTheDocument()
    );

    act(() => passwordField.focus());

    await wait(() =>
      expect(
        screen.queryByText(message('emptyPasswordTooltip'))
      ).not.toBeInTheDocument()
    );
  });

  it('Should not display an alert by default', () => {
    const dom = render(<Login />);
    expect(dom.queryByTestId('login-alert')).not.toBeInTheDocument();
  });

  it('Should display an alert when login fails', async () => {
    const email = 't@test.com',
      password = 'a1c7a2z7123';
    const login = jest.fn(
      () => new Promise((_, reject) => reject(new Error('login-failed')))
    );
    const dom = render(<Login login={login} />);
    expect(dom.queryByTestId('login-alert')).not.toBeInTheDocument();

    await act(() =>
      userEvent.type(dom.queryByTestId('email-field-input'), email)
    );
    await act(() =>
      userEvent.type(dom.queryByTestId('password-field-input'), password)
    );

    act(() => userEvent.click(dom.queryByTestId('loading-button')));

    await wait(() =>
      expect(dom.queryByTestId('login-alert')).toBeInTheDocument()
    );
    expect(dom.queryByText(message('loginRejectedAlert'))).toBeInTheDocument();
  });

  it('Should display an alert when login fails', async () => {
    const email = 't@test.com',
      password = 'a1c7a2z7123';
    const login = jest.fn(
      () => new Promise((_, reject) => reject(new Error('crash')))
    );
    const dom = render(<Login login={login} />);
    expect(dom.queryByTestId('login-alert')).not.toBeInTheDocument();

    await act(() =>
      userEvent.type(dom.queryByTestId('email-field-input'), email)
    );
    await act(() =>
      userEvent.type(dom.queryByTestId('password-field-input'), password)
    );

    act(() => userEvent.click(dom.queryByTestId('loading-button')));

    await wait(() =>
      expect(dom.queryByTestId('login-alert')).toBeInTheDocument()
    );
    expect(dom.queryByText(message('loginFailedAlert'))).toBeInTheDocument();
  });

  it('Should disable login button when email is bad', async () => {
    const dom = render(<Login />);
    expect(dom.queryByTestId('login-alert')).not.toBeInTheDocument();

    expect(dom.queryByTestId('loading-button')).toHaveProperty(
      'disabled',
      true
    );

    await act(() =>
      userEvent.type(dom.queryByTestId('email-field-input'), 'not-an-email')
    );

    expect(dom.queryByTestId('loading-button')).toHaveProperty(
      'disabled',
      true
    );
  });

  it('Should disable login button when password is bad', async () => {
    const dom = render(<Login />);
    expect(dom.queryByTestId('login-alert')).not.toBeInTheDocument();

    expect(dom.queryByTestId('loading-button')).toHaveProperty(
      'disabled',
      true
    );

    await act(() =>
      userEvent.type(dom.queryByTestId('password-field-input'), '')
    );

    expect(dom.queryByTestId('loading-button')).toHaveProperty(
      'disabled',
      true
    );
  });
});

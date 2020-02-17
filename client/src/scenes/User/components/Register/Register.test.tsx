import React from 'react';

import { Register } from './Register';

import {
  act,
  initializeURL,
  messagePrefix,
  queryByText,
  render,
  screen,
  userEvent,
  URL,
  wait,
} from 'src/test-utils';

const message = messagePrefix('scenes.User.Register');

describe('<Register/>', () => {
  it('Should render without crashing', () => {
    const dom = render(<Register />);

    expect(dom.getByTestId('register-container')).toBeInTheDocument();
  });

  it('Should render a redirect if authenticated', () => {
    initializeURL();
    const dom = render(<Register authenticated={true} />);

    expect(dom.queryByTestId('register-container')).not.toBeInTheDocument();
    expect(URL()).toEqual('/');
  });

  it('Should render all form fields', () => {
    const dom = render(<Register />);

    expect(dom.queryByTestId('email-field-input')).toBeInTheDocument();
    expect(dom.queryByTestId('password-field-input')).toBeInTheDocument();
    expect(dom.queryByTestId('loading-button')).toBeInTheDocument();

    expect(
      queryByText(dom.getByTestId('loading-button'), message('registerButton'))
    ).toBeInTheDocument();
  });

  it('Should render password strength information', () => {
    const dom = render(<Register />);

    expect(
      dom.queryByTestId('register-password-strength-label')
    ).toBeInTheDocument();
    expect(dom.queryByTestId('register-password-strength')).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-bar')
    ).toBeInTheDocument();

    expect(
      dom.queryByTestId('register-password-strength-info')
    ).not.toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-warning')
    ).not.toBeInTheDocument();

    expect(dom.getByText(message('passwordStrength'))).toBeInTheDocument();
    expect(dom.getByText(message('passwordUnknown'))).toBeInTheDocument();
  });

  it('Should render appropriate password strength info', async () => {
    const dom = render(<Register />);

    const passwordField = dom.getByTestId('password-field-input');

    expect(dom.queryByText(message('passwordUnknown'))).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-info')
    ).not.toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-warning')
    ).not.toBeInTheDocument();

    await act(() => userEvent.type(passwordField, ''));
    expect(dom.queryByText(message('passwordUnknown'))).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-info')
    ).not.toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-warning')
    ).not.toBeInTheDocument();

    await act(() => userEvent.type(passwordField, 'a'));
    expect(dom.queryByText(message('passwordTooWeak'))).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-info')
    ).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-warning')
    ).not.toBeInTheDocument();

    await act(() => userEvent.type(passwordField, 'testi'));
    expect(dom.queryByText(message('passwordWeak'))).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-info')
    ).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-warning')
    ).toBeInTheDocument();

    await act(() => userEvent.type(passwordField, 'ab12cd3'));
    expect(dom.queryByText(message('passwordDecent'))).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-info')
    ).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-warning')
    ).not.toBeInTheDocument();

    await act(() => userEvent.type(passwordField, 'hello world'));
    expect(dom.queryByText(message('passwordStrong'))).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-info')
    ).not.toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-warning')
    ).not.toBeInTheDocument();

    await act(() => userEvent.type(passwordField, 'hello world 1'));
    expect(dom.queryByText(message('passwordExcellent'))).toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-info')
    ).not.toBeInTheDocument();
    expect(
      dom.queryByTestId('register-password-strength-warning')
    ).not.toBeInTheDocument();
  });

  it('Should render the heading', () => {
    const dom = render(<Register />);

    expect(dom.queryByTestId('register-lock-icon')).toBeInTheDocument();
    expect(dom.queryByTestId('register-title')).toBeInTheDocument();

    expect(
      queryByText(dom.queryByTestId('register-title'), message('title'))
    ).toBeInTheDocument();
  });

  it('Should render and redirect with the redirect link', async () => {
    const dom = render(<Register />);
    expect(dom.queryByTestId('register-login-link')).toBeInTheDocument();
    expect(dom.queryByText(message('loginLink'))).toBeInTheDocument();

    initializeURL();
    act(() => userEvent.click(dom.queryByTestId('register-login-link')));
    await wait(() => expect(URL()).toEqual('/login'));
  });

  it('Should submit accurate form values', async () => {
    const email = 't@test.com',
      password = 'a1c7a2z7123';
    const register = jest.fn(
      ({ email }) => new Promise(resolve => resolve({ email: email }))
    );
    const dom = render(<Register register={register} />);

    await act(() =>
      userEvent.type(dom.queryByTestId('email-field-input'), email)
    );
    await act(() =>
      userEvent.type(dom.queryByTestId('password-field-input'), password)
    );
    act(() => userEvent.click(dom.queryByTestId('loading-button')));

    expect(register).toBeCalledWith({
      email: email,
      password: password,
    });
  });

  it('Should display a warning when the password is too weak', async () => {
    const dom = render(<Register />);

    expect(
      screen.queryByText(message('passwordTooWeakTooltip'))
    ).not.toBeInTheDocument();

    const passwordField = dom.queryByTestId('password-field-input');
    act(() => passwordField.focus());

    expect(
      screen.queryByText(message('passwordTooWeakTooltip'))
    ).not.toBeInTheDocument();

    act(() => passwordField.blur());

    await wait(() =>
      expect(
        screen.queryByText(message('passwordTooWeakTooltip'))
      ).toBeInTheDocument()
    );

    act(() => passwordField.focus());

    await wait(() =>
      expect(
        screen.queryByText(message('passwordTooWeakTooltip'))
      ).not.toBeInTheDocument()
    );
  });

  it('Should not display an alert by default', () => {
    const dom = render(<Register />);
    expect(dom.queryByTestId('register-alert')).not.toBeInTheDocument();
  });

  it('Should display a tooltip when email is taken', async () => {
    const email = 't@test.com',
      password = 'a1c7a2z7123';
    const register = jest.fn(
      () => new Promise((_, reject) => reject(new Error('email-taken')))
    );
    const dom = render(<Register register={register} />);
    expect(
      screen.queryByText(message('emailTakenTooltip'))
    ).not.toBeInTheDocument();

    await act(() =>
      userEvent.type(dom.queryByTestId('email-field-input'), email)
    );
    await act(() =>
      userEvent.type(dom.queryByTestId('password-field-input'), password)
    );

    act(() => userEvent.click(dom.queryByTestId('loading-button')));

    await wait(() =>
      expect(
        screen.queryByText(message('emailTakenTooltip'))
      ).toBeInTheDocument()
    );
  });

  it('Should display an alert when register crashes', async () => {
    const email = 't@test.com',
      password = 'a1c7a2z7123';
    const register = jest.fn(
      () => new Promise((_, reject) => reject(new Error('error')))
    );
    const dom = render(<Register register={register} />);
    expect(dom.queryByTestId('register-alert')).not.toBeInTheDocument();

    await act(() =>
      userEvent.type(dom.queryByTestId('email-field-input'), email)
    );
    await act(() =>
      userEvent.type(dom.queryByTestId('password-field-input'), password)
    );

    act(() => userEvent.click(dom.queryByTestId('loading-button')));

    await wait(() =>
      expect(dom.queryByTestId('register-alert')).toBeInTheDocument()
    );
    expect(dom.queryByText(message('registerFailedAlert'))).toBeInTheDocument();
  });

  it('Should disable register button when email is bad', async () => {
    const dom = render(<Register />);

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

  it('Should disable register button when password is bad', async () => {
    const dom = render(<Register />);

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

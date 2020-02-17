import React from 'react';
// Unconnected component
import { AccountAvatar, PresentationAccountAvatar } from './AccountAvatar';

import { act, render, wait } from 'src/test-utils';
import userEvent from '@testing-library/user-event';

describe('<AccountAvatar/>', () => {
  it('Renders without crashing', () => {
    const dom = render(<AccountAvatar authenticated={false} />);

    expect(dom.getByTestId('account-avatar-button')).toBeInTheDocument();
  });

  it('Opens a menu when clicked', async () => {
    const dom = render(<AccountAvatar authenticated={false} />);

    const accountButton = dom.getByTestId('account-avatar-button');

    act(() => userEvent.click(accountButton));

    await wait(() =>
      expect(dom.getByTestId('account-menu')).toBeInTheDocument()
    );
  });

  it('Closes the menu when clicked away', async () => {
    const dom = render(<AccountAvatar authenticated={false} />);

    const accountButton = dom.getByTestId('account-avatar-button');

    act(() => userEvent.click(accountButton));

    await wait(() => expect(dom.getByTestId('account-menu')).toBeVisible());

    act(() => userEvent.click(accountButton));

    await wait(() => expect(dom.getByTestId('account-menu')).not.toBeVisible());
  });
});

describe('<PresentationAccountAvatar/>', () => {
  it('Renders without crashing', () => {
    const dom = render(<PresentationAccountAvatar authenticated={false} />);

    expect(dom.getByTestId('account-avatar-button')).toBeInTheDocument();
    expect(dom.getByTestId('account-menu')).toBeInTheDocument();
  });

  it('Displays a generic icon when not logged in', () => {
    const dom = render(<PresentationAccountAvatar authenticated={false} />);

    expect(
      dom.getByTestId('account-avatar-logged-out-icon')
    ).toBeInTheDocument();

    dom.rerender(
      <PresentationAccountAvatar
        authenticated={false}
        user={{ email: 'Test' }}
      />
    );

    expect(
      dom.getByTestId('account-avatar-logged-out-icon')
    ).toBeInTheDocument();
  });

  it('Displays a ? when logged in without a user', () => {
    const dom = render(<PresentationAccountAvatar authenticated={true} />);

    expect(dom.getByTestId('account-avatar')).toBeInTheDocument();

    expect(dom.getByText('?')).toBeInTheDocument();
  });

  it('Displays an initial when logged in with a user', () => {
    const dom = render(
      <PresentationAccountAvatar
        authenticated={true}
        user={{ email: 'Test' }}
      />
    );

    expect(dom.getByTestId('account-avatar')).toBeInTheDocument();

    expect(dom.getByText('T')).toBeInTheDocument();

    dom.rerender(
      <PresentationAccountAvatar
        authenticated={true}
        user={{ email: 'Jest' }}
      />
    );

    expect(dom.getByText('J')).toBeInTheDocument();
  });

  it('Displays a menu when menuOpen is true', async () => {
    const dom = render(<PresentationAccountAvatar authenticated={false} />);

    // Rerender to force ref to update
    dom.rerender(
      <PresentationAccountAvatar authenticated={false} menuOpen={true} />
    );

    expect(dom.getByTestId('account-menu')).toBeVisible();
  });

  it('Determines menu contents based on menuAuthenticated', () => {
    const dom = render(
      <PresentationAccountAvatar
        authenticated={false}
        menuAuthenticated={false}
      />
    );

    // Rerender to force ref to update
    dom.rerender(
      <PresentationAccountAvatar
        authenticated={false}
        menuOpen={true}
        menuAuthenticated={false}
      />
    );

    expect(dom.getByTestId('login-menu-item')).toBeInTheDocument();

    dom.rerender(
      <PresentationAccountAvatar
        authenticated={false}
        menuOpen={true}
        menuAuthenticated={true}
      />
    );

    expect(dom.getByTestId('logout-menu-item')).toBeInTheDocument();
  });
});

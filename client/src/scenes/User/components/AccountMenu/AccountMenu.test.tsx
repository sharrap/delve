import React from 'react';

// Non-connected component
import { AccountMenu, AccountMenuProps } from './AccountMenu';

import { act, messagePrefix, render, userEvent } from 'src/test-utils';

const message = messagePrefix('scenes.User.AccountMenu');

// Menus always need an anchorEl and open state, so this provides a default one
// for every test and automatically rerenders to prevent MaterialUI complaining
// when the menu first renders and useRef is null.
const MountedMenu: React.FunctionComponent<AccountMenuProps> = (
  props: AccountMenuProps
) => {
  const ref = React.useRef(null);
  return (
    <div ref={ref}>
      <AccountMenu
        anchorEl={ref.current}
        open={Boolean(ref.current)}
        {...props}
      />
    </div>
  );
};

function renderProps(props: AccountMenuProps) {
  const dom = render(<MountedMenu {...props} />);

  dom.rerender(<MountedMenu {...props} />);

  return dom;
}

function rerenderProps(dom, props: AccountMenuProps) {
  dom.rerender(<MountedMenu {...props} />);
}

describe('<AccountMenu/>', () => {
  it('Renders without crashing', () => {
    const dom = renderProps({});

    expect(dom.getByTestId('account-menu')).toBeInTheDocument();
  });

  it('Only shows unauthenticated options when unauthenticated', () => {
    const dom = renderProps({ authenticated: false });

    expect(dom.queryByTestId('login-menu-item')).toBeInTheDocument();
    expect(dom.queryByTestId('register-menu-item')).toBeInTheDocument();
    expect(dom.queryByTestId('logout-menu-item')).not.toBeInTheDocument();

    expect(dom.queryByText(message('loginMenuItem'))).toBeInTheDocument();
    expect(dom.queryByText(message('registerMenuItem'))).toBeInTheDocument();
    expect(dom.queryByText(message('logoutMenuItem'))).not.toBeInTheDocument();
  });

  it('Only shows authenticated options when authenticated', () => {
    const dom = renderProps({ authenticated: true });

    expect(dom.queryByTestId('login-menu-item')).not.toBeInTheDocument();
    expect(dom.queryByTestId('register-menu-item')).not.toBeInTheDocument();
    expect(dom.queryByTestId('logout-menu-item')).toBeInTheDocument();

    expect(dom.queryByText(message('loginMenuItem'))).not.toBeInTheDocument();
    expect(
      dom.queryByText(message('registerMenuItem'))
    ).not.toBeInTheDocument();
    expect(dom.queryByText(message('logoutMenuItem'))).toBeInTheDocument();
  });

  it('Calls logout when logout clicked', () => {
    const logout = jest.fn();
    const dom = renderProps({ authenticated: true, logout: logout });

    act(() => userEvent.click(dom.getByTestId('logout-menu-item')));

    expect(logout).toHaveBeenCalled();
  });

  it('Calls onItemClick when items clicked', () => {
    const onItemClick = jest.fn();
    const dom = renderProps({ authenticated: true, onItemClick: onItemClick });

    act(() => userEvent.click(dom.getByTestId('logout-menu-item')));
    expect(onItemClick).toBeCalled();

    rerenderProps(dom, { authenticated: false, onItemClick: onItemClick });

    act(() => userEvent.click(dom.getByTestId('login-menu-item')));
    expect(onItemClick).toBeCalledTimes(2);

    act(() => userEvent.click(dom.getByTestId('register-menu-item')));
    expect(onItemClick).toBeCalledTimes(3);
  });
});

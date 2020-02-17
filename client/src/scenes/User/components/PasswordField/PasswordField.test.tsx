import React from 'react';
import PasswordField from './PasswordField';
import {
  act,
  fireEvent,
  messagePrefix,
  render,
  screen,
  wait,
  waitForElement,
} from 'src/test-utils';
import userEvent from '@testing-library/user-event';

const message = messagePrefix('scenes.User.PasswordField');

describe('<PasswordField/>', () => {
  it('Renders without crashing', () => {
    const dom = render(<PasswordField />);
    expect(dom.getByText(message('label'))).toBeInTheDocument();
  });

  it('Can focus and blur', async () => {
    const focus = jest.fn(),
      blur = jest.fn();
    const dom = render(<PasswordField onFocus={focus} onBlur={blur} />);

    const passwordFieldInput = dom.getByTestId('password-field-input');

    act(() => passwordFieldInput.focus());

    expect(passwordFieldInput).toHaveFocus();
    await wait(() => expect(focus).toHaveBeenCalled());

    act(() => passwordFieldInput.blur());

    expect(passwordFieldInput).not.toHaveFocus();
    await wait(() => expect(blur).toHaveBeenCalled());
  });

  it('Renders a caps lock tooltip only when focused', async () => {
    const dom = render(<PasswordField />);

    const passwordFieldInput = dom.getByTestId('password-field-input');

    function capsLockTooltip(): React.Node {
      return screen.queryByTestId('password-field-error-tooltip');
    }

    expect(capsLockTooltip()).toBeNull();

    act(() => {
      fireEvent.keyPress(window, { charCode: 65, shiftKey: false });
    });

    expect(capsLockTooltip()).toBeNull();

    act(() => passwordFieldInput.focus());

    expect(passwordFieldInput).toHaveFocus();
    await waitForElement(capsLockTooltip, { timeout: 1000 });

    expect(screen.queryByText(message('capsLockTooltip'))).toBeInTheDocument();

    act(() => passwordFieldInput.blur());

    await wait(() => expect(capsLockTooltip()).toBeNull(), { timeout: 1000 });

    act(() => passwordFieldInput.focus());

    await waitForElement(capsLockTooltip, { timeout: 1000 });

    act(() => {
      fireEvent.keyPress(window, { charCode: 65, shiftKey: true });
    });

    await wait(() => expect(capsLockTooltip()).toBeNull(), { timeout: 1000 });
  });
  it('Renders error tooltip when focused', async () => {
    const errorTooltip = 'Delve'; // Arbitrary message
    const dom = render(
      <PasswordField error={false} errorTooltip={errorTooltip} />
    );

    function tooltip(): React.Node {
      return screen.queryByTestId('password-field-error-tooltip');
    }

    expect(tooltip()).toBeNull();

    dom.rerender(<PasswordField error={true} errorTooltip={errorTooltip} />);

    await waitForElement(tooltip, { timeout: 1000 });
    expect(screen.queryByText(errorTooltip)).toBeInTheDocument();
  });
  it('Only is a password field if the button is not clicked', async () => {
    const dom = render(<PasswordField />);

    const passwordFieldInput = dom.getByTestId('password-field-input');
    const passwordFieldVisibilityButton = dom.getByTestId(
      'password-field-visibility-button'
    );

    function visibility(vis: 'on' | 'off'): React.Node {
      return dom.queryByTestId('password-field-visibility-' + vis);
    }

    expect(passwordFieldInput).toHaveProperty('type', 'password');
    expect(visibility('on')).toBeNull();
    expect(visibility('off')).toBeDefined();

    act(() => userEvent.click(passwordFieldVisibilityButton));

    expect(passwordFieldInput).toHaveProperty('type', 'text');
    expect(visibility('off')).toBeNull();
    expect(visibility('on')).toBeDefined();

    act(() => userEvent.click(passwordFieldVisibilityButton));

    expect(passwordFieldInput).toHaveProperty('type', 'password');
    expect(visibility('on')).toBeNull();
    expect(visibility('off')).toBeDefined();
  });
});

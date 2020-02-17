import React from 'react';
import EmailField from './EmailField';

import {
  act,
  messagePrefix,
  render,
  screen,
  wait,
  waitForElement,
} from 'src/test-utils';
import userEvent from '@testing-library/user-event';

const message = messagePrefix('scenes.User.EmailField');

describe('<EmailField/>', () => {
  it('Renders without crashing', () => {
    const dom = render(<EmailField />);
    expect(dom.getByText(message('label'))).toBeInTheDocument();
  });

  it('Can focus and blur', async () => {
    const focus = jest.fn(),
      blur = jest.fn();
    const dom = render(<EmailField onFocus={focus} onBlur={blur} />);

    const emailFieldInput = dom.getByTestId('email-field-input');

    act(() => emailFieldInput.focus());
    expect(emailFieldInput).toHaveFocus();
    await wait(() => expect(focus).toHaveBeenCalled());

    act(() => emailFieldInput.blur());
    expect(emailFieldInput).not.toHaveFocus();
    await wait(() => expect(blur).toHaveBeenCalled());
  });

  it('Renders a tooltip on error', async () => {
    const errorTooltip = 'Tippy';
    const dom = render(
      <EmailField error={false} errorTooltip={errorTooltip} />
    );

    expect(screen.queryByText(errorTooltip)).toBeNull();

    act(() =>
      dom.rerender(<EmailField error={true} errorTooltip={errorTooltip} />)
    );

    await wait(() =>
      expect(screen.queryByText(errorTooltip)).toBeInTheDocument()
    );
  });

  it('Renders a tooltip on bad email and blur', async () => {
    const errorTooltip = message('invalidTooltip');
    const dom = render(<EmailField />);

    const emailFieldInput = dom.getByTestId('email-field-input');

    function tooltip(): React.ReactNode {
      return screen.queryByTestId('email-field-error-tooltip');
    }

    act(() => emailFieldInput.focus());
    expect(tooltip()).toBeNull();

    await act(() => userEvent.type(emailFieldInput, 'helloworld'));

    expect(tooltip()).toBeNull();

    act(() => emailFieldInput.blur());
    await waitForElement(tooltip);
    expect(screen.queryByText(errorTooltip)).toBeInTheDocument();

    act(() => emailFieldInput.focus());
    await wait(() => expect(screen.queryByText(errorTooltip)).toBeNull());
    await act(() => userEvent.type(emailFieldInput, 'helloworld@gmail.com'));
    await wait(() => expect(tooltip()).toBeNull());

    act(() => emailFieldInput.blur());
    await wait(() => expect(tooltip()).toBeNull());
  });
});

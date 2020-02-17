import React from 'react';
import LoadingButton from './LoadingButton';

import { render } from 'src/test-utils';

describe('<LoadingButton/>', () => {
  it('Renders without crashing', () => {
    const dom = render(<LoadingButton />);

    expect(dom.getByTestId('loading-button')).toBeInTheDocument();
  });

  it('Renders its children', () => {
    const dom = render(
      <LoadingButton>
        <span data-testid="test-span">Test Text</span>
      </LoadingButton>
    );

    expect(dom.getByTestId('test-span')).toBeInTheDocument();
    expect(dom.getByText('Test Text')).toBeInTheDocument();
  });

  it('Does not render a spinner when not loading', () => {
    const dom = render(<LoadingButton />);

    expect(dom.queryByTestId('loading-button-spinner')).not.toBeInTheDocument();
  });

  it('Renders a spinner when loading', () => {
    const dom = render(<LoadingButton loading={true} />);

    expect(dom.getByTestId('loading-button-spinner')).toBeInTheDocument();
  });

  it('Renders children while loading', () => {
    const dom = render(
      <LoadingButton loading={true}>
        <span data-testid="test-span" />
      </LoadingButton>
    );

    expect(dom.getByTestId('test-span')).toBeInTheDocument();
  });
});

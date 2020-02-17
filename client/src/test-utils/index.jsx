import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import messages from 'src/locale';
import { light } from 'src/theme';
import { store as reduxStore } from 'src/redux';

import AppProviders from '../AppProviders';

function AllProviders({ children }) {
  return <AppProviders mock>{children}</AppProviders>;
}

const renderWithProviders = (component, options) =>
  render(component, { wrapper: AllProviders, ...options });

// Fix MUI crash on tooltip
global.document.createRange = () => ({
  setStart: () => undefined,
  setEnd: () => undefined,
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

export * from '@testing-library/react';
export { renderWithProviders as render };
export function message(str) {
  return messages['en'][str];
}
export function messagePrefix(prefix) {
  return str => message(prefix + '.' + str);
}

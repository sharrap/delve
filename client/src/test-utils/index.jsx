import React from 'react';
import { render } from '@testing-library/react';

import messages from 'src/locale';

import { prettyDOM } from '@testing-library/dom';

import AppProviders from '../AppProviders';

import userEvent from '@testing-library/user-event';

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
export { renderWithProviders as render, userEvent };
export function message(str) {
  return messages['en'][str];
}
export function messagePrefix(prefix) {
  return str => message(prefix + '.' + str);
}

export function printDOM() {
  console.log(prettyDOM(document.body));
}

// For testing React-Router redirects etc
export function initializeURL() {
  global.window = { location: { pathname: null } };
}

export function URL() {
  return global.window.location.pathname;
}

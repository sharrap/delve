import React from 'react';

import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { AuthenticationProvider } from 'src/components/AuthenticationProvider';

import { store as reduxStore } from './redux';
import messages from './locale';
import { light } from 'src/theme';

interface RouterProps {
  mock: boolean;
  children?: React.ReactNode;
}

interface AppProviderProps {
  locale?: string;
  maxNotifications?: number;
  mock?: boolean;
  children: React.ReactNode;
}

const AppProviders: React.FunctionComponent<AppProviderProps> = ({
  locale = 'en',
  maxNotifications = 1,
  mock = false,
  children = null,
}: AppProviderProps) => {
  const safeLocale = messages[locale] ? locale : 'en';

  return (
    <IntlProvider locale={safeLocale} messages={messages[safeLocale]}>
      <ThemeProvider theme={light}>
        <ReduxProvider store={reduxStore}>
          <SnackbarProvider maxSnack={maxNotifications}>
            <AuthenticationProvider mock={mock}>
              <BrowserRouter>{children}</BrowserRouter>
            </AuthenticationProvider>
          </SnackbarProvider>
        </ReduxProvider>
      </ThemeProvider>
    </IntlProvider>
  );
};

export default AppProviders;

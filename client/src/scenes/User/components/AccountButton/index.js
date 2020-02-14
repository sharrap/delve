import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import axios from 'axios';

import { actions } from '../../../../_redux';

import { IconButton } from '@material-ui/core';

import { AccountCircle as AccountIcon } from '@material-ui/icons';

function AccountButton({ authenticated, user, setAuthenticated }) {
  function checkAuthenticated() {
    axios
      .get('/user/logged-in', { withCredentials: true })
      .then(resp => setAuthenticated(resp.data))
      .catch(() => setAuthenticated({ authenticated: false }));
  }

  React.useEffect(checkAuthenticated, []);

  return (
    <IconButton>
      <AccountIcon />
    </IconButton>
  );
}

AccountButton.defaultProps = {
  authenticated: false,
  user: undefined,
  setAuthenticated: () => undefined,
};

AccountButton.propTypes = {
  authenticated: PropTypes.bool,
  user: PropTypes.any,
  setAuthenticated: PropTypes.func,
};

function authenticate({ authenticated, user }) {
  return dispatch =>
    authenticated
      ? dispatch({ type: actions.auth.LOG_IN, user: user })
      : dispatch({ type: actions.auth.LOG_OUT });
}

function mapStateToProps({ auth }) {
  return { authenticated: auth.authenticated, user: auth.user };
}

const actionCreators = {
  setAuthenticated: authenticate,
};

const reduxAccountButton = connect(
  mapStateToProps,
  actionCreators
)(AccountButton);

export default reduxAccountButton;

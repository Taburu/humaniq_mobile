import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';

function primaryAccount(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_PRIMARY_ACCOUNT:
      return {
        ...state,
        ...action.account,
      };
    default:
      return state;
  }
}

function saved(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_PRIMARY_ACCOUNT:
      return true;
    default:
      return state;
  }
}

function secondaryAccounts(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_SECONDARY_ACCOUNT:
      return [
        ...state,
        action.account,
      ];
    default:
      return state;
  }
}

const defaultState = {
  primaryAccount: {},
  secondaryAccounts: [],
  saved: null,
};

export function accounts(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_PRIMARY_ACCOUNT:
      return {
        ...state,
        primaryAccount: primaryAccount(state.primaryAccount, action),
        saved: saved(state.saved, action),
      };
    case ActionTypes.ADD_SECONDARY_ACCOUNT:
      return {
        ...state,
        secondaryAccounts: secondaryAccounts(state.secondaryAccounts, action),
      };
    default:
      return state;
  }
}
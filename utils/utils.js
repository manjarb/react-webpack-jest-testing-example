import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render as rtlRender } from 'react-testing-library';
import { createMemoryHistory } from 'history';
import {
  BrowserRouter as Router, Route,
} from 'react-router-dom';

import reducer from '../redux/reducers';
import { defaultState } from '../redux/store';

export function reduxRender(
  ui,
  initialState = defaultState,
) {
  const store = createStore(reducer, initialState);

  return {
    ...rtlRender(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
}

export function routerRender(
  component,
  initialState = defaultState,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {},
) {
  return reduxRender(<Router history={history}><Route path={route} exact component={component} /></Router>, initialState);
}

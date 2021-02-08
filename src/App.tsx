import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import Private from './page/private';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Private} />
      </Switch>
    </Router>
  );
}

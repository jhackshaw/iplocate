import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from "components";
import { Home } from "pages";
import { ThemeProvider } from "context";

export const App: React.FC = () => (
  <ThemeProvider>
    <Layout>
      <Router>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </Layout>
  </ThemeProvider>
);

export default App;

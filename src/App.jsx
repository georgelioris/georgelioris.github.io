import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import Article from './components/Article';
import Navigation from './components/Naviation';
import About from './pages/About';
import Blog from './pages/Blog';
import Portfolio from './pages/Portfolio';
import posts from './posts';

function App() {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route exact path="/" component={Portfolio} />
        <Route exact path="/about" component={About} />
        <Route exact path="/blog" component={Blog} />
        <Route
          path="/blog/:slug"
          render={({
            match: {
              params: { slug }
            }
          }) => {
            const id = (posts.byTitle[slug] && posts.byTitle[slug].id) || null;
            return id ? (
              <Article post={posts.byID[id]} />
            ) : (
              <Redirect to="/blog" />
            );
          }}
        />
      </Switch>
    </Router>
  );
}

export default App;

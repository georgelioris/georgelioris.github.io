import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { animated, useTransition } from 'react-spring';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PlaceHolder from './PlaceHolder';
import { ArrowBack } from './Icons';

const renderers = {
  code: ({ language, value }) => (
    <SyntaxHighlighter language={language} style={vscDarkPlus}>
      {value}
    </SyntaxHighlighter>
  )
};

const Article = ({ post: { date, url } }) => {
  const [state, setState] = useState('');
  const [error, setError] = useState(false);

  const [show, set] = useState(false);
  const transitions = useTransition(show, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1, position: 'relative' },
    leave: { opacity: 0 }
  });

  useEffect(() => {
    axios
      .get(url)
      .then((response) => response.data)
      .then((data) => {
        set(true);
        setState(data);
      })
      .catch(() => {
        set(setError(true));
      });
    if (state)
      document
        .getElementsByTagName('h2')[0]
        .insertAdjacentHTML('afterend', `<p id="date"><i>${date}</i></p>`);
    return () => {
      const el = document.getElementById('date');
      if (el) el.remove();
    };
  }, [state, date, url]);

  return (
    <div className="markdown">
      <Link to="/blog">
        <ArrowBack />
      </Link>
      {error && (
        <div className="text-center font-sans tracking-tighter text-black opacity-25 font-medium break-normal">
          <h3>woops! something went wrong</h3>
        </div>
      )}
      {!state && !error && <PlaceHolder />}
      {!error &&
        state &&
        transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div style={props} key={key}>
                <ReactMarkdown
                  renderers={renderers}
                  source={state}
                  transformImageUri={(uri) =>
                    uri.replace(/\./, process.env.REACT_APP_MARKDOWN)
                  }
                />
              </animated.div>
            )
        )}
    </div>
  );
};

export default Article;

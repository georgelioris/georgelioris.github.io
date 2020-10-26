import React, { useEffect, useState, useLayoutEffect } from 'react';
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
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        borderRadius: 'auto',
        padding: '1.3125rem',
        overflowX: 'auto',
        margin: '0 -1.3125rem 1.75rem -1.3125rem'
      }}
    >
      {value}
    </SyntaxHighlighter>
  )
};

const Article = ({ post: { date, url } }) => {
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [show, set] = useState(false);
  const transitions = useTransition(show, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1, position: 'relative' },
    leave: { opacity: 0 }
  });

  useEffect(() => {
    (async () => {
      setError(false);
      setLoading(true);
      try {
        const result = await axios(url);
        set(true);
        setState(result.data.replace(/<br\/>/gi, '\n &nbsp;  '));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  useLayoutEffect(() => {
    if (state)
      document
        .getElementsByTagName('h2')[0]
        .insertAdjacentHTML('afterend', `<p id="date"><i>${date}</i></p>`);
    return () => {
      const el = document.getElementById('date');
      if (el) el.remove();
    };
  }, [date, state]);

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
      {loading && <PlaceHolder />}
      {state &&
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

import React from 'react';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import posts from '../posts';
import Section from '../components/Section';

const Blog = () => {
  const blogPosts = [...Object.values(posts.byID)].reverse();

  return (
    <Section className="p-5">
      <div className="flex-row flex justify-start mx-auto py-5 mb-12">
        <img
          src={require('../assets/media/avatar.jpg')}
          alt="george lioris"
          className="rounded-full my-auto flex-col justify-self-center"
          style={{ width: '56px', height: '56px' }}
        />
        <p className="font-serif text-gray-700  py-4 flex-col ml-5">
          Random thoughts about programming and technology.
        </p>
      </div>
      {blogPosts.map((post) => (
        <div className="mb-16" key={post.id}>
          <div className="leading-tight row text-3xl font-black text-purple-700 mb-2">
            <Link to={`/blog/${slugify(post.title, { lower: true })}`}>
              {post.title}
            </Link>
          </div>
          <div className="row font-serif text-xs text-gray-800">
            <span>{post.date}</span>
          </div>
          <div className="row font-serif leading-relaxed text-gray-800">
            <span>{post.summary}</span>
          </div>
        </div>
      ))}
    </Section>
  );
};

export default Blog;

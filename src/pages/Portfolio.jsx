import React from 'react';
import Section from '../components/Section';
import projects from '../projects';
import Slider from '../components/Slider';
import { External } from '../components/Icons';

const CardImage = ({ id, title, desc, img, tech, url, sources }) => {
  return (
    <div className="mx-auto  mb-12 flex flex-col justify-start justify-items-center">
      <div className="card-label">
        <div className="text-gray-700 leading-snug flex-row">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={url}
            className="hover:underline text-3xl font-black"
          >
            <h3 className="text-gray-900 flex flex-row">{title}</h3>
          </a>
          <ul className="list-disc flex flex-row justify-start list-inside flex-wrap">
            {tech.map((item, idx) => (
              <li
                className="text-xs mr-3 text-gray-600 uppercase font-bold"
                key={item}
                style={idx === 0 ? { listStyle: 'none' } : {}}
              >
                {item}
              </li>
            ))}
          </ul>
          <ul className="text-purple-700 text-sm font-medium mt-2">
            {sources.map((source) => (
              <li key={source}>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row"
                >
                  {source.replace(/https:\/\//g, '')}
                  <span>
                    <External />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-600 flex-row font-medium">
            {desc}
          </p>
        </div>
      </div>
      <Slider images={img} />
    </div>
  );
};

const Portfolio = () => {
  return (
    <Section className="pb-1">
      {projects.map((project) => (
        <div className="md:mx-auto" key={project.id}>
          <CardImage {...project} />
        </div>
      ))}
    </Section>
  );
};

export default Portfolio;

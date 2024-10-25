import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <p className="text-sm sm:text-base">
          Built with{' '}
          <span className="inline-block transform hover:scale-110 transition-transform duration-200">❤️</span>{' '}
          by{' '}
          <Link 
            href="https://x.com/0x7manish"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Ox7manish
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;




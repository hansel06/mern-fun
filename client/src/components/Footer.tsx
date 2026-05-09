const Footer = () => {
  return (
    <footer className="bg-surface-elevated border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-text-secondary text-sm">
            Made with React, Express, and Tailwind by <span className="font-semibold text-text-primary">Hansel Thomas Dsouza</span>
          </p>
          <a 
            href="mailto:hanseldsouza6904@gmail.com" 
            className="text-primary-light hover:text-primary transition-colors text-sm font-medium"
          >
            hanseldsouza6904@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

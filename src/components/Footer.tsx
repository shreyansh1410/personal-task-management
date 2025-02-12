const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">TaskFlow</h3>
              <p className="text-sm">
                Streamline your workflow with our intuitive task management platform.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-sm text-center">
              © {currentYear} TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
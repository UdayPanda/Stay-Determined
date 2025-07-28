import React from "react";
// import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/Stay-determined-logo.png";

function NewFooter() {
  return (
    <footer className="bg-[#2C2627] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  className="h-5 md:h-8 lg:mr-1 lg:h-12"
                  alt="Logo"
                />
                <span className="font-dancing-script self-center text-xl lg:text-4xl sm:text-lg whitespace-nowrap">
                  Stay Determined!
                </span>
              </Link>
            </div>
            <p className="text-gray-400">
              Master your productivity with intelligent time management and
              analytics.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <div className="space-y-2 text-gray-400">
              <div>Features</div>
              <div>Analytics</div>
              <div>Pricing</div>
              <div>API</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-2 text-gray-400">
              <div>About</div>
              <div>Blog</div>
              <div>Careers</div>
              <div>Contact</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-gray-400">
              <div>Help Center</div>
              <div>Documentation</div>
              <div>Community</div>
              <div>Status</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Stay Determined! All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default NewFooter;

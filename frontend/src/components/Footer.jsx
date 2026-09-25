import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="flex items-center gap-3 mb-4">
              <div className="logo-icon">
                <Heart size={24} />
              </div>
              <span className="text-xl font-bold text-white">Connect2Life</span>
            </div>
            <p className="text-neutral-400 mb-4">
              Connecting donors with recipients through AI-powered matching. 
              One connection. A lifetime saved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-primary-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-blue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-blue transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block hover:text-primary-blue transition-colors">
                Home
              </Link>
              <Link to="/about" className="block hover:text-primary-blue transition-colors">
                About Us
              </Link>
              <Link to="/how-it-works" className="block hover:text-primary-blue transition-colors">
                How It Works
              </Link>
              <Link to="/register" className="block hover:text-primary-blue transition-colors">
                Become a Donor
              </Link>
              <Link to="/register" className="block hover:text-primary-blue transition-colors">
                Find a Match
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4>Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block hover:text-primary-blue transition-colors">
                Donation Guidelines
              </a>
              <a href="#" className="block hover:text-primary-blue transition-colors">
                Medical Information
              </a>
              <a href="#" className="block hover:text-primary-blue transition-colors">
                FAQ
              </a>
              <a href="#" className="block hover:text-primary-blue transition-colors">
                Support Center
              </a>
              <a href="#" className="block hover:text-primary-blue transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block hover:text-primary-blue transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary-blue" />
                <span>support@connect2life.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-primary-blue" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-primary-blue" />
                <span>Emergency Hotline: 911</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-white font-semibold mb-2">Emergency Contact</h5>
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-center">
                <p className="font-bold text-lg">24/7 Emergency Line</p>
                <p className="text-xl font-bold">1-800-LIFE-NOW</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2025 Connect2Life. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-primary-blue transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-blue transition-colors">
                Terms of Use
              </a>
              <a href="#" className="hover:text-primary-blue transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
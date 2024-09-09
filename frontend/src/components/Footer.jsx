import { Link } from "react-router-dom";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  const categories = [
    "Conference",
    "Workshop",
    "Seminar",
    "Bootcamp",
    "Lecture",
    "Hackathon",
    "Cultural Event",
    "Volunteer",
  ];

  return (
    <footer className="bg-teal-600 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold mb-4">Contact Us</h4>
          <p className="flex items-center space-x-2">
            <HiOutlineMail className="text-yellow-400 h-5 w-5" />
            <span>info@evently.com</span>
          </p>
          <p className="flex items-center space-x-2">
            <HiOutlinePhone className="text-yellow-400 h-5 w-5" />
            <span>+1 234 567 890</span>
          </p>
          <p className="flex items-center space-x-2">
            <HiOutlineLocationMarker className="text-yellow-400 h-5 w-5" />
            <span>123 Evently Street, City, Country</span>
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold mb-4">Categories</h4>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index}>
                <Link
                  to={`/events?category=${category}`}
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold mb-4">Follow Us</h4>
          <p>Stay connected with us on social media:</p>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              <FaFacebookF className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              <FaTwitter className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              <FaInstagram className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              <FaLinkedinIn className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-teal-500 mt-8 pt-4">
        <div className="container mx-auto text-center text-sm text-teal-200">
          &copy; 2024 Evently. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;


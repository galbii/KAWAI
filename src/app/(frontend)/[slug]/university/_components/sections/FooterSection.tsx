export default function FooterSection() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-accent"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-40 translate-x-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 animate-fade-in-up">
            <div className="text-4xl font-bold text-gradient-primary mb-4 tracking-wide">KAWAI</div>
            <p className="text-xl text-gradient-gold mb-4 font-medium">Premium Pianos Since 1927</p>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Crafting exceptional musical instruments with unwavering dedication to quality, 
              innovation, and the art of piano making for nearly a century.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: "📘", label: "Facebook" },
                { icon: "📷", label: "Instagram" },
                { icon: "🐦", label: "Twitter" },
                { icon: "📺", label: "YouTube" }
              ].map((social, index) => (
                <a key={index} href="#" 
                   className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-xl hover:bg-primary hover:scale-110 transition-all duration-300 group"
                   title={social.label}>
                  <span className="group-hover:scale-110 transition-transform duration-300">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="animate-fade-in-up animate-delay-200">
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                "Event Details",
                "Piano Collection",
                "Financing Options",
                "Service & Support",
                "Trade-In Program",
                "Warranty Info"
              ].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-gold transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:bg-gold transition-colors duration-300"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="animate-fade-in-up animate-delay-300">
            <h4 className="text-lg font-bold mb-6 text-white">Get In Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-primary mt-1">📍</div>
                <div className="text-gray-300 text-sm">
                  601 W. Plano Parkway, Suite 153<br />
                  Plano, TX 75075
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-primary">📞</div>
                <a href="tel:9726452514" className="text-gray-300 hover:text-gold transition-colors duration-300 text-sm">
                  (972) 645-2514
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-primary">✉️</div>
                <a href="mailto:info@kawaipianosdallas.com" className="text-gray-300 hover:text-gold transition-colors duration-300 text-sm">
                  info@kawaipianosdallas.com
                </a>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-gradient-primary text-white font-semibold py-2 px-6 rounded-full text-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
                Newsletter Signup
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 KAWAI Musical Instruments. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Accessibility</a>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              🏆 Winner of multiple piano industry awards • 🌍 Trusted by musicians worldwide • 🔧 Expert craftsmanship since 1927
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
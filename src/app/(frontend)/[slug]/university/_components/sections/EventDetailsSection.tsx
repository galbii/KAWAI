export default function EventDetailsSection() {
  const schedules = [
    { day: "Wednesday, Sept 18", time: "9:00 AM - 6:00 PM", highlight: false },
    { day: "Thursday, Sept 19", time: "9:00 AM - 6:00 PM", highlight: true },
    { day: "Friday, Sept 20", time: "10:00 AM - 5:00 PM", highlight: false },
    { day: "Saturday, Sept 21", time: "9:00 AM - 4:00 PM", highlight: false }
  ];

  const offers = [
    { icon: "💰", title: "Up to 40% off select models", desc: "Premium upright and grand pianos" },
    { icon: "🚚", title: "Free delivery within 50 miles", desc: "Professional setup included" },
    { icon: "🛡️", title: "Extended warranty available", desc: "Up to 10 years coverage" },
    { icon: "🔄", title: "Trade-in program", desc: "Upgrade your current instrument" }
  ];

  return (
    <section id="event" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-40 -translate-x-40"></div>
      
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6 tracking-tight">
            Event <span className="text-gradient-primary">Details</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-medium max-w-2xl mx-auto leading-relaxed">
            Join us for an exclusive four-day celebration of musical excellence
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Schedule Card */}
          <div className="card-premium rounded-3xl p-8 animate-slide-in-left">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-dark">Event Schedule</h3>
            </div>
            
            <div className="space-y-4">
              {schedules.map((schedule, index) => (
                <div key={index} className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 hover:bg-primary/5 ${
                  schedule.highlight ? 'bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary' : 'bg-gray-50'
                }`}>
                  <span className="font-semibold text-gray-dark">{schedule.day}</span>
                  <span className="text-gray-medium font-medium">{schedule.time}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-gold/10 to-gold-light/10 rounded-xl border border-gold/20">
              <p className="text-sm text-gray-dark font-medium">
                ✨ <span className="text-gradient-gold font-semibold">Peak Hours:</span> Saturday 11 AM - 3 PM for maximum selection
              </p>
            </div>
          </div>
          
          {/* Special Offers Card */}
          <div className="card-premium rounded-3xl p-8 animate-slide-in-right">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-gold to-gold-light rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-dark">Exclusive Offers</h3>
            </div>
            
            <div className="space-y-4">
              {offers.map((offer, index) => (
                <div key={index} className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 group">
                  <div className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">{offer.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-dark mb-1">{offer.title}</h4>
                    <p className="text-sm text-gray-medium">{offer.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg">
                View All Benefits
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
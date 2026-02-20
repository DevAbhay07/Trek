import { useState } from 'react';
import { Search, MapPin, Building2, Calendar, Star, Loader2, ChevronDown, ShieldCheck, Zap, CreditCard, BookOpen } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../../components/shared/Button';
import BookingModal, { type VenueDetails } from '../../components/booking/BookingModal';
import MyBookings from '../../components/booking/MyBookings';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

// Bulk import images (Vite)
const imageModules = import.meta.glob('./venue-images/*.{png,jpg,jpeg,svg}', { eager: true });

const getImagePath = (fileName: string): string => {
  const key = `./venue-images/${fileName}`;
  const module = imageModules[key] as { default: string } | undefined;
  return module ? module.default : '';
};

const UserHome = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  
  const cities = ['Mumbai', 'Delhi', 'Gurgaon', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
  const venueTypes = ['Malls', 'Hospitals', 'Business Parks', 'Public Parking'];

  const [filters, setFilters] = useState({ city: '', type: '' });

  const allVenues = [
    // ... (Keep your existing venues list here)
    { id: 7, name: 'DLF Cyber Hub', city: 'Gurgaon', location: 'DLF Phase 3', type: 'Business Parks', rating: 4.9, price: '60', image: getImagePath('dlf-cyberhub.jpg'), slots: 120 },
    { id: 19, name: 'Ambience Mall', city: 'Gurgaon', location: 'NH-48', type: 'Malls', rating: 4.8, price: '50', image: getImagePath('ambience-mall.jpg'), slots: 95 },
    { id: 20, name: 'Medanta - The Medicity', city: 'Gurgaon', location: 'Sector 38', type: 'Hospitals', rating: 4.7, price: '40', image: getImagePath('medanta.jpg'), slots: 35 },
    { id: 21, name: 'DLF Avenue', city: 'Delhi', location: 'Saket', type: 'Malls', rating: 4.7, price: '50', image: getImagePath('dlf-avenue.jpeg'), slots: 70 },
    { id: 8, name: 'Select Citywalk', city: 'Delhi', location: 'Saket', type: 'Malls', rating: 4.8, price: '50', image: getImagePath('select-citywalk.jpg'), slots: 65 },
    { id: 9, name: 'AIIMS Parking Area', city: 'Delhi', location: 'Ansari Nagar', type: 'Public Parking', rating: 4.2, price: '20', image: getImagePath('aiims-parking-area.jpg'), slots: 200 },
    { id: 22, name: 'Connaught Place Block-A', city: 'Delhi', location: 'Central Delhi', type: 'Public Parking', rating: 4.4, price: '40', image: getImagePath('connaught-place.jpg'), slots: 110 },
    { id: 15, name: 'Express Avenue Mall', city: 'Chennai', location: 'Royapettah', type: 'Malls', rating: 4.8, price: '40', image: getImagePath('express.jpg'), slots: 55 },
    { id: 16, name: 'Tidal Park', city: 'Chennai', location: 'OMR Road', type: 'Business Parks', rating: 4.7, price: '50', image: getImagePath('tidal-park.jpg'), slots: 180 },
    { id: 17, name: 'MIOT International Hospital', city: 'Chennai', location: 'Manapakkam', type: 'Hospitals', rating: 4.6, price: '30', image: getImagePath('miot.jpg'), slots: 25 },
    { id: 1, name: 'Phoenix Marketcity', city: 'Pune', location: 'Viman Nagar', type: 'Malls', rating: 4.8, price: '40', image: getImagePath('phoenix.jpg'), slots: 45 },
    { id: 2, name: 'Ruby Hall Clinic', city: 'Pune', location: 'Sassoon Road', type: 'Hospitals', rating: 4.6, price: '30', image: getImagePath('ruby.jpg'), slots: 22 },
    { id: 3, name: 'Magarpatta Cyber City', city: 'Pune', location: 'Hadapsar', type: 'Business Parks', rating: 4.7, price: '50', image: getImagePath('magarpatta.jpg'), slots: 85 },
    { id: 4, name: 'Apollo Hospital', city: 'Bangalore', location: 'Bannerghatta', type: 'Hospitals', rating: 4.5, price: '30', image: getImagePath('apollo.jpg'), slots: 12 },
    { id: 5, name: 'UB City Mall', city: 'Bangalore', location: 'Lavelle Road', type: 'Malls', rating: 4.9, price: '80', image: getImagePath('ub-city.jpg'), slots: 30 },
    { id: 6, name: 'Manyata Tech Park', city: 'Bangalore', location: 'Hebbal', type: 'Business Parks', rating: 4.8, price: '50', image: getImagePath('manyata.jpg'), slots: 150 },
    { id: 10, name: 'Inorbit Mall', city: 'Mumbai', location: 'Malad', type: 'Malls', rating: 4.7, price: '50', image: getImagePath('inorbit.jpg'), slots: 88 },
    { id: 11, name: 'Nanavati Hospital', city: 'Mumbai', location: 'Vile Parle', type: 'Hospitals', rating: 4.4, price: '40', image: getImagePath('nanavati.jpg'), slots: 18 },
    { id: 12, name: 'BKC Public Parking', city: 'Mumbai', location: 'Bandra Kurla', type: 'Public Parking', rating: 4.5, price: '70', image: getImagePath('bkc.jpg'), slots: 300 },
    { id: 13, name: 'GVK One Mall', city: 'Hyderabad', location: 'Banjara Hills', type: 'Malls', rating: 4.7, price: '40', image: getImagePath('gvk.jpg'), slots: 40 },
    { id: 14, name: 'HITEC City Tech Park', city: 'Hyderabad', location: 'Madhapur', type: 'Business Parks', rating: 4.8, price: '45', image: getImagePath('hitec.jpg'), slots: 110 },
  ];

  const [filteredVenues, setFilteredVenues] = useState<VenueDetails[]>(allVenues);

  // ── Booking modal state ────────────────────────────────────────────────
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingVenue, setBookingVenue] = useState<VenueDetails | null>(null);
  const [showMyBookings, setShowMyBookings] = useState(false);

  const venueBookingCount = useSelector(
    (state: RootState) =>
      state.booking.venueBookings.filter(
        (b) => b.status === 'CONFIRMED' || b.status === 'ACTIVE',
      ).length,
  );

  const openBookingModal = (venue: VenueDetails) => {
    setBookingVenue(venue);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    // Clear venue after exit animation completes
    setTimeout(() => setBookingVenue(null), 350);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(() => {
      const results = allVenues.filter(v => 
        (!filters.city || v.city === filters.city) &&
        (!filters.type || v.type === filters.type)
      );
      setFilteredVenues(results);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 overflow-x-hidden">
      {/* 1. Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* My Bookings top-right button */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setShowMyBookings(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
          >
            <BookOpen size={16} />
            My Bookings
            {venueBookingCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {venueBookingCount}
              </span>
            )}
          </button>
        </div>

        <div className="text-center">
          <h1 className={`font-black text-gray-900 tracking-tight transition-all duration-1000 ${hasSearched ? 'text-4xl opacity-80' : 'text-6xl mb-4'}`}>
            Find Your Spot.
          </h1>
          {!hasSearched && (
            <p className="text-gray-500 text-xl max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
              Real-time availability and predictive booking for urban spaces.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className={`flex flex-col md:flex-row transition-all duration-1000 ease-in-out ${hasSearched ? 'flex-col' : 'items-start gap-12'}`}>
          
          {/* 2. Transforming Search Section */}
          <div className={`
            bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white transition-all duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1) z-10
            ${hasSearched ? 'w-full p-3 mb-12' : 'w-full md:w-[500px] p-10 flex-shrink-0'}
          `}>
            <div className={`overflow-hidden transition-all duration-700 ${hasSearched ? 'max-h-0 opacity-0 mb-0' : 'max-h-24 opacity-100 mb-8'}`}>
              <h2 className="text-2xl font-extrabold text-gray-800">Select City & Venue</h2>
              <p className="text-sm text-gray-400 mt-1">Please provide details to see available slots</p>
            </div>

            <div className={`flex transition-all duration-1000 ${hasSearched ? 'flex-row items-center divide-x divide-gray-100' : 'flex-col space-y-6'}`}>
              {/* City */}
              <div className={`px-4 py-2 transition-all duration-700 ${hasSearched ? 'flex-1' : 'w-full bg-slate-50 rounded-2xl p-6 hover:bg-slate-100'}`}>
                <label className="text-[10px] font-black text-blue-600 tracking-widest uppercase">City</label>
                <select className="w-full bg-transparent font-bold text-lg outline-none cursor-pointer" onChange={(e) => setFilters({...filters, city: e.target.value})}>
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Category */}
              <div className={`px-4 py-2 transition-all duration-700 ${hasSearched ? 'flex-1' : 'w-full bg-slate-50 rounded-2xl p-6 hover:bg-slate-100'}`}>
                <label className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Category</label>
                <select className="w-full bg-transparent font-bold text-lg outline-none cursor-pointer" onChange={(e) => setFilters({...filters, type: e.target.value})}>
                  <option value="">Venue Type</option>
                  {venueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Date */}
              <div className={`px-4 py-2 transition-all duration-700 ${hasSearched ? 'flex-1' : 'w-full bg-slate-50 rounded-2xl p-6 hover:bg-slate-100'}`}>
                <label className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Date</label>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd MMM" minDate={new Date()} className="w-full bg-transparent font-bold text-lg outline-none cursor-pointer" />
              </div>

              {/* Button */}
              <div className={`transition-all duration-1000 ${hasSearched ? 'w-auto ml-2' : 'pt-4'}`}>
                <Button onClick={handleSearch} disabled={isSearching} className={`rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 ${hasSearched ? 'h-14 w-14 p-0' : 'w-full py-6 text-xl shadow-xl shadow-blue-100'}`}>
                  {isSearching ? <Loader2 className="animate-spin" /> : <Search size={hasSearched ? 20 : 24} />}
                  {!hasSearched && (isSearching ? 'Finding...' : 'Search Venues')}
                </Button>
              </div>
            </div>
          </div>

          {/* 3. Features Section (Right side) */}
          <div className={`flex-1 transition-all duration-1000 ${hasSearched ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[800px] opacity-100'}`}>
            <div className="text-left mb-12">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Why Choose Park-Prabandh?</h2>
              <p className="mt-2 text-lg text-gray-500 font-medium">Advanced technology meets user-friendly design</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <FeatureCard icon={<ShieldCheck className="w-7 h-7 text-blue-600" />} title="AI-Powered Detection" desc="Real-time OpenCV slot detection with 99.5% accuracy" bg="bg-blue-100" />
              <FeatureCard icon={<CreditCard className="w-7 h-7 text-green-600" />} title="FASTag Integration" desc="Seamless payments with automatic toll deduction" bg="bg-green-100" />
              <FeatureCard icon={<Zap className="w-7 h-7 text-purple-600" />} title="Real-time Updates" desc="Live slot availability and instant booking confirmation" bg="bg-purple-100" />
            </div>
          </div>
        </div>

        {/* 4. Results Section */}
        <div className={`transition-all duration-1000 ${hasSearched ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none absolute'}`}>
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-20"><Loader2 className="animate-spin text-blue-600 mb-4" size={40} /><p className="animate-pulse">Syncing live availability...</p></div>
          ) : filteredVenues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredVenues.map((venue) => (
                <div key={venue.id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden hover:-translate-y-3 transition-all duration-500 group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={venue.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-black flex items-center shadow-sm"><Star size={12} className="mr-1 text-orange-400 fill-orange-400" /> {venue.rating}</div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-1">{venue.name}</h4>
                    <p className="text-gray-500 flex items-center text-sm font-medium mb-6"><MapPin size={14} className="mr-1 text-blue-500"/> {venue.location}, {venue.city}</p>
                    <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                      <div className="text-2xl font-black text-blue-600">₹{venue.price}<span className="text-sm text-gray-400 font-medium">/hr</span></div>
                      <Button onClick={() => openBookingModal(venue)} className="rounded-xl px-8 py-3">Book</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center mb-8 text-slate-300 relative">
                <Search size={80} strokeWidth={1} className="opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-1 bg-red-400 h-20 rotate-45 rounded-full opacity-40"></div></div>
              </div>
              <h3 className="text-3xl font-extrabold text-gray-800 mb-3">No Spots Found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">No venues in <span className="text-blue-600 font-bold">{filters.city || "this area"}</span> matching <span className="text-blue-600 font-bold">{filters.type || "selected category"}</span>.</p>
              <Button variant="outline" className="mt-10 rounded-2xl border-slate-200 text-slate-600 hover:bg-white hover:border-blue-500 hover:text-blue-600 px-8 py-4 transition-all" onClick={() => { setHasSearched(false); setFilteredVenues(allVenues); }}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Booking Modal ──────────────────────────────────────────── */}
      {bookingVenue && (
        <BookingModal
          isOpen={bookingModalOpen}
          venue={bookingVenue}
          onClose={closeBookingModal}
          initialDate={startDate ?? new Date()}
          onViewMyBookings={() => setShowMyBookings(true)}
        />
      )}

      {/* ── My Bookings Panel ──────────────────────────────────────── */}
      <MyBookings isOpen={showMyBookings} onClose={() => setShowMyBookings(false)} />
    </div>
  );
};

// Helper component for cleaner code
const FeatureCard = ({ icon, title, desc, bg }: any) => (
  <div className="flex items-start p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mr-6 flex-shrink-0`}>{icon}</div>
    <div><h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3><p className="text-gray-500 leading-relaxed">{desc}</p></div>
  </div>
);

export default UserHome;
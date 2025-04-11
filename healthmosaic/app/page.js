// app/page.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [signInAlert, setSignInAlert] = useState(false);
  const [navAlert, setNavAlert] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    setSignInAlert(true);
    setTimeout(() => setSignInAlert(false), 2000);
  };

  const handleNavClick = (section) => {
    setNavAlert(section);
    setTimeout(() => setNavAlert(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 py-4 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center mr-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-semibold text-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-transparent bg-clip-text"
            >
              MedDash
            </motion.span>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <motion.button 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              onClick={() => handleNavClick('features')} 
              className="text-gray-700 hover:text-teal-500 transition-colors font-medium"
            >
              Features
            </motion.button>
            <motion.button 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              onClick={() => handleNavClick('about')} 
              className="text-gray-700 hover:text-teal-500 transition-colors font-medium"
            >
              About
            </motion.button>
            <motion.button 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              onClick={() => handleNavClick('contact')} 
              className="text-gray-700 hover:text-teal-500 transition-colors font-medium"
            >
              Contact
            </motion.button>
            
          </nav>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-teal-500 to-cyan-600 text-transparent bg-clip-text">MedDash</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your comprehensive healthcare management platform for doctors and patients
            </p>
            <div className="inline-block px-6 py-2 bg-blue-50 rounded-full text-blue-800 font-medium mb-6">
              Please select how you want to continue
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex justify-center space-x-4 mb-12"
          >
            <div className="h-2 w-2 rounded-full bg-teal-500"></div>
            <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
            <div className="h-2 w-2 rounded-full bg-teal-500"></div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Doctor Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-teal-50 overflow-hidden"
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-6 shadow-lg shadow-teal-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c-1.134 0-2.2.478-3 1.179M12 6c.262 0 .52.02.768.058M15 6a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">I am a Doctor</h2>
              <p className="text-gray-600 mb-8">Access your doctor dashboard to manage patients and appointments</p>
              
              <div className="text-left w-full space-y-4 mb-8">
                <div className="flex items-start bg-teal-50 p-3 rounded-lg">
                  <div className="bg-teal-500 rounded-full p-1 flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-700">Manage patient records</p>
                </div>
                <div className="flex items-start bg-teal-50 p-3 rounded-lg">
                  <div className="bg-teal-500 rounded-full p-1 flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-700">Track patient health metrics</p>
                </div>
                <div className="flex items-start bg-teal-50 p-3 rounded-lg">
                  <div className="bg-teal-500 rounded-full p-1 flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-700">Schedule and manage appointments</p>
                </div>
              </div>
              
              <Link href="/doctor-signup" className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-teal-200 transition-all w-full flex items-center justify-center group">
                Continue as Doctor
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Patient Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-blue-50 overflow-hidden"
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">I am a Patient</h2>
              <p className="text-gray-600 mb-8">Access your health dashboard to manage your medical information</p>
              
              <div className="text-left w-full space-y-4 mb-8">
                <div className="flex items-start bg-blue-50 p-3 rounded-lg">
                  <div className="bg-blue-500 rounded-full p-1 flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-700">View your health score and metrics</p>
                </div>
                <div className="flex items-start bg-blue-50 p-3 rounded-lg">
                  <div className="bg-blue-500 rounded-full p-1 flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-700">Consult with doctors</p>
                </div>
                <div className="flex items-start bg-blue-50 p-3 rounded-lg">
                  <div className="bg-blue-500 rounded-full p-1 flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-700">Upload and analyze medical reports</p>
                </div>
              </div>
              
              <Link href="/patient-signup" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all w-full flex items-center justify-center group">
                Continue as Patient
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Curved Wave Separator */}
        <div className="mt-24 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-teal-50">
            <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,202.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Trust Section */}
        <div className="bg-teal-50 -mt-1 py-16 px-6 rounded-3xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Trusted by Healthcare Professionals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">1000+</div>
                <div className="text-gray-600">Doctors</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">50k+</div>
                <div className="text-gray-600">Patients</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">100+</div>
                <div className="text-gray-600">Hospitals</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">25+</div>
                <div className="text-gray-600">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {signInAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-4 rounded-lg shadow-lg"
          >
            This would open the sign-in dialog in a production environment.
          </motion.div>
        )}

        {navAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-4 rounded-lg shadow-lg"
          >
            This would navigate to the {navAlert} section in a production environment.
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">MedDash &copy; 2025</span>
            </div>
            <div className="flex space-x-4">
              <button className="rounded-full h-10 w-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-teal-500 hover:text-teal-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </button>
              <button className="rounded-full h-10 w-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-teal-500 hover:text-teal-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </button>
              <button className="rounded-full h-10 w-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-teal-500 hover:text-teal-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                </svg>
              </button>
              <button className="rounded-full h-10 w-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-teal-500 hover:text-teal-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">© 2025 MedDash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthWrapper() {
  const [showLogin, setShowLogin] = useState(true);
  
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={showLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {showLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <SignupForm onToggleForm={toggleForm} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

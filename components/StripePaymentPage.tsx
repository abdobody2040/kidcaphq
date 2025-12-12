
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, Check, ArrowLeft, Loader2 } from 'lucide-react';

interface StripePaymentPageProps {
  onSuccess: () => void;
  onCancel: () => void;
  planName?: string;
  price?: number;
}

const StripePaymentPage: React.FC<StripePaymentPageProps> = ({ 
  onSuccess, 
  onCancel, 
  planName = "KidCap Pro (Monthly)", 
  price = 9.99 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'FORM' | 'PROCESSING' | 'SUCCESS'>('FORM');
  
  // Form State
  const [email, setEmail] = useState('parent@example.com');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep('PROCESSING');

    // Simulate API Network Request to Stripe
    await new Promise(resolve => setTimeout(resolve, 2000));

    setStep('SUCCESS');
    
    // Redirect back to app after success animation
    setTimeout(() => {
        onSuccess();
    }, 1500);
  };

  // Auto-format card number
  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '');
      val = val.substring(0, 16);
      val = val.replace(/(.{4})/g, '$1 ').trim();
      setCardNumber(val);
  };

  // Auto-format expiry
  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      setExpiry(val);
  };

  return (
    <div className="fixed inset-0 z-[160] bg-gray-50 flex flex-col md:flex-row overflow-hidden font-sans text-gray-900">
      
      {/* Left Panel - Order Summary */}
      <div className="w-full md:w-1/2 bg-gray-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
              <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors font-bold text-sm">
                  <ArrowLeft size={16} /> Cancel payment
              </button>
              
              <div className="flex items-center gap-3 mb-6 opacity-50">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center font-black">K</div>
                  <span className="font-bold">KidCap HQ Inc.</span>
              </div>

              <div className="mb-2 text-gray-400 font-medium">Subscribe to</div>
              <h1 className="text-4xl font-black mb-8">{planName}</h1>

              <div className="flex items-end gap-2 mb-12">
                  <span className="text-6xl font-black">${price}</span>
                  <span className="text-gray-400 font-bold mb-2">per month</span>
              </div>

              <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300 font-medium">
                      <div className="bg-green-500/20 p-1 rounded-full text-green-400"><Check size={14} strokeWidth={3}/></div>
                      Unlimited Game Access
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 font-medium">
                      <div className="bg-green-500/20 p-1 rounded-full text-green-400"><Check size={14} strokeWidth={3}/></div>
                      AI Tutor (Ollie)
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 font-medium">
                      <div className="bg-green-500/20 p-1 rounded-full text-green-400"><Check size={14} strokeWidth={3}/></div>
                      Parent Analytics Dashboard
                  </div>
              </div>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 flex items-center gap-2 text-xs text-gray-500 font-bold">
              <div className="bg-white/10 p-1 rounded"><Shield size={12}/></div>
              Powered by <span className="text-white">Stripe</span>
          </div>

          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* Right Panel - Payment Form */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-12 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-md">
              
              {step === 'SUCCESS' ? (
                  <div className="text-center py-20">
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl"
                      >
                          <Check size={48} strokeWidth={4} />
                      </motion.div>
                      <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h2>
                      <p className="text-gray-500 font-bold">Upgrading your account...</p>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="mb-8">
                          <h2 className="text-2xl font-black text-gray-800 mb-2">Pay with card</h2>
                          <div className="flex gap-2">
                              <div className="h-8 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center grayscale opacity-50"><CreditCard size={16}/></div>
                              <div className="h-8 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center grayscale opacity-50 font-black text-xs italic text-blue-800">VISA</div>
                              <div className="h-8 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center grayscale opacity-50 font-black text-xs text-red-500">MC</div>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-600 mb-1">Email</label>
                              <input 
                                  type="email" 
                                  required
                                  value={email}
                                  onChange={e => setEmail(e.target.value)}
                                  className="w-full p-3 rounded-lg border-2 border-gray-200 font-medium focus:border-blue-500 outline-none transition-colors"
                                  placeholder="you@example.com"
                              />
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-gray-600 mb-1">Card Information</label>
                              <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                                  <div className="relative">
                                      <input 
                                          type="text" 
                                          required
                                          placeholder="1234 5678 1234 5678"
                                          value={cardNumber}
                                          onChange={handleCardNumber}
                                          className="w-full p-3 outline-none font-mono text-gray-700"
                                      />
                                      <div className="absolute right-3 top-3 text-gray-400"><CreditCard size={20}/></div>
                                  </div>
                                  <div className="flex border-t border-gray-200">
                                      <input 
                                          type="text" 
                                          required
                                          placeholder="MM / YY"
                                          maxLength={5}
                                          value={expiry}
                                          onChange={handleExpiry}
                                          className="w-1/2 p-3 outline-none border-r border-gray-200 font-mono text-gray-700"
                                      />
                                      <input 
                                          type="text" 
                                          required
                                          placeholder="CVC"
                                          maxLength={3}
                                          value={cvc}
                                          onChange={e => setCvc(e.target.value.replace(/\D/g,''))}
                                          className="w-1/2 p-3 outline-none font-mono text-gray-700"
                                      />
                                  </div>
                              </div>
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-gray-600 mb-1">Name on card</label>
                              <input 
                                  type="text" 
                                  required
                                  value={cardName}
                                  onChange={e => setCardName(e.target.value)}
                                  className="w-full p-3 rounded-lg border-2 border-gray-200 font-medium focus:border-blue-500 outline-none transition-colors"
                                  placeholder="John Doe"
                              />
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-gray-600 mb-1">Country or region</label>
                              <select className="w-full p-3 rounded-lg border-2 border-gray-200 font-medium bg-white focus:border-blue-500 outline-none">
                                  <option>United States</option>
                                  <option>United Kingdom</option>
                                  <option>Canada</option>
                                  <option>Australia</option>
                              </select>
                          </div>
                      </div>

                      <button 
                          type="submit"
                          disabled={isProcessing}
                          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                          {isProcessing ? (
                              <><Loader2 className="animate-spin" /> Processing...</>
                          ) : (
                              <><Lock size={16} /> Pay ${price}</>
                          )}
                      </button>
                      
                      <p className="text-center text-xs text-gray-400 font-medium mt-4">
                          Payments are secure and encrypted.
                      </p>
                  </form>
              )}
          </div>
      </div>
    </div>
  );
};

export default StripePaymentPage;

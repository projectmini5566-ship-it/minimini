import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { ShoppingCart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    product: '',
    total: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            product: formData.product,
            total: formData.total,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        address: '',
        product: '',
        total: 0,
      });
    } catch (err: any) {
      console.error('Error submitting order:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Checkout</h2>
        <p className="text-zinc-500 text-sm">Complete your order and send it to our database.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Order Submitted Successfully!</h3>
            <p className="text-zinc-500 max-w-xs">Your order has been recorded in our Supabase database.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-4 px-6 py-2 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
            >
              New Order
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Full Name</label>
              <input 
                required
                className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Email Address</label>
              <input 
                required
                type="email"
                className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Shipping Address</label>
              <textarea 
                required
                rows={3}
                className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all resize-none"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, City, Country"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Product Name</label>
                <input 
                  required
                  className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="MacBook Pro"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Total Amount ($)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Complete Order
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="bg-zinc-100 border border-zinc-200 rounded-3xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-300 rounded-2xl flex items-center justify-center">
          <AlertCircle className="text-zinc-500" size={24} />
        </div>
        <div>
          <p className="text-zinc-900 font-bold text-sm">Supabase Integration Active</p>
          <p className="text-zinc-500 text-xs">Orders are sent to project: nbohtmylnioomywptcyh</p>
        </div>
      </div>
    </div>
  );
};

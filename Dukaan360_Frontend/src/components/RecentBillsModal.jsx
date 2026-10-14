import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Receipt, Printer } from '@phosphor-icons/react';

const RecentBillsModal = ({ onClose }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pos/bills/?limit=10');
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
              <Receipt weight="fill" className="text-xl" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Recent Bills</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition">
            <X weight="bold" className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto cart-scroll flex-1">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p>No recent bills found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bills.map(bill => (
                <div key={bill.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex justify-between items-center hover:border-brand transition group">
                  <div>
                    <h4 className="font-black text-slate-800">{bill.invoice_number}</h4>
                    <p className="text-xs font-medium text-slate-500">
                      {new Date(bill.timestamp).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-black text-lg text-slate-800">₹{bill.grand_total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentBillsModal;

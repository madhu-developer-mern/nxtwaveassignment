import React, { useState } from 'react';
import { CreditCard, Lock, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PaymentFormProps {
  appointmentId: string;
  amount: number;
  onSuccess: () => void;
}

export function PaymentForm({ appointmentId, amount, onSuccess }: PaymentFormProps) {
  const { state } = useAuth();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    paymentMethod: 'card'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({
          appointmentId,
          amount,
          paymentMethod: paymentData.paymentMethod,
          cardDetails: {
            cardNumber: paymentData.cardNumber,
            expiryDate: paymentData.expiryDate,
            cvv: paymentData.cvv,
            cardholderName: paymentData.cardholderName
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment failed');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Lock className="h-5 w-5 text-green-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">Secure Payment</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Consultation Fee:</span>
          <span className="text-xl font-bold text-blue-600">${amount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentData.paymentMethod === 'card'}
                onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="mr-2"
              />
              <CreditCard className="h-4 w-4 mr-1" />
              Credit/Debit Card
            </label>
          </div>
        </div>

        {/* Card Details */}
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            id="cardholderName"
            type="text"
            required
            value={paymentData.cardholderName}
            onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Name on card"
          />
        </div>

        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            required
            maxLength={19}
            value={paymentData.cardNumber}
            onChange={(e) => setPaymentData(prev => ({ 
              ...prev, 
              cardNumber: formatCardNumber(e.target.value) 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1234 5678 9012 3456"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="text"
              required
              maxLength={5}
              value={paymentData.expiryDate}
              onChange={(e) => setPaymentData(prev => ({ 
                ...prev, 
                expiryDate: formatExpiryDate(e.target.value) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              id="cvv"
              type="text"
              required
              maxLength={4}
              value={paymentData.cvv}
              onChange={(e) => setPaymentData(prev => ({ 
                ...prev, 
                cvv: e.target.value.replace(/[^0-9]/g, '') 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Pay ${amount}
            </>
          )}
        </button>

        <div className="text-xs text-gray-500 text-center">
          <Lock className="h-3 w-3 inline mr-1" />
          Your payment information is secure and encrypted
        </div>
      </form>
    </div>
  );
}
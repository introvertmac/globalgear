import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { Button } from '../common/Button';
import { X, Minus, Plus, Trash2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const removeFromCart = (id: number, size?: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size } });
  };

  const updateQuantity = (id: number, quantity: number, size?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, size } });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      router.push('/checkout');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-96 md:w-1/3 lg:w-1/4 xl:w-1/5 max-w-md bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out z-50 flex flex-col`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg sm:text-xl font-semibold">Your Cart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {state.items.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          <>
            {state.items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="mb-6 pb-4 border-b last:border-b-0">
                <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {item.price} PYUSD {item.size ? `(${item.size})` : ''}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size)}
                      className="p-1 bg-gray-200 rounded-full"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1, item.size)}
                      className="w-12 text-center border rounded-md text-xs sm:text-sm"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                      className="p-1 bg-gray-200 rounded-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {state.items.length > 0 && (
        <div className="p-4 border-t mt-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-base sm:text-lg">Total:</p>
            <p className="font-bold text-lg sm:text-xl">{state.total.toFixed(2)} PYUSD</p>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full py-3 text-sm sm:text-base active:scale-95 transition-transform duration-150"
          >
            {isCheckingOut ? 'Processing...' : 'Checkout'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
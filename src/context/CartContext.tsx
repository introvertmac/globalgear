import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '@/config/products';

interface CartItem extends Product {
  quantity: number;
  size?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  isCartOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product & { size?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: number; size?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; size?: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.size === action.payload.size
      );
      if (existingItemIndex !== -1) {
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price,
          isCartOpen: true,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
        isCartOpen: true,
      };
    case 'REMOVE_FROM_CART':
      const itemToRemove = state.items.find(item => 
        item.id === action.payload.id && item.size === action.payload.size
      );
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.size === action.payload.size)
        ),
        total: state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((total, item) => {
          if (item.id === action.payload.id && item.size === action.payload.size) {
            return total + item.price * action.payload.quantity;
          }
          return total + item.price * item.quantity;
        }, 0),
      };
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        isCartOpen: false,
      };
    case 'OPEN_CART':
      return {
        ...state,
        isCartOpen: true,
      };
    case 'CLOSE_CART':
      return {
        ...state,
        isCartOpen: false,
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, isCartOpen: false });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  AlertCircle, 
  Plus, 
  MapPin, 
  CreditCard, 
  Truck, 
  Pill 
} from 'lucide-react';
import { mockMedications, mockPharmacies } from '../data/mockData';
import { useNotification } from '../context/NotificationContext';

const Pharmacy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState(mockPharmacies[0]);
  const [showPharmacyList, setShowPharmacyList] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const { triggerLowStockAlert } = useNotification();
  
  const lowStockMedications = mockMedications.filter(med => med.stock < 5);
  
  const filteredMedications = mockMedications.filter(medication => 
    medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.dosage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const addToCart = (medication: any) => {
    const existingItem = cart.find(item => item.id === medication.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === medication.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...medication, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const cartTotal = cart.reduce((total, item) => total + (300 * item.quantity), 0);
  
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Pharmacy</h2>
          <p className="text-gray-600">Order refills and manage your medications</p>
        </div>
      </div>
      
      {/* Low stock alert */}
      {lowStockMedications.length > 0 && (
        <div className="card mb-6 bg-warning-50 border-warning-200">
          <div className="p-5 flex items-start">
            <div className="bg-warning-100 rounded-full p-2 mr-3">
              <AlertCircle size={20} className="text-warning-600" />
            </div>
            <div>
              <h3 className="font-semibold text-warning-800">Low Stock Alert</h3>
              <p className="text-warning-700 mt-1">
                You're running low on these medications. Consider ordering refills soon.
              </p>
              <div className="flex flex-wrap mt-3 gap-2">
                {lowStockMedications.map((med, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-warning-200 rounded-lg px-3 py-2 text-sm flex items-center"
                  >
                    <span className="font-medium">{med.name}</span>
                    <span className="ml-2 bg-warning-100 text-warning-800 px-2 py-0.5 rounded-full text-xs">
                      {med.stock} left
                    </span>
                    <button 
                      className="ml-2 text-primary-600 hover:text-primary-700"
                      onClick={() => addToCart(med)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Pharmacy selection */}
          <div className="card mb-6">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold">Your Pharmacy</h3>
            </div>
            
            <div className="p-5">
              <div className="relative">
                <div 
                  className="border border-gray-300 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-primary-300"
                  onClick={() => setShowPharmacyList(!showPharmacyList)}
                >
                  <div className="flex items-start">
                    <div className="bg-primary-100 rounded-full p-2 mr-3">
                      <ShoppingBag size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedPharmacy.name}</p>
                      <p className="text-sm text-gray-600">{selectedPharmacy.address}</p>
                      <div className="flex items-center mt-1">
                        <MapPin size={14} className="text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">{selectedPharmacy.distance} away</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-sm text-primary-600">Change</span>
                </div>
                
                {showPharmacyList && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium">Select a Pharmacy</p>
                    </div>
                    {mockPharmacies.map((pharmacy, index) => (
                      <div 
                        key={index}
                        className="p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedPharmacy(pharmacy);
                          setShowPharmacyList(false);
                        }}
                      >
                        <div className="flex items-start">
                          <div>
                            <p className="font-medium">{pharmacy.name}</p>
                            <p className="text-sm text-gray-600">{pharmacy.address}</p>
                            <div className="flex items-center mt-1">
                              <MapPin size={14} className="text-gray-500 mr-1" />
                              <span className="text-xs text-gray-500">{pharmacy.distance} away</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Medication search */}
          <div className="card">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold">Find Medications</h3>
            </div>
            
            <div className="p-5">
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search medications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMedications.length === 0 ? (
                  <div className="col-span-full text-center p-6 text-gray-500">
                    <Pill size={40} className="mx-auto mb-2 text-gray-300" />
                    <p>No medications found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  filteredMedications.map((medication, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{medication.name}</h4>
                          <p className="text-sm text-gray-600">{medication.dosage}</p>
                          
                          <div className="flex items-center mt-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              medication.stock < 5 
                                ? 'bg-error-100 text-error-700' 
                                : 'bg-success-100 text-success-700'
                            }`}>
                              {medication.stock} left
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium">Rs 300.00</p>
                          <p className="text-xs text-gray-500">30 day supply</p>
                          <button
                            className="btn btn-primary btn-sm mt-2"
                            onClick={() => addToCart(medication)}
                          >
                            <Plus size={14} className="mr-1" />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Cart panel */}
        <div>
          <div className="card sticky top-6">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold">Your Cart</h3>
            </div>
            
            <div className="p-5">
              {cart.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  <ShoppingBag size={40} className="mx-auto mb-2 text-gray-300" />
                  <p>Your cart is empty</p>
                  <p className="text-sm mt-1">Add medications to order refills</p>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-gray-100 mb-4">
                    {cart.map((item, index) => (
                      <li key={index} className="py-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.dosage}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Rs{(300 * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <button
                              className="h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="mx-2 w-6 text-center">{item.quantity}</span>
                            <button
                              className="h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            className="text-gray-500 hover:text-error-600"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">Rs{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-medium">Rs 50.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>Rs{(cartTotal + 50).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="btn btn-primary w-full">
                      <CreditCard size={18} className="mr-2" />
                      Checkout
                    </button>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Truck size={14} className="mr-1" />
                      <span>Delivery in 1-2 business days</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
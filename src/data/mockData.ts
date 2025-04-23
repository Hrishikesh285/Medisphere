// Mock medications data
export const mockMedications = [
  {
    id: '1',
    name: 'Metformin',
    dosage: '500mg',
    schedule: [
      { time: '08:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { time: '20:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }
    ],
    stock: 23,
    prescribedBy: 'Dr. Sarah Johnson'
  },
  {
    id: '2',
    name: 'Lisinopril',
    dosage: '10mg',
    schedule: [
      { time: '09:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }
    ],
    stock: 3,
    prescribedBy: 'Dr. Michael Chen'
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '20mg',
    schedule: [
      { time: '21:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }
    ],
    stock: 12,
    prescribedBy: 'Dr. Michael Chen'
  },
  {
    id: '4',
    name: 'Aspirin',
    dosage: '81mg',
    schedule: [
      { time: '08:00', days: ['monday', 'wednesday', 'friday'] }
    ],
    stock: 45,
    prescribedBy: 'Dr. Sarah Johnson'
  },
  {
    id: '5',
    name: 'Glimepiride',
    dosage: '2mg',
    schedule: [
      { time: '12:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }
    ],
    stock: 8,
    prescribedBy: 'Dr. Patricia Williams'
  }
];

// Mock pharmacies data
export const mockPharmacies = [
  {
    id: '1',
    name: 'MediCare Pharmacy',
    address: '123 Health Street, Mumbai, MH 400001',
    phone: '+91 22 1234 5678',
    hours: '8:00 AM - 9:00 PM',
    distance: '0.8 km'
  },
  {
    id: '2',
    name: 'LifeCare Pharmacy',
    address: '456 Wellness Avenue, Mumbai, MH 400002',
    phone: '+91 22 2345 6789',
    hours: '9:00 AM - 10:00 PM',
    distance: '1.2 km'
  },
  {
    id: '3',
    name: 'Apollo Pharmacy',
    address: '789 Medical Plaza, Mumbai, MH 400003',
    phone: '+91 22 3456 7890',
    hours: '24 hours',
    distance: '2.5 km'
  }
];
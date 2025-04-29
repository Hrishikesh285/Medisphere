fetch("http://localhost:5001/adherence") // for adherence backend
import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useNotification } from '../context/NotificationContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AIAnalysis: React.FC = () => {
  const { addNotification } = useNotification();
  const [timeRange, setTimeRange] = useState('week');
  const [openFaqs, setOpenFaqs] = useState<number[]>([0]); // First FAQ is open by default
  
  // Mock adherence data
  const mockAdherenceScore = 72;
  const mockAdherenceHistory = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Adherence Score',
          data: [85, 90, 75, 60, 50, 65, 72],
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1,
        },
      ],
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Adherence Score',
          data: [88, 82, 75, 72],
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1,
        },
      ],
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Adherence Score',
          data: [95, 90, 85, 82, 80, 78, 76, 75, 73, 74, 72, 72],
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1,
        },
      ],
    },
  };
  
  
  
  // Medication-specific adherence
  const medicationAdherenceData = {
    labels: ['Metformin', 'Lisinopril', 'Atorvastatin', 'Aspirin'],
    datasets: [
      {
        label: 'Adherence Rate',
        data: [95, 80, 65, 85],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // Primary
          'rgba(20, 184, 166, 0.7)', // Secondary
          'rgba(249, 115, 22, 0.7)', // Accent
          'rgba(34, 197, 94, 0.7)', // Success
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Adherence trends over time
  const trendData = {
    labels: ['6 months ago', '5 months ago', '4 months ago', '3 months ago', '2 months ago', '1 month ago', 'Current'],
    datasets: [
      {
        label: 'Adherence Score',
        data: [95, 92, 88, 85, 80, 75, 72],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  

  const recommendations = [
    'Set up evening reminders 30 minutes before your scheduled medication time',
    'Create a weekend routine to improve adherence during those days',
    'Consider using a pill organizer to better manage multiple medications',
    'Discuss your Atorvastatin regimen with your doctor to address any side effects or concerns',
    'Use the MediSphere mobile app to receive timely medication reminders',
  ];
  
  // FAQs
  const faqs = [
    {
      question: 'What is medication adherence?',
      answer: 'Medication adherence refers to taking medications correctly as prescribed by your healthcare provider. This includes taking the right dose, at the right time, in the right way, and for the prescribed duration.'
    },
    {
      question: 'Why is medication adherence important?',
      answer: 'Poor adherence can lead to disease progression, increased hospitalizations, and higher healthcare costs. For chronic conditions, adhering to medication regimens is crucial for managing symptoms and preventing complications.'
    },
    {
      question: 'How is my adherence score calculated?',
      answer: 'Your adherence score is calculated based on several factors including: whether you take medications at the prescribed times, if you miss doses, and if you take the correct dosage. The system tracks when you mark medications as taken compared to their scheduled times.'
    },
    {
      question: 'How can I improve my medication adherence?',
      answer: 'You can improve adherence by: setting up reminders, using pill organizers, establishing a routine, keeping a medication journal, understanding the purpose of each medication, discussing side effects with your doctor, and using technology tools like MediSphere to track your medications.'
    },
  ];
  
  // Toggle FAQ
  const toggleFaq = (index: number) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter(i => i !== index));
    } else {
      setOpenFaqs([...openFaqs, index]);
    }
  };
  
  // Notify user 
  useEffect(() => {
    if (mockAdherenceScore < 80) {
      addNotification({
        type: 'adherence',
        title: 'Low Adherence Score',
        message: 'Your medication adherence score is below the recommended threshold. Check the AI Analysis tab for tips to improve.',
        actionLink: '/ai-analysis'
      });
    }
  }, []);
  
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">AI Analysis</h2>
          <p className="text-gray-600">Smart insights to improve your medication adherence</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-700">Time Range:</span>
          <div className="relative z-10">
            <select
              className="form-input py-1.5 pl-3 pr-8"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>
      
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Current Adherence Score</h3>
              <p className="text-primary-100 mb-4">Based on your medication history</p>
              
              <div className="flex items-baseline">
                <span className="text-5xl font-bold">{mockAdherenceScore}%</span>
                <span className="ml-2 text-primary-200">
                  <TrendingDown size={20} className="inline" /> -3% from last month
                </span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <BarChart2 size={32} className="text-white" />
              </div>
            </div>
          </div>
          
          {mockAdherenceScore < 80 && (
            <div className="mt-6 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center">
                <AlertTriangle size={18} className="mr-2" />
                <p className="font-medium">Below recommended threshold (80%)</p>
              </div>
              <p className="text-sm mt-1">Review the insights below to improve your adherence.</p>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold mb-4">Adherence History</h3>
          <div className="h-64">
            <Bar 
              data={mockAdherenceHistory[timeRange as keyof typeof mockAdherenceHistory]} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          
        </div>
        
        <div className="card p-6">
          
        </div>
        
        <div className="card p-6">
        </div> 
      </div>
      
      {/* Detailed charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        

      </div>
    </div>
  );
};

export default AIAnalysis;

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Pill, 
  ClipboardList, 
  ShoppingBag, 
  Video,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { mockMedications } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { triggerMedicationReminder } = useNotification();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate upcoming medication based on current time
  const getUpcomingMedication = () => {
    const now = new Date();
    const today = format(now, 'EEEE').toLowerCase();
    
    // Filter medications scheduled for today
    const todayMedications = mockMedications.filter(med => 
      med.schedule.some(schedule => 
        schedule.days.includes(today)
      )
    );
    
    // Sort by closest upcoming time
    const sortedMedications = todayMedications.sort((a, b) => {
      const getNextTime = (med: any) => {
        const todaySchedule = med.schedule.filter((s: any) => s.days.includes(today));
        const times = todaySchedule.map((s: any) => {
          const [hour, minute] = s.time.split(':').map(Number);
          const scheduleTime = new Date();
          scheduleTime.setHours(hour, minute, 0, 0);
          if (scheduleTime < now) {
            scheduleTime.setDate(scheduleTime.getDate() + 1);
          }
          return scheduleTime;
        });
        return Math.min(...times.map(t => t.getTime()));
      };
      
      return getNextTime(a) - getNextTime(b);
    });
    
    return sortedMedications[0];
  };
  
  const upcomingMedication = getUpcomingMedication();
  
  // Calculate next dose time
  const getNextDoseTime = (medication: any) => {
    if (!medication) return '';
    
    const today = format(currentTime, 'EEEE').toLowerCase();
    const todaySchedule = medication.schedule.filter((s: any) => s.days.includes(today));
    
    if (todaySchedule.length === 0) return 'No doses today';
    
    const nextTimes = todaySchedule.map((s: any) => {
      const [hour, minute] = s.time.split(':').map(Number);
      const scheduleTime = new Date();
      scheduleTime.setHours(hour, minute, 0, 0);
      return scheduleTime;
    }).filter((time: Date) => time > currentTime);
    
    if (nextTimes.length === 0) return 'All doses taken today';
    
    const nextTime = new Date(Math.min(...nextTimes.map(t => t.getTime())));
    return format(nextTime, 'h:mm a');
  };
  
  // Handle reminder button click
  const handleReminderClick = () => {
    if (upcomingMedication) {
      triggerMedicationReminder(upcomingMedication);
    }
  };
  
  const adherenceScore = 72;
  const lowStockMedications = mockMedications.filter(med => med.stock < 5);
  
  return (
    <div className="space-y-8">
      {/* Greeting section */}
      <section className="card p-6 bg-gradient-to-r from-primary-500 to-secondary-600 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name.split(' ')[0]}!
            </h2>
            <p className="text-primary-100 mb-4">
              {format(currentTime, 'EEEE, MMMM d, yyyy')} | {format(currentTime, 'h:mm a')}
            </p>
            
            {upcomingMedication && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <Bell size={18} className="mr-2" />
                  <h3 className="font-medium">Upcoming Medication</h3>
                </div>
                <p className="font-semibold mb-1">{upcomingMedication.name} ({upcomingMedication.dosage})</p>
                <p className="text-sm text-primary-100">Next dose: {getNextDoseTime(upcomingMedication)}</p>
                
                <div className="mt-3 flex">
                  <button 
                    className="btn bg-white text-primary-600 hover:bg-primary-50 mr-2"
                    onClick={handleReminderClick}
                  >
                    <Bell size={16} className="mr-1" />
                    Remind Me
                  </button>
                  <button 
                    className="btn bg-white/20 hover:bg-white/30"
                    onClick={() => navigate('/reminders')}
                  >
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="hidden md:block">
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Pill size={48} className="text-white" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Dashboard sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's medications */}
        <section className="card">
          <div className="p-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center">
                <ClipboardList size={18} className="mr-2 text-primary-500" />
                Today's Medications
              </h3>
              <button 
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                onClick={() => navigate('/reminders')}
              >
                View all
                <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
          
          <div className="p-0">
            <ul className="divide-y divide-gray-100">
              {mockMedications.slice(0, 3).map((medication, index) => (
                <li key={index} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                      index % 3 === 0 ? 'bg-primary-100 text-primary-600' : 
                      index % 3 === 1 ? 'bg-secondary-100 text-secondary-600' : 
                      'bg-accent-100 text-accent-600'
                    }`}>
                      <Pill size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{medication.name}</p>
                      <p className="text-sm text-gray-600">{medication.dosage} • {medication.schedule[0].time}</p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        medication.stock < 5 ? 'bg-error-100 text-error-700' : 
                        'bg-success-100 text-success-700'
                      }`}>
                        {medication.stock} left
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        
        {/* Adherence score */}
        <section className="card">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold flex items-center">
              <TrendingUp size={18} className="mr-2 text-primary-500" />
              Medication Adherence
            </h3>
          </div>
          
          <div className="p-5 flex flex-col items-center">
            <div className="relative h-36 w-36 mb-4">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke={adherenceScore >= 80 ? '#16a34a' : '#f97316'}
                  strokeWidth="2"
                  strokeDasharray={`${adherenceScore} ${100 - adherenceScore}`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold">{adherenceScore}%</span>
                </div>
              </div>
            </div>
            
            <p className="text-center font-medium">
              {adherenceScore >= 80 ? 'Great job!' : 'Needs improvement'}
            </p>
            
            {adherenceScore < 80 && (
              <p className="text-sm text-gray-600 text-center mt-1">
                Try to take your medications on time to improve your score.
              </p>
            )}
            
            <button
              className="btn btn-primary mt-4"
              onClick={() => navigate('/ai-analysis')}
            >
              View Analysis
            </button>
          </div>
        </section>
        
        {/* Quick actions */}
        <section className="card">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold">Quick Actions</h3>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <button
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex flex-col items-center"
                onClick={() => navigate('/pharmacy')}
              >
                <ShoppingBag size={24} className="text-primary-500 mb-2" />
                <span className="text-sm font-medium">Refill Medication</span>
              </button>
              
              <button
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex flex-col items-center"
                onClick={() => navigate('/telemedicine')}
              >
                <Video size={24} className="text-secondary-500 mb-2" />
                <span className="text-sm font-medium">Book Consultation</span>
              </button>
              
              <button
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex flex-col items-center"
                onClick={() => navigate('/reminders')}
              >
                <Bell size={24} className="text-accent-500 mb-2" />
                <span className="text-sm font-medium">Set Reminder</span>
              </button>
              
              <button
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex flex-col items-center"
                onClick={() => navigate('/profile')}
              >
                <Calendar size={24} className="text-success-500 mb-2" />
                <span className="text-sm font-medium">Appointments</span>
              </button>
            </div>
          </div>
        </section>
      </div>
      
      {/* Low stock alert */}
      {lowStockMedications.length > 0 && (
        <section className="card bg-warning-50 border-warning-200">
          <div className="p-5 flex items-start">
            <div className="bg-warning-100 rounded-full p-2 mr-3">
              <ShoppingBag size={20} className="text-warning-600" />
            </div>
            <div>
              <h3 className="font-semibold text-warning-800">Low Medication Stock Alert</h3>
              <p className="text-warning-700 mt-1">
                You're running low on {lowStockMedications.map(med => med.name).join(', ')}. 
                Consider ordering refills soon.
              </p>
              <button
                className="btn bg-warning-500 text-white hover:bg-warning-600 mt-3"
                onClick={() => navigate('/pharmacy')}
              >
                Order Refills
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
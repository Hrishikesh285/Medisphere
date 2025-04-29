fetch("http://localhost:5000/reminders") // for reminder backend

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Edit, 
  Trash2, 
  XCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { useNotification } from '../context/NotificationContext';
import { mockMedications } from '../data/mockData';

const Reminders: React.FC = () => {
  const { triggerMedicationReminder } = useNotification();
  const [medications, setMedications] = useState(mockMedications);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const getMedicationStatus = (medication: any) => {
    const today = format(currentTime, 'EEEE').toLowerCase();
    const now = currentTime;
    
    // Check if medication is scheduled for today
    const todaySchedules = medication.schedule.filter((s: any) => s.days.includes(today));
    
    if (todaySchedules.length === 0) {
      return 'not-scheduled';
    }
    
    // Check if any doses are upcoming
    const upcomingDoses = todaySchedules.filter((s: any) => {
      const [hour, minute] = s.time.split(':').map(Number);
      const scheduleTime = new Date();
      scheduleTime.setHours(hour, minute, 0, 0);
      return scheduleTime > now;
    });
    
    if (upcomingDoses.length > 0) {
      return 'upcoming';
    }
    
    // If no upcoming doses, all are past
    return 'taken';
  };
  
  const getNextDoseTime = (medication: any) => {
    const today = format(currentTime, 'EEEE').toLowerCase();
    const now = currentTime;
    
    // Get today's schedule
    const todaySchedules = medication.schedule.filter((s: any) => s.days.includes(today));
    
    if (todaySchedules.length === 0) {
      return 'Not scheduled today';
    }
    
    // Find next upcoming dose
    const upcomingDoses = todaySchedules.map((s: any) => {
      const [hour, minute] = s.time.split(':').map(Number);
      const scheduleTime = new Date();
      scheduleTime.setHours(hour, minute, 0, 0);
      return { time: scheduleTime, timeString: s.time };
    }).filter((dose: any) => dose.time > now);
    
    if (upcomingDoses.length === 0) {
      return 'All doses taken today';
    }
    
    // Sort and get the next dose
    upcomingDoses.sort((a: any, b: any) => a.time.getTime() - b.time.getTime());
    return format(upcomingDoses[0].time, 'h:mm a');
  };
  
  const filteredMedications = medications.filter(medication => {
    const status = getMedicationStatus(medication);
    
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = format(currentTime, 'EEEE').toLowerCase();
      return medication.schedule.some(s => s.days.includes(today));
    }
    if (filter === 'upcoming') return status === 'upcoming';
    if (filter === 'taken') return status === 'taken';
    
    return true;
  });
  
  const handleReminder = (medication: any) => {
    triggerMedicationReminder(medication);
  };
  
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Medication Reminders</h2>
          <p className="text-gray-600">Keep track of your medication schedule</p>
        </div>
        
        <button
          className="btn btn-primary mt-4 sm:mt-0"
          onClick={() => setShowDialog(true)}
        >
          <Plus size={18} className="mr-1" />
          Add Medication
        </button>
      </div>
      
      {/* Filter tabs */}
      <div className="flex overflow-x-auto mb-6 bg-white p-1 rounded-lg shadow-sm">
        {['all', 'today', 'upcoming', 'taken'].map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded-md whitespace-nowrap mr-2 ${
              filter === option 
                ? 'bg-primary-100 text-primary-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Reminders list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMedications.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-6 text-center text-gray-500 flex flex-col items-center">
            <Bell size={48} className="text-gray-300 mb-2" />
            <p className="font-medium">No medications match your filter</p>
            <p className="text-sm mt-1">Try changing your filter or add a new medication</p>
          </div>
        ) : (
          filteredMedications.map((medication, index) => {
            const status = getMedicationStatus(medication);
            
            return (
              <div 
                key={index} 
                className={`card card-hover ${
                  status === 'upcoming' ? 'border-l-4 border-l-primary-500' :
                  status === 'taken' ? 'border-l-4 border-l-success-500' :
                  ''
                }`}
              >
                <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{medication.name}</h3>
                    <p className="text-sm text-gray-600">{medication.dosage}</p>
                  </div>
                  
                  <div className="flex">
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-error-600 rounded-full hover:bg-gray-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start mb-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                      status === 'upcoming' ? 'bg-primary-100 text-primary-600' :
                      status === 'taken' ? 'bg-success-100 text-success-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {status === 'upcoming' ? <Clock size={16} /> :
                       status === 'taken' ? <CheckCircle size={16} /> :
                       <XCircle size={16} />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {status === 'upcoming' ? 'Upcoming Dose' :
                         status === 'taken' ? 'Taken Today' :
                         'Not Scheduled Today'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {status === 'upcoming' ? getNextDoseTime(medication) :
                         status === 'taken' ? 'All doses completed for today' :
                         'This medication is not scheduled for today'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Schedule */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule</h4>
                    <div className="flex flex-wrap gap-1">
                      {weekdays.map((day) => {
                        const active = medication.schedule.some((s: any) => s.days.includes(day));
                        return (
                          <span 
                            key={day}
                            className={`text-xs px-2 py-1 rounded-md ${
                              active 
                                ? 'bg-primary-100 text-primary-700' 
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {day.substr(0, 3)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Times */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Times</h4>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(medication.schedule.map((s: any) => s.time))].map((time) => {
                        const [hour, minute] = time.split(':');
                        const timeObj = new Date();
                        timeObj.setHours(parseInt(hour), parseInt(minute));
                        
                        return (
                          <span 
                            key={time}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md flex items-center"
                          >
                            <Clock size={12} className="mr-1" />
                            {format(timeObj, 'h:mm a')}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Stock */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        medication.stock < 5 ? 'bg-error-100 text-error-700' : 
                        'bg-success-100 text-success-700'
                      }`}>
                        {medication.stock} {medication.stock === 1 ? 'pill' : 'pills'} left
                      </span>
                    </div>
                    
                    {status === 'upcoming' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReminder(medication)}
                      >
                        <Bell size={14} className="mr-1" />
                        Remind Me
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Add Medication Dialog (simplified) */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Medication</h3>
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setShowDialog(false)}
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="text-center p-6">
              <p className="text-gray-600">
                Consult doctor to add medicine.
              </p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;

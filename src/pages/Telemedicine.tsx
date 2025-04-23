import React, { useState } from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  Check, 
  X, 
  Calendar as CalendarIcon,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const Telemedicine: React.FC = () => {
  const { addNotification } = useNotification();
  const [step, setStep] = useState(1);
  const [symptomText, setSymptomText] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [preferredDoctor, setPreferredDoctor] = useState('');
  const [urgency, setUrgency] = useState('normal');
  
  // Mock data
  const availableDoctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'General Physician', available: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiologist', available: true },
    { id: 3, name: 'Dr. Patricia Williams', specialty: 'Endocrinologist', available: false }
  ];
  
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Move to next step or submit final form
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Show notification for successfully scheduled appointment
      addNotification({
        type: 'appointment',
        title: 'Consultation Scheduled',
        message: `Your ${appointmentType} consultation has been scheduled for ${appointmentDate} at ${appointmentTime}.`,
        actionLink: '/telemedicine'
      });
      
      // Reset form
      setSymptomText('');
      setAppointmentType('video');
      setAppointmentDate('');
      setAppointmentTime('');
      setPreferredDoctor('');
      setUrgency('normal');
      setStep(1);
    }
  };
  
  // Previous upcoming appointments (mock data)
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      type: 'Video Consultation',
      date: '2025-05-15',
      time: '10:00 AM',
      status: 'confirmed',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    }
  ];
  
  
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="font-semibold mb-4">Tell us about your symptoms</h3>
            <div className="mb-4">
              <label htmlFor="symptom-text" className="block text-sm font-medium text-gray-700 mb-1">
                Describe your symptoms
              </label>
              <textarea
                id="symptom-text"
                rows={4}
                className="form-input"
                placeholder="What symptoms are you experiencing?"
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How urgent is your concern?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'normal', 'high'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`border rounded-lg py-2 px-3 text-sm font-medium ${
                      urgency === option
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setUrgency(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h3 className="font-semibold mb-4">Choose appointment type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                className={`border rounded-lg p-4 text-left ${
                  appointmentType === 'video'
                    ? 'bg-primary-50 border-primary-300'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setAppointmentType('video')}
              >
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    appointmentType === 'video'
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Video size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Video Consultation</p>
                    <p className="text-sm text-gray-600">Face-to-face virtual appointment</p>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                className={`border rounded-lg p-4 text-left ${
                  appointmentType === 'message'
                    ? 'bg-primary-50 border-primary-300'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setAppointmentType('message')}
              >
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    appointmentType === 'message'
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Message Consultation</p>
                    <p className="text-sm text-gray-600">Text-based medical advice</p>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="preferred-doctor" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Doctor (Optional)
              </label>
              <select
                id="preferred-doctor"
                className="form-input"
                value={preferredDoctor}
                onChange={(e) => setPreferredDoctor(e.target.value)}
              >
                <option value="">No preference</option>
                {availableDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id.toString()} disabled={!doctor.available}>
                    {doctor.name} ({doctor.specialty}) {!doctor.available && '- Unavailable'}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h3 className="font-semibold mb-4">Schedule your appointment</h3>
            <div className="mb-4">
              <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                id="appointment-date"
                type="date"
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Time
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`border rounded-lg py-2 px-3 text-sm font-medium ${
                      appointmentTime === time
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setAppointmentTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-primary-800 mb-2">Appointment Summary</h4>
              <ul className="space-y-2 text-sm text-primary-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 mr-1.5">
                    <User size={16} />
                  </span>
                  <span>
                    {preferredDoctor 
                      ? availableDoctors.find(d => d.id.toString() === preferredDoctor)?.name 
                      : 'Any available doctor'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 mr-1.5">
                    <Video size={16} />
                  </span>
                  <span>
                    {appointmentType === 'video' ? 'Video Consultation' : 'Message Consultation'}
                  </span>
                </li>
                {appointmentDate && (
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 mr-1.5">
                      <Calendar size={16} />
                    </span>
                    <span>{appointmentDate}</span>
                  </li>
                )}
                {appointmentTime && (
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 mr-1.5">
                      <Clock size={16} />
                    </span>
                    <span>{appointmentTime}</span>
                  </li>
                )}
              </ul>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Telemedicine</h2>
          <p className="text-gray-600">Consult with healthcare professionals remotely</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Consultation request form */}
          <div className="card mb-6">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold">Request a Consultation</h3>
            </div>
            
            <div className="p-5">
              {/* Progress steps */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 ${
                        step === stepNumber
                          ? 'bg-primary-500 text-white'
                          : step > stepNumber
                            ? 'bg-success-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step > stepNumber ? <Check size={16} /> : stepNumber}
                      </div>
                      <span className="text-xs text-gray-600">
                        {stepNumber === 1 ? 'Symptoms' : 
                         stepNumber === 2 ? 'Type' : 'Schedule'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative mt-2">
                  <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full"></div>
                  <div 
                    className="absolute top-0 left-0 h-1 bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
                
                <div className="flex justify-between mt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      (step === 1 && !symptomText) ||
                      (step === 3 && (!appointmentDate || !appointmentTime))
                    }
                  >
                    {step === 3 ? 'Schedule Appointment' : 'Continue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Upcoming appointments */}
          <div className="card mb-6">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold">Upcoming Appointments</h3>
            </div>
            
            <div className="p-0">
              {upcomingAppointments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Calendar size={40} className="mx-auto mb-2 text-gray-300" />
                  <p>You have no upcoming appointments</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {upcomingAppointments.map((appointment) => (
                    <li key={appointment.id} className="p-4 hover:bg-gray-50">
                      <div className="sm:flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="bg-primary-100 rounded-full p-2 mr-3">
                            <Video size={20} className="text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.doctorName}</p>
                            <p className="text-sm text-gray-600">{appointment.type}</p>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <CalendarIcon size={14} className="mr-1" />
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              <span className="mx-1">•</span>
                              <Clock size={14} className="mr-1" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-0 flex flex-col items-end">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 uppercase">
                            {appointment.status}
                          </span>
                          
                          {appointment.meetingLink && (
                            <a
                              href={appointment.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary btn-sm mt-2"
                            >
                              <Video size={14} className="mr-1" />
                              Join Meeting
                            </a>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Past appointments */}
          <div className="card">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold">Past Consultations</h3>
            </div>
            
            <div className="p-0">
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default Telemedicine;
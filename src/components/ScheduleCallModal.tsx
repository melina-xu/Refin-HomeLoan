import React, { useState } from 'react';
import { X, Calendar, Clock, PhoneCall, CheckCircle2, User, MessageSquare } from 'lucide-react';

interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleCallModal: React.FC<ScheduleCallModalProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 10:30 AM');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    'Today, 4:00 PM',
    'Today, 6:00 PM',
    'Tomorrow, 10:30 AM',
    'Tomorrow, 2:00 PM',
    'Tomorrow, 5:00 PM',
    'Friday, 11:00 AM'
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1e2020] border-2 border-[#444933] w-full max-w-lg p-6 lg:p-10 space-y-6 shadow-2xl text-[#e2e2e2] relative">
        
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 bg-[#121414] border border-[#333535] hover:border-[#c3f400] text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isBooked ? (
          <form onSubmit={handleBooking} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-[#c3f400]" />
                <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] tracking-widest uppercase font-bold">
                  DIRECT COMM LINK
                </span>
              </div>
              <h2 className="font-['Syne'] text-2xl font-bold uppercase text-white">
                Schedule Senior Debt Architect Call
              </h2>
              <p className="font-['Geist'] text-xs text-[#c4c9ac]">
                15-minute quantitative consultation on complex portfolio restructuring, trust assets, or multi-property TDSR optimization.
              </p>
            </div>

            {/* Time Slot Selector */}
            <div className="space-y-2">
              <label className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] uppercase block">
                Select Consultation Window
              </label>
              <div className="grid grid-cols-2 gap-2 font-['JetBrains_Mono'] text-xs">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedDate(slot)}
                    className={`p-3 text-left border transition-all cursor-pointer ${
                      selectedDate === slot
                        ? 'bg-[#c3f400] text-[#161e00] font-bold border-[#c3f400]'
                        : 'bg-[#121414] text-[#e2e2e2] border-[#333535] hover:border-[#444933]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 font-['JetBrains_Mono'] text-xs">
              <div className="space-y-1">
                <label className="text-[#c4c9ac] uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kenneth Tan"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#121414] border border-[#444933] p-2.5 text-white focus:border-[#c3f400] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#c4c9ac] uppercase">Mobile Number (WhatsApp/Call)</label>
                <input
                  type="text"
                  required
                  placeholder="+65 9123 4567"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  className="w-full bg-[#121414] border border-[#444933] p-2.5 text-white focus:border-[#c3f400] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#c3f400] hover:bg-white text-[#161e00] font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Confirm Direct Call Slot</span>
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center py-4">
            <div className="w-14 h-14 bg-[#c3f400] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#161e00]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-['Syne'] text-2xl font-bold uppercase text-white">
                Consultation Scheduled
              </h3>
              <p className="font-['Geist'] text-sm text-[#c4c9ac]">
                Our senior credit architect will ring you at <strong className="text-white">{selectedDate}</strong>.
              </p>
            </div>

            <button
              onClick={() => {
                setIsBooked(false);
                onClose();
              }}
              className="bg-[#c3f400] text-[#161e00] font-['JetBrains_Mono'] text-xs font-bold uppercase px-8 py-3 cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Smartphone, Bell, Heart, Bus, Star, ClipboardCheck, BookOpen, Layers, Send } from 'lucide-react';

type Persona = 'parent' | 'teacher' | 'pupil' | 'admin';

export function MobileSimulator() {
  const [activePersona, setActivePersona] = useState<Persona>('parent');
  
  // simulated notification messages count
  const [unreadCount, setUnreadCount] = useState(3);
  const [smsLogs, setSmsLogs] = useState([
    { id: 'S1', sender: 'Kids Villa', msg: 'Shifra ate her midday porridge soundly. Rhythmic play-based sounds are progressing well.', time: '11:45 AM' },
    { id: 'S2', sender: 'Kids Villa', msg: 'Fees Reminder: High default risk. Please settle the Term 2 balance of UGX 150,000.', time: '09:00 AM' }
  ]);

  const [newSmsMsg, setNewSmsMsg] = useState('');
  
  const handleTriggerSimSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSmsMsg) return;
    const item = {
      id: `S-${Date.now()}`,
      sender: 'Kids Villa Gate',
      msg: newSmsMsg,
      time: 'Just now'
    };
    setSmsLogs([item, ...smsLogs]);
    setNewSmsMsg('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Selector Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E0D8CC]">
        <h3 className="font-extrabold text-[#5A3E2B] text-base flex items-center gap-1.5">
          <Smartphone className="w-5 h-5 text-[#6B8E23]" /> Visual Interactive Mobile Mockup App Simulator
        </h3>
        <p className="text-xs text-[#7D6B5D] leading-relaxed mt-1">
          Kids Villa Academy is fully responsive and supports PWA standard installation on parents' phones. Cycle through mobile views below to see specific interfaces in action:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Options Control panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E0D8CC] space-y-4 h-fit">
          <span className="text-[10px] font-black uppercase text-[#7D6B5D] tracking-wider block">Choose simulator perspective:</span>
          
          <div className="flex flex-col gap-2">
            {[
              { id: 'parent', label: '👨‍👩‍👧 Parent Perspective', subtitle: 'View milestones, pay slips, track GPS shuttle, daily health reports' },
              { id: 'teacher', label: '👩‍🏫 Caregiver Perspective', subtitle: 'Mark biometric porridge, record development scores, AI logs' },
              { id: 'pupil', label: '👶 Pupil Play Companion', subtitle: 'Play-based sorting cards, ear phonics, interactive cartoon stars' },
              { id: 'admin', label: '💼 Admin Overview', subtitle: 'Manage Central Kampala multi-campus cash totals, staff appraisals' }
            ].map((pers) => (
              <button
                key={pers.id}
                onClick={() => setActivePersona(pers.id as Persona)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                  activePersona === pers.id
                    ? 'bg-[#E8F1D7] border-[#6B8E23] text-[#3D2B1F]'
                    : 'bg-white border-transparent text-[#7D6B5D] hover:bg-[#F2EDE4]/40 hover:text-[#3D2B1F]'
                }`}
              >
                <span className="font-bold text-xs">{pers.label}</span>
                <span className="text-[10px] opacity-75 font-medium leading-tight">{pers.subtitle}</span>
              </button>
            ))}
          </div>

          {/* Simulated Bulk SMS broadcasting portal */}
          <div className="border-t border-[#F2EDE4] pt-4 space-y-3">
            <span className="text-[9px] font-black uppercase text-[#8C5A3C] block tracking-widest">Airtel / MTN bulk SMS router</span>
            <form onSubmit={handleTriggerSimSMS} className="space-y-2">
              <input
                type="text"
                placeholder="Broadcast instant SMS to parents' handsets..."
                value={newSmsMsg}
                onChange={(e) => setNewSmsMsg(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FDFBF7] border border-[#E0D8CC] rounded-xl text-[#3D2B1F]"
              />
              <button
                type="submit"
                className="w-full bg-[#8C5A3C] text-white py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1"
              >
                <Send className="w-3 h-3" /> Broadcast SMS
              </button>
            </form>
          </div>
        </div>

        {/* Center: The Phone frame Mockup */}
        <div className="lg:col-span-4 flex justify-center">
          
          <div className="w-72 h-[540px] bg-neutral-900 rounded-[36px] p-3.5 shadow-2xl border-4 border-neutral-800 relative flex flex-col justify-between overflow-hidden select-none">
            
            {/* Phone Speaker Notch */}
            <div className="absolute top-1 left-1/3 w-1/3 h-5 bg-neutral-900 rounded-b-xl z-20 flex justify-center items-end pb-0.5">
              <div className="w-12 h-1 bg-neutral-700 rounded-full" />
            </div>

            {/* Inner Phone Screen */}
            <div className="w-full h-full bg-[#FDFBF7] rounded-[24px] overflow-hidden flex flex-col justify-between relative mt-1 text-xs">
              
              {/* Top phone system bar status */}
              <div className="bg-[#8C5A3C] text-white px-4 py-1.5 flex justify-between items-center text-[9px] font-bold z-10 pt-2 shrink-0">
                <span>Kids Villa Mobile</span>
                <div className="flex gap-1.5">
                  <span>9:41 AM</span>
                  <span>🔋 99%</span>
                </div>
              </div>

              {/* Sub-header of app */}
              <div className="bg-[#8C5A3C] text-white px-4 pb-3 pt-1 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-[#E8F1D7] flex items-center justify-center font-extrabold text-[#7D6B5D] text-xs shadow-xs">KV</div>
                  <div>
                    <h5 className="font-extrabold leading-none text-[11px] uppercase tracking-wide">Kids Villa S.O.W</h5>
                    <span className="text-[8px] text-white/80">Kitemu Nsangi Camp</span>
                  </div>
                </div>

                <div className="relative cursor-pointer">
                  <Bell className="w-4 h-4 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Scrollable Mobile Body perspective content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F2EDE4]/20">
                
                {activePersona === 'parent' && (
                  <div className="space-y-4.5 animate-fadeIn">
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E0D8CC] space-y-1.5 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] bg-[#E8F1D7] text-[#6B8E23] px-2 py-0.5 rounded-full font-bold">MILSTONE LEVEL</span>
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      </div>
                      <h4 className="font-bold text-xs text-[#3D2B1F]">Babirye Shifra (Middle Class)</h4>
                      <p className="text-[10px] text-gray-500 leading-tight">Excellent progress in language sounds. Reading fluency scored <strong>Very Good</strong> by Tr. Martha.</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#E0D8CC] space-y-2">
                      <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#8C5A3C] block">🚗 Shuttle Tracker</span>
                      <div className="flex items-center gap-1.5 text-[#3D2B1F]">
                        <Bus className="w-4 h-4 text-[#6B8E23]" />
                        <div>
                          <strong className="text-[10px] block">Van UBC-401A is approaching</strong>
                          <span className="text-[9px] text-[#7D6B5D] block">Last Stop: Muyenga Post</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#E0D8CC] space-y-1">
                      <span className="text-[8px] uppercase tracking-wider font-extrabold text-blue-600 block">💳 UGX Tuition Balance</span>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-[#3D2B1F]">UGX 150,000</span>
                        <span className="bg-[#F9ECE4] text-[#8C5A3C] text-[8px] font-bold px-2 py-0.5 rounded">Default Risk</span>
                      </div>
                    </div>
                  </div>
                )}

                {activePersona === 'teacher' && (
                  <div className="space-y-4.5 animate-fadeIn">
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E0D8CC] space-y-2">
                      <span className="text-[8px] font-extrabold text-[#6B8E23] uppercase tracking-widest block">📝 HEALTH REGISTER</span>
                      <h4 className="font-bold text-xs text-[#3D2B1F]">Daily Wellness Check</h4>
                      
                      <div className="flex gap-1">
                        <button className="flex-1 bg-[#6B8E23] text-white py-1.1 rounded-lg text-[9px] font-bold">Log Temperature</button>
                        <button className="flex-1 bg-[#F2EDE4] text-[#3D2B1F] py-1.1 rounded-lg text-[9px] font-bold">Check First Aid</button>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#E0D8CC] space-y-1.5">
                      <span className="text-[8px] font-extrabold text-[#8C5A3C] uppercase tracking-widest block">⭐ Daily Merit stamps</span>
                      <p className="text-[10px] text-[#7D6B5D]">Acknowledge active helpful behaviors instantly on the playground floor:</p>
                      <button className="w-full bg-[#8C5A3C] text-white py-1 rounded text-[10px] font-extrabold">+ Give 10 Stars</button>
                    </div>
                  </div>
                )}

                {activePersona === 'pupil' && (
                  <div className="space-y-4 text-center py-4 animate-fadeIn">
                    <div className="w-16 h-16 bg-[#E8F1D7] rounded-full mx-auto flex items-center justify-center border-2 border-dashed border-[#6B8E23]">
                      <Star className="w-8 h-8 text-[#6B8E23] fill-[#6B8E23] animate-bounce" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[#3D2B1F] text-base">Oli bulungi child!</h4>
                      <p className="text-[10px] text-[#7D6B5D] leading-tight">You have earned <strong>140 Star coins</strong> today! Click card companion levels below to explore sound matching games:</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-800">🍎 Apple Sound matching</div>
                      <div className="p-2 bg-blue-50 rounded-xl border border-blue-200 text-xs font-bold text-blue-800">🦒 Zoo Sorting game</div>
                    </div>
                  </div>
                )}

                {activePersona === 'admin' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E0D8CC] text-center space-y-1.5">
                      <span className="text-[8px] font-extrabold text-[#8C5A3C] uppercase tracking-wider block">Total Kampala Cash Receipts</span>
                      <h3 className="text-xl font-black text-[#3D2B1F]">UGX 14,250,000</h3>
                      <p className="text-[9px] text-[#6B8E23] font-bold">100% Mobile Money reconciled via backend queues</p>
                    </div>

                    <div className="bg-[#8C5A3C]/10 text-[#8C5A3C] p-3 rounded-xl text-[9px] font-bold leading-tight">
                      * Weekly HR payroll and Caregiver attendance records are synced securely with district registries in Wakiso.
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom System Navigation Bar */}
              <div className="bg-white border-t border-[#E0D8CC] px-4 py-2 flex justify-between items-center text-center text-gray-400 text-[8px] font-bold shrink-0">
                <div className="flex flex-col items-center justify-center gap-0.5 text-[#8C5A3C]">
                  <ClipboardCheck className="w-3.5 h-3.5 text-[#8C5A3C]" />
                  <span>Dashboard</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Exams</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <Star className="w-3.5 h-3.5" />
                  <span>Merits</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Multi-Camp</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Right Side: Simulated Client SMS Log alerts */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E0D8CC] p-5 space-y-4 h-fit">
          <div className="flex items-center gap-1 text-[#8C5A3C]">
            <Bell className="w-4 h-4 text-[#8C5A3C]" />
            <h4 className="font-extrabold text-xs uppercase tracking-wider">Parents Handset Real SMS triggers</h4>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {smsLogs.map(log => (
              <div key={log.id} className="p-3 bg-[#FDFBF7] rounded-xl border border-gray-100 text-xs text-slate-700 leading-normal animate-fadeIn font-medium">
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1">
                  <span>To: Parent {log.sender}</span>
                  <span>{log.time}</span>
                </div>
                <p>{log.msg}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#F2EDE4]/40 p-3 rounded-2xl text-[9px] font-bold text-[#7D6B5D] text-center">
            * Mobile money payment confirmations and sickbay emergencies are instantly logged here.
          </div>
        </div>

      </div>

    </div>
  );
}

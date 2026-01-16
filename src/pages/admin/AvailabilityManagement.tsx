import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Clock, CheckCircle, XCircle, Calendar as CalendarIcon, Save, RotateCcw, Copy, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import api from '@/config/api';
import { cn } from '@/lib/utils';

const ALL_TIME_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];

const AvailabilityManagement = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([...ALL_TIME_SLOTS]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [notes, setNotes] = useState('');
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyTargetDates, setCopyTargetDates] = useState<Date[]>([]);

  // Get availability for selected date
  const { data: availability, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ['availability', selectedDate],
    queryFn: async () => {
      if (!selectedDate) return null;
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const response = await api.get(`/api/availability/check?date=${dateString}`);
      return response.data.data;
    },
    enabled: !!selectedDate,
  });

  // Update availability when data is loaded
  useEffect(() => {
    if (availability) {
      setSelectedSlots(availability.availableSlots || [...ALL_TIME_SLOTS]);
      setIsBlocked(availability.isBlocked || false);
      setNotes(availability.notes || '');
    } else {
      setSelectedSlots([...ALL_TIME_SLOTS]);
      setIsBlocked(false);
      setNotes('');
    }
  }, [availability, selectedDate]);

  // Mutation to save availability
  const saveMutation = useMutation({
    mutationFn: async () => {
      const dateString = format(selectedDate!, 'yyyy-MM-dd');
      const response = await api.post('/api/availability', {
        date: dateString,
        timeSlots: selectedSlots,
        isBlocked,
        notes,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Availability updated successfully');
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update availability');
    },
  });

  // Mutation to reset availability
  const resetMutation = useMutation({
    mutationFn: async () => {
      const dateString = format(selectedDate!, 'yyyy-MM-dd');
      const response = await api.post('/api/availability/reset', {
        date: dateString,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Availability reset to default (all slots available)');
      setSelectedSlots([...ALL_TIME_SLOTS]);
      setIsBlocked(false);
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset availability');
    },
  });

  // Mutation to copy availability
  const copyMutation = useMutation({
    mutationFn: async () => {
      const sourceDate = format(selectedDate!, 'yyyy-MM-dd');
      const targetDates = copyTargetDates.map(date => format(date, 'yyyy-MM-dd'));
      const response = await api.post('/api/availability/copy', {
        sourceDate,
        targetDates,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setShowCopyModal(false);
      setCopyTargetDates([]);
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to copy availability');
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const toggleSlot = (slot: string) => {
    if (isBlocked) return; // Can't toggle slots if entire day is blocked

    setSelectedSlots(prev => {
      if (prev.includes(slot)) {
        return prev.filter(s => s !== slot);
      } else {
        return [...prev, slot].sort((a, b) => {
          return ALL_TIME_SLOTS.indexOf(a) - ALL_TIME_SLOTS.indexOf(b);
        });
      }
    });
  };

  const toggleBlockDay = () => {
    setIsBlocked(!isBlocked);
    if (!isBlocked) {
      setSelectedSlots([]);
    } else {
      setSelectedSlots([...ALL_TIME_SLOTS]);
    }
  };

  const handleSave = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    saveMutation.mutate();
  };

  const handleReset = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (confirm('Are you sure you want to reset availability for this date to default (all slots available)?')) {
      resetMutation.mutate();
    }
  };

  const handleCopyClick = () => {
    if (!selectedDate) {
      toast.error('Please select a source date first');
      return;
    }
    setShowCopyModal(true);
  };

  const handleCopyConfirm = () => {
    if (copyTargetDates.length === 0) {
      toast.error('Please select at least one target date');
      return;
    }
    copyMutation.mutate();
  };

  const handleCopyDateToggle = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

    // Don't allow selecting the source date
    if (dateString === selectedDateString) {
      toast.error('Cannot copy to the same date');
      return;
    }

    setCopyTargetDates(prev => {
      const exists = prev.find(d => format(d, 'yyyy-MM-dd') === dateString);
      if (exists) {
        return prev.filter(d => format(d, 'yyyy-MM-dd') !== dateString);
      } else {
        return [...prev, date];
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Meeting Availability</h1>
        <p className="font-body text-muted-foreground">
          Manage which time slots are available for meeting bookings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Selection */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Select Date
          </h2>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-xl border border-border bg-background p-4"
              classNames={{
                day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
              }}
            />
          </div>
          {selectedDate && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
              <p className="font-body text-sm font-medium text-primary">
                Configuring: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          )}
        </div>

        {/* Time Slots Configuration */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Configure Time Slots
          </h2>

          {isLoadingAvailability ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Block entire day toggle */}
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <Label className="font-medium">Block Entire Day</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    No meetings will be available on this date
                  </p>
                </div>
                <button
                  onClick={toggleBlockDay}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    isBlocked ? 'bg-red-500' : 'bg-gray-300'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      isBlocked ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>

              {/* Time slots */}
              {!isBlocked && (
                <>
                  <div>
                    <Label className="mb-2 block">Available Time Slots</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Click to toggle availability
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_TIME_SLOTS.map((slot) => {
                        const isAvailable = selectedSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            onClick={() => toggleSlot(slot)}
                            className={cn(
                              'px-4 py-3 rounded-lg font-body text-sm font-medium border transition-all duration-200 flex items-center justify-between',
                              isAvailable
                                ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300'
                                : 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300'
                            )}
                          >
                            <span>{slot}</span>
                            {isAvailable ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this date (e.g., 'Holiday', 'Out of office', etc.)"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </>
              )}

              {isBlocked && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                  <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <p className="font-medium text-red-700 dark:text-red-300">
                    This entire day is blocked
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No meetings can be scheduled on this date
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={!selectedDate || saveMutation.isPending}
                    className="flex-1 gap-2"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Configuration
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={!selectedDate || resetMutation.isPending}
                    className="gap-2"
                  >
                    {resetMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Reset
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleCopyClick}
                  disabled={!selectedDate}
                  className="w-full gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy to Other Dates
                </Button>
              </div>

              {/* Summary */}
              <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                <h3 className="font-medium text-sm">Summary:</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  {isBlocked ? (
                    <p>✋ Entire day blocked - no meetings available</p>
                  ) : (
                    <>
                      <p>
                        ✅ {selectedSlots.length} of {ALL_TIME_SLOTS.length} slots available
                      </p>
                      {selectedSlots.length < ALL_TIME_SLOTS.length && (
                        <p>
                          ❌ {ALL_TIME_SLOTS.length - selectedSlots.length} slots blocked
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="font-display font-bold text-blue-700 dark:text-blue-300 mb-2">
          How it works
        </h3>
        <ul className="font-body text-sm text-blue-600 dark:text-blue-400 space-y-2">
          <li>• Select a date from the calendar</li>
          <li>• Toggle time slots to mark them as available (green) or unavailable (red)</li>
          <li>• Or block the entire day if you're completely unavailable</li>
          <li>• Click "Save Configuration" to apply your changes</li>
          <li>• Click "Copy to Other Dates" to apply the same configuration to multiple dates</li>
          <li>• Users will only see available slots when booking meetings</li>
          <li>• Click "Reset" to restore all slots to available for that date</li>
        </ul>
      </div>

      {/* Copy Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="font-display text-2xl font-bold">Copy Availability</h2>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Select dates to copy the configuration from{' '}
                  <span className="font-medium text-primary">
                    {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCopyModal(false);
                  setCopyTargetDates([]);
                }}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Source Configuration Summary */}
              <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                <h3 className="font-medium text-sm mb-3">Configuration to Copy:</h3>
                <div className="space-y-2 text-sm">
                  {isBlocked ? (
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      🚫 Entire day blocked
                    </p>
                  ) : (
                    <>
                      <p className="text-muted-foreground">
                        ✅ Available slots: {selectedSlots.length} of {ALL_TIME_SLOTS.length}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedSlots.map(slot => (
                          <span
                            key={slot}
                            className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-300 rounded text-xs font-medium"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  {notes && (
                    <p className="text-xs text-muted-foreground mt-2">
                      📝 Notes: {notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <Label className="mb-3 block">
                  Select Target Dates ({copyTargetDates.length} selected)
                </Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="multiple"
                    selected={copyTargetDates}
                    onSelect={(dates) => {
                      if (!dates) {
                        setCopyTargetDates([]);
                        return;
                      }
                      // Filter out the source date
                      const filteredDates = (Array.isArray(dates) ? dates : [dates]).filter(
                        (date) => {
                          const dateString = format(date, 'yyyy-MM-dd');
                          const sourceString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
                          return dateString !== sourceString;
                        }
                      );
                      setCopyTargetDates(filteredDates);
                    }}
                    className="rounded-xl border border-border bg-background p-4"
                    classNames={{
                      day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                      day_today: 'bg-accent text-accent-foreground',
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Click on multiple dates to select them
                </p>
              </div>

              {/* Selected Dates List */}
              {copyTargetDates.length > 0 && (
                <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                  <h3 className="font-medium text-sm mb-2">Selected Dates:</h3>
                  <div className="flex flex-wrap gap-2">
                    {copyTargetDates
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((date, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                          {format(date, 'MMM d, yyyy')}
                          <button
                            onClick={() => handleCopyDateToggle(date)}
                            className="hover:bg-primary/30 rounded p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCopyModal(false);
                  setCopyTargetDates([]);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCopyConfirm}
                disabled={copyTargetDates.length === 0 || copyMutation.isPending}
                className="gap-2"
              >
                {copyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Copying...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy to {copyTargetDates.length} Date{copyTargetDates.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManagement;

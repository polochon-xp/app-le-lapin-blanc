import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const CalendarPanel = ({ 
  selectedDate, 
  onDateSelect, 
  currentTheme, 
  isOpen, 
  onClose,
  missions = [] 
}) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent pour compléter la première semaine
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // Jours du mois suivant pour compléter la dernière semaine
    while (days.length < 42) { // 6 semaines * 7 jours
      const nextDate = new Date(year, month + 1, days.length - daysInMonth - startingDayOfWeek + 1);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const hasMissions = (date) => {
    return missions.some(mission => {
      if (mission.type === 'daily') return true;
      if (mission.type === 'weekly') {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return dayNames[date.getDay()] === mission.weekDay;
      }
      if (mission.type === 'once' && mission.specificDate) {
        return isSameDay(new Date(mission.specificDate), date);
      }
      return false;
    });
  };

  const goToPreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    onDateSelect(date);
    onClose();
  };

  if (!isOpen) return null;

  const calendarDays = getDaysInMonth(viewDate);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card 
        className="w-full max-w-sm border-0 bg-black/95 backdrop-blur-sm"
        style={{ backgroundColor: currentTheme.cardColor + 'F0' }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0"
              style={{ color: currentTheme.textColor }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <CardTitle 
              className="text-lg font-bold"
              style={{ color: currentTheme.primaryColor }}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </CardTitle>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
              style={{ color: currentTheme.textColor }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(day => (
              <div key={day} className="text-center text-xs font-medium py-2 text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ date, isCurrentMonth }, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleDateClick(date)}
                disabled={!isCurrentMonth}
                className={`
                  h-8 w-8 p-0 text-xs relative
                  ${isCurrentMonth ? 'hover:bg-white/10' : 'opacity-30'}
                  ${isSameDay(date, selectedDate) ? 'ring-2' : ''}
                  ${isToday(date) ? 'font-bold' : ''}
                `}
                style={{
                  color: isCurrentMonth ? currentTheme.textColor : currentTheme.textColor + '40',
                  ringColor: isSameDay(date, selectedDate) ? currentTheme.primaryColor : 'transparent',
                  backgroundColor: isToday(date) ? currentTheme.primaryColor + '20' : 'transparent'
                }}
              >
                {date.getDate()}
                {/* Indicateur de missions */}
                {isCurrentMonth && hasMissions(date) && (
                  <div 
                    className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  />
                )}
              </Button>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateClick(new Date())}
              className="flex-1 border-0 text-xs"
              style={{
                backgroundColor: currentTheme.primaryColor + '20',
                color: currentTheme.primaryColor
              }}
            >
              Aujourd'hui
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 border-0 text-xs"
              style={{
                backgroundColor: 'transparent',
                color: currentTheme.textColor,
                borderColor: currentTheme.accentColor + '40'
              }}
            >
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPanel;
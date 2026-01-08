export interface CalendarProps {
  showDetailsHandle: (dayStr: string) => void;
  currentWeek: string[];
  setCurrentWeek: (week: string[]) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  setState: (value: boolean) => void;
}

/* eslint-disable react/prop-types */

const DayNamePicker = ({ selectedDays, onDayChange }) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleDayClick = (day) => {
    if (selectedDays.includes(day)) {
      onDayChange(selectedDays.filter((selectedDay) => selectedDay !== day));
    } else {
      onDayChange([...selectedDays, day]);
    }
  };

  return (
    <div className="create-tour-day-name-picker">
      {days.map((day) => (
        <div
          key={day}
          className={
            selectedDays.includes(day)
              ? "create-tour-day-name selected"
              : "create-tour-day-name"
          }
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      ))}
    </div>
  );
};
export default DayNamePicker
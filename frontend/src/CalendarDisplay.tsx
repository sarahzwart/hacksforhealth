import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar'; // Import Datepicker component if it's defined in a separate file
import 'react-calendar/dist/Calendar.css'; // Import Calendar styles

function CalendarDisplay() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Set initial state to null
    const [mood, setMood] = useState<{ [date: string]: string }>({});

    const handleDateChange: CalendarProps['onChange'] = (date) => {
        setSelectedDate(date as Date); // Ensure date is of type Date
    };

    const handleMoodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedDate) {
            const dateString = selectedDate.toISOString().slice(0, 10);
            setMood({ ...mood, [dateString]: event.target.value });
        }
    };

    const getTileContent = ({ date }: { date: Date }) => {
        const dateString = date.toISOString().slice(0, 10);
        if (mood[dateString] === 'sad') {
            return <span role="img" aria-label="sad-face">😞</span>;
        } else if (mood[dateString] === 'happy') {
            return <span role="img" aria-label="happy-face">😊</span>;
        } 
        return null;
    };

    return (
        <div>
            <input type="text" value={selectedDate ? mood[selectedDate.toISOString().slice(0, 10)] || '' : ''} onChange={handleMoodChange} placeholder="Enter your mood" />
            <h1></h1>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={getTileContent}
            />
        </div>
    );
}

export default CalendarDisplay;

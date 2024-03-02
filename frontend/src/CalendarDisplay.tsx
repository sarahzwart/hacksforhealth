import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

enum Mood {
  Happy = "😊",
  Sad = "😞",
  Angry = "😡",
  Confused = "😕",
}

function CalendarDisplay() {
  const [mood, setMood] = useState<{ [date: string]: Mood | null }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleMoodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!mood[selectedDate.toISOString().slice(0, 10)]) {
      setMood({
        ...mood,
        [selectedDate.toISOString().slice(0, 10)]: event.target.value as Mood,
      });
    }
  };

  const handlePage = async () => {
    try {
      const response = await axios.get("http://localhost:5000/", {});
      console.log(response.data);
      // Handle successful response here
    } catch (error) {
      console.error("An error occurred:", error);
      // Optionally, you can handle errors here or leave it empty
    }
  };

  const handleTileClick = (date: Date) => {
    if (date <= new Date()) {
      setSelectedDate(date);
    }
  };

  const getTileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().slice(0, 10);
    return mood[dateString] ? "big-emoji" : "";
  };

  const getTileContent = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().slice(0, 10);
    return mood[dateString] ? (
      <span className="big-emoji" role="img" aria-label="emoji">
        {mood[dateString]}
      </span>
    ) : null;
  };

  const calculateHighestEmoji = () => {
    const emojiCounts: { [monthYear: string]: { [emoji in Mood]: number } } =
      {};
    const highestEmojiPerMonth: { [monthYear: string]: Mood | null } = {};

    for (const dateString in mood) {
      if (mood[dateString]) {
        const date = new Date(dateString);
        const monthName = date.toLocaleString("default", { month: "long" }); // Get month name

        const monthYear = `${monthName}/${date.getFullYear()}`; // Use month name instead of number

        if (!emojiCounts[monthYear]) {
          emojiCounts[monthYear] = {
            [Mood.Happy]: 0,
            [Mood.Sad]: 0,
            [Mood.Angry]: 0,
            [Mood.Confused]: 0,
          };
        }

        const emoji = mood[dateString];
        if (emoji !== null) {
          emojiCounts[monthYear][emoji]++;
        }
      }
    }

    for (const monthYear in emojiCounts) {
      const highestEmoji = Object.keys(
        emojiCounts[monthYear] as { [emoji in Mood]: number }
      ).reduce((a, b) =>
        emojiCounts[monthYear][a as Mood] > emojiCounts[monthYear][b as Mood]
          ? (a as Mood)
          : (b as Mood)
      );
      highestEmojiPerMonth[monthYear] = highestEmoji as Mood | null;
    }

    return highestEmojiPerMonth;
  };

  const highestEmojiPerMonth = calculateHighestEmoji();

  return (
    <div>
      <button onClick={handlePage}>button</button>
      <select
        value={mood[selectedDate.toISOString().slice(0, 10)] || ""}
        onChange={handleMoodChange}>
        <option value="">Select Mood</option>
        <option value={Mood.Happy}>Happy</option>
        <option value={Mood.Sad}>Sad</option>
        <option value={Mood.Angry}>Angry</option>
        <option value={Mood.Confused}>Confused</option>
      </select>
      <Calendar
        tileClassName={getTileClassName}
        tileContent={getTileContent}
        onClickDay={handleTileClick}
        value={selectedDate}
      />
      <div>
        <h2>Highest Emoji per Month</h2>
        <ul>
          {Object.entries(highestEmojiPerMonth).map(([monthYear, emoji]) => (
            <h3 key={monthYear}>
              {monthYear}: {emoji || "No data"}
            </h3>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarDisplay;

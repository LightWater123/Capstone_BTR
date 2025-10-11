import React from 'react';

export default function RemindersPanel({ events }) {
  return (
    <div className="w-full min-w-[300px] h-[350px] bg-gray-100 rounded-xl shadow-md p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Reminders</h2>
      <ul className="flex-1 overflow-y-auto space-y-2">
        {events.length === 0 ? (
          <li className="text-gray-500">No reminders yet.</li>
        ) : (
          events.map((event, index) => (
            <li key={index} className="bg-white p-2 rounded shadow-sm">
              <div className="font-semibold">{event.title}</div>
              <div className="text-sm text-gray-600">
                {event.date} | {event.startTime} – {event.endTime}
              </div>
              <div className="text-sm text-gray-500">{event.location}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

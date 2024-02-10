'use client'
import React, { useState } from 'react';

export default function YourShowsStatuses() {
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const statuses = ['Watching', 'Completed', 'Plan to Watch'];

  return (
    <div>
      {statuses.map((status) => (
        <button
          key={status}
          className={`p-1 mx-1 bg-blue-500 ${selectedStatus === status ? 'selected' : ''}`}
          onClick={() => handleStatusChange(status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
};
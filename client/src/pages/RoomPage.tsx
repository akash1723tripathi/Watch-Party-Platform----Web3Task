import React from 'react';
import { useParams } from 'react-router-dom';

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">RoomPage: {roomId}</h1>
    </div>
  );
};

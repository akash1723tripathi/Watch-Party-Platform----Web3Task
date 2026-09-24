import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { RoomPage } from '../pages/RoomPage';
import { LoginPage } from '../pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/room/:roomId',
    element: <RoomPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { HomePage } from '@/pages/Home';
import { AuthPage } from '@/pages/Auth';
import { Layout } from '@/app/layouts';
import ProtectedRoute from './ProtectedRoute';
import { routerOptions } from './config';
import { LoadingCharacter } from '@/shared/ui';

const LivePage = lazy(() => import('@/pages/Live'));
const BroadcastPage = lazy(() => import('@/pages/Broadcast'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const RecordPage = lazy(() => import('@/pages/Record'));

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '',
          element: <HomePage />,
        },
        {
          path: 'live/:liveId',
          element: (
            <Suspense fallback={<LoadingCharacter />}>
              <LivePage />
            </Suspense>
          ),
        },
        {
          path: 'auth',
          element: <AuthPage />,
        },
        {
          path: '',
          element: <ProtectedRoute />,
          children: [
            {
              path: 'profile',
              element: (
                <Suspense fallback={<LoadingCharacter />}>
                  <ProfilePage />
                </Suspense>
              ),
            },
            {
              path: 'record/:attendanceId',
              element: (
                <Suspense fallback={<LoadingCharacter />}>
                  <RecordPage />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    {
      path: 'broadcast',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: (
            <Suspense fallback={<LoadingCharacter />}>
              <BroadcastPage />
            </Suspense>
          ),
        },
      ],
    },
  ],
  routerOptions,
);

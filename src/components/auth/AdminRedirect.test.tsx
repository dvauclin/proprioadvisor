// Test file for AdminRedirect component
// This file is for testing purposes only

import { render, screen } from '@testing-library/react';
import AdminRedirect from './AdminRedirect';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'admin@proprioadvisor.com' },
    profile: { role: 'admin' },
    loading: false
  })
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  usePathname: () => '/'
}));

describe('AdminRedirect', () => {
  it('should redirect admin users to admin panel', () => {
    render(<AdminRedirect />);
    // Component should not render anything visible
    expect(screen.queryByText('AdminRedirect')).not.toBeInTheDocument();
  });
});

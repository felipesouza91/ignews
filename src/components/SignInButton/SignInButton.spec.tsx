import { render, screen } from '@testing-library/react';
import SignInButton from '.';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';

jest.mock('next-auth/client');

describe('SignInButton component', () => {
  it('rendes correctly when user is not authenticated', () => {
    const useSessionMocket = mocked(useSession);
    useSessionMocket.mockReturnValueOnce([null, false]);
    render(<SignInButton />);
    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
  });
  it('rendes correctly when user is authenticated', () => {
    const useSessionMocket = mocked(useSession);
    useSessionMocket.mockReturnValueOnce([
      {
        user: { name: 'User name', email: 'username@mail.com' },
        expires: 'fake-value',
      },

      false,
    ]);
    render(<SignInButton />);
    expect(screen.getByText('User name')).toBeInTheDocument();
  });
});

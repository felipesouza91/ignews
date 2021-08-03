import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import SubscribeButton from '.';

jest.mock('next-auth/client');

jest.mock('next/router');

describe('SubscribeButton component', () => {
  it('rendes correctly', () => {
    mocked(useSession).mockReturnValueOnce([null, false]);
    render(<SubscribeButton />);
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });
  it('redirects user to sign in when not authenticated', () => {
    mocked(useSession).mockReturnValueOnce([null, false]);
    const signInSpyt = mocked(signIn);
    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);
    expect(signInSpyt).toHaveBeenCalled();
  });
  it('redirects user to post when user', () => {
    const useRouterMock = mocked(useRouter);
    const pushMocket = jest.fn();
    const useSessionMocket = mocked(useSession);
    useSessionMocket.mockReturnValueOnce([
      {
        user: { name: 'User name', email: 'username@mail.com' },
        activeSubscription: 'fakse-active',
        expires: 'fake-value',
      },
      false,
    ]);
    useRouterMock.mockReturnValueOnce({ push: pushMocket } as any);
    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);
    expect(pushMocket).toHaveBeenLastCalledWith('/posts');
  });
});

import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';
jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false],
  };
});

jest.mock('../../services/stripe');

describe('Home Page Spec', () => {
  it('render Correctly', async () => {
    render(<Home product={{ priceId: 'anydy', amount: 'R$ 100,00' }} />);
    expect(screen.getByText('for R$ 100,00 month')).toBeInTheDocument();
  });

  it('loads initials data', async () => {
    const retriveStripesMock = mocked(stripe.prices.retrieve);
    retriveStripesMock.mockResolvedValueOnce({
      id: 'anyId',
      unit_amount: 1000,
    } as any);
    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'anyId',
            amount: '$10.00',
          },
        },
      })
    );
  });
});

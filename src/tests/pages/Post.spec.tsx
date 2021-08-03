import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getSession } from 'next-auth/client';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';
const post = {
  slug: 'any-post-info',
  title: 'any-post-title-info',
  content: '<p>any-post-excerpt-info</p>',
  updatedAt: 'any-post-updateAt-info',
};

jest.mock('../../services/prismic');
jest.mock('next-auth/client');

describe('Post Page Spec', () => {
  it('render correctly ', () => {
    render(<Post post={post} />);
    expect(screen.getByText('any-post-title-info')).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMock = mocked(getSession);
    getSessionMock.mockResolvedValueOnce({});
    const response = await getServerSideProps({
      req: { cookies: {} },
      params: { slug: 'anyId' },
    } as any);
    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false,
        },
      })
    );
  });

  it('load initial data', async () => {
    const getSessionMock = mocked(getSession);
    getSessionMock.mockResolvedValueOnce({ activeSubscription: 'true' });
    const getPrismicClientMock = mocked(getPrismicClient);
    getPrismicClientMock.mockReturnValue({
      getByUID: jest.fn().mockResolvedValueOnce({
        uid: 'my-new-post',
        data: {
          title: [
            {
              type: 'heading',
              text: 'My new post title',
            },
          ],
          content: [{ type: 'paragraph', text: 'any content' }],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any);
    const response = await getServerSideProps({
      req: { cookies: {} },
      params: { slug: 'my-new-post' },
    } as any);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post title',
            content: '<p>any content</p>',
            updatedAt: '2021 M04 01',
          },
        },
      })
    );
  });
});

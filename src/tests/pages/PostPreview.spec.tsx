import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getSession, useSession } from 'next-auth/client';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';
import { useRouter } from 'next/router';
const post = {
  slug: 'any-post-info',
  title: 'any-post-title-info',
  content: '<p>any-post-excerpt-info</p>',
  updatedAt: 'any-post-updateAt-info',
};

jest.mock('../../services/prismic');
jest.mock('next/router');
jest.mock('next-auth/client');

describe('Post Preview Page Spec', () => {
  it('render correctly ', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<PostPreview post={post} />);
    expect(screen.getByText('any-post-title-info')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading ?')).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: 'User name', email: 'username@mail.com' },
        activeSubscription: 'fake-active',
        expires: 'fake-value',
      },
      false,
    ]);
    const useRouterMock = mocked(useRouter);
    const pushMocket = jest.fn();
    useRouterMock.mockReturnValueOnce({ push: pushMocket } as any);
    render(<PostPreview post={post} />);
    expect(pushMocket).toHaveBeenLastCalledWith(`/posts/${post.slug}`);
  });

  it('load initial data', async () => {
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
    const response = await getStaticProps({
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

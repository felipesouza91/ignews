import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';
const posts = [
  {
    slug: 'any-post-info',
    title: 'any-post-title-info',
    excerpt: 'any-post-excerpt-info',
    updatedAt: 'any-post-updateAt-info',
  },
  {
    slug: 'any-post-info2',
    title: 'any-post-info2-info2',
    excerpt: 'any-post-excerpt-info2',
    updatedAt: 'any-post-updateAt-info2',
  },
  {
    slug: 'any-post-info3',
    title: 'any-post-info2-info3',
    excerpt: 'any-post-excerpt-info3',
    updatedAt: 'any-post-updateAt-info3',
  },
];

jest.mock('../../services/prismic');

describe('Posts Page Spec', () => {
  it('render correctly ', () => {
    render(<Posts posts={posts} />);
    expect(screen.getByText('any-post-info2-info2')).toBeInTheDocument();
  });

  it('loads initials data', async () => {
    const getPrismicClientMock = mocked(getPrismicClient);
    getPrismicClientMock.mockReturnValue({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
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
          },
        ],
      }),
    } as any);
    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My new post title',
              excerpt: 'any content',
              updatedAt: '2021 M04 01',
            },
          ],
        },
      })
    );
  });
});

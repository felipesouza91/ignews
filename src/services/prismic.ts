import Prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMIC_APP_URL, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
  return prismic;
}

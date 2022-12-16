import _Head from 'next/head';

interface Props {
  title: string;
  description: string;
}

const TITLE = 'Ecoverse';

Head.defaultProps = {
  title: TITLE,
  description: 'Helping the environment one tile at a time',
};

export default function Head({ title, description }: Props) {
  const subTitle = title ? `: ${title}` : '';
  const titleToDisplay = `${TITLE}${subTitle}`;
  return (
    <_Head>
      <title>{titleToDisplay}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Ecoverse, Earth, Tiles" />
      <meta name="author" content="BalloonBox" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </_Head>
  );
}

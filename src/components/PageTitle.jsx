import { Helmet } from 'react-helmet-async';

const PageTitle = ({ title }) => {
  const defaultTitle = 'EGE Organic - Everything Green Everywhere';
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta property="og:title" content={fullTitle} />
    </Helmet>
  );
};

export default PageTitle;

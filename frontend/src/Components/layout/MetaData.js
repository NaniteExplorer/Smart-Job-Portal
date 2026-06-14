import { Helmet } from "react-helmet";

const MetaData = ({ title, description }) => (
  <Helmet>
    <title>{title ? `${title} · NexHire` : "NexHire"}</title>
    {description && <meta name="description" content={description} />}
  </Helmet>
);

export default MetaData;

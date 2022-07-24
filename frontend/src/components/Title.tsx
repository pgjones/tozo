import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet-async";

interface IProps {
  title: string;
}

const Title = ({ title }: IProps) => (
  <>
    <Helmet>
      <title>Tozo | {title}</title>
    </Helmet>
    <Typography component="h1" variant="h5">
      {title}
    </Typography>
  </>
);

export default Title;

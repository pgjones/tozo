import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

const Error = () => (
  <Container maxWidth="sm">
    <Alert severity="error" sx={{ marginTop: 2 }}>
      <AlertTitle>Error</AlertTitle>
      Sorry, something has gone wrong. Please try reloading the page or click{" "}
      <Link href="/">here</Link>.
    </Alert>
  </Container>
);

export default Error;

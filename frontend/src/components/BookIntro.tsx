import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const BookIntro = () => (
  <Card sx={{ marginTop: 4 }}>
    <CardMedia
      component="img"
      height="140"
      image="/static/Cover.jpg"
      sx={{ objectFit: "contain" }}
      alt="The book cover"
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        A Blueprint for Production-Ready Web Applications
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This app is the working version as built following "A Blueprint for
        Production-Ready Web Applications". Both the book and the code are
        available via the links below.
      </Typography>
    </CardContent>
    <CardActions>
      <Button
        size="small"
        href="https://www.packtpub.com/product/blueprint-for-production-ready-web-development/9781803248509"
      >
        Read book
      </Button>
      <Button size="small" href="https://github.com/pgjones/tozo">
        View code
      </Button>
    </CardActions>
  </Card>
);

export default BookIntro;

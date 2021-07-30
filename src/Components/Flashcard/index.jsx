import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function Flashcard(props) {

  const { word, formatMeaningsFunction, error, loading, facingWord, flipCardFunc } = props;


  const getFlashcard = () => {
    if (loading) {
      return (
        <CardContent>
          <Typography className="App-flash-card-loading-header" variant="h5" component="h2">
            Loading...
          </Typography>
          <CircularProgress />
        </CardContent>
      );
    } else if (error !== null) {
      return (
        <CardContent>
          <Typography className="App-flash-card-error-header" variant="h5" component="h2">
            Error
          </Typography>
          <Typography className="App-flash-card-error-message" variant="body2" component="p">
            {error}
          </Typography>
        </CardContent>
      );
    } else {
      const wordToDisplay = (word !== null) ? word : "Add words to start using flashcards!";
      const definitionsToDisplay = (word !== null) ? formatMeaningsFunction() : null;
      return (
        <div className="App-flash-card-entry">
          <div>
            {(() => {
              if (facingWord) {
                return (
                  <CardContent>
                    <Typography className="App-flash-card-word" variant="h5" component="h2">
                      {wordToDisplay}
                    </Typography>
                  </CardContent>
                );
              } else {
                return (
                  <CardContent>
                    <Typography className="App-flash-card-word" variant="h5" component="h2">
                      {wordToDisplay}
                    </Typography>
                    <div className="App-flash-card-meanings">
                      {definitionsToDisplay}
                    </div>
                  </CardContent>
                );
              }
            })()}
          </div>
          <CardActions>
            <Button
              variant="outlined"
              size="small"
              onClick={() => flipCardFunc()}
              style={{position: "fixed", top: "465px", left: "25px"}}
            >
              Flip
            </Button>
          </CardActions>
        </div>
      );
    }
  }

  return (
    <Card className="App-flash-card" style={{width: "750px", height: "500px", margin: "10px"}}>
      {getFlashcard()}
    </Card>
  )
}
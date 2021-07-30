import React from "react";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";

async function getWordDefinition(word) {
  const apiRequest = "https://api.dictionaryapi.dev/api/v2/entries/en_US/" + word;
  return fetch(apiRequest)
    .then(response => {
      return response.json();
    })
}

function isOnlyAlphaAndSpaces(str) {
  for (const char of str) {
    if (!(/[a-zA-Z]/.test(char) | char === " ")) {
      return false;
    }
  }

  return true;
}

function WordList(props) {

  const { words } = props;

  return (
    <List
      className="App-word-list"
      component="nav"
    >
      {words.map((word, id) => {
        return (
          <ListItem key={id}>
            <ListItemText primary={word} />
          </ListItem>
        )})}
    </List>
  )
}

function Flashcard(props) {

  const { word, meanings, error, loading } = props;

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
      return (
        <div className="App-flash-card-entry">
          <CardContent>
            <Typography className="App-flash-card-word" variant="h5" component="h2">
              {wordToDisplay}
            </Typography>
            <Typography className="App-flash-card-meanings" variant="body2" component="p">
              {meanings}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Flip</Button>
          </CardActions>
        </div>
      );
    }
  }

  return (
    <Card className="App-flash-card">
      {getFlashcard()}
    </Card>
  )
}

function App() {

  const [newWordField, setNewWordField] = React.useState("Hello");
  const [newWordFieldError, setNewWorldFieldError] = React.useState({
    error: false,
    errorMessage: null
  });
  const [wordList, setWordList] = React.useState([]);
  const [selectedWord, setSelectedWord] = React.useState(null);
  const [selectedWordDefinition, setSelectedWordDefinition] = React.useState(null);
  const [selectedWordError, setSelectedWordError] = React.useState(null);
  const [loadingDefinition, setLoadingDefinition] = React.useState(false);
  const [didWordFileLoad, setDidWordFileLoad] = React.useState(null);

  React.useEffect(() => {
    if (didWordFileLoad !== null) {
      setTimeout(() => {
        setDidWordFileLoad(null);
      }, 3000);
    }
  }, [didWordFileLoad]);

  const handleNewWordFieldChange = event => {
    event.preventDefault();

    const word = event.target.value;

    if (typeof(word) !== "string") {
      setNewWorldFieldError({
        error: true,
        errorMessage: "New word must be a string"
      });
    } else if (word.trim() === "") {
      setNewWorldFieldError({
        error: true,
        errorMessage: "New word cannot be empty"
      });
    } else if (!isOnlyAlphaAndSpaces(word.trim())) {
      setNewWorldFieldError({
        error: true,
        errorMessage: "Must be a word containing only alphabetic characters"
      });
    } else {
      setNewWorldFieldError({
        error: false,
        errorMessage: null
      });
    }

    setNewWordField(word);
  }

  const handleNewWordFieldSubmit = event => {
    if (event.key === "Enter" && !newWordFieldError.error) {
      event.preventDefault();
      setWordList([...wordList, event.target.value]);
    }
  }

  const handleSelectNewWord = event => {
    event.preventDefault();
    if (wordList.length === 0) {
      return
    }
    const nextWordIndex = Math.floor(Math.random() * wordList.length);
    setLoadingDefinition(true);
    getWordDefinition(wordList[nextWordIndex])
      .then(info => {
        if (info.message === undefined) {
          const word = info[0].word;
          const meanings = info[0].meanings[0].definitions[0].definition;
          setSelectedWord(word);
          setSelectedWordDefinition(meanings);
          setSelectedWordError(null);
          setLoadingDefinition(false);
        } else {
          const errorMessage = "No definition found for " + wordList[nextWordIndex].toLowerCase() + "!";
          setSelectedWord(null);
          setSelectedWordDefinition(null);
          setSelectedWordError(errorMessage);
          setLoadingDefinition(false);
        }
      })
      .catch(e => {
        setSelectedWord(null);
        setSelectedWordDefinition(null);
        setSelectedWordError(e.message);
        setLoadingDefinition(false);
      });
  }

  const handleUploadFile = event => {
    event.preventDefault();

    if (event.target.files === undefined || event.target.files.length === 0) {
      return;
    }
  
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setDidWordFileLoad(true);
      const newWords = reader.result.split("\n");
      setWordList(wordList.concat(newWords));
    }

    reader.onerror = () => {
      setDidWordFileLoad(false);
    }

    reader.readAsText(file);
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSelectNewWord}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Next
          </Button>
        </form>
        <WordList words={wordList} />
        <TextField
          className="App-new-field-field"
          defaultValue={newWordField}
          error={!!newWordFieldError.error}
          helperText={newWordFieldError.errorMessage}
          id="outlined-basic"
          label="Enter new words here"
          variant="outlined"
          onChange={handleNewWordFieldChange}
          onKeyPress={handleNewWordFieldSubmit}
        />
        <Flashcard word={selectedWord} meanings={selectedWordDefinition} error={selectedWordError} loading={loadingDefinition} />
        <Button
          type="submit"
          variant="contained"
          component="label"
        >
          Upload File
          <input type="file" onChange={handleUploadFile} hidden/>
        </Button>
        <div className="App-file-upload-alert">
          {(() => {
            if (didWordFileLoad === true) {
              return (
                <div>
                  <Alert severity="success">
                    File uploaded sucessfully!
                  </Alert>
                </div>
              )
            } else if (didWordFileLoad === false) {
              return (
                <div>
                  <Alert severity="error">
                    File could not be uploaded!
                  </Alert>
                </div>
              )
            }
          })()}
        </div>
      </header>
    </div>
  );
}

export default App;

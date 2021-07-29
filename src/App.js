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

async function getWordDefinition(word) {
  const apiRequest = "https://api.dictionaryapi.dev/api/v2/entries/en_US/" + word;
  return fetch(apiRequest);
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
  return (
    <div></div>
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
    setSelectedWord(wordList[nextWordIndex]);
    getWordDefinition(wordList[nextWordIndex])
      .then(info => console.log(info))
      .catch(e => console.log(e));
  }

  return (
    <div className="App">
      <header className="App-header">
        <Flashcard />
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
      </header>
    </div>
  );
}

export default App;

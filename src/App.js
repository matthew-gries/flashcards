import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Alert from "@material-ui/lab/Alert";
import { CssBaseline } from "@material-ui/core";

import Flashcard from "./Components/Flashcard";
import WordList from "./Components/WordList";
import theme from "./theme";

import { v4 as uuidv4 } from "uuid";

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

function App() {

  const [newWordField, setNewWordField] = React.useState("Hello");
  const [newWordFieldError, setNewWorldFieldError] = React.useState({
    error: false,
    errorMessage: null
  });
  const [wordList, setWordList] = React.useState([]);
  const [selectedWord, setSelectedWord] = React.useState(null);
  const [selectedWordDefinitions, setSelectedWordDefinitions] = React.useState(null);
  const [selectedWordError, setSelectedWordError] = React.useState(null);
  const [loadingDefinition, setLoadingDefinition] = React.useState(false);
  const [didWordFileLoad, setDidWordFileLoad] = React.useState(null);
  const [isFacingWord, setIsFacingWord] = React.useState(true);

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

  const selectNewWord = (listOfWords) => {

    if (listOfWords.length === 0) {
      return
    }
    const nextWordIndex = Math.floor(Math.random() * listOfWords.length);
    setLoadingDefinition(true);
    getWordDefinition(listOfWords[nextWordIndex])
      .then(info => {
        if (info.message === undefined) {
          const word = info[0].word;
          const meanings = info[0].meanings;
          setSelectedWord(word);
          setSelectedWordDefinitions(meanings);
          setSelectedWordError(null);
          setLoadingDefinition(false);
        } else {
          const errorMessage = "No definition found for " + listOfWords[nextWordIndex].toLowerCase() + "!";
          setSelectedWord(null);
          setSelectedWordDefinitions(null);
          setSelectedWordError(errorMessage);
          setLoadingDefinition(false);
        }
      })
      .catch(e => {
        setSelectedWord(null);
        setSelectedWordDefinitions(null);
        setSelectedWordError(e.message);
        setLoadingDefinition(false);
      });
    setIsFacingWord(true);
  }

  const handleSelectNewWord = event => {
    event.preventDefault();
    selectNewWord(wordList);
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
      const newWordList = wordList.concat(newWords);
      setWordList(newWordList);
      selectNewWord(newWordList);
    }

    reader.onerror = () => {
      setDidWordFileLoad(false);
    }

    reader.readAsText(file);
  };

  const formatMeaningsFunction = () => {
    return (
      <div>
        {selectedWordDefinitions.map((meaning) => {
          return (
            <div>
              <Typography color="textSecondary" gutterBottom key={uuidv4()}>
                {meaning.partOfSpeech}
              </Typography>
              <div className="App-word-definitions">
                {meaning.definitions.map((definition) => {
                  return (
                    <Typography variant="body2" component="p" key={uuidv4()}>
                      {definition.definition}
                    </Typography>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <header className="App-header">
          <div className="App-flash-card-and-buttons" style={{float: "left"}}>
            <Flashcard
              word={selectedWord}
              formatMeaningsFunction={formatMeaningsFunction}
              error={selectedWordError}
              loading={loadingDefinition}
              facingWord={isFacingWord}
              flipCardFunc={() => setIsFacingWord(!isFacingWord)}
            />
            <div style={{paddingTop: "10px", paddingBottom: "10px", margin: "10px"}}>
              <form onSubmit={handleSelectNewWord}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{float: "left"}}
                >
                  Next
                </Button>
              </form>
              <Button
                type="submit"
                variant="contained"
                component="label"
                style={{marginLeft: "10px"}}
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
            </div>
          </div>
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
            style={{paddingBottom: "10px", margin: "10px"}}
          />
          <WordList words={wordList} />
        </header>
      </ThemeProvider>
    </div>
  );
}

export default App;

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"

import { v4 as uuidv4 } from "uuid";

export default function WordList(props) {

  const { words } = props;

  return (
    <List
      className="App-word-list"
      style={{maxHeight: 200, maxWidth: 300, overflow: 'auto', position: 'relative', margin: "10px"}}
      component="nav"
    >
      {words.map((word) => {
        return (
          <ListItem key={uuidv4()}>
            <ListItemText primary={word} />
          </ListItem>
        )})}
    </List>
  )
}


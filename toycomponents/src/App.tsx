import { useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import UpdateForm from "./components/UpdateForm";

import itemService, { Item } from "./services/item-service";
import useItems from "./hooks/useItems";
import InsertForm from "./components/InsertFrom";
import useString from "./hooks/useString";
import stringService from "./services/string-service";

function App() {
  const { items, error, isLoading, setItems, setError } = useItems();
  const { string, strError, strIsLoading, setString, setStrError } =
    useString();

  const deleteItem = (item: Item) => {
    const originalItems = [...items];
    setItems(items.filter((x) => x.id !== item.id));

    itemService.delete(item.id).catch((err) => {
      setError(err.message);
      setItems(originalItems);
    });
  };

  const addItem = (newName: string) => {
    const originalItems = [...items];

    let max: number = items[0].id;
    for (let i = 0; i < items.length; i++) {
      if (max < items[i].id) max = items[i].id;
    }

    const newItem = { id: max + 1, name: newName };
    setItems([...items, newItem]);

    itemService
      .create(newItem)
      .then(() => {
        setItems([...items, newItem]);
      })
      .catch((err) => {
        setError(err.message);
        setItems([...originalItems]);
      });
  };

  const addToString = (newString: string) => {
    const originalString = [...string];
    setString([string[0] + "__" + newString]);

    stringService
      .create({ str: newString })
      .then(() => {
        setString([string[0] + "__" + newString]);
      })
      .catch((err) => {
        setError(err.message);
        setString([...originalString]);
      });
  };

  const updateItem = (item: Item) => {
    const originalItems = [...items];
    const updatedItem = { ...item, name: item.name };
    setItems(items.map((u) => (u.id === item.id ? updatedItem : u)));

    itemService.update(updatedItem).catch((err) => {
      setError(err.message);
      setItems([...originalItems]);
    });
  };

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}

      {/*Here we render the items in a list*/}
      <ul className="list-group">
        {items.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between"
          >
            {item.name}
            {/*Delete Button*/}
            <div>
              <button
                className="btn btn-outline-danger"
                onClick={() => deleteItem(item)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <br />

      <InsertForm onSubmit={(data) => addItem(data.name)}></InsertForm>
      <br />

      <UpdateForm onSubmit={(data) => updateItem(data)} />
      <br />
      {/**EXERCISE: Create a component that will load text from the server. The follow aspects are required:
       * Loading spinner
       * Display error
       * Text should have it's own route and service
       */}
      {strError && <p className="text-danger">{strError}</p>}
      {strIsLoading && <div className="spinner-border"></div>}
      {string[0] && <p className="text-danger">{string[0]}</p>}

      {/**EXERCISE: Create a button that will add to the aforementioned text from the server. The follow aspects are required:
       * Should revert to original content in the case of an error
       * Server should have it's own route and associated logic
       */}
      <br />
      <Button
        color="danger"
        onClick={() => {
          addToString("SPAM");
        }}
      >
        ADD SPAM
      </Button>
      {/**EXERCISE: Create a button that will remove the first character from the aforementioned text from the server. The follow aspects are required:
       * Should revert to original content in the case of an error
       * Server should have it's own route and associated logic
       */}
      {/**EXERCISE: Create a button that will change the first character from the aforementioned text from the server. The follow aspects are required:
       * Should revert to original content in the case of an error
       * Server should have it's own route and associated logic
       */}
    </>
  );
}

export default App;

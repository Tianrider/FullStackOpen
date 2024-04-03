import { useEffect, useState } from "react";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Person from "./components/Person.jsx";
import axios from "axios";
import noteService from "./services/notes";
import Notification from "./components/Notification.jsx";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, [persons]);

  const handleAddName = (event) => {
    persons.forEach((person) => {
      if (person.name === newName) {
        if (
          window.confirm(
            `${newName} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          const updatedPerson = { ...person, number: newNumber };
          noteService
            .update(person.id, updatedPerson)
            .then((returnedPerson) => {
              setPersons(
                persons.map((person) =>
                  person.id !== returnedPerson.id ? person : returnedPerson
                )
              );
              setErrorMessage(`Updated ${newName}`);
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            });
          handleDelete(person.id);
        }
      }
    });

    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString(),
    };

    noteService.create(personObject).then((returnedPerson) => {
      setErrorMessage(`Added ${newName}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const filteredPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = (id) => {
    if (window.confirm("Do you really want to delete?")) {
      axios.delete(`http://localhost:3001/persons/${id}`).then((response) => {
        console.log(response);
      });

      noteService.getAll().then((initialPersons) => {
        setPersons(initialPersons);
        setErrorMessage(`Deleted`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter value={search} onChange={(e) => setSearch(e.target.value)} />

      <h2>add a new</h2>
      <PersonForm
        addPerson={handleAddName}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h2>Numbers</h2>

      {filteredPersons.map((person) => (
        <Person key={person.name} person={person} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default App;

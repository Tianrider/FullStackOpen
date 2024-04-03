const Person = ({ person, onDelete }) => {
  return (
    <div>
      {person.name} {person.number}{" "}
      <button onClick={(e) => onDelete(person.id)}>delete</button>
    </div>
  );
};

export default Person;

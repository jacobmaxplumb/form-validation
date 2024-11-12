import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import * as yup from "yup";

const schema = yup.object().shape({
  fullName: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Full name must contain only letters")
    .min(3, "Full name must be at least 3 characters")
    .max(20, "Full name must be at most 20 characters")
    .required("Full name is required"),
  shirtSize: yup
    .string()
    .oneOf(["S", "M", "L"], "Shirt size must be S, M, or L")
    .required("Shirt size is required"),
});

const intialFormValues = {
  fullName: "",
  shirtSize: "",
  animals: [],
};

const intialErrors = {
  fullName: '',
  shirtSize: ''
}

const animals = ["cat", "dog", "bird", "fish", "bear"];

function App() {
  const [formValues, setFormValues] = useState(intialFormValues);
  const [errors, setErrors] = useState(intialErrors);
  const [isEnabled, setIsEnabled] = useState(false);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    yup
      .reach(schema, name)
      .validate(value)
      .then(() => setErrors({...errors, [name]: ''}))
      .catch((err) => setErrors({...errors, [name]: err.errors[0]}));
  };

  useEffect(() => {
    // {fullName: 'jacob', shirtSize: 'S', animals: []}
    schema.isValid(formValues).then((valid) => {
      setIsEnabled(valid);
    });
  }, [formValues]);

  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setFormValues({ ...formValues, animals: [...formValues.animals, name] });
    } else {
      setFormValues({
        ...formValues,
        animals: formValues.animals.filter((a) => a !== name),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={formValues.fullName}
          name="fullName"
          placeholder="Full Name"
          onChange={handleTextChange}
        />
        {errors.fullName && <p>{errors.fullName}</p>}
      </div>
      <div>
        <select
          value={formValues.shirtSize}
          name="shirtSize"
          onChange={handleTextChange}
        >
          <option value=""></option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.shirtSize && <p>{errors.shirtSize}</p>}
      </div>
      {animals.map((animal) => (
        <div key={animal}>
          <input
            onChange={handleCheckBoxChange}
            type="checkbox"
            checked={formValues.animals.includes(animal)}
            name={animal}
          />{" "}
          {animal}
        </div>
      ))}
      <button disabled={!isEnabled}>Submit</button>
    </form>
  );
}

export default App;

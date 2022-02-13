import React, { useState } from "react";

function Form({ formLabel, placeholder, handleFormSubmit, handleButtonClick }) {
  const [input, setInput] = useState("");

  const handleInputOnChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!(input === "")) {
      handleFormSubmit(input);
      setInput("");
    }
  };

  const handleClick = () => {
    if (!(input === "")) {
      handleButtonClick(input);
      setInput("");
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>{formLabel}</label>
          <input
            type="text"
            value={input}
            onChange={handleInputOnChange}
            placeholder={placeholder}
          />
        </div>
      </form>
      <button onClick={handleClick}>Search</button>
    </div>
  );
}

export default Form;

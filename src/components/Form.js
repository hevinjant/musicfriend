import React, { useState } from "react";

function Form({ formLabel, placeholder, handleFormSubmit }) {
  const [input, setInput] = useState("");

  const handleInputOnChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleFormSubmit(input);
    setInput("");
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
    </div>
  );
}

export default Form;

import React, { useState } from 'react';
import './FormModal.css';
import { categories, genders, states, jobs } from '../constants/constants';

const FormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name:'',
    category: '',
    gender: '',
    state: '',
    job: '',
    cityPopulation: '',
    age: '',
    amount: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (
      !formData.name ||
      !formData.category ||
      !formData.gender ||
      !formData.state ||
      !formData.job ||
      !formData.cityPopulation ||
      !formData.age ||
      !formData.amount
    ) {
      setError('All fields are required.');
      return;
    }

    // Clear previous error
    setError('');

    const transformedData = {
      name: [formData.name],
      category: [formData.category],
      gender: [formData.gender],
      amt: [parseFloat(formData.amount)],
      city_pop: [parseInt(formData.cityPopulation)],
      state: [formData.state],
      job: [formData.job],
      age: [parseInt(formData.age)]
    };

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transformedData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Form submission result:', result); // Log the result
      onSubmit(transformedData, result);

      setFormData({
        name: '',
        category: '',
        gender: '',
        state: '',
        job: '',
        cityPopulation: '',
        age: '',
        amount: ''
      });

      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <form className="form-section" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Name"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="" disabled>Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="" disabled>Select a gender</option>
                {genders.map((gender, index) => (
                  <option key={index} value={gender}>{gender}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>State</label>
              <select name="state" value={formData.state} onChange={handleChange}>
                <option value="" disabled>Select a state</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Job</label>
              <select name="job" value={formData.job} onChange={handleChange}>
                <option value="" disabled>Select a job</option>
                {jobs.map((job, index) => (
                  <option key={index} value={job}>{job}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>City Population</label>
              <input
                type="number"
                name="cityPopulation"
                value={formData.cityPopulation}
                onChange={handleChange}
                placeholder="Enter city population"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;

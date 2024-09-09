import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Form() {
  const { eventId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log(token);

  useEffect(() => {
    axios
      .get(`http://localhost:6001/general/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setQuestions(response.data.questions);
        setAnswers(Array(response.data.questions.length).fill(""));
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, [eventId]);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://localhost:6001/student/send-request/${eventId}`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Request sent successfully:", response.data);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error sending request:", error);
      });

    console.log("Request is sent.");
    console.log(token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 to-teal-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-6">Event Registration</h2>
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                {question}
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg shadow-sm"
                value={answers[index]}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-green-400 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;

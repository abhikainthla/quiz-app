import React, { useEffect, useState } from 'react';

function Quiz() {
    const [questionData, setQuestionData] = useState([]);
    const [questionNo, setQuestionNo] = useState(0);
    const [radioValue, setRadioValue] = useState("");
    const [buttonValue, setButtonValue] = useState("");
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [time, setTime] = useState(10);
    const [timerRunning, setTimerRunning] = useState(true);

    const fetchQuestions = () => {
        if (questionData.length < 10) { 
            const url = "https://opentdb.com/api.php?amount=10&type=multiple";
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    const questions = data.results.map((element) => {
                        return {
                            question: element.question,
                            options: [...element.incorrect_answers, element.correct_answer],
                            correctAnswer: element.correct_answer
                        };
                    });
                    setQuestionData(questions);
                    setQuestionNo(1);
                    setScore(0);
                    setShowScore(false);
                    setTime(10);
                    setTimerRunning(true);
                })
                .catch((error) => console.error("Error fetching data:", error));
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleNext();
        }, 10000);

        return () => clearTimeout(timer);
    }, [questionNo]);

    useEffect(() => {
        if (timerRunning) {
            const interval = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime === 1) {
                        setTimerRunning(false);
                        handleNext();
                        return 10;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timerRunning]);

    const handleChange = (e) => {
        setRadioValue(e.target.value);
    };

    const handleSubmit = () => {
        setButtonValue("submit");
        const currentQuestion = questionData[questionNo - 1];
        if (radioValue === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
        handleNext();
    };

    const handleNext = () => {
        if (questionNo === questionData.length) {
            setShowScore(true);
        } else {
            setQuestionNo(questionNo + 1);
            setRadioValue("");
            setButtonValue("");
            setTime(10);
            setTimerRunning(true);
        }
    };

    return (
        <div className='main'>
            <div className='container'>
                <h1>Quiz App</h1>
                {questionData.length > 0 && (
                    <>
                        <h3>Question {questionNo}</h3>
                        <p>{questionData[questionNo - 1].question}</p>
                        <ul>
                            {questionData[questionNo - 1].options.map((option, index) => (
                                <li key={index}>
                                    <input type='radio' name='options' value={option} onChange={handleChange} checked={radioValue === option} />
                                    <label>{option}</label>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <button className='submit' onClick={handleSubmit}>Submit</button>
                            <button className='next' onClick={handleNext}>{questionNo === questionData.length ? "Finish" : "Next"}</button>
                            <p>Time Left: {time}</p>
                        </div>
                    </>
                )}
                {showScore && (
                    <div id='score'>
                        <h2>Score:</h2>
                        <span>{score}/{questionData.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Quiz;

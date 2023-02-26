import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'
import Question from './Question'

const Questions = () => {
    const [quizData, setQuizData] = useState({score: 0, questions: []})
    const [hasQuizStarted, setHasQuizStarted] = useState(false)
    const [hasFinishedAnswering, setHasFinishedAnswering] = useState(false)

    console.log(quizData)

    useEffect(() => {
        async function getQuizData() {
            const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            const data = await res.json()
            const filteredQuestions = data.results.map( datum => {
                return {
                    id: nanoid(),
                    question: decode(datum.question),
                    correctAnswer: decode(datum.correct_answer),
                    answer: '',
                    choices: [
                            {
                                key:decode(datum.correct_answer),
                                isHeld: false
                            }, 
                            ...datum.incorrect_answers.map(incAns => {
                                return {
                                    key: decode(incAns),
                                    isHeld: false
                                }
                            })
                        ]
                }
            })
            const newQuizData = {score: 0, questions: [...filteredQuestions]}
            setQuizData(newQuizData)
        }
        getQuizData()
    }, [])

    function handleChoiceClick(questionId,choice) {
        console.log(`handleChoiceClick triggered: ${questionId} ${choice}`)
        const updatedArray = quizData.questions.map( question => {
            return question.id === questionId ? 
                {   ...question,
                    choices: [...question.choices.map(item => {
                        return {
                            ...item, 
                            isHeld: item.key === choice ? !item.isHeld : false
                        }
                    })],
                    answer: choice
                } : question
        })
        setQuizData(prevState => {
            return {
                score: prevState.score,
                questions: [...updatedArray]
            }
        })

    }

    function handlePlayAgain() {
        setHasFinishedAnswering(false)
        async function getQuizData() {
            const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            const data = await res.json()
            const filteredQuestions = data.results.map( datum => {
                return {
                    id: nanoid(),
                    question: decode(datum.question),
                    correctAnswer: decode(datum.correct_answer),
                    answer: '',
                    choices: [
                            {
                                key:decode(datum.correct_answer),
                                isHeld: false
                            }, 
                            ...datum.incorrect_answers.map(incAns => {
                                return {
                                    key: decode(incAns),
                                    isHeld: false
                                }
                            })
                        ]
                }
            })
            const newQuizData = {score: 0, questions: [...filteredQuestions]}
            setQuizData(newQuizData)
        }
        getQuizData()
    }
    
    function handleCheckAnswer() {
        let correctAns = 0 
        quizData.questions.forEach(question => {
            if(question.answer === question.correctAnswer) {
                correctAns++
            } else {
            }
        })
        setQuizData(prevState => {
            return {
                ...prevState,
                score: correctAns
            }
        })
        setHasFinishedAnswering(true)
    }

    const questionsElements = quizData.questions.map(item => {
        return <Question key={item.id} {...item} handleChoiceClick={handleChoiceClick}/>
    })
    
    function handleStartClick() {
        setHasQuizStarted(prevState => !prevState)
    }

    return (       
        <div>
            <main className='main'>
                {   hasQuizStarted ?
                    <section className='py-20'>
                        {questionsElements}
                        {
                            hasFinishedAnswering ? 
                            <div className='flex my-10 flex-col lg:flex-row gap-2 lg:gap-4 items-center justify-center'>
                                <p className='text-darkIndigo text-2xl font-bold'>You scored {quizData.score}/10 correct answers</p>
                                <button className='btn m-0 lg:my-10 lg:ml-4 text-xl py-3 px-8 ' onClick={handlePlayAgain}>Play again</button>
                                <button className='btn invertedBtn m-0 lg:my-10 text-xl py-3 px-8' onClick={handleStartClick}>Quit</button>
                            </div>
                            :
                            <button className='btn text-xl py-3 px-8' onClick={handleCheckAnswer}>Check answers</button>

                        }
                    </section> 
                    :
                    <section className='py-40'>
                        <h1 className='text-5xl font-bold mb-1'>Quizzical</h1>
                        <p className='text-xl'>Let's test how broad your knowledge</p>
                        <button 
                            onClick={handleStartClick} 
                            className='btn place-self-center text-2xl py-4 px-16'
                        >
                            Start quiz
                        </button>
                    </section>
                }
            </main>
        </div>
        
    );
}
 
export default Questions;
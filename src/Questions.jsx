import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Question from './Question'

const Questions = () => {
    const [quizData, setQuizData] = useState({score: 0, total: 0, questions: []})
    const [hasQuizStarted, setHasQuizStarted] = useState(false)
    const [hasFinishedAnswering, setHasFinishedAnswering] = useState(false)
    const [willPlayAgain, setWillPlayAgain] = useState(false)

    console.log(quizData)

    useEffect(() => {
        async function getQuizData() {
            const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            const data = await res.json()
            const filteredData = data.results.map( datum => {
                // Listing and decoding of choices with the correct answer
                const choices = [
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

                // Randomizing the choices and pushing it to the new 'randomChoices' array
                const randomChoices = []
                while(choices.length) {
                    const randomIndex = Math.floor(Math.random() * choices.length)
                    const randomChoice = choices.splice(randomIndex,1)[0]
                    randomChoices.push(randomChoice)
                }

                return {
                    id: nanoid(),
                    question: decode(datum.question),
                    correctAnswer: decode(datum.correct_answer),
                    answer: '',
                    choices: [...randomChoices]
                }
            })
            const newQuizData = {score: 0, total: filteredData.length, questions: [...filteredData]}
            setQuizData(newQuizData)
        }
        getQuizData()
    }, [willPlayAgain])

    function handleChoiceClick(questionId,choice) {
        // console.log(`handleChoiceClick triggered: ${questionId} ${choice}`)
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
                ...prevState,
                questions: [...updatedArray]
            }
        })

    }

    function warningToast(message) {
        return toast.warning(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
    }
    function successToast(message) {
        return toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    }
    
    function handleCheckAnswer() {
        const isAllQuestionsAsnwered = quizData.questions.map(question => {
            return !question.choices.every(choice => !choice.isHeld)
        }).every(isHeld => isHeld)

        if(isAllQuestionsAsnwered) {
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
            const tally = `${correctAns}/${quizData.total}`
            correctAns > 8 ? 
                successToast(`🎉 ${tally}. Congrats! You passed.`): 
                successToast(`${tally} You fell short but, hey! you did your best. 👍`)

            setHasFinishedAnswering(true)

        } else {
            warningToast('Some questions are still unanswered.')
        }
        
    }

    const questionsElements = quizData.questions.map(item => {
        return <Question key={item.id} {...item} hasFinishedAnswering={hasFinishedAnswering} handleChoiceClick={handleChoiceClick}/>
    })
    
    function handleStartClick() {
        setHasQuizStarted(prevState => !prevState)
    }
    
    function handlePlayAgain() {
        setHasFinishedAnswering(false)
        setWillPlayAgain(prevState => !prevState)
    }

    function handleQuitClick() {
        setHasQuizStarted(false)
        setHasFinishedAnswering(false)
        setWillPlayAgain(prevState => !prevState)
    }
    return (       
        <div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <main className='main'>
                {   hasQuizStarted ?
                    <section className='py-20'>
                        {questionsElements}
                        {
                            hasFinishedAnswering ? 
                            <div className='flex my-10 flex-col lg:flex-row gap-2 lg:gap-4 items-center justify-center'>
                                <p className='text-darkIndigo text-2xl font-bold'>You scored {quizData.score}/10 correct answers</p>
                                <button className='btn m-0 lg:my-10 lg:ml-4 text-xl py-3 px-8 ' onClick={handlePlayAgain}>Play again</button>
                                <button className='btn invertedBtn m-0 lg:my-10 text-xl py-3 px-8' onClick={handleQuitClick}>Quit</button>
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
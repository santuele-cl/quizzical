import { nanoid } from 'nanoid'

const Question = (props) => {
    console.log(props)
    const {question,choices,handleChoiceClick,id,correctAnswer, hasFinishedAnswering} = props

    const choicesElement = choices.map(choice => {
        const isFinished = hasFinishedAnswering
        const isAnswer = choice.isHeld
        const isAnswerKey = choice.key === correctAnswer 

        return (
            <span 
                key={nanoid()}
                className={
                    `choice 
                    ${choice.isHeld ? 'choiceIsHeld' : ''} 
                    ${isAnswerKey && isFinished ? 'correct': ''}
                    ${isAnswerKey && isFinished ? 'correct': ''}
                    ${isAnswer && !isAnswerKey && isFinished ? 'wrong' : ''}
                    `
                }
                onClick={() => handleChoiceClick(id,choice.key)}
            >
                {choice.key}
            </span>
        )
    })
    return (  
        <div className='flex flex-col gap-6 text-left text-darkIndigo py-8 [&:not(div:last-of-type)]:border-b-2 border-lightBlue'>
            <p className='font-bold text-3xl'>{question}</p>
            <div className='flex flex-col gap-4 md:items-center md:flex-row'>
                {choicesElement}
            </div>
        </div>
    );
}
 
export default Question;
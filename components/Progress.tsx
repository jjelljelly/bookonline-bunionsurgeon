import React from 'react'
import style from './Progress.module.css'

interface Props {
    currentStage: {number: number, title: string}, 
    stages: {number: number, title: string}[],
    stageName: string,
    backgroundColor: string,
    borderColor: string
}

const Progress = ({ currentStage, stages, stageName, backgroundColor, borderColor }: Props) => {
    //reduce synonymous stages to array of unique stages
    const numbers = stages.reduce((arr, stage) => {
        if (arr.indexOf(stage.number) < 0) arr.push(stage.number)
        return arr
    }, [])

    return (
        <div
            className={style.progress}
            >
                <div
                    className={style.progressTitle}
                    >
                        <strong>Stage {currentStage.number}</strong> | <i>{currentStage.title}</i>
                </div>
                <div
                    className={style.progressBox}>
                {
                    numbers.map((num, i) => {
                        return <div key={'num' + i}>
                            <div
                                className={style.stageNumber}
                                style={
                                    num <= currentStage.number ? 
                                        {backgroundColor: backgroundColor, color: 'white', border: '2px solid ' + borderColor} :
                                        {}
                                    }
                                >
                                {num}
                            </div>
                        </div>
                    })
                }
                </div>
        </div>
    )
}

export default Progress
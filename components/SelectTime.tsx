import { useState } from 'react'
import style from './SelectTime.module.css'
import { methods } from '../objects/methods'
import { getDateComponents } from './BookingForm'

interface Props {
    availability: [],
    setStage: (n: number) => void,
    setSelectedTime: (s: [date: string, time: string]) => void,
    found: [boolean, boolean]
}

const SelectTime = ({ availability, setStage, setSelectedTime, found }: Props) => {
    console.log('select time availability', availability)
    //reduce availability to collection of dates
    const times = availability.reduce((times, cur: string) => {
        const date = cur.split(',')[0];
        const time = cur.split(', ')[1]
        if (times[date]) times[date].unshift(time)
        if (!times[date]) times[date] = [time]
        return times;
    }, {})

    //filter dates and times in sections of five
    const [inc, setInc] = useState<number>(5)
    const keys = Object.keys(times).filter((cur, idx) => idx < inc && idx >= inc - 5)

    //handle appointment select
    const select = (date: string, time: string) => {
        setSelectedTime([date, time])
        found[0] ? setStage(4) : setStage(2)
    }

    return (
        <div>
            <div className={style.dates}>
                <div
                    className={style.navigate}
                >
                    <div
                        className={style.arrow}
                        onClick={() => (inc > 5) && setInc(inc - 5)}
                    >
                        &#8678;
                    </div>
                    <div className={style.dateRange}>
                        {keys[0]} - {keys[4]}
                    </div>
                    <div
                        className={style.arrow}
                        onClick={() => (inc > 0 && inc <= keys.length) && setInc(inc + 5)}
                    >
                        &#8680;
                    </div>
                </div>
                {keys.map((date) => {
                    return <div
                        key={date}
                        className={style.dateColumn}
                    >
                        <div className={style.dateHead}>{date}</div>
                        <hr />
                        {
                            times[date].map((time: string) => {
                                return <div
                                    key={time}
                                    className={style.time}
                                    onClick={() => select(date, time)}
                                >
                                    {time.replace(':00 ', ' ')}
                                </div>
                            })
                        }
                    </div>
                })}
            </div>
            <button
                className={style.stageButton}
                onClick={() => setStage(0)}
            >
                Go Back
            </button>
        </div >
    )
}

export default SelectTime
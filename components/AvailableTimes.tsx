import style from './AvailableTimes.module.css'
import { getDateComponents } from './BookingForm';

interface Props {
    availableTimes: string[],
    selectTime: (selectedTime: string) => void,
    setStage: (n: number) => void
}

const AvailableTimes: React.FC<Props> = (props) => {
    let times = props.availableTimes;
    const dateArgs: [string, string] = times[0].split(',') as any
    const dateComponents = getDateComponents(dateArgs)
    console.log(dateComponents)
    return (
        <>
            {times.length === 0 ?
                <>
                    <p>Unfortunately the last appointment has now been reserved for this day.</p>
                    <p>Please select a different day.</p>
                </> :
                <>
                    <div className={style.availableTimesContainer}>
                        <div className={style.atBanner}>
                            <h2 className={style.AT}>Available Times</h2>
                            {
                                times !== undefined ?
                                    <p>You have selected {new Date(dateComponents.year, dateComponents.month, dateComponents.date).toDateString()}</p> :
                                    <p>Please select a date</p>
                            }
                        </div>
                        <hr className={style.hr} />
                        <div className={style.timesContainer}>
                            {
                                times !== undefined && times.map((time, i) => {
                                    return (
                                        <button
                                            onClick={() => props.selectTime(time)}
                                            className={style.atButtons}
                                            key={'time' + i}
                                        >
                                            {time.split(', ')[1].split(':').map((section, i) => {
                                                if (i === 0) {
                                                    return section + ':'
                                                } else if (i === 1) {
                                                    return section + ' '
                                                } else if (i === 2) {
                                                    return section.split(' ')[1]
                                                }
                                                return '';
                                            })}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </>
            }
            <button
                className={style.stageButton}
                onClick={() => props.setStage(0)}
            >
                Go Back
            </button>
        </>
    )
}

export default AvailableTimes
import { useState } from 'react'
import Checkbox from './form_components/Checkbox'
import TextInput from './form_components/TextInput'
import Paypal from './PayPal'
import style from './FinaliseFollowUp.module.css'
import aTypes from '../objects/appointment_types'
import { methods } from '../objects/methods'

interface Props {
    type: string,
    setStage: (stage: number) => void,
    selectedTime: [date: string, time: string],
    found: [boolean, boolean],
    setLoading: (b: boolean) => void,
    profile: [string, string]
}

export function getDateComponents([date, time]) {

    const splitDate = date.split('/')
    const splitTime = time.split(' ')[0].split(':')
    const hours = time.includes('PM') ? Number(splitTime[1]) + 12 : splitTime[0]
    const dateObj = new Date(splitDate[2], Number(splitDate[1]) - 1, splitDate[0], hours, splitTime[1])
    return {
        month: dateObj.getMonth(),
        date: dateObj.getDate(),
        year: dateObj.getFullYear(),
        hours: dateObj.getHours(),
        minutes: dateObj.getMinutes()
    }
}

const FinaliseFollowUp: React.FC<Props> = (props) => {
    const [fuEmail, setFuEmail] = useState<string>('');
    const [privacy, setPrivacy] = useState<boolean>(false);

    //submit function
    const submitFU = () => {
        props.setLoading(true);
        const { date, month, hours, minutes } = getDateComponents(props.selectedTime)
        const year = props.selectedTime[0].split('/')[2]
        const data = {
            first_name: props.profile[0],
            last_name: props.profile[1],
            email: fuEmail,
            appointmentType: props.type,
            year,
            month,
            date,
            hours,
            minutes
        }

        const complete = () => {
            props.setLoading(false)
            props.setStage(5)
        }
        methods.post(
            process.env.NEXT_PUBLIC_BOOK_FU,
            data,
            complete
        )
    }
    const selectedComponents = getDateComponents([props.selectedTime[0], props.selectedTime[1]])
    const selectedDate = new Date(selectedComponents.year, selectedComponents.month, selectedComponents.date, selectedComponents.hours, selectedComponents.minutes)
    return (
        <div className={style.fuPayContainer}>
            <div className={style.fuPay}>
                <div className={style.selection}>
                    <strong>You have selected: </strong>
                    {selectedDate.toDateString() + ' at ' + `${selectedComponents.hours}:${selectedComponents.minutes < 10 ? '0' : ''}${selectedComponents.minutes}`}
                </div>
                <hr className={style.hr} />
                <p>Please provide an email address to receive confirmation of your appointment.</p>
                <TextInput
                    name='email'
                    value={fuEmail}
                    updateField={(name: string, value: string) => setFuEmail(value)}
                    description="Please provide an email address to receive confirmation of your booking"
                />
                <Checkbox
                    name="privacy"
                    value={privacy}
                    updateField={(name: string, value: any) => setPrivacy(value)}
                    description='By checking this box you agree that you have read our privacy policy and that the personal information you provide will be processed in accordance with this.'
                    required={true}
                    label="I AGREE"
                />
                {
                    !props.found[1] ?
                        <button
                            className={style.stageButton}
                            onClick={() => submitFU()}>
                            submit
                        </button> :
                        (fuEmail !== '' && privacy && props.found[1]) &&
                        <>
                            <hr className={style.hr} />
                            <p>Our records indicate that you are self funding.</p>
                            <p style={{ width: '90%', margin: 'auto' }}>To complete your booking, please select whether to pay the fee of £{aTypes[props.type]['price']} either now or in clinic.</p>
                            <button
                                className={style.stageButton}
                                onClick={() => submitFU()}
                            >
                                Pay In Clinic
                            </button>
                            <div className={style.fuPpContainer}>
                                <Paypal
                                    price={aTypes[props.type]['price']}
                                    description={aTypes[props.type]['description']}
                                    paySubmit={() => submitFU()}
                                />
                            </div>
                        </>
                }
            </div>
            <button
                className={style.stageButton}
                onClick={() => props.setStage(1)}
            >
                Select A Different Time
            </button>
        </div>
    )
}

export default FinaliseFollowUp
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

const FinaliseFollowUp: React.FC<Props> = (props) => {
    const selectedDate = new Date(props.selectedTime[0] + ' ' + props.selectedTime[1]).toString()
    const [fuEmail, setFuEmail] = useState<string>('');
    const [privacy, setPrivacy] = useState<boolean>(false);

    //submit function
    const submitFU = () => {
        props.setLoading(true);
        const d = new Date(props.selectedTime[0] + ' ' + props.selectedTime[1]);
        const data = {
            first_name: props.profile[0],
            last_name: props.profile[1],
            email: fuEmail,
            appointmentType: props.type,
            year: d.getFullYear(),
            month: d.getMonth(),
            date: d.getDate(),
            hours: d.getHours(),
            minutes: d.getMinutes()
        }
        console.log(data)
        const complete = () => {
            props.setStage(5)
            props.setLoading(false)
        }
        methods.post(
            process.env.NEXT_PUBLIC_BOOK_FU,
            data,
            complete
        )
    }

    return (
        <div className={style.fuPayContainer}>
            <div className={style.fuPay}>
                <div className={style.selection}>
                    <strong>You have selected: </strong>
                    {selectedDate.split(':00 GMT')[0]}
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
import { useState } from 'react'
import TextInput from './form_components/TextInput'
import DateInput from './form_components/DateInput'
import style from './FindPatient.module.css'
import { methods } from '../objects/methods'

interface Props {
    setFound: (b: [boolean, boolean]) => void,
    setLoading: (b: boolean) => void,
    availability: [],
    setStage: (n: number) => void,
    setProfile: (a: [string, string]) => void
}

const FindPatient = ({ setFound, setLoading, availability, setStage, setProfile }: Props) => {
    const [fields, setFields] = useState<{[index: string]: string}>({});
    const updateField = (name: string, value: string) => {
        const temp = {...fields}
        temp[name] = value;
        setFields(temp)
    }

    //form submission
    const submit = (e: any) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            dob: fields.date_of_birth.split('-').reverse().join('.'),
            name: fields.last_name
        }
        const complete = (result: any) => {
            console.log(result)
            setFound(result)
            setProfile([fields.first_name, fields.last_name])
            console.log(availability)
            availability.length > 0 ? setLoading(false) : setLoading(true)
            result[0] == true && setStage(1)
        }
        //setLoading(true)
        methods.post(
            process.env.NEXT_PUBLIC_FIND_FU,
            data,
            complete
        )
    }

    return (
        <div className={style.form}>
            <h2 style={{margin: '0 auto 20px auto'}}>Help us to find you on our system</h2>
            <form 
                className={style.formation}
                onSubmit={(e: any) => submit(e)}
                >
                <TextInput 
                    name='first_name'
                    value={fields.first_name}
                    updateField={(name: string, value: string) => updateField(name, value)}
                    />
                <TextInput 
                    name='last_name'
                    value={fields.last_name}
                    updateField={(name: string, value: string) => updateField(name, value)}
                    />
                <DateInput 
                    name='date_of_birth'
                    value={fields.date_of_birth}
                    updateField={(name: string, value: string) => updateField(name, value)}
                    />
                <hr />
                <input 
                    className={style.stageButton} 
                    style={{
                        width: '98%', 
                        border: '2px solid var(--the-black)',
                        fontWeight: 400
                        }} 
                    type="submit" 
                    value="submit" 
                    />
            </form>
            <button
                className={style.stageButton}
                onClick={() => setStage(0)}
                >
                    Go Back
            </button>
        </div>
    )
}

export default FindPatient
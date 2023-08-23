import { useState, useEffect } from 'react'
import TextInput from './form_components/TextInput'
import DateInput from './form_components/DateInput'
import SelectInput from './form_components/SelectInput'
import Checkbox from './form_components/Checkbox'
import Paypal from './PayPal'
import style from './BookingForm.module.css'
import { methods } from '../objects/methods'
import aTypes from '../objects/appointment_types'

type BookingFormProps = {
    setStage: (n: number) => void,
    selectedTime: [date: string, time: string],
    setLoading: (b: boolean) => void,
    type: string
}

export function getDateComponents([date, time]) {

    const splitDate = date.split('/')
    const splitTime = time.split(' ')[0].split(':')
    const hours = time.includes('PM') ? Number(splitTime[1]) + 12 : splitTime[0]
    console.log(splitDate[2])
    const dateObj = new Date(splitDate[2], Number(splitDate[1]) - 1, splitDate[0], hours, splitTime[1])
    console.log(dateObj)
    return {
        month: dateObj.getMonth(),
        date: dateObj.getDate(),
        year: dateObj.getFullYear(),
        hours: dateObj.getHours(),
        minutes: dateObj.getMinutes()
    }
}

const BookingForm = ({ setStage, selectedTime, setLoading, type }: BookingFormProps) => {
    //handle form state
    const [fields, setFields] = useState<{ [index: string]: string }>({});
    const updateField = (name: string, value: string) => {
        const temp = { ...fields }
        temp[name] = value;
        setFields(temp)
    }

    //submit form
    const submit = (e?: any) => {
        e.preventDefault()
        setLoading(true)
        const { date, month, hours, minutes } = getDateComponents(selectedTime)
        const year = selectedTime[0].split('/')[2]
        const data = {
            ...fields,
            appointmentType: type,
            address: address,
            gpAddress: gpAddress,
            year,
            month,
            date,
            hours,
            minutes
        }
        data['title'] = data['title'][0].toUpperCase() + data['title'].slice(1);
        data['date_of_birth'] = data['date_of_birth'].split('-').reverse().join('.');
        const complete = () => {
            type === 'KN-VIRTUAL' ? setStage(3) : setStage(5)
            setLoading(false)
        }
        type === 'KN-VIRTUAL'
            ? methods.post(
                process.env.NEXT_PUBLIC_BOOK_VIRTUAL,
                data,
                complete
            )
            :
            methods.post(
                process.env.NEXT_PUBLIC_BOOK_NP,
                data,
                complete
            )
    }

    //render google auto complete for address fields
    const [address, setAddress] = useState<string>('');
    const [gpAddress, setGpAddress] = useState<string>('');
    const [googleLoad, setGoogleLoad] = useState<boolean>(false);
    const renderGoogle = () => {
        setGoogleLoad(true)
        let autocomplete: any;
        const google = window.google;
        const auto: any = document.getElementById('address');
        autocomplete = new google.maps.places.Autocomplete(auto, {})

        let handlePlaceSelect = () => {
            let addressObject = autocomplete.getPlace();
            let address = addressObject.address_components;

            autocomplete.setFields(['address_component']);
            const val = address.reduce((total: [string], cur: {}) => {
                const c = cur['long_name'];
                total.push(c)
                return total
            }, []).filter((c: string) => c !== 'United Kingdom' && c !== 'Greater London' && c !== 'England').join(', ')
            setAddress(val)
        }
        autocomplete.addListener("place_changed", handlePlaceSelect)

        let autoGP: any;
        const gpAuto: any = document.getElementById('GP');
        autoGP = new google.maps.places.Autocomplete(gpAuto, {})

        let handleGpPlaceSelect = () => {
            let addressObject = autoGP.getPlace();
            let address = addressObject.address_components;

            autoGP.setFields(['address_component']);
            const val = address
                .reduce((total: [string], cur: {}) => {
                    const c = cur['long_name'];
                    total.push(c)
                    return total
                }, [])
                .filter((c: string) => c !== 'United Kingdom' && c !== 'Greater London' && c !== 'England')
                .join(', ')
            setGpAddress(val)
        }
        autoGP.addListener("place_changed", handleGpPlaceSelect)
    }

    //on mount, load google auto complete 
    useEffect(() => {
        if (!googleLoad) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places`;
            script.async = true;
            script.onload = () => renderGoogle();
            document.body.appendChild(script);
        }
    }, [googleLoad])

    const selectedComponents = getDateComponents([selectedTime[0], selectedTime[1]])
    const selectedDate = new Date(selectedComponents.year, selectedComponents.month, selectedComponents.date, selectedComponents.hours, selectedComponents.minutes)

    return (
        <div className={style.form}>
            <div className={style.selection}>
                <strong>You have selected: </strong>
                {selectedDate.toDateString() + ' at ' + `${selectedComponents.hours}:${selectedComponents.minutes < 10 ? '0' : ''}${selectedComponents.minutes}`}
            </div>
            <form
                className={style.formation}
                onSubmit={(e) => submit(e)}
            >
                <SelectInput
                    name="title"
                    value={fields.title}
                    options={[
                        'Mr',
                        'Ms',
                        'Mrs',
                        'Miss',
                        'Master',
                        'Doctor',
                        'Lord'
                    ]}
                    updateField={(name: string, value: string) => updateField(name, value)}
                />
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
                <TextInput
                    name='telephone'
                    value={fields.telephone}
                    updateField={(name: string, value: string) => updateField(name, value)}
                />
                <TextInput
                    name='email'
                    value={fields.email}
                    updateField={(name: string, value: string) => updateField(name, value)}
                />
                <TextInput
                    name='address'
                    value={address}
                    updateField={(name: string, value: string) => setAddress(value)}
                    description="Your Home Address"
                    id="address"
                />
                <TextInput
                    name='gp_address'
                    value={gpAddress}
                    updateField={(name: string, value: string) => setGpAddress(value)}
                    description="Your General Practitioner's Address"
                    id="GP"
                />
                {
                    type === 'KN-VIRTUAL' && <SelectInput
                        name="contact_method"
                        value={fields.contact_method}
                        options={[
                            'Zoom',
                            'Facetime',
                            'WhatsApp',
                            'Telephone'
                        ]}
                        updateField={(name: string, value: string) => updateField(name, value)}
                    />
                }
                <SelectInput
                    name="method_of_payment"
                    value={fields.method_of_payment}
                    options={[
                        'Self Funding',
                        'Aetna',
                        'Allianz',
                        'Aviva',
                        'AXA PPP',
                        'AXA PPP International',
                        'Bupa',
                        'Cigna',
                        'Cigna International',
                        'Exeter Friendly',
                        'Healix',
                        'Simply Health',
                        'Vitality',
                        'WPA'
                    ]}
                    updateField={(name: string, value: string) => updateField(name, value)}
                />
                {
                    (fields.method_of_payment !== '' && fields.method_of_payment !== "self-funding" && fields.method_of_payment !== undefined) ?
                        <>
                            <hr />
                            <TextInput
                                name='policy'
                                value={fields.policy}
                                updateField={(name: string, value: string) => updateField(name, value)}
                            />
                            <TextInput
                                name='authorisation'
                                value={fields.authorisation}
                                updateField={(name: string, value: string) => updateField(name, value)}
                            />
                        </> :
                        fields.method_of_payment === 'self-funding' &&
                        <>
                            <hr />
                            <div style={{ fontSize: '14px', width: '90%', margin: 'auto' }}>
                                The appointment fee is £{aTypes[type]['price']}.<br />
                                {
                                    type !== 'KN-VIRTUAL' ?
                                        <><br />When you submit the form you can opt to either pay now or pay in clinic.</> :
                                        <><br />Payment will be collected when submitting this form, which will complete your booking.</>
                                }
                            </div>
                        </>
                }
                <hr />
                <Checkbox
                    name="privacy"
                    value={fields.privacy}
                    updateField={(name: string, value: any) => updateField(name, value)}
                    description="By checking this box you agree that you have read our privacy policy and that the personal information you provide will be processed in accordance with this."
                    required={true}
                    label="I AGREE"
                />
                <hr />
                {
                    (fields.method_of_payment === 'self-funding' && type !== 'KN-VIRTUAL') ?
                        <>
                            <input
                                className={style.stageButton}
                                style={{
                                    width: '98%',
                                    border: '2px solid var(--the-black)',
                                    fontWeight: 400
                                }}
                                type="submit"
                                value="pay in clinic"
                            />
                            <div style={{ width: '80%', margin: 'auto' }}>
                                <Paypal
                                    price={aTypes[type]['price']}
                                    description={aTypes[type]['description']}
                                    paySubmit={() => submit()}
                                />
                            </div>
                        </> :
                        (fields.method_of_payment === 'self-funding' && type === 'KN-VIRTUAL') ?
                            <div style={{ width: '80%', margin: 'auto' }}>
                                <Paypal
                                    price={aTypes[type]['price']}
                                    description={aTypes[type]['description']}
                                    paySubmit={() => submit()}
                                />
                            </div> :
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
                }
            </form>
            <div className={style.stageContainer}>
                <button
                    className={style.stageButton}
                    onClick={() => setStage(1)}
                >
                    Change Selected Time
                </button>
                <button
                    className={style.stageButton}
                    onClick={() => setStage(0)}
                >
                    {type === 'KN-VIRTUAL' ? 'Select A Different Date' : 'Change Appointment Type'}
                </button>
            </div>
        </div>
    )
}

export default BookingForm
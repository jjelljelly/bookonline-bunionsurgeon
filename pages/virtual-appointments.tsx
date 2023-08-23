import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import Progress from '../components/Progress'
import Loading from '../components/Loading'
import Calendar from '../components/Calendar'
import AvailableTimes from '../components/AvailableTimes'
import BookingForm from '../components/BookingForm'
import style from '../styles/Home.module.css'
import { methods } from '../objects/methods'
import Thanks from '../components/Thanks'

const Virtual = () => {
    const stages = [
        {
            number: 1,
            title: 'Select A Date'
        },
        {
            number: 2,
            title: 'Select Appointment Time'
        },
        {
            number: 3,
            title: 'Appointment Details'
        },
        {
            number: 3,
            title: 'Thank You'
        }
    ];
    const [stage, setStage] = useState<{ number: number, title: string }>(stages[0]);
    const [loading, setLoading] = useState<boolean>(false);

    //calendar
    const [availableDates, setAvailableDates] = useState<[[number, number]]>([[0, 0]]);
    const [availableTimes, setAvailableTimes] = useState<string[]>();
    const [selectedTime, setSelectedTime] = useState<[date: string, time: string]>();
    const [date, setDate] = useState<Date>(new Date());

    const updateCalendar = (selectedDate: Date) => {
        setDate(selectedDate)
        setLoading(true)
        const complete = (r: any) => {
            setStage(stages[1])
            setAvailableTimes(r.freeslots)
            setLoading(false)
        }
        methods.post(
            process.env.NEXT_PUBLIC_VIRTUAL_GET_TIMES,
            { "selectedDate": selectedDate },
            complete
        )
    }

    useEffect(() => {
        const complete = (r: any) => {
            setAvailableDates(r)
        }
        methods.post(
            process.env.NEXT_PUBLIC_VIRTUAL_DATES,
            { "year": date.getFullYear() },
            complete
        )
    }, [])

    //select Time
    const selectTime = (selectedTime: string) => {
        setSelectedTime([new Date(selectedTime).toDateString(), new Date(selectedTime).toString().split(' ')[4]]);
        setStage(stages[2])
    }

    return (
        <Layout>

            <Head>
                <title>Bunion Surgeon - Book A Virtual Appointment</title>
                <meta
                    name="description"
                    content="Book a virtual appointment quickly and easily online with our Surgical Consultant, Mr. Kaser Nazir."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0,user-scalable=0"
                />
            </Head>

            <div className={style.container}>
                <div className={style.border}>
                    <h1 className={style.title}>Book A Virtual Appointment</h1>

                    <Progress
                        currentStage={stage}
                        stages={stages}
                        stageName={stage.title}
                        backgroundColor='var(--the-blue)'
                        borderColor='var(--the-black)'
                    />

                    {
                        loading ?
                            <Loading /> :
                            stage.title === 'Select A Date' ?
                                <Calendar
                                    availableDates={availableDates}
                                    date={date}
                                    updateCalendar={(selectedDate: Date) => updateCalendar(selectedDate)}
                                /> :
                                stage.title === 'Select Appointment Time' ?
                                    <AvailableTimes
                                        availableTimes={availableTimes}
                                        selectTime={(selectedTime: string) => selectTime(selectedTime)}
                                        setStage={(n: number) => setStage(stages[n])}
                                    /> :
                                    stage.title === 'Appointment Details' ?
                                        <BookingForm
                                            selectedTime={selectedTime}
                                            setStage={(n: number) => setStage(stages[n])}
                                            setLoading={(b) => setLoading(b)}
                                            type={'KN-VIRTUAL'}
                                        /> :
                                        <Thanks />
                    }

                </div>
            </div>
        </Layout>
    )
}

export default Virtual
import { useState } from 'react'
import { methods } from '../objects/methods'

import Layout from '../components/Layout'
import Loading from '../components/Loading'
import Progress from '../components/Progress'
import AppointmentType from '../components/AppointmentType'
import SelectTime from '../components/SelectTime'
import FindPatient from '../components/FindPatient'
import BookingForm from '../components/BookingForm'
import Thanks from '../components/Thanks'
import FinaliseFollowUp from '../components/FinaliseFollowUp'

import Head from 'next/head'
import style from '../styles/Home.module.css'

export default function Home() {
  //progress bar data
  const stages = [
    {
      number: 1,
      title: 'Select Appointment Type'
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
      number: 1,
      title: 'Help Us To Find You'
    },
    {
      number: 3,
      title: 'Reserve Follow Up'
    },
    {
      number: 3,
      title: 'Thank You'
    }
  ]
  const [stage, setStage] = useState<{ number: number, title: string }>(stages[0]);
  const [loading, setLoading] = useState<boolean>(false);

  //handle Appointment Type Select
  const [availability, setAvailability] = useState<[]>([]);
  const [type, setType] = useState<string>('');
  const [found, setFound] = useState<[boolean, boolean]>([false, false]);
  const [profile, setProfile] = useState<[string, string]>();
  const selectType = (type: string, length: number) => {
    setFound([false, false]) //reset if return to appointment page
    const postData = { date: new Date(), type, appointmentLength: length }
    if (type.indexOf('NP') >= 0) {
      setLoading(true);
      const complete = (a: []) => {
        setAvailability(a)
        setStage(stages[1])
        setLoading(false)
        setType(type)
      }
      methods.post(
        process.env.NEXT_PUBLIC_AVAILABILITY,
        postData,
        complete
      )
    } else if (type.indexOf('FU') >= 0) {
      setStage(stages[3])
      const completeFollowUp = (result: any) => {
        setAvailability(result)
        setType(type)
      }
      methods.post(
        process.env.NEXT_PUBLIC_AVAILABILITY,
        postData,
        completeFollowUp
      )
    }
  }

  //handle client profile through stages
  const [selectedTime, setSelectedTime] = useState<[date: string, time: string]>()

  return (
    <Layout>

      <Head>
        <title>Bunion Surgeon - Book An Appointment</title>
        <meta
          name="description"
          content="Book an appointment quickly and easily online with our Surgical Consultant, Mr. Kaser Nazir."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,user-scalable=0"
        />
      </Head>

      <div className={style.container}>
        <div className={style.border}>
          <h1 className={style.title}>Book An Appointment</h1>

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
              stage.title === 'Select Appointment Type' ?
                <AppointmentType
                  selectType={selectType}
                /> :
                stage.title === 'Select Appointment Time' ?
                  <SelectTime
                    availability={availability}
                    setSelectedTime={(s: [date: string, time: string]) => setSelectedTime(s)}
                    setStage={(n: number) => setStage(stages[n])}
                    found={found}
                  /> :
                  stage.title === 'Help Us To Find You' ?
                    <FindPatient
                      setFound={(b: [boolean, boolean]) => setFound(b)}
                      setLoading={(b: boolean) => setLoading(b)}
                      availability={availability}
                      setStage={(n: number) => setStage(stages[n])}
                      setProfile={(a: [string, string]) => setProfile(a)}
                    /> :
                    stage.title === 'Appointment Details' ?
                      <BookingForm
                        selectedTime={selectedTime}
                        setStage={(n: number) => setStage(stages[n])}
                        setLoading={(b) => setLoading(b)}
                        type={type}
                      /> :
                      stage.title === 'Reserve Follow Up' ?
                        <FinaliseFollowUp
                          type={type}
                          setStage={(n: number) => setStage(stages[n])}
                          selectedTime={selectedTime}
                          found={found}
                          setLoading={(b: boolean) => setLoading(b)}
                          profile={profile}
                        /> :
                        stage.title === 'Thank You' &&
                        <Thanks />
          }

        </div>
      </div>

    </Layout>
  )
}
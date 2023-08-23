import aTypes from '../objects/appointment_types'
import Link from 'next/link'
import style from './AppointmentType.module.css'

type Props = {
  selectType: (type: string, length: number) => void
}

const AppointmentType = ({ selectType }: Props) => {
  return (
    <div className={style.appointments}>
      {
        Object.keys(aTypes).map((type, i) => {
          return (
            <Link
              key={type}
              href={type === 'KN-VIRTUAL' ? '/virtual-appointments' : '/'}
            >
              <div
                className={style.appointmentCard}
                onClick={() => selectType(type, aTypes[type]['length'])}
              >
                <h2>{aTypes[type]['type']}</h2>
                <hr style={{ backgroundColor: 'var(--the-black)' }} />
                <h3><strong>Consultant:</strong> {aTypes[type]['consultant']}</h3>
                <h4><strong>Price:</strong> £{aTypes[type]['price']}</h4>
                <h4>Private Medical Insurance Is Accepted.</h4>
                <h5>{aTypes[type]['description']}</h5>
              </div>
            </Link>
          )
        })
      }
    </div>
  )
}

export default AppointmentType
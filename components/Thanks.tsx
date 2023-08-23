import style from './Thanks.module.css'

const Thanks = () => {
    return (
        <div
            className={style.thanks}
            >
            <p>Thank You for reserving you appointment.</p>
            <p>Please check your emails for confirmation of your booking.</p>
        </div>
    )
}

export default Thanks
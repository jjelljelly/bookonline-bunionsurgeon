import style from './Loading.module.css'

const Loading: React.FC = () => {

    return (
        <div className={style.wakingUp}>
            <div className={style.loadingIcon}>
                <div className={style.firstCircle}></div>
            </div>
            <p className={style.loadingText}>Loading...</p>
        </div>
    )
}

export default Loading
import React, { ReactNode } from 'react'
import Image from 'next/image'
import style from './Layout.module.css'

type Props = {
    children?: ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <>
            <Image 
                src="/images/background-image.jpg"
                className={style.backgroundImage}
                alt="background image"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                />
            <div className={style.layout}>
                { children }
            </div>
        </>
    )
}

export default Layout
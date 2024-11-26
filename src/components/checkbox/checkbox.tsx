import React from 'react'
import styles from './checkbox.module.scss'

type Props = {
    id: string
    children?: React.ReactNode
    className?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, Props>(
    ({ id, children, className }, ref) => {
        return (
            <label htmlFor={id} className={`${styles.wrap} ${className}`}>
                <input ref={ref} type="checkbox" id={id} />
                {children}
            </label>
        )
    }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox

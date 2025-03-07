import React from 'react'
import './Button.css'
import {Link} from 'react-router-dom';


const STYLES = ['btn--primary', 'btn--outline']

const SIZES = ['btn--medium', 'btn--large']

export const Button = ({children, type, onClick, buttonStyle, buttonSize}) => { // Button component
    const checkButtonStyle = STYLES.include(buttonStyle)
     ? buttonStyle: 
     STYLES[0]


     const checkButtonSize = SIZES.includes(buttonSize)? buttonSize : SIZES[0];
}
import React from 'react';

type ButtonProps = {
    text: string;
}

export default function Button(props: ButtonProps) {
    const {text} = props;
    return (
        <button className='button'>
            <p className='button__text'>{text}</p>
        </button>
    );
};

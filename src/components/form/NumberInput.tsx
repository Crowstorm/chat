import React from 'react';
import { IonInput, IonItem } from '@ionic/react';
import './form.css'

const NumberInput: React.FC<{
    id: string,
    placeholder: string,
    errors: string
    min: string 
    max: string 
    onChange: (field: string, value: any) => void
}> = ({ id, placeholder, errors, min, max, onChange }) => {
    return (
        <IonItem
        className="numberInputContainer"
        >
            <IonInput
            className="textInput"
                type="number"
                min={min}
                max={max}
                placeholder={placeholder}
                onIonChange={(e) => onChange(id, +e.detail.value)}
            >
            </IonInput>
            <div>
                {(errors) && errors}
            </div>
        </IonItem>
    )
}

export default NumberInput;
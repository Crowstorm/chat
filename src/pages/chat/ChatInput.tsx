import React from 'react';
import { IonInput, IonItem } from '@ionic/react';
import './chat.css'

const NumberInput: React.FC<{
    value: string
    onChange: (value: any) => void
}> = ({ value, onChange }) => {
    return (
        <IonItem className="chatInput">
            <IonInput
                value={value}
                onIonChange={(e) => onChange(e.detail.value)}
                placeholder="Write something nice"
            >
            </IonInput>
        </IonItem>
    )
}

export default NumberInput;
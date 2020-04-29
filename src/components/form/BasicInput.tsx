import React from 'react';
import { IonInput, IonItem } from '@ionic/react';

const BasicInput: React.FC<{
    id: string,
    placeholder: string,
    errors: string
    onChange: (field: string, value: any) => void
}> = ({ id, placeholder, errors, onChange }) => {
    return (
        <IonItem
            className="textInputContainer"
        >
            <IonInput
                className="textInput"
                placeholder={placeholder}
                onIonChange={(e) => onChange(id, e.detail.value)}
            >
            </IonInput>
            <div>
                {(errors) && errors}
            </div>
        </IonItem>
    )
}

export default BasicInput;
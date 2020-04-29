import React from 'react';
import { IonInput, IonItem, IonRange, IonLabel, IonText } from '@ionic/react';

const RangeInput: React.FC<{
    id: string,
    min: number
    max: number
    lower: number
    upper: number
    onChange: (field: string, value: any) => void
}> = ({ id, min, max, lower, upper, onChange }) => {
    const value = { lower, upper };
    return (
        <React.Fragment>
            <IonRange
                min={min}
                max={max}
                step={1}
                dualKnobs={true}
                snaps={true}
                value={value}
                onIonChange={e => onChange(id, e.detail.value)}
                color="tertiary"
                className="rangeInput"
            >
                <IonLabel slot="start" color="secondary">{min}</IonLabel>
                <IonLabel slot="end" color="secondary">{max}</IonLabel>
            </IonRange>
            <p
                className="ageRangeLabel"
            >
                Age from: {lower} to: {upper}
            </p>
        </React.Fragment>
    )
}

export default RangeInput;
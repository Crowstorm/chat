import React from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import './form.css'

interface Values {
    value: string,
    name: string,
}


const SegmentButton: React.FC<{
    id: string,
    label: string,
    values: Array<Values>,
    value: string
    onChange: (field: string, value: any) => void
}> = ({ id, label, values, value, onChange }) => {


    const buttons = values.map(v => {
        const classes = (v.value === value) ? "segmentButton segmentButtonActive" : "segmentButton";
        return (
            <IonSegmentButton value={v.value} key={v.value} className={classes}>
                <IonLabel>
                    {v.name}
                </IonLabel>
            </IonSegmentButton>
        )
    })


    return (
        <IonSegment onIonChange={e => onChange(id, e.detail.value)} className="segment">
            <IonLabel className="segmentLabel">{label}</IonLabel>
            <div className="segmentButtonContainer">
                {buttons}
            </div>
        </IonSegment>
    )
}

export default SegmentButton;
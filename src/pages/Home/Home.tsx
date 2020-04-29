import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonHeader, IonContent, IonToolbar, IonTitle, IonPage, IonList, IonButton } from '@ionic/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import { firestore } from '../../firebase';
import './home.css'


import SegmentButton from '../../components/form/SegmentButton';
import RangeInput from '../../components/form/Range';

type HomeProps = {
    socket: any
}

const Home: React.FC<HomeProps> = ({socket}) => {
    
    const history = useHistory();
    const [formData, setFormData] = useState(null);

    const submitForm = (values: any) => {
        setFormData(values);

        //znajdź osoby o podanych parametrach i wylosuj jedna
        let validUsers: string[] = []
        const currentUser = JSON.parse(localStorage.getItem("currentUser")).id;

        firestore.collection('users')
            .where("age", ">=", values.age.lower)
            .where("age", "<=", values.age.upper)
            .where("age", "<=", values.age.upper)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(function (doc) {
                    if(doc.id !== currentUser){
                        validUsers.push(doc.id)
                    }
                });

                //jesli nie ma takich userow to powiadomic

                const randomUser = _.sample(validUsers);
                const conversationUsers = [currentUser, randomUser];

                //sprawdzic czy z ta osoba konwersacja juz nie istnieje, jesli istnieje podlaczyc sie do niej ponownie
                firestore.collection('conversations')
                    .where('users', '==', conversationUsers)
                    .get()
                    .then(querySnapshot => {
                        if (querySnapshot.size > 0) {
                            history.push('/conversation/' + querySnapshot.docs[0].id)
                            return;
                        } else {
                            //stworz konwersacje pomiedzy tymi osobami i pobierz id by do niej przejsc
                            firestore.collection('conversations')
                                .add({
                                    messages: [],
                                    users: conversationUsers
                                })
                                .then(docRef => {
                                    socket.emit('new conversation', randomUser);
                                    history.push('/conversation/' + docRef.id)
                                })
                                .catch((error) => {
                                    console.error("Error adding document: ", error);
                                });
                        }
                    })
            })
    }

    return (
        <IonPage >
            <div className="flex height100 ion-justify-content-center ion-align-items-center mainColorBackground">
                <Formik
                    initialValues={{
                        gender: 'male',
                        age: { lower: 18, upper: 30 }
                    }}
                    validationSchema={
                        Yup.object({

                        })
                    }
                    onSubmit={(values, { setSubmitting }) => {
                        submitForm(values);
                    }}
                >
                    {formik => (
                        <form onSubmit={formik.handleSubmit} className="findSomeoneContainer">

                            <SegmentButton
                                id="gender"
                                values={[{ value: 'male', name: 'Male' }, { value: 'female', name: 'Female' }]}
                                value={formik.values.gender}
                                label="Look for"
                                onChange={formik.setFieldValue}
                            />

                            <RangeInput
                                id="age"
                                min={18}
                                max={30}
                                lower={formik.values.age.lower}
                                upper={formik.values.age.upper}
                                onChange={formik.setFieldValue}
                            />

                            <IonButton type="submit" color="secondary" expand="block">
                                Find someone
                                </IonButton>
                        </form>
                    )}
                </Formik>
            </div>
        </IonPage>
    )
}

export default Home;
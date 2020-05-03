import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonButton } from '@ionic/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import { firestore } from '../../firebase';
import io from 'socket.io-client';

import './home.css'


import SegmentButton from '../../components/form/SegmentButton';
import RangeInput from '../../components/form/Range';

type HomeProps = {
    socket: any
}

const Home: React.FC<HomeProps> = ({ socket }) => {

    const history = useHistory();
    const [formData, setFormData] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("currentUser")).id;
    if (currentUser && !socket) {
        socket = io(':3000', {
            query: {
                id: currentUser
            }
        })
    };

    const doesConversationExist = async (conversationUsers: any, reversedConversationUsers: any) => {
        const doesChatExists1 = firestore.collection('conversations')
            .where('users', '==', reversedConversationUsers)
            .get();
        const doesChatExists2 = firestore.collection('conversations')
            .where('users', '==', conversationUsers)
            .get();

        const [check1, check2] = await Promise.all([
            doesChatExists1,
            doesChatExists2
        ]);


        if (check1.docs.length === 0 && check2.docs.length === 0) {
            return false;
        } else {
            if (check1.docs && check1.docs[0] && check1.docs[0].id) {
                console.log(check1.docs[0].id)
                return check1.docs[0].id
            } else if (check2.docs && check2.docs[0] && check2.docs[0].id) {
                console.log(check2.docs[0].id)
                return check2.docs[0].id
            }

        }

    }

    const submitForm = (values: any) => {
        setFormData(values);
        console.log(formData)
        console.log(values)

        //znajdź osoby o podanych parametrach i wylosuj jedna
        let validUsers: string[] = []

        firestore.collection('users')
            .where("age", ">=", values.age.lower)
            .where("age", "<=", values.age.upper)
            .where("age", "<=", values.age.upper)
            .where("age", "<=", values.age.upper)
            // .where("gender", "==", values.gender)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(function (doc) {
                    if (doc.id !== currentUser) {
                        validUsers.push(doc.id)
                    }
                });

                //jesli nie ma takich userow to powiadomic
                if (validUsers.length > 0) {
                    const randomUser = _.sample(validUsers);
                    const conversationUsers = [currentUser, randomUser];
                    const reversedConversationUsers = [randomUser, currentUser];

                    //sprawdzic czy z ta osoba konwersacja juz nie istnieje, jesli istnieje podlaczyc sie do niej ponownie
                    doesConversationExist(conversationUsers, reversedConversationUsers).then(res => {
                        console.log(res);

                        if (res) {
                            history.push('/conversation/' + res);
                            return;
                        } else {
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
                    });

                    // .then(querySnapshot => {
                    //     if (querySnapshot.size > 0) {
                    //         history.push('/conversation/' + querySnapshot.docs[0].id)
                    //         return;
                    //     } else {
                    //         //stworz konwersacje pomiedzy tymi osobami i pobierz id by do niej przejsc
                    //         firestore.collection('conversations')
                    //             .add({
                    //                 messages: [],
                    //                 users: conversationUsers
                    //             })
                    //             .then(docRef => {
                    //                 socket.emit('new conversation', randomUser);
                    //                 history.push('/conversation/' + docRef.id)
                    //             })
                    //             .catch((error) => {
                    //                 console.error("Error adding document: ", error);
                    //             });
                    //     }
                    // })


                } else {
                    alert('nie ma userow spelniajacych warunkui')
                }


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
import React, { useState, useEffect } from 'react';
import { IonButton, IonPage, IonList, IonText } from '@ionic/react';
import { Formik  } from 'formik';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { auth, firestore } from '../../firebase';

import './login.css'

import BasicInput from '../../components/form/BasicInput';
import NumberInput from '../../components/form/NumberInput';
import SegmentButton from '../../components/form/SegmentButton';

const Login: React.FC = () => {
    const history = useHistory();
    const usersCollection = firestore.collection('users');

    const [formData, setFormData] = useState(null);
    const [isUserSaved, setIsUserSaved] = useState(false);


    useEffect(() => {
        // const currentUser = localStorage.getItem("currentUser");

        // if (currentUser) {
        //     history.replace('/home');
        // }
    }, [])

    const calculateAge = (birthdate: any) => {
        if (formData) {
            var diff_ms = Date.now() - birthdate.getTime();
            var age_dt = new Date(diff_ms);

            return Math.abs(age_dt.getUTCFullYear() - 1970);
        }
    }

    auth.onAuthStateChanged(function (user) {
        if (user) {
            if (formData && !isUserSaved) {
                const uid = user.uid

                let newUser = {
                    uid: uid,
                    name: formData.name,
                    age: calculateAge(new Date(formData.year, formData.month, formData.day)),
                    id: ''
                }


                usersCollection.add(newUser).then((docRef) => {
                    newUser.id = docRef.id;
                    localStorage.setItem("currentUser", JSON.stringify(newUser));
                    setIsUserSaved(true);
                })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });

            }

        } else {
            // User is signed out.
            // ...
        }
    });

    const submitForm = (values: any) => {
        setFormData(values);
        auth.signInAnonymously().catch(function (error: any) {
            console.error(error)
        });
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (isUserSaved) {
            history.replace('/home');
            console.log('zalogowany')
            window.location.reload(); 
        }

    }, [isUserSaved])

    return (
        <IonPage>
            <div className="flex height100 ion-justify-content-center ion-align-items-center mainColorBackground">
                <IonList className="mainColorBackground">
                    <Formik
                        initialValues={{
                            name: 'Marian',
                            gender: 'male',
                            day: 1,
                            month: 1,
                            year: 1970
                        }}
                        validationSchema={
                            Yup.object({
                                name: Yup.string()
                                    .min(3, 'Name must be at least 3 characters')
                                    .max(30, 'Name must be 30 characters or less')
                                    .required('Required'),
                            })
                        }
                        onSubmit={(values, { setSubmitting }) => {
                            submitForm(values);
                        }}
                    >
                        {formik => (
                            <form onSubmit={formik.handleSubmit} className="formContainer">
                                <BasicInput
                                    id="name"
                                    placeholder={"Your name"}
                                    onChange={formik.setFieldValue}
                                    errors={formik.errors?.name}
                                />

                                <SegmentButton
                                    id="gender"
                                    values={[{ value: 'male', name: 'Male' }, { value: 'female', name: 'Female' }]}
                                    value={formik.values.gender}
                                    label="Select your gender"
                                    onChange={formik.setFieldValue}
                                />

                                <IonText color="secondary">
                                    Birthday
                                </IonText>

                                <div className="birthdayContainer">
                                    <NumberInput
                                        id="day"
                                        placeholder="Day"
                                        onChange={formik.setFieldValue}
                                        errors={formik.errors?.day}
                                        min={'1'}
                                        max={'31'}
                                    />
                                    <NumberInput
                                        id="month"
                                        placeholder="Month"
                                        onChange={formik.setFieldValue}
                                        errors={formik.errors?.month}
                                        min={'1'}
                                        max={'12'}
                                    />
                                    <NumberInput
                                        id="year"
                                        placeholder="Year"
                                        onChange={formik.setFieldValue}
                                        errors={formik.errors?.year}
                                        min={'1900'}
                                        max={'2002'}
                                    />
                                </div>

                                <IonButton type="submit" className="submitButton" color="secondary" expand="block"> 
                                    Done
                                </IonButton>
                            </form>
                        )}
                    </Formik>
                </IonList>
            </div>
        </IonPage>
    )
}

export default Login;
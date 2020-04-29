import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonItem, IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { firestore } from '../../firebase';
import './conversations.css';

const Conversations: React.FC = () => {
    const history = useHistory();


    const chatRef = firestore.collection('conversations');
    const userRef = firestore.collection('users');

    const [conversations, setConversations] = useState([]);

    const getConversationsList = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")).id;
        chatRef
            .where('users', 'array-contains', currentUser)
            .get()
            .then(results => {
                let data: any = []
                results.forEach(result => {
                    const id = result.id;
                    const res = result.data();
                    res.id = id;
                    data.push(res);
                })

                Promise.all(data.map(async (d: any) => {
                    const name = await getConversationPartnerName(d.users);
                    d.name = name;
                })).then(() => {
                    setConversations(data);
                })


            })
    }

    useEffect(() => {
        getConversationsList();
    }, [])

    // useEffect(() => {
    //     getConversationsList();
    // })

    const getConversationPartnerName = (users: string[]) => {
        return new Promise((resolve) => {
            if (users.length >= 2) {
                const currentUser = JSON.parse(localStorage.getItem("currentUser")).id;
                let id;
                if (users[0] === currentUser) {
                    id = users[1];
                } else {
                    id = users[0];
                }

                userRef
                    .doc(id)
                    .get()
                    .then(result => {
                        if (result.data().name) {
                            resolve(result.data().name)
                        }

                    })
            } else {
                resolve('');
            }

        })
    }

    const renderConversations = () => {
        return conversations.map((conv, i) => {
            return (
                <div
                    className="conversationSingle"
                    key={i}
                    onClick={() => history.push(`/conversation/${conv.id}`)}
                >
                    {conv.name}
                </div>

            )
        })
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Conversations</IonTitle>
                </IonToolbar>
            </IonHeader>
            <div className="height100  mainColorBackground">
                {/* <IonItem> */}
                {renderConversations()}
                {/* </IonItem> */}
            </div>
        </IonPage>
    )
}

export default Conversations;
import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonPage, IonButtons, IonBackButton } from '@ionic/react';
import { firestore } from '../../firebase';
import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

import ChatInput from './ChatInput';
import Message from './Message';

// let socket: any;

type ChatProps = {
    socket: any
}

const Chat: React.FC<ChatProps> = ({ socket }) => {

    const currentUser = JSON.parse(localStorage.getItem("currentUser")).id;
    if (currentUser && !socket) {
        socket = io(':3000', {
            query: {
                id: currentUser
            }
        })
    };

    const chatId = useParams<{ id: string }>().id;
    const chatRef = firestore.collection("conversations").doc(chatId);
    const userRef = firestore.collection("users")
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const [matchedPersonName, setMatchedPersonName] = useState('');
    const [matchedPersonAge, setMatchedPersonAge] = useState('');
    const [matchedPersonId, setMatchedPersonId] = useState('');

    const getMessages = () => {
        chatRef.get().then(function (doc) {
            if (doc.exists) {
                setMessages(doc.data().messages);
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }

    const getMatchedPersonData = () => {
        chatRef.get().then(function (doc) {
            if (doc.exists) {
                if (doc.data().users && doc.data().users.length >= 2 && doc.data().users[1]) {
                    const id = (currentUser === doc.data().users[1]) ? doc.data().users[0] : doc.data().users[1];
                    console.log(currentUser, '   ', id);
                    setMatchedPersonId(id);

                    userRef
                        .doc(id)
                        .get()
                        .then(result => {
                            if (result.data().name) {
                                setMatchedPersonName(result.data().name);
                            }
                            if (result.data().age) {
                                setMatchedPersonAge(result.data().age);
                            }
                        })
                }
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }

    useEffect(() => {
        getMessages();
        getMatchedPersonData();
    }, [])

    socket.on('chat message', () => {
        console.log('wiadomooooooosc')
        getMessages();
    })

    const renderMessages = () => {
        return messages.map((msg, i) => {
            let isCurrentUsersMsg = false;
            if (msg.user === JSON.parse(localStorage.getItem("currentUser")).id) {
                isCurrentUsersMsg = true;
            }
            return (
                <Message
                    name={matchedPersonName}
                    key={i}
                    value={msg.msg}
                    isCurrentUsersMsg={isCurrentUsersMsg}
                />
            )
        })
    }

    const createNewMsg = () => {
        let newMsg = {
            user: '',
            msg: ''
        }
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        newMsg.user = currentUser.id;
        newMsg.msg = msg;

        messages.push(newMsg);

        chatRef.update({
            messages: messages
        })
            .then(function () {
                console.log("Document successfully updated!");
                socket.emit('chat message', matchedPersonId);
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });


    }

    const onFormSubmit = (e: any) => {
        e.preventDefault()
        createNewMsg();
        setMsg('');
    }

    return (
        <IonPage>
            <IonHeader >
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>
                        {matchedPersonName}, {matchedPersonAge}y.o
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <div className="height100  mainColorBackground">
                {renderMessages()}

                <form onSubmit={onFormSubmit}>
                    <ChatInput
                        value={msg}
                        onChange={setMsg}
                    />
                </form>
            </div>
        </IonPage>
    )
}

export default Chat;
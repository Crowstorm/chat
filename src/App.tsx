import React from 'react';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs } from '@ionic/react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { list } from 'ionicons/icons'
import io from 'socket.io-client';

import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Conversations from './pages/Conversations/Conversations';
import Chat from './pages/chat/Chat';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
let socket: any;



const App: React.FC = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && !socket) {
        socket = io(':3000', {
            query: {
                id: currentUser.id
            }
        })
    };

    socket.on('new conversation', () => {
        console.log('masz wiadomosc')
        alert('nowa wiadomosc mordo')
    })

    return (

        <IonApp>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route path="/" exact >
                            <Login />
                        </Route>
                        <Route path="/home" exact>
                            <Home socket={socket}/>
                        </Route>
                        <Route path="/conversation/:id">
                            <Chat socket={socket} />
                        </Route>
                        <Route path="/conversations" exact>
                            <Conversations />
                        </Route>
                        <Redirect to="/" />
                    </IonRouterOutlet>

                    <IonTabBar slot="bottom" color="primary">
                        <IonTabButton
                            tab="home"
                            href="/home"
                        >
                            <IonIcon icon={list} />
                            <IonLabel>Home</IonLabel>
                        </IonTabButton>

                        <IonTabButton
                            tab="conversations"
                            href="/conversations"
                        >
                            <IonIcon icon={list} />
                            <IonLabel>Conversations</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </IonApp>
    )
};

export default App;

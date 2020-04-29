import React from 'react';
import './chat.css'

const Message: React.FC<{
    name: string,
    value: string,
    isCurrentUsersMsg: boolean
}> = ({ value, isCurrentUsersMsg, name }) => {

    const label = () => {
        if (isCurrentUsersMsg) {
            return (
                <div className="ownerName">
                    You
                </div>
            )
        } else if (name) {
            return (
                <div className="otherUserName">
                    {name}
                </div>
            )
        }
    }

    return (
        <div className="messageContainer">
            {label()}
            <div>
                {value}
            </div >
        </div>
    )
}

export default Message;
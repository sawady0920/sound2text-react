import React, {FC, useEffect, useState} from 'react';
import actioncable from 'actioncable'

const END_POINT = 'ws://127.0.0.1:3002/cable/'

const cable = actioncable.createConsumer(END_POINT)

export const WebSocketSample:FC = () => {
    const [roomCh, setRoomCh] = useState<actioncable.Channel|undefined>(undefined)
    const [msg, setMsg] = useState<string>('')
    const [receivedData, setReceivedData] = useState<{msg: string, date: Date}>({msg:'', date: new Date()})
    const [msgs, setMsgs] = useState<string[]>([])
    const msgChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setMsg(event.currentTarget.value)
    }
    const buttonClickHandler = () =>{
        roomCh?.perform('speak', {data:msg})
        setMsg('')
    }
    const addMsg = (msg: string) => {
        setMsgs([...msgs, msg])
    }
    const receive = (obj: any) =>{
        console.log('received')
        setReceivedData({msg: obj.message, date: new Date()})
    }
    const setUpSubscription = () =>{
        const tmpRoomCh = cable.subscriptions.create('RoomChannel',{
            connected: () => {
                console.log('connected')
            },
            disconnected: () => {console.log('disconnected')},
            received: receive
        });
        setRoomCh(tmpRoomCh)
    }

    useEffect(() => {
        setUpSubscription()
    }, [])

    useEffect(()=>{
        // Note: 初期Mount時には発火させたくないため以下のif文を記述
        if(receivedData.msg != ''){
            addMsg(receivedData.msg)
        }
    },[receivedData])

    return(
        <>
        {console.log(msgs)}
        WebSocketSample
        <h3>msgs</h3>
        <ul>
        {msgs && msgs.length > 0 && msgs.map((m,index)=>{
            return <li key={m + index}>{m}</li>;
        })}
        </ul>
        <input onChange={msgChangeHandler} value={msg}/>
        <button onClick={buttonClickHandler}>押す</button>
        </>
    );
};

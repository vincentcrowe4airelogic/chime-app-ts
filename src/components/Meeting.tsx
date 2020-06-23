import React, { useRef, useState, useEffect } from 'react';
import { useChimeContext } from '../context/ChimeSdk';
  
interface IMeetingInfo {
    started: boolean,
    meeting: any;
    attendee: any;
}

export const Meeting = () => {
    const [ meetingInfo, setMeetingInfo ] = useState<IMeetingInfo>({ started: false, meeting: {}, attendee: {}});
    const chimeContext = useChimeContext();

    const localVideo = useRef<HTMLVideoElement>(null!);
    const remoteVideo = useRef<HTMLVideoElement>(null!);
    const audioRef = useRef<HTMLAudioElement>(null!);

    const startMeeting = async () => {
        fetch('https://mbsnz79c79.execute-api.eu-west-2.amazonaws.com/dev/room', {method: 'POST'})
        .then(resp => resp.json())
        .then(json =>
            setMeetingInfo({ started: true, meeting: json.meeting, attendee: json.attendee })
      );
    }

    const joinMeeting = async () => {
        fetch('https://mbsnz79c79.execute-api.eu-west-2.amazonaws.com/dev/join', {method: 'POST'})
        .then(resp => resp.json())
        .then(json =>
            setMeetingInfo({ started: true, meeting: json.meeting, attendee: json.attendee })
      );
    }

    const startPreview = async () => {
        await chimeContext.prepareMeeting();
        chimeContext.startPreview(localVideo.current);
    }

    useEffect(() => {
        if(!meetingInfo.started)
            return;

        chimeContext.initialiseMeeting(meetingInfo);        
    }, [meetingInfo] )

    useEffect(() => {
        if(chimeContext.meetingSession != null)
            startPreview();
    }, [chimeContext.meetingSession])

    useEffect(() => {
        showConnectedUser();
    }, [chimeContext.participants])

    useEffect(() => {
        if(chimeContext.state == 'ready')
        {
            chimeContext.join(audioRef.current);
        }
        else if(chimeContext.state == 'joined')
            showConnectedUser();
    }, [chimeContext.state])

    const showConnectedUser = () => {
        if(chimeContext.participants.length > 0) {
            chimeContext.showVideo(chimeContext.participants[0], remoteVideo.current);
        }
    } 
    
    return (
        <>
        <audio ref={audioRef} />
        <video muted style={{border: "solid 1px black", display: "block"}} ref={localVideo} />
        <video style={{border: "solid 1px black", display: "block"}} ref={remoteVideo} />
        <button onClick={startMeeting}>Start</button>
        <button onClick={joinMeeting}>Join</button>
        </>
    )
}
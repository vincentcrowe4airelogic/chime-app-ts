import React, { useRef, useState, useEffect } from 'react'
import { ConsoleLogger, DefaultDeviceController, DefaultMeetingSession, LogLevel, MeetingSessionConfiguration } from 'amazon-chime-sdk-js';
  
interface IMeetingInfo {
    started: boolean,
    meeting: any;
    attendee: any;
}

export const Meeting = () => {
    const logger = new ConsoleLogger('MyLogger', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    const [ meetingInfo, setMeetingInfo ] = useState<IMeetingInfo>({ started: false, meeting: {}, attendee: {}});
    const [ meetingSession, setMeetingSession ] = useState<any|null>(null);

    const videoRef = useRef<HTMLVideoElement>(null!);
    const audioRef = useRef<HTMLAudioElement>(null!);

    const startMeeting = async () => {
        fetch('https://rrz7e3wd7l.execute-api.eu-west-2.amazonaws.com/dev/room', {method: 'POST'})
        .then(resp => resp.json())
        .then(json =>
            setMeetingInfo({ started: true, meeting: json.meeting, attendee: json.attendee })
      );
    }

    const startPreview = async () => {
        const videoInputDevices = await meetingSession.audioVideo.listVideoInputDevices();
        const videoInputDeviceInfo = videoInputDevices[0];
        await meetingSession.audioVideo.chooseVideoInputDevice(videoInputDeviceInfo.deviceId);

        meetingSession.audioVideo.startVideoPreviewForVideoInput(videoRef.current);
    }

    useEffect(() => {

        if(!meetingInfo.started)
            return;

        console.log(meetingInfo);

        const configuration = new MeetingSessionConfiguration(meetingInfo.meeting, meetingInfo.attendee);
                
        const meetingSession = new DefaultMeetingSession(
          configuration,
          logger,
          deviceController
        );

        setMeetingSession(meetingSession);

    }, [meetingInfo] )

    useEffect(() => {
        if(meetingSession != null)
            startPreview();
    }, [meetingSession])

    const connectDevices = async () => {
        const audioInputDevices = await meetingSession.audioVideo.listAudioInputDevices();
        const audioOutputDevices = await meetingSession.audioVideo.listAudioOutputDevices();
        const videoInputDevices = await meetingSession.audioVideo.listVideoInputDevices();

        const audioInputDeviceInfo = audioInputDevices[0];
        await meetingSession.audioVideo.chooseAudioInputDevice(audioInputDeviceInfo.deviceId);

        const audioOutputDeviceInfo = audioOutputDevices[0];
        await meetingSession.audioVideo.chooseAudioOutputDevice(audioOutputDeviceInfo.deviceId);

        const videoInputDeviceInfo = videoInputDevices[0];
        await meetingSession.audioVideo.chooseVideoInputDevice(videoInputDeviceInfo.deviceId);

        meetingSession.audioVideo.bindAudioElement(audioRef.current);
        
        const observer = {
            // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
            videoTileDidUpdate: (tileState : any) => {
              // Ignore a tile without attendee ID and other attendee's tile.
              if (!tileState.boundAttendeeId || !tileState.localTile) {
                return;
              }
          
              console.log("connecting video");
              meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoRef.current);
            }
          };
          
          meetingSession.audioVideo.addObserver(observer);
          
          meetingSession.audioVideo.startLocalVideoTile();
    }

    return (
        <>
        <audio ref={audioRef} />
        <video style={{border: "solid 1px black", display: "block"}} ref={videoRef} />
        <button onClick={startMeeting}>Start</button>
        </>
    )
}
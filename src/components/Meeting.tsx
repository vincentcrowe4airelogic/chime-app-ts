import React, { useRef, useState, useEffect } from 'react'
import { ConsoleLogger, DefaultDeviceController, DefaultMeetingSession, LogLevel, MeetingSessionConfiguration, MeetingSessionStatusCode } from 'amazon-chime-sdk-js';
  
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
    const videoRef2 = useRef<HTMLVideoElement>(null!);
    const audioRef = useRef<HTMLAudioElement>(null!);

    const startMeeting = async () => {
        fetch('https://mbsnz79c79.execute-api.eu-west-2.amazonaws.com/dev/room', {method: 'POST'})
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



    const observer = {
        audioVideoDidStart: () => {
          console.log('Started');
        },

        videoTileDidUpdate: (tileState: { boundAttendeeId: any; localTile: any; isContent: any; tileId: any; }) => {
            // Ignore a tile without attendee ID, a local tile (your video), and a content share.

            if (!tileState.boundAttendeeId || tileState.isContent) {
              return;
            }

            if(tileState.localTile)
            {
                meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoRef.current);
            }
            else
            {        
            meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoRef2.current);
            }
          },
          audioVideoDidStop: (sessionStatus: { statusCode: () => any; }) => {
            const sessionStatusCode = sessionStatus.statusCode();
            if (sessionStatusCode === MeetingSessionStatusCode.Left) {
              /*
                - You called meetingSession.audioVideo.stop().
                - When closing a browser window or page, Chime SDK attempts to leave the session.
              */
              console.log('You left the session');
            } else {
              console.log('Stopped with a session status code: ', sessionStatusCode);
            }
          }
      };

    const startSession = async () =>{
        meetingSession.audioVideo.addObserver(observer);
        meetingSession.audioVideo.start();
    }

    const stopSession = async() => {
        meetingSession.audioVideo.stop();
    }

    const toggleMyVideo = async () => {
        const videoInputDevices = await meetingSession.audioVideo.listVideoInputDevices();
        const videoInputDeviceInfo = videoInputDevices[0];
        await meetingSession.audioVideo.chooseVideoInputDevice(videoInputDeviceInfo.deviceId);

        meetingSession.audioVideo.startLocalVideoTile();
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

    // useEffect(() => {
    //     if(meetingSession != null)
    //         //startPreview();
    // }, [meetingSession])

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
        <video style={{border: "solid 1px black", display: "block"}} ref={videoRef2} />
        <button onClick={startMeeting}>Start</button>
        <button onClick={startSession}>Start Session</button>
        <button onClick={stopSession}>Stop Session</button>
        <button onClick={toggleMyVideo}>Toggle my video</button>
        </>
    )
}
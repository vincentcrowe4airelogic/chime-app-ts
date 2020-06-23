import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConsoleLogger, DefaultDeviceController, DefaultMeetingSession, LogLevel, MeetingSessionConfiguration, SessionStateControllerState } from 'amazon-chime-sdk-js';
import { connect } from 'http2';

export interface IChimeContext {
    initialiseMeeting: (meetingInfo: any) => void;
    startPreview: (videoElement: HTMLVideoElement) => Promise<void>;    
    prepareMeeting: () => Promise<void>;
    join: (audio: HTMLAudioElement) => void;
    showVideo: (tileInfo: any, video: HTMLVideoElement) => void;
    meetingSession: any;
    audioVideo: any;
    state: 'initialising' | 'initialised' | 'ready' | 'joined';
    participants: any[];
}

export const ChimeContext = createContext<IChimeContext>(null!);

export const ChimeProvider = (props: any) => {
    const logger = new ConsoleLogger('MyLogger', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    const [ meetingSession, setMeetingSession ] = useState<any|null>(null);
    const [ audioVideo, setAudioVideo ] = useState<any|null>(null);
    const [ participants, setParticipants ] = useState<any[]>([] as any[]);
    const [ state, setState ] = useState<'initialising' | 'initialised' | 'ready' | 'joined'>('initialising');

    const initialiseMeeting = (meetingInfo: any) : void => {
        const configuration = new MeetingSessionConfiguration(meetingInfo.meeting, meetingInfo.attendee);
                
        const meetingSession = new DefaultMeetingSession(
          configuration,
          logger,
          deviceController
        );

        setAudioVideo(meetingSession.audioVideo);
        setMeetingSession(meetingSession);
        setState('initialised')
    }

    const startPreview = async (videoElement: HTMLVideoElement) => {
        const videoInputDevices = await audioVideo.listVideoInputDevices();
        const videoInputDeviceInfo = videoInputDevices[0];
        await audioVideo.chooseVideoInputDevice(videoInputDeviceInfo.deviceId);

        audioVideo.startVideoPreviewForVideoInput(videoElement);
    }

    const prepareMeeting = async () => {
        const audioInputDevices = await audioVideo.listAudioInputDevices();
        const audioOutputDevices = await audioVideo.listAudioOutputDevices();
        
        const audioInputDeviceInfo = audioInputDevices[0];
        await audioVideo.chooseAudioInputDevice(audioInputDeviceInfo.deviceId);

        const audioOutputDeviceInfo = audioOutputDevices[0];
        await audioVideo.chooseAudioOutputDevice(audioOutputDeviceInfo.deviceId);

        const observer = {
            // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
            videoTileDidUpdate: (tileState : any) => {
              // Ignore a tile without attendee ID and other attendee's tile.
              if(tileState.localTile)
                return;

                alert("remote connection");
                setParticipants([...participants, tileState]);
            },
            audioVideoDidStart: () => {
                setState('ready');
            }
          };
          
          audioVideo.addObserver(observer);
          audioVideo.start();
    }

    const join = (audio: HTMLAudioElement) => {
        audioVideo.startLocalVideoTile();
        audioVideo.bindAudioElement(audio);
        setState('joined');
    }

    const showVideo = (tileInfo: any, video: HTMLVideoElement) => {
        audioVideo.bindVideoElement(tileInfo.tileId, video);
    }

    useEffect(() => {
        if(meetingSession != null)
            setAudioVideo(meetingSession.audioVideo);
    }, [meetingSession])

    return (
        <ChimeContext.Provider value={{
            initialiseMeeting, 
            startPreview,
            prepareMeeting, 
            join,
            showVideo,
            meetingSession, 
            audioVideo,
            state,
            participants}} >
            {props.children}
        </ChimeContext.Provider>
    )
};

export const useChimeContext = () => {
    const context = useContext(ChimeContext);
    if (!context) {
      throw new Error('useVideoContext must be used within a VideoProvider');
    }
    return context;
  }
import React, { useEffect } from 'react';
import IPatientSlot from '../../interfaces/IPatientSlot';
import { makeStyles, Card, CardContent, Typography, CardActions, Button, Box } from '@material-ui/core';
import CopyToClipboard from 'react-copy-to-clipboard';

interface IClinicianSlotProps {
  slot: IPatientSlot;
  joinSlot: () => void;
}

const useStyles = makeStyles(({ spacing, palette }) => {
  const family =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
  return {
    root: {
      minWidth: 275,
    },
    card: {
      display: 'flex',
      padding: spacing(2),
      minWidth: 288,
      borderRadius: 12,
      marginTop: 3,
      boxShadow: '0 2px 4px 0 rgba(138, 148, 159, 0.2)',
      '& > *:nth-child(1)': {
        marginRight: spacing(2),
      },
      '& > *:nth-child(2)': {
        flex: 'auto',
      },
    },
    heading: {
      fontFamily: family,
      fontSize: 16,
      marginBottom: 0,
      marginTop: 1,
    },
    subheader: {
      fontFamily: family,
      fontSize: 14,
      color: palette.grey[600],
      letterSpacing: '1px',
      marginBottom: 4,
      marginTop: 1,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 1,
    },
  };
});

export default function ClinicianSlot(props: IClinicianSlotProps) {
  const classes = useStyles();

  const getHost = () => {
    return `${window.location.host}`;
  };

  return (
    <Card className={classes.card}>
      <Box>
        <h3 className={classes.heading}>{props.slot.SubjectName}</h3>
        <p className={classes.subheader}>{props.slot.State}</p>
      </Box>
      <CardActions>
        {props.slot.State === 'connected' && (
          <Button size="small" onClick={props.joinSlot} color="secondary" variant="contained">
            Join
          </Button>
        )}
        {!['creating', 'connected'].includes(props.slot.State) && (
          <CopyToClipboard text={`${getHost()}/slot/${props.slot.SlotId}`}>
            <Button size="small" color="secondary">
              Copy Invite
            </Button>
          </CopyToClipboard>
        )}
      </CardActions>
    </Card>
  );
}

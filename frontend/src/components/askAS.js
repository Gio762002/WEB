import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({mode, handleModeChange, handleDialogInfo}) {
  const [open, setOpen] = React.useState(false);
  const [asId, setAsId] = React.useState('');
  const [ipRange, setIpRange] = React.useState('');
  const [protocol, setProtocol] = React.useState('');


  const handleClickOpen = () => {
    setOpen(true);
    handleModeChange('newAS')
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleCloseSave = () => {
    setOpen(false);
    handleDialogInfo(asId, ipRange, protocol);
  };

  return (
    <div>
      <Button color="primary" onClick={handleClickOpen} variant={mode === 'newAS' ? 'contained' : 'text'}  style={{ marginTop: '30px',marginBottom: '0px', width: '100%' }}>
        Nouvel AS
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Configuration AS</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour ajouter une AS, veuillez renseigner les informations suivantes
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="as id"
            label="Numéro AS"
            type="number"
            fullWidth
            onChange={(e) => setAsId(e.target.value)}
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="ip range"
            label="IP Range"
            type="string"
            fullWidth
            onChange={(e) => setIpRange(e.target.value)}
            inputProps={{ autoComplete: 'off' }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="igp"
            label="IGP Protocole"
            type="string"
            fullWidth
            onChange={(e) => setProtocol(e.target.value)}
            inputProps={{ autoComplete: 'off' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseSave} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { QRCode } from 'react-qrcode-logo'
//import {createCreds} from '../utils/webauthn'
import useStorageState from '../utils/use-storage-state'

const RegisterLogin = ({typeID,onClose}) => {
  const [name, setName] = React.useState('')
  const [username, setUsername] = useStorageState()
  const handleChange = (event) => setName(event.target.value)
  const fallbackToQR = (typeID=="QR")
  const isTypeFingerprint = (typeID=="Touch")
  const handleFingerprint = () => {
//    createCreds()
    setUsername(name)
    onClose()
  }
  const handleQR = () => {
    setUsername(name)
    onClose()
  }
  return (
    <div>
      <DialogTitle id="form-dialog-title">Register User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="usernameField"
          label="Username"
          variant="filled"
          fullWidth
          value={name}
          onChange={handleChange}
        />
        {fallbackToQR && <QRCode value={name} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={fallbackToQR ? () => handleQR() : isTypeFingerprint ? () => handleFingerprint() : null}
        >
          {fallbackToQR? "Simulate QR Reader" : "Register"}
        </Button>
      </DialogActions>
    </div>
  )
}

export default RegisterLogin

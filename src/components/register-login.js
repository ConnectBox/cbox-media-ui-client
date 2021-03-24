import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { QRCode } from 'react-qrcode-logo'
import {createCreds} from '../utils/webauthn'
import useStorageState from '../utils/use-storage-state'

const RegisterLogin = ({typeID,onClose}) => {
  const [name, setName] = React.useState('')
  const handleChange = (event) => setName(event.target.value)
  const [username, setUsername] = useStorageState()
  const fallbackToQR = (typeID==="QR")
  const isTypeFingerprint = (typeID==="Touch")
  const handleFingerprint = () => {
    createCreds()
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

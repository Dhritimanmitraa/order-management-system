import { Box, Paper, Typography, Switch, FormControlLabel, Divider, Button } from '@mui/material';
import { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    autoSync: true
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = () => {
    // Implement settings save logic here
    console.log('Settings saved:', settings);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Application Settings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications}
                onChange={() => handleSettingChange('notifications')}
              />
            }
            label="Enable Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.darkMode}
                onChange={() => handleSettingChange('darkMode')}
              />
            }
            label="Dark Mode"
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Communication Preferences
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailUpdates}
                onChange={() => handleSettingChange('emailUpdates')}
              />
            }
            label="Email Updates"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoSync}
                onChange={() => handleSettingChange('autoSync')}
              />
            }
            label="Auto Sync"
          />
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mr: 2 }}
            >
              Save Changes
            </Button>
            <Button variant="outlined" color="secondary">
              Reset to Default
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;
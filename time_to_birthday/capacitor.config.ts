import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'time_to_birthday',
  webDir: 'build',
  "plugins": {
    "LocalNotifications": {
      "smallIcon": "ic_stat_icon_config",
      "iconColor": "#488AFF",
      "sound": "beep.wav"
    }
  }
};

export default config;

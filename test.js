import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {VLCPlayerView} from 'react-native-vlc-media-player';

export default function BlankScreen2() {
  const handleError = error => {
    console.error('VLCPlayer Error:', error);
  };

  const handleOpen = () => {
    console.log('VLCPlayer Opened');
  };

  const handleEnd = () => {
    console.log('VLCPlayer Ended');
  };

  return (
    <View style={styles.container}>
      <VLCPlayerView
        videoAspectRatio="16:9"
        source={{
          uri: 'rtsp://user:aqua23@smartaqua7126.iptime.org:52001/stream1',
        }}
        style={{width: '100%', height: 200}}
        autoplay={false}
        onError={handleError}
        onOpen={handleOpen}
        onEnd={handleEnd}
      />
      {console.log(VLCPlayerView)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

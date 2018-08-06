// import lib for making component
import React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';

// make component
const Spinner = ({ size, type }) => {
  return (
    <View style={styles.containerStyle}>
      {type === 'rehive' ? (
        <Image
          style={{
            height: size === 'large' ? 150 : 50,
            width: size === 'large' ? 150 : 50,
          }}
          source={require('./../../../assets/icons/rehive_spinner_150.gif')}
        />
      ) : (
        <ActivityIndicator size={size || 'large'} />
      )}
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

// make component available to other parts of app
export { Spinner };

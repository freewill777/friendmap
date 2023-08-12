import React, { useEffect } from 'react';
import { View, Animated, Dimensions } from 'react-native';

const MovingLine = () => {
  const screenWidth = Dimensions.get('window').width;
  const animatedValue = new Animated.Value(0);

  const startAnimation = () => {
    animatedValue.setValue(0); // Reset the animated value before each loop
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false
      })
    ).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth] // Translates from far left to far right
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View
        style={{
          width: '80%',
          height: 2,
          backgroundColor: 'black',
          transform: [{ translateX }]
        }}
      />
    </View>
  );
};

export default MovingLine;

import React, { useRef, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

const ScrollHandler = React.memo(({ children, refreshing, onRefresh }) => {

 
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3669c9']} />
      }
      showsVerticalScrollIndicator ={false}
    >
      {children}
    </ScrollView>
  );
});

export default ScrollHandler;

import React, { useRef } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

const ScrollHandler = ({ onScroll, children, refreshing, onRefresh }) => {
  const previousScrollOffset = useRef(0); // Lưu lại vị trí cuộn trước đó

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3669c9']} />
      }
      onScroll={(event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const isScrollingUp = currentOffset < previousScrollOffset.current;

        // Điều kiện để hiển thị footer khi cuộn lên hoặc khi cuộn đến đỉnh
        if (isScrollingUp || currentOffset <= 0) {
          onScroll(true); // Hiển thị footer
        } else {
          onScroll(false); // Ẩn footer
        }

        previousScrollOffset.current = currentOffset; // Cập nhật vị trí cuộn hiện tại
      }}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  );
};

export default ScrollHandler;

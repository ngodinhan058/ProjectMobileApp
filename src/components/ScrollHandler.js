import React, { useRef, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

const ScrollHandler = React.memo(({ onScroll, children, refreshing, onRefresh }) => {
  const previousScrollOffset = useRef(0); // Lưu lại vị trí cuộn trước đó

  // Dùng useCallback để tránh tạo hàm mới khi render lại
  const handleScroll = useCallback(
    (event) => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      const isScrollingUp = currentOffset < previousScrollOffset.current;

      // Điều kiện để hiển thị footer khi cuộn lên hoặc khi cuộn đến đỉnh
      onScroll(isScrollingUp || currentOffset <= 0);

      previousScrollOffset.current = currentOffset; // Cập nhật vị trí cuộn hiện tại
    },
    [onScroll]
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3669c9']} />
      }
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  );
});

export default ScrollHandler;

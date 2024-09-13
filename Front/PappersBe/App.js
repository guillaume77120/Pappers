import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import HomeComponent from './Component/HomeComponent';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <HomeComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeComponent from './Component/HomeComponent';
import CompanyDetail from './Component/EnterpriseDetail'; // Composant des détails de l'entreprise

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="HomeComponent" component={HomeComponent} options={{ title: 'Entreprises' }} />
        <Stack.Screen name="CompanyDetail" component={CompanyDetail} options={{ title: 'Détails de l\'entreprise' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

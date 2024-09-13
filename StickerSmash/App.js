import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Calculator from './Calculator';
import JustePrix from './JustePrix';
import Chronometre from './Chronometre'; // Assure-toi que les composants sont bien importés

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calculator">
        <Stack.Screen 
          name="Calculator" 
          component={Calculator} 
          options={{ title: 'Calculatrice' }} 
        />
        <Stack.Screen 
          name="JustePrix" 
          component={JustePrix} 
          options={{ title: 'Juste Prix' }} 
        />
        <Stack.Screen 
          name="Chronometre" 
          component={Chronometre} 
          options={{ title: 'Chronomètre' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

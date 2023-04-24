import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import {StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, stackActions } from "@react-navigation/native";


 import data from './data/data.json'
 import Question from './components/Question';

 export default function App() {
 const Stack = createNativeStackNavigator()
 return (
  <NavigationContainer>
  <Stack.Navigator initialRouteName="Question">
  <Stack.Screen
  name="Question"
  component={Question}
  initialParams={{data: data}}
  />
  </Stack.Navigator>
  </NavigationContainer>
 );
 }
  export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 30,
      paddingHorizontal: 15
    }
  })
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, Platform, Dimensions, ScrollView,FlatList } from 'react-native';
import { Eye, Plus,Send } from 'lucide-react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import TopUpScreen from './TopUpScreen';
import RegisterScreen from './RegisterScreen';
import TransferScreen from './TransferScreen';
import { AuthProvider } from './context/AuthContext';
import SplashScreen from './SplashScreen';

export default function App() {
 
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='SplashScreen'>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
          <Stack.Screen name="TopUpScreen" component={TopUpScreen} options={{title: "Top Up"}}/>
          <Stack.Screen name="TransferScreen" component={TransferScreen} options={{title: "Transfer"}}/>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}


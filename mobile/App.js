import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (isMounted) {
          // Якщо токен існує — відкриваємо Home, інакше Login
          setInitialRoute(token ? 'Home' : 'Login');
        }
      } catch (error) {
        console.error('Помилка при зчитуванні токена:', error);
        if (isMounted) {
          setInitialRoute('Login');
        }
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, []);

  // Поки перевіряємо токен — показуємо індикатор завантаження
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: { backgroundColor: '#1e1e1e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Workouts" component={WorkoutsScreen} options={{ title: 'Розклад тренувань' }} />
        <Stack.Screen name="Bookings" component={BookingsScreen} options={{ title: 'Мої записи' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Особистий профіль' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
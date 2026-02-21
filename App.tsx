import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { RemindersProvider } from './src/context/RemindersContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { DetailsScreen } from './src/screens/DetailsScreen';
import { AddEditTaskScreen } from './src/screens/AddEditTaskScreen';
import { SearchScreen } from './src/screens/SearchScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function RemindersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#007AFF',
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="AddEditTask" 
        component={AddEditTaskScreen} 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#007AFF',
      }}
    >
      <Stack.Screen 
        name="SearchMain" 
        component={SearchScreen} 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'list';
          
          if (route.name === 'RemindersTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen 
        name="RemindersTab" 
        component={RemindersStack}
        options={{
          title: 'Reminders',
        }}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchStack}
        options={{
          title: 'Search',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <RemindersProvider>
        <NavigationContainer>
          <AppTabs />
        </NavigationContainer>
      </RemindersProvider>
    </SafeAreaProvider>
  );
}
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RemindersProvider } from './src/context/RemindersContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { MonthViewScreen } from './src/screens/MonthViewScreen';
import { DetailsScreen } from './src/screens/DetailsScreen';
import { AddEditTaskScreen } from './src/screens/AddEditTaskScreen';
import { CategoryScreen } from './src/screens/CategoryScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { StreaksScreen } from './src/screens/StreaksScreen';
import StreakDetailScreen from './src/screens/StreakDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const lightTheme = { bg: '#F2F2F7', card: '#FFF', text: '#000', border: '#C6C6C8' };
const darkTheme = { bg: '#000', card: '#1C1C1E', text: '#FFF', border: '#38383A' };

function RemindersStack() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#007AFF',
        headerStyle: {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
          borderBottomWidth: 0.5,
        },
        headerTitleStyle: {
          color: theme.text,
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: theme.bg,
        },
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
        name="Category"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MonthView" 
        component={MonthViewScreen} 
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

function StreaksStack() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#007AFF',
        headerStyle: {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
          borderBottomWidth: 0.5,
        },
        headerTitleStyle: {
          color: theme.text,
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: theme.bg,
        },
      }}
    >
      <Stack.Screen 
        name="StreaksMain" 
        component={StreaksScreen} 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="StreakDetail" 
        component={StreakDetailScreen} 
        options={{ 
          headerTitle: 'Streak Details',
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
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#007AFF',
        headerStyle: {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
          borderBottomWidth: 0.5,
        },
        headerTitleStyle: {
          color: theme.text,
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: theme.bg,
        },
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
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'list';
          
          if (route.name === 'RemindersTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'MonthTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
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
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 0.5,
        },
      })}
    >
      <Tab.Screen 
        name="RemindersTab" 
        component={RemindersStack}
        options={{
          title: 'Lists',
        }}
      />
      <Tab.Screen
        name="StreaksTab"
        component={StreaksStack}
        options={{
          title: 'Streaks',
        }}
      />
      <Tab.Screen 
        name="MonthTab" 
        component={MonthViewScreen}
        options={{
          title: 'This Month',
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
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <RemindersProvider>
        <NavigationContainer
          theme={{
            dark: isDarkMode,
            colors: {
              primary: '#007AFF',
              background: theme.bg,
              card: theme.card,
              text: theme.text,
              border: theme.border,
              notification: '#FF3B30',
            },
            fonts: {
              regular: {
                fontFamily: 'System',
                fontWeight: '400',
              },
              bold: {
                fontFamily: 'System',
                fontWeight: '600',
              },
              heavy: {
                fontFamily: 'System',
                fontWeight: '700',
              },
              medium: {
                fontFamily: 'System',
                fontWeight: '500',
              },
            },
          }}
        >
          <AppTabs />
        </NavigationContainer>
      </RemindersProvider>
    </SafeAreaProvider>
  );
}
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar, Platform} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Services
import {CloudflareOptimizer} from '@services/CloudflareOptimizer';
import {GitHubPagesManager} from '@services/GitHubPagesManager';
import {AIOrchestrator} from '@services/AIOrchestrator';

// Screens
import HomeScreen from '@screens/HomeScreen';
import TradingScreen from '@screens/TradingScreen';
import PortfolioScreen from '@screens/PortfolioScreen';
import AIInsightsScreen from '@screens/AIInsightsScreen';
import SettingsScreen from '@screens/SettingsScreen';

// Components
import {QuantumTheme} from '@components/QuantumTheme';
import {LoadingScreen} from '@components/LoadingScreen';
import {ErrorBoundary} from '@components/ErrorBoundary';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#22d3ee',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#64748b',
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trading" component={TradingScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="AI Insights" component={AIInsightsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Cloudflare optimization
        await CloudflareOptimizer.initialize();
        
        // Setup GitHub Pages integration
        await GitHubPagesManager.initialize();
        
        // Start AI orchestration
        await AIOrchestrator.initialize();
        
        setIsReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsReady(true); // Still allow app to load
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <PaperProvider theme={QuantumTheme}>
            <StatusBar
              barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
              backgroundColor="#0f172a"
            />
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  cardStyle: {backgroundColor: '#0f172a'},
                }}>
                <Stack.Screen name="Main" component={TabNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
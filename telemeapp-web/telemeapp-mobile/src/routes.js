import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createNativeStackNavigator();

import Home from './pages/Home';
import Info from './pages/Info';

export default function Routes() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Principal" options={{ headerShown: false }} component={Home} />
                <Tab.Screen name="Info" options={{ headerShown: false }} component={Info} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
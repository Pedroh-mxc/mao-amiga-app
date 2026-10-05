import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import DetalheDoacaoScreen from './src/screens/DetalheDoacaoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Instituto Mão Amiga' }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Minhas doações' }} />
        <Stack.Screen name="DetalheDoacao" component={DetalheDoacaoScreen} options={{ title: 'Detalhe da doação' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

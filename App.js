import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import PontosScreen from './src/screens/PontosScreen';
import DetalhePontoScreen from './src/screens/DetalhePontoScreen';
import FormPontoScreen from './src/screens/FormPontoScreen';
import MeusPontosScreen from './src/screens/MeusPontosScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import DetalheDoacaoScreen from './src/screens/DetalheDoacaoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Instituto Mão Amiga' }} />
        <Stack.Screen name="Pontos" component={PontosScreen} options={{ title: 'Pontos de coleta' }} />
        <Stack.Screen name="DetalhePonto" component={DetalhePontoScreen} options={{ title: 'Detalhe do ponto' }} />
        <Stack.Screen name="FormPonto" component={FormPontoScreen} options={{ title: 'Ponto de coleta' }} />
        <Stack.Screen name="MeusPontos" component={MeusPontosScreen} options={{ title: 'Meus pontos' }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Registrar doação' }} />
        <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Minhas doações' }} />
        <Stack.Screen name="DetalheDoacao" component={DetalheDoacaoScreen} options={{ title: 'Detalhe da doação' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

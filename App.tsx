import React from 'react';
import {
  NavigationContainer,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './app/screens/Home';
import Login from './app/screens/Login';
import ProductAdd from './app/screens/ProductAdd';
import {Button} from 'react-native';
import ProductDetails, {
  Params as ProductDetailsParams,
} from './app/screens/ProductDetails';
export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ProductDetails: ProductDetailsParams;
  ProductAdd: undefined;
};

function HomeHeader(): React.JSX.Element {
  const Navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Button title="Agregar" onPress={() => Navigation.navigate('ProductAdd')} />
  );
}
/* creamos el archivo app/screens/Home.tsx */
function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#0ff040'},
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerRight: HomeHeader,
          }}
        />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="ProductAdd" component={ProductAdd} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

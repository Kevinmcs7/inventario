import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Product} from '../model/products';
import {Props as ProductDetailsProps} from './ProductDetails';
import LocalDB from '../persistance/localdb';
type RootStackParamList = {
  Home: undefined;
  ProductDetails: ProductDetailsProps;
};
type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
  navigation: HomeScreenProps;
  route: HomeScreenRoute;
};
function Home({navigation}: HomeProps): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const productItem = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={style.productItem}
      onPress={() => navigation.navigate('ProductDetails', {product: item})}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'column', flexGrow: 9}}>
          <Text style={style.itemTitle}>{item.nombre}</Text>
          <Text style={style.itemDetails}>
            Precio: ${item.precio.toFixed(2)}{' '}
          </Text>
        </View>
        <Text
          style={[
            style.itemBadge,
            item.currenStock < item.minStock ? style.itemBadge : null,
          ]}>
          {item.currenStock}
        </Text>
      </View>
    </TouchableOpacity>
  );
  useEffect(() => {
    LocalDB.init();
    navigation.addListener('focus', async () => {
      const db = await LocalDB.connect();
      db.transaction(async tx => {
        tx.executeSql(
          'SELECT * FROM productos;',
          [],
          (_, res) => setProducts(res.rows.raw()),
          error => console.error({error}),
        );
      });
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <FlatList
        data={products}
        renderItem={productItem}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  productItem: {
    padding: 12,
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'uppercase',
  },
  itemDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  itemBadge: {
    fontSize: 24,
    color: 'red',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
export default Home;

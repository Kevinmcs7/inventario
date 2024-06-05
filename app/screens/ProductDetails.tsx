import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Button,
  TextInput,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../app';
import {StackNavigationProp} from '@react-navigation/stack';
import {Product} from '../model/products';
import LocalDB from '../persistance/localdb';

export type Params = {
  product: Product;
};

export type Props = {
  route: RouteProp<RootStackParamList, 'ProductDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

function ProductDetails({route, navigation}: Props): React.JSX.Element {
  const [product, setProduct] = useState<Product>(route.params.product);
  const [quantity, setQuantity] = useState<string>('');

  useEffect(() => {
    setProduct(route.params.product);
    loadEntryExitData(route.params.product.id);
  }, [route]);

  const loadEntryExitData = async (productId: number) => {
    try {
      const db = await LocalDB.connect();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT entradas, salidas FROM producto_entradas_salidas WHERE product_id = ?;',
          [productId],
          (_, result) => {
            if (result.rows.length > 0) {
              const entryExitData = result.rows.item(0);
              setProduct(prevProduct => ({
                ...prevProduct,
                entradas: entryExitData.entradas,
                salidas: entryExitData.salidas,
              }));
            }
          },
          error => console.error('Error loading entry and exit data:', error),
        );
      });
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  };

  const handleInput = (value: string) => {
    setQuantity(value);
  };

  const handleEntry = async () => {
    const quantityValue = parseInt(quantity, 10);
    if (!isNaN(quantityValue) && quantityValue > 0) {
      await updateEntryExitData(product.id, quantityValue, 0);
      setProduct(prevProduct => ({
        ...prevProduct,
        entradas: prevProduct.entradas + quantityValue,
        currentStock: prevProduct.currentStock + quantityValue, // Actualizar el stock actual
      }));
      setQuantity(''); // Limpiar el campo de cantidad después de agregar la entrada
      alert('Entrada registrada correctamente');
    }
  };

  const handleExit = async () => {
    const quantityValue = parseInt(quantity, 10);
    if (!isNaN(quantityValue) && quantityValue > 0) {
      if (quantityValue <= product.currentStock) {
        await updateEntryExitData(product.id, 0, quantityValue);
        setProduct(prevProduct => ({
          ...prevProduct,
          salidas: prevProduct.salidas + quantityValue,
          currentStock: prevProduct.currentStock - quantityValue,
        }));
        setQuantity('');
        alert('Salida registrada correctamente');
      } else {
        // Si la cantidad de salida es mayor que el stock actual, mostrar un mensaje de error
        alert('No hay suficientes existencias disponibles para esta salida.');
      }
    }
  };

  const updateEntryExitData = async (
    productId: number,
    entry: number,
    exit: number,
  ) => {
    try {
      const db = await LocalDB.connect();
      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO producto_entradas_salidas (product_id, entradas, salidas) VALUES (?, COALESCE((SELECT entradas FROM producto_entradas_salidas WHERE product_id = ?), 0) + ?, COALESCE((SELECT salidas FROM producto_entradas_salidas WHERE product_id = ?), 0) + ?);',
          [productId, productId, entry, productId, exit],
          () => console.log('Entry and exit data updated successfully'),
          error => console.error('Error updating entry and exit data:', error),
        );
      });
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {product && (
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Detalle del Producto</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.text}>{product.nombre}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Stock:</Text>
              <Text style={styles.text}>{product.currentStock}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Precio:</Text>
              <Text style={styles.text}>$ {product.precio}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Entradas:</Text>
              <Text style={styles.text}>{product.entradas}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Salidas:</Text>
              <Text style={styles.text}>{product.salidas}</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Cantidad"
              keyboardType="numeric"
              value={quantity}
              onChangeText={handleInput}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Entradas" onPress={handleEntry} color="green" />
            <Button title="Salidas" onPress={handleExit} color="red" />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default ProductDetails;

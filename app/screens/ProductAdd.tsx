import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Button, SafeAreaView, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../../App';
import LocalDB from '../persistance/localdb';

export default function ProductAdd(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState<string>('');
  const [precio, setPrecio] = useState<string>('0');

  const btnGuardarOnPress = async () => {
    const db = await LocalDB.connect();
    db.transaction(tx => {
      tx.executeSql('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [
        nombre,
        precio,
      ]);
      navigation.goBack();
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <View style={styles.container}>
        <Text style={styles.title}>Agregar Producto</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={'#828894'}
            onChangeText={u => setNombre(u)}
          />
          <TextInput
            style={styles.input}
            placeholder="Precio"
            placeholderTextColor={'#828894'}
            onChangeText={p => setPrecio(p)}
          />
        </View>
        <Button title="Guardar" onPress={btnGuardarOnPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    width: '80%',
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 30,
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
};

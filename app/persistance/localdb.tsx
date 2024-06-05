import SQLite from 'react-native-sqlite-storage';

export default class LocalDB {
  static connect() {
    return SQLite.openDatabase({ name: 'inventario' });
  }

  static async init() {
    const db = await LocalDB.connect();
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS productos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(64) NOT NULL,
          precio DECIMAL(10,2) NOT NULL DEFAULT 0.0, 
          minStock INTEGER NOT NULL DEFAULT 0,
          currentStock INTEGER NOT NULL DEFAULT 0,
          maxStock INTEGER NOT NULL DEFAULT 0
        );`,
        [],
        () => console.log('CREATED TABLE productos'),
        error => console.error('Error creating table productos:', error)
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS producto_entradas_salidas (
          product_id INTEGER PRIMARY KEY,
          entradas INTEGER DEFAULT 0,
          salidas INTEGER DEFAULT 0
        );`,
        [],
        () => console.log('CREATED TABLE producto_entradas_salidas'),
        error => console.error('Error creating table producto_entradas_salidas:', error)
      );
    });
  }
}

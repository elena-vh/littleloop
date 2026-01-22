import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('knitbits_v2.db');

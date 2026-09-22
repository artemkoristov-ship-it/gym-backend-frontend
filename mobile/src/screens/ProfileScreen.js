import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import client from '../api/client';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      try {
        const userRes = await client.get('/auth/me');
        setUser(userRes.data);
      } catch (e) {
        console.log('Не вдалося завантажити дані користувача');
      }

      const res = await client.get('/results');
      setResults(Array.isArray(res.data) ? res.data : res.data?.results || []);
    } catch (err) {
      console.log('Помилка завантаження рекордів:', err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Додавання рекорду
  const handleAddResult = async () => {
    if (!title.trim() || !value.trim()) {
      Alert.alert('Помилка', 'Будь ласка, заповніть назву вправи та результат');
      return;
    }

    setSubmitting(true);
    try {
      await client.post('/results', {
        title: title.trim(),
        value: value.trim()
      });
      
      setTitle('');
      setValue('');
      fetchData();
    } catch (err) {
      console.log('Помилка збереження:', err.response?.data);
      Alert.alert('Помилка', err.response?.data?.error || 'Не вдалося зберегти результат');
    } finally {
      setSubmitting(false);
    }
  };

  // 🗑️ Видалення рекорду
  const handleDeleteResult = (item, exerciseTitle) => {
    // Шукаємо ID у всіх можливих полях об'єкта
    const recordId = item.id || item._id;

    if (!recordId) {
      Alert.alert('Помилка', 'Не вдалося визначити ID запису');
      return;
    }

    Alert.alert(
      'Видалити рекорд',
      `Ви дійсно хочете видалити результат для "${exerciseTitle}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Відправляємо запит на видалення ID:', recordId);
              await client.delete(`/results/${recordId}`);
              
              // Миттєво прибираємо зі списку на екрані за будь-яким з ID полів
              setResults(prevResults => prevResults.filter(r => (r.id || r._id) !== recordId));
            } catch (err) {
              console.log('Помилка видалення:', err.response?.data || err.message);
              Alert.alert('Помилка', err.response?.data?.error || 'Не вдалося видалити рекорд');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Профіль */}
      <View style={styles.userCard}>
        <Ionicons name="person-circle" size={48} color="#e50914" />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || user?.username || 'Спортсмен'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'Мій особистий кабінет'}</Text>
        </View>
      </View>

      {/* Форма додавання */}
      <Text style={styles.sectionTitle}>Додати результат</Text>
      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Назва вправи (напр. Жим лежачи)"
          placeholderTextColor="#777"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Результат (напр. 100 кг)"
          placeholderTextColor="#777"
          value={value}
          onChangeText={setValue}
        />
        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={handleAddResult}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Зберегти</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Список рекордів */}
      <Text style={styles.sectionTitle}>Особисті макс. рекорди</Text>
      <FlatList
        data={results}
        keyExtractor={(item, index) => (item.id || item._id || index).toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Ви ще не додали жодного результату</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <View style={styles.resultLeft}>
              <Text style={styles.exerciseName}>{item.title || item.exercise}</Text>
              <Text style={styles.dateText}>
                {item.date ? new Date(item.date).toLocaleDateString('uk-UA') : 'Сьогодні'}
              </Text>
            </View>
            <View style={styles.resultRight}>
              <Text style={styles.resultWeight}>{item.value || item.weight}</Text>
              <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={() => handleDeleteResult(item, item.title || item.exercise)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 18 },
  center: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#1c1c1e', padding: 16, borderRadius: 16, marginBottom: 20 },
  userInfo: { flex: 1 },
  userName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userEmail: { color: '#888', fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 12, marginTop: 8 },
  formCard: { backgroundColor: '#1c1c1e', borderRadius: 16, padding: 16, marginBottom: 20 },
  input: { backgroundColor: '#2c2c2e', color: '#fff', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, fontSize: 15, marginBottom: 12 },
  saveBtn: { backgroundColor: '#e50914', borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultCard: { backgroundColor: '#1c1c1e', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  resultLeft: { flex: 1 },
  resultRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  exerciseName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  dateText: { color: '#777', fontSize: 12, marginTop: 4 },
  resultWeight: { color: '#e50914', fontSize: 18, fontWeight: 'bold' },
  deleteBtn: { padding: 4 },
  emptyText: { color: '#777', textAlign: 'center', marginTop: 30, fontSize: 15 },
});
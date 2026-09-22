import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import client from '../api/client';

export default function WorkoutsScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);

  const fetchWorkouts = async () => {
    try {
      const res = await client.get('/workouts');
      setWorkouts(res.data);
    } catch (err) {
      Alert.alert('Помилка', 'Не вдалося завантажити розклад тренувань');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [])
  );

  const handleBook = async (workoutId) => {
    setBookingId(workoutId);
    try {
      await client.post('/bookings', { 
        workoutId: Number(workoutId),
        workout_id: Number(workoutId),
        id: Number(workoutId)
      });
      Alert.alert('Успіх!', 'Ви успішно записалися на тренування');
      fetchWorkouts(); // Оновлюємо список, щоб підтягнути нові дані з місцями
    } catch (err) {
      console.log('Помилка сервера (POST /bookings):', err.response?.data);
      Alert.alert('Запис відхилено', err.response?.data?.error || err.response?.data?.message || 'Помилка при записі');
    } finally {
      setBookingId(null);
    }
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
      <Text style={styles.headerTitle}>Актуальний розклад</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Наразі немає доступних тренувань</Text>
        }
        renderItem={({ item }) => {
          // Рахуємо кількість вільних місць
          const bookedCount = item.bookings ? item.bookings.length : 0;
          const freeSpots = item.capacity - bookedCount;

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.badge}>
                  <Ionicons name="people-outline" size={14} color="#e50914" />
                  <Text style={styles.badgeText}>
                    {freeSpots >= 0 ? freeSpots : 0} / {item.capacity} вільних
                  </Text>
                </View>
              </View>
              
              <Text style={styles.description}>{item.description}</Text>
              
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#aaa" />
                <Text style={styles.infoText}>Тренер: {item.trainer}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#aaa" />
                <Text style={styles.infoText}>
                  {item.date ? new Date(item.date).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' }) : 'Час не вказано'}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.bookBtn} 
                onPress={() => handleBook(item.id)}
                disabled={bookingId === item.id}
              >
                {bookingId === item.id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.bookBtnText}>Записатися</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 18 },
  center: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  card: { backgroundColor: '#1c1c1e', borderRadius: 16, padding: 18, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(229,9,20,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#e50914', fontSize: 12, fontWeight: '600' },
  description: { color: '#bbb', marginVertical: 10, fontSize: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  infoText: { color: '#ddd', fontSize: 14 },
  bookBtn: { backgroundColor: '#e50914', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 14 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  emptyText: { color: '#777', textAlign: 'center', marginTop: 40, fontSize: 16 },
});
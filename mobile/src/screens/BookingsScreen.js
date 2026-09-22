import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import client from '../api/client';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      let res;
      // Почергово перевіряємо можливі роути бекенду для отримання записів користувача
      try {
        res = await client.get('/bookings');
      } catch (e1) {
        try {
          res = await client.get('/bookings/my');
        } catch (e2) {
          res = await client.get('/user/bookings');
        }
      }

      setBookings(Array.isArray(res.data) ? res.data : res.data?.bookings || []);
    } catch (err) {
      console.log('Помилка завантаження записів:', err.response?.status);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const handleCancelBooking = async (id) => {
    try {
      await client.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
      Alert.alert('Скасовано', 'Запис успішно скасовано');
    } catch (err) {
      Alert.alert('Помилка', err.response?.data?.error || 'Не вдалося скасувати запис');
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
      <Text style={styles.headerTitle}>Мої заброньовані заняття</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => (item.id || Math.random()).toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>У вас поки немає активних записів</Text>
        }
        renderItem={({ item }) => {
          const workout = item.workout || item;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{workout.title || 'Тренування'}</Text>
                <Ionicons name="checkmark-circle" size={22} color="#4cd964" />
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#aaa" />
                <Text style={styles.infoText}>Тренер: {workout.trainer || 'Не вказано'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#aaa" />
                <Text style={styles.infoText}>
                  {workout.date ? new Date(workout.date).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' }) : 'Час не вказано'}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => handleCancelBooking(item.id)}
              >
                <Text style={styles.cancelBtnText}>Скасувати запис</Text>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  infoText: { color: '#ddd', fontSize: 14 },
  cancelBtn: { backgroundColor: 'rgba(229,9,20,0.15)', borderWidth: 1, borderColor: '#e50914', borderRadius: 10, padding: 10, alignItems: 'center', marginTop: 14 },
  cancelBtnText: { color: '#e50914', fontWeight: 'bold', fontSize: 14 },
  emptyText: { color: '#777', textAlign: 'center', marginTop: 40, fontSize: 16 },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ласкаво просимо! 💪</Text>
          <Text style={styles.subtitle}>Оберіть розділ для продовження</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={24} color="#e50914" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsRow}>
        {/* Картка 1: Розклад */}
        <TouchableOpacity 
          style={styles.cardContainer} 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Workouts')}
        >
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800' }} 
            style={styles.cardImage}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <View style={styles.iconBadge}>
                <Ionicons name="calendar" size={26} color="#e50914" />
              </View>
              <Text style={styles.cardTitle}>Розклад тренувань</Text>
              <Text style={styles.cardDesc}>Актуальний розклад занять та графік роботи</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Картка 2: Запис */}
        <TouchableOpacity 
          style={styles.cardContainer} 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Bookings')}
        >
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800' }} 
            style={styles.cardImage}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <View style={styles.iconBadge}>
                <Ionicons name="fitness" size={26} color="#e50914" />
              </View>
              <Text style={styles.cardTitle}>Запис на тренування</Text>
              <Text style={styles.cardDesc}>Запис на групові та індивідуальні заняття</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Картка 3: Профіль */}
        <TouchableOpacity 
          style={styles.cardContainer} 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Profile')}
        >
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800' }} 
            style={styles.cardImage}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <View style={styles.iconBadge}>
                <Ionicons name="person" size={26} color="#e50914" />
              </View>
              <Text style={styles.cardTitle}>Особистий профіль</Text>
              <Text style={styles.cardDesc}>Власні досягнення, статистика та результати</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30 
  },
  greeting: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#ffffff' 
  },
  subtitle: { 
    fontSize: 15, 
    color: '#8e8e93', 
    marginTop: 4 
  },
  logoutBtn: { 
    padding: 12, 
    backgroundColor: '#1c1c1e', 
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  cardContainer: { 
    flex: 1,
    minWidth: 260,
    height: 380,
    borderRadius: 20, 
    backgroundColor: '#1c1c1e',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  cardImage: { 
    width: '100%', 
    height: '100%', 
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 20,
  },
  overlay: { 
    backgroundColor: 'rgba(0, 0, 0, 0.65)', 
    padding: 20, 
    height: '100%',
    justifyContent: 'flex-end',
    borderRadius: 20,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#ffffff', 
  },
  cardDesc: { 
    fontSize: 13, 
    color: '#d1d1d6', 
    marginTop: 6,
    lineHeight: 18,
  },
});
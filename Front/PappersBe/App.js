import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CAMERA_BAR_HEIGHT = 0; // Hauteur estimée de la barre de caméra
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Tab = ({ label, active, onPress }) => (
  <TouchableOpacity style={[styles.tab, active && styles.activeTab]} onPress={onPress}>
    <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
  </TouchableOpacity>
);

const CompanyCard = ({ name, vat, address, phone, website }) => (
  <View style={styles.card}>
    <Text style={styles.companyName}>{name}</Text>
    <Text style={styles.vatNumber}>{vat}</Text>
    <View style={styles.infoRow}>
      <Ionicons name="location-outline" size={16} color="#666" />
      <Text style={styles.infoText}>{address}</Text>
    </View>
    <View style={styles.infoRow}>
      <Ionicons name="call-outline" size={16} color="#666" />
      <Text style={styles.infoText}>{phone}</Text>
    </View>
    <View style={styles.infoRow}>
      <Ionicons name="globe-outline" size={16} color="#666" />
      <Text style={styles.infoText}>{website}</Text>
    </View>
  </View>
);

export default function PappersMobileRN() {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.cameraBar} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une entreprise..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="filter" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.tabContainer}>
            <Tab label="Recherche" active={activeTab === 'search'} onPress={() => setActiveTab('search')} />
            <Tab label="Carte" active={activeTab === 'map'} onPress={() => setActiveTab('map')} />
            <Tab label="Favoris" active={activeTab === 'favorites'} onPress={() => setActiveTab('favorites')} />
            <Tab label="Outils" active={activeTab === 'tools'} onPress={() => setActiveTab('tools')} />
          </View>
        </View>

        <ScrollView style={styles.content}>
          {[1, 2, 3, 4, 5].map((item) => (
            <CompanyCard
              key={item}
              name={`Entreprise ${item} SPRL`}
              vat={`BE 0123.456.${789 + item}`}
              address={`${123 + item} Rue Principale, 1000 Bruxelles`}
              phone={`+32 2 123 45 ${67 + item}`}
              website={`www.entreprise${item}.be`}
            />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: CAMERA_BAR_HEIGHT,
  },
  cameraBar: {
    height: CAMERA_BAR_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0747a6',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    color: 'white',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabText: {
    color: 'white',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0747a6',
    marginBottom: 4,
  },
  vatNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0747a6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
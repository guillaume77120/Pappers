import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CAMERA_BAR_HEIGHT = 0; // Hauteur estimée de la barre de caméra
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Tab = ({ label, active, onPress }) => (
  <TouchableOpacity style={[styles.tab, active && styles.activeTab]} onPress={onPress}>
    <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
  </TouchableOpacity>
);

const CompanyCard = ({ name, vat, address, phone, website, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.companyName}>{name}</Text>
    <Text style={styles.vatNumber}>N° d'entreprise : {vat}</Text>
    <View style={styles.infoRow}>
      <Ionicons name="location-outline" size={16} color="#666" />
      <Text style={styles.infoText}>{address}</Text>
    </View>
    <View style={styles.infoContainer}>
      {phone && /^\d/.test(phone) ? (
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{phone}</Text>
        </View>
      ) : null}

      {website ? (
        <View style={styles.infoRow}>
          <Ionicons name="globe-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{website}</Text>
        </View>
      ) : null}
    </View>
  </TouchableOpacity>
);

export default function HomeComponent() {
  const [activeTab, setActiveTab] = useState('search');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('EnterpriseNumber');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.74.2.59:3000/api/enterprises');
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredData(data);
    } else {
      const filterData = () => {
        return data.filter(item => {
          switch (filterType) {
            case 'EnterpriseNumber':
              return item.EnterpriseNumber.toLowerCase().includes(searchTerm.toLowerCase());
            case 'Denomination':
              return item.Denomination.toLowerCase().includes(searchTerm.toLowerCase());
            case 'StreetFR':
              return (item.StreetFR + ' ' + item.MunicipalityFR).toLowerCase().includes(searchTerm.toLowerCase());
            default:
              return false;
          }
        });
      };
      setFilteredData(filterData());
    }
  }, [searchTerm, filterType, data]);

  const handleSearch = () => {
    setSearchTerm(searchTerm.trim());
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

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
              value={searchTerm}
              onChangeText={text => setSearchTerm(text)}
            />
            <TouchableOpacity style={styles.iconButton} onPress={handleSearch}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
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
          {filteredData.map((item, index) => (
            <CompanyCard
              key={index}
              name={item.Denomination}
              vat={item.EnterpriseNumber}
              address={item.HouseNumber +' '+ item.StreetFR+' ' + item.MunicipalityFR+' ' +item.Zipcode}
              phone={item.Value}
              website={item.Value}
              onPress={() => navigation.navigate('CompanyDetail', { enterpriseId: item.enterpriseId })}
            />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>

        {/* Modal pour le filtre */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choisir un filtre</Text>
              <TouchableOpacity
                style={[styles.filterOption, filterType === 'EnterpriseNumber' && styles.selectedFilter]}
                onPress={() => { setFilterType('EnterpriseNumber'); setModalVisible(false); }}
              >
                <Text style={styles.filterText}>Numéro d'entreprise</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, filterType === 'Denomination' && styles.selectedFilter]}
                onPress={() => { setFilterType('Denomination'); setModalVisible(false); }}
              >
                <Text style={styles.filterText}>Dénomination</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, filterType === 'StreetFR' && styles.selectedFilter]}
                onPress={() => { setFilterType('StreetFR'); setModalVisible(false); }}
              >
                <Text style={styles.filterText}>Rue</Text>
              </TouchableOpacity>
              <Button title="Fermer" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterOption: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  selectedFilter: {
    backgroundColor: '#0747a6',
  },
  filterText: {
    color: '#666',
  },
});

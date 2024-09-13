import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const EnterpriseDetail = ({ route }) => {
  const { enterpriseNumber } = route.params; // On récupère le numéro d'entreprise depuis les paramètres de la route
  const [company, setCompany] = useState();
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        console.log('Fetching details for:', enterpriseNumber);
        const response = await fetch(`http://10.74.2.59:3000/api/enterprises/${enterpriseNumber}/details`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data); // Ajoute ce log pour vérifier la structure des données
        setCompany(data);

      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'entreprise:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompanyDetails();
  }, [enterpriseNumber]);
  
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };
  
  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveSlide(slideIndex);
  };
  
  const scrollToSlide = (index) => {
    scrollViewRef.current.scrollTo({ x: index * width, animated: true });
  };
  
  const slides = [
    { title: "Vue d'ensemble", content: "Informations générales sur l'entreprise..." },
    { title: "Données financières", content: "Données financières de l'entreprise..." },
    { title: "Informations juridiques", content: "Informations juridiques de l'entreprise..." },
  ];
  
  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      {company ? (
        <>
          <View style={styles.card}>
            <Text style={styles.title}>{company.enterprise?.Denomination || 'Nom non disponible'}</Text>
            <Text style={styles.subtitle}>N° d'entreprise : {company.enterprise?.EnterpriseNumber || 'N/A'}</Text>
            <View style={styles.infoContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{company.enterprise?.HouseNumber +' '+ company.enterprise?.StreetFR+' ' + company.enterprise?.MunicipalityFR+' ' +company.enterprise?.Zipcode|| 'Adresse non disponible'}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{company.enterprise?.Value || 'Téléphone non disponible'}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Ionicons name="globe-outline" size={16} color="#666" />
              <TouchableOpacity onPress={() => openLink(`https://${company.enterprise?.Value || ''}`)}>
                <Text style={[styles.infoText, styles.link]}>{company.enterprise?.Value || 'Site web non disponible'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
              <Ionicons name="mail-outline" size={16} color="#666" />
              <TouchableOpacity onPress={() => openLink(`mailto:${company.enterprise?.Value || ''}`)}>
                <Text style={[styles.infoText, styles.link]}>{company.enterprise?.Value || 'Email non disponible'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.slideContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {slides.map((slide, index) => (
                <View key={index} style={styles.slide}>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideContent}>{slide.content}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.paginationDot, index === activeSlide && styles.paginationDotActive]}
                  onPress={() => scrollToSlide(index)}
                />
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Établissements</Text>
            {company.establishments?.length > 0 ? (
              company.establishments.map((establishment, index) => (
                <View key={index} style={styles.infoContainer}>
                  <Text style={styles.subtitle}>N° d'entreprise : {establishment?.EstablishmentNumber || 'N/A'}</Text>
                  <Ionicons name="business-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{establishment?.HouseNumber +' '+ establishment?.StreetFR+' ' + establishment?.MunicipalityFR+' ' +establishment?.Zipcode|| 'Adresse non disponible'}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>Aucun établissement trouvé.</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Branches</Text>
            {company.branches?.length > 0 ? (
              company.branches.map((branch, index) => (
                <View key={index} style={styles.infoContainer}>
                  <Ionicons name="briefcase-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{branch?.HouseNumber +' '+ branch?.StreetFR+' ' + branch?.MunicipalityFR+' ' +branch?.Zipcode|| 'Adresse non disponible'}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>Aucune branche trouvée.</Text>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.infoText}>Aucune information sur l'entreprise disponible.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  link: {
    color: '#007AFF',
  },
  slideContainer: {
    marginVertical: 8,
  },
  slide: {
    width: width,
    backgroundColor: '#fff',
    padding: 16,
  },
  slideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slideContent: {
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EnterpriseDetail;

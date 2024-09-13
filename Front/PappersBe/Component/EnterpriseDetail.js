import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiUrl } from '../apiUrl';
const { width } = Dimensions.get('window');

const EnterpriseDetail = ({ route }) => {
  const { enterpriseNumber } = route.params;
  const [company, setCompany] = useState();
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showEnterpriseActivities, setShowEnterpriseActivities] = useState(false);
  const [showEstablishmentActivities, setShowEstablishmentActivities] = useState({});
  const scrollViewRef = useRef(null);
  
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`${ApiUrl}/enterprises/${enterpriseNumber}/details`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCompany(data);

      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'entreprise:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompanyDetails();
  }, [enterpriseNumber]);

  const toggleActivities = (type, index) => {
    if (type === 'enterprise') {
      setShowEnterpriseActivities(!showEnterpriseActivities);
    } else if (type === 'establishment') {
      setShowEstablishmentActivities(prev => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };
  
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

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      {company ? (
        <>
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{company.enterprise?.Denomination || 'Nom non disponible'}</Text>
              <Text style={styles.subtitle}>N° d'entreprise : {company.enterprise?.EnterpriseNumber || 'N/A'}</Text>
              <Ionicons name="location-outline" size={20} color="#007AFF" />
              <Text style={styles.infoText}>
                {company.enterprise?.HouseNumber} {company.enterprise?.StreetFR}, {company.enterprise?.MunicipalityFR} {company.enterprise?.Zipcode || 'Adresse non disponible'}
              </Text>
              <Text style={styles.infoText}>Statut : {company.enterprise?.Status || 'N/A'}</Text>
              <Text style={styles.infoText}>Situation juridique : {company.enterprise?.JuridicalSituation || 'N/A'}</Text>
              <Text style={styles.infoText}>Type d'entreprise : {company.enterprise?.TypeOfEnterprise || 'N/A'}</Text>
              <Text style={styles.infoText}>Forme juridique : {company.enterprise?.JuridicalForm || 'N/A'}</Text>
              <Text style={styles.infoText}>Date de création : {company.enterprise?.StartDate || 'N/A'}</Text>
              <Text style={styles.infoText}>Numéro d'entité : {company.enterprise?.EntityNumber || 'N/A'}</Text>
              <Text style={styles.infoText}>Type d'adresse : {company.enterprise?.TypeOfAddress || 'N/A'}</Text>
              <Text style={styles.infoText}>Pays (NL) : {company.enterprise?.CountryNL || 'N/A'}</Text>
              <Text style={styles.infoText}>Pays (FR) : {company.enterprise?.CountryFR || 'N/A'}</Text>
              <Text style={styles.infoText}>Code postal : {company.enterprise?.Zipcode || 'N/A'}</Text>
              <Text style={styles.infoText}>Commune (NL) : {company.enterprise?.MunicipalityNL || 'N/A'}</Text>
              <Text style={styles.infoText}>Commune (FR) : {company.enterprise?.MunicipalityFR || 'N/A'}</Text>
              <Text style={styles.infoText}>Rue (NL) : {company.enterprise?.StreetNL || 'N/A'}</Text>
              <Text style={styles.infoText}>Rue (FR) : {company.enterprise?.StreetFR || 'N/A'}</Text>
              <Text style={styles.infoText}>Numéro : {company.enterprise?.HouseNumber || 'N/A'}</Text>
              <Text style={styles.infoText}>Boîte : {company.enterprise?.Box || 'N/A'}</Text>
              <Text style={styles.infoText}>Adresse supplémentaire : {company.enterprise?.ExtraAddressInfo || 'N/A'}</Text>
              <Text style={styles.infoText}>Date de radiation : {company.enterprise?.DateStrikingOff || 'N/A'}</Text>
              <Text style={styles.infoText}>Langue : {company.enterprise?.Language || 'N/A'}</Text>
              <Text style={styles.infoText}>Type de dénomination : {company.enterprise?.TypeOfDenomination || 'N/A'}</Text>
            </View>
            {/* Bouton pour déplier/replier les activités */}
            <TouchableOpacity onPress={() => toggleActivities('enterprise')} style={styles.activityButton}>
              <Text style={styles.activityButtonText}>
                {showEnterpriseActivities ? 'Replier les activités' : 'Déplier les activités'}
              </Text>
            </TouchableOpacity>

            {/* Affichage des activités de l'entreprise */}
            {showEnterpriseActivities && company.enterprise?.activities && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Activités</Text>
                {company.enterprise.activities.map((activity, index) => (
                  <View key={index} style={styles.infoContainer}>
                    <Text style={styles.infoText}>Groupe d'activités : {activity.ActivityGroup}</Text>
                    <Text style={styles.infoText}>Code NACE : {activity.NaceCode}</Text>
                    <Text style={styles.infoText}>Version NACE : {activity.NaceVersion}</Text>
                    <Text style={styles.infoText}>Classification : {activity.Classification}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Affichage des établissements */}
          {company.establishments?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Établissements</Text>
              {company.establishments.map((establishment, index) => (
                <View key={index} style={styles.infoContainer}>
                  <Text style={styles.subtitle}>N° d'établissement : {establishment?.EstablishmentNumber || 'N/A'}</Text>
                  <Ionicons name="business-outline" size={20} color="#007AFF" />
                  <Text style={styles.infoText}>Adresse : {establishment?.HouseNumber} {establishment?.StreetFR}, {establishment?.MunicipalityFR} {establishment?.Zipcode}</Text>
                  <TouchableOpacity onPress={() => toggleActivities('establishment', index)} style={styles.activityButton}>
                    <Text style={styles.activityButtonText}>
                      {showEstablishmentActivities[index] ? 'Replier les activités' : 'Déplier les activités'}
                    </Text>
                  </TouchableOpacity>
                  {showEstablishmentActivities[index] && establishment?.activities && (
                    <View style={styles.card}>
                      {establishment.activities.map((activity, idx) => (
                        <View key={idx} style={styles.infoContainer}>
                          <Text style={styles.infoText}>Groupe d'activités : {activity.ActivityGroup}</Text>
                          <Text style={styles.infoText}>Code NACE : {activity.NaceCode}</Text>
                          <Text style={styles.infoText}>Version NACE : {activity.NaceVersion}</Text>
                          <Text style={styles.infoText}>Classification : {activity.Classification}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Affichage des branches */}
          {company.branches?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Branches</Text>
              {company.branches.map((branch, index) => (
                <View key={index} style={styles.infoContainer}>
                  <Text style={styles.subtitle}>ID : {branch?.Id || 'N/A'}</Text>
                  <Ionicons name="briefcase-outline" size={20} color="#007AFF" />
                  <Text style={styles.infoText}>Adresse : {branch?.HouseNumber} {branch?.StreetFR}, {branch?.MunicipalityFR} {branch?.Zipcode}</Text>
                  <Text style={styles.infoText}>Date de début : {branch?.StartDate || 'N/A'}</Text>
                  <Text style={styles.infoText}>Type d'adresse : {branch?.TypeOfAddress || 'N/A'}</Text>
                  <Text style={styles.infoText}>Pays (NL) : {branch?.CountryNL || 'N/A'}</Text>
                  <Text style={styles.infoText}>Pays (FR) : {branch?.CountryFR || 'N/A'}</Text>
                  <Text style={styles.infoText}>Code postal : {branch?.Zipcode || 'N/A'}</Text>
                  <Text style={styles.infoText}>Commune (NL) : {branch?.MunicipalityNL || 'N/A'}</Text>
                  <Text style={styles.infoText}>Commune (FR) : {branch?.MunicipalityFR || 'N/A'}</Text>
                  <Text style={styles.infoText}>Rue (NL) : {branch?.StreetNL || 'N/A'}</Text>
                  <Text style={styles.infoText}>Rue (FR) : {branch?.StreetFR || 'N/A'}</Text>
                  <Text style={styles.infoText}>Numéro : {branch?.HouseNumber || 'N/A'}</Text>
                  <Text style={styles.infoText}>Boîte : {branch?.Box || 'N/A'}</Text>
                  <Text style={styles.infoText}>Adresse supplémentaire : {branch?.ExtraAddressInfo || 'N/A'}</Text>
                  <Text style={styles.infoText}>Date de radiation : {branch?.DateStrikingOff || 'N/A'}</Text>
                </View>
              ))}
            </View>
          )}

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
    color: '#007AFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  activityButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  activityButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007AFF',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EnterpriseDetail;

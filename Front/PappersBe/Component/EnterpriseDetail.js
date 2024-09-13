// enterpriseDetail.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const enterpriseDetail = ({ route }) => {
  const { enterpriseId } = route.params;
  useEffect(() => {
    // Fonction pour récupérer les données
    const fetchData = async () => {
      try {
        const response = await fetch(`http://10.74.2.59:3000/api/enterprises/${enterpriseId}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{enterprise.name}</Text>
      <Text style={styles.detail}>N° d'entreprise : {enterprise.vat}</Text>
      <Text style={styles.detail}>Adresse : {enterprise.address}</Text>
      <Text style={styles.detail}>Téléphone : {enterprise.phone}</Text>
      <Text style={styles.detail}>Site web : {enterprise.website}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default enterpriseDetail;

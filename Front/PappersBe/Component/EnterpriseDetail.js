// CompanyDetail.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CompanyDetail = ({ route }) => {
  const { company } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{company.name}</Text>
      <Text style={styles.detail}>N° d'entreprise : {company.vat}</Text>
      <Text style={styles.detail}>Adresse : {company.address}</Text>
      <Text style={styles.detail}>Téléphone : {company.phone}</Text>
      <Text style={styles.detail}>Site web : {company.website}</Text>
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

export default CompanyDetail;

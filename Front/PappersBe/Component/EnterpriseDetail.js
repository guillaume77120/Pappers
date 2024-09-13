import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const EnterpriseDetail = ({ company = {
  name: "Example Company",
  vat: "BE0123456789",
  address: "123 Main Street, 1000 Brussels, Belgium",
  phone: "+32 2 123 45 67",
  website: "www.example.com",
  email: "contact@example.com"
} }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef(null);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{company.name}</Text>
        <Text style={styles.subtitle}>N° d'entreprise : {company.vat}</Text>
        <View style={styles.infoContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{company.address}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{company.phone}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Ionicons name="globe-outline" size={16} color="#666" />
          <TouchableOpacity onPress={() => openLink(`https://${company.website}`)}>
            <Text style={[styles.infoText, styles.link]}>{company.website}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <TouchableOpacity onPress={() => openLink(`mailto:${company.email}`)}>
            <Text style={[styles.infoText, styles.link]}>{company.email}</Text>
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
        <View style={styles.infoContainer}>
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text style={styles.infoText}>Siège social: {company.address}</Text>
        </View>
      </View>
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
    flexDirection: 'row',
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
});

export default EnterpriseDetail;
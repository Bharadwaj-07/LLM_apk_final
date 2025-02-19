import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.7;

const SlideMenu = forwardRef((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Dashboard'); // Track selected item
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const navigation = useNavigation();

  // Allow parent component (App.js) to control the menu
  useImperativeHandle(ref, () => ({
    toggleMenu: () => {
      if (isOpen) {
        Animated.timing(slideAnim, {
          toValue: -MENU_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setIsOpen(false));
      } else {
        setIsOpen(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  }));

  const menuItems = [
    { title: 'Dashboard', icon: 'home-outline', onPress: () => navigation.navigate('Home') },
    { title: 'Create Class', icon: 'add-outline', onPress: () => navigation.navigate('CreateClass') },
    { title: 'Join Class', icon: 'arrow-forward-outline', onPress: () => navigation.navigate('JoinClass') },
    { title: 'Logout', icon: 'log-out-outline', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) },
  ];

  return (
    <>
      {isOpen && <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => ref.current.toggleMenu()} />} 

      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}> 
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.menuItem, selectedItem === item.title && styles.selectedMenuItem]} 
            onPress={() => { 
              setSelectedItem(item.title);
              item.onPress();
              ref.current.toggleMenu();
            }}
          >
            <Ionicons 
              name={item.icon} 
              size={24} 
              color={selectedItem === item.title ? 'white' : '#32004b'} 
              style={styles.icon} 
            />
            <Text style={[styles.menuText, selectedItem === item.title && styles.selectedMenuText]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: '#e2d1f9',
    zIndex: 100,
    paddingTop: 50,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  selectedMenuItem: {
    backgroundColor: '#32004b', // Highlight color
  },
  icon: {
    marginRight: 15,
    width: 24,
  },
  menuText: {
    color: '#32004b',
    fontSize: 18,
    fontWeight: '500',
  },
  selectedMenuText: {
    color: 'white', // Change text color for selected item
  },
});

export default SlideMenu;

import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//activeTab kertoo, mikä välilehti on parhaillaan aktiivisena.
// setActiveTab vaihtaa aktiivisen välilehden käyttäjän valinnan mukaan.
type BottomNavigationProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

// Alapalkin navigaatiokomponentti
export default function BottomNavigation({
  activeTab,
  setActiveTab,
}: BottomNavigationProps) {
  return (
    <View style={styles.bottomNav}>
      <Pressable
        style={[
          styles.navButton,
          activeTab === 'calendar' && styles.activeNavButton,
        ]}
        onPress={() => setActiveTab('calendar')}
      >
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={24}
          color={activeTab === 'calendar' ? '#51483F' : '#85857C'}
        />
        <Text
          style={[
            styles.navLabel,
            activeTab === 'calendar' && styles.activeNavLabel,
          ]}
        >
          Kalenteri
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.navButton,
          activeTab === 'phases' && styles.activeNavButton,
        ]}
        onPress={() => setActiveTab('phases')}
      >
        <MaterialCommunityIcons
          name="chart-donut"
          size={24}
          color={activeTab === 'phases' ? '#51483F' : '#85857C'}
        />
        <Text
          style={[
            styles.navLabel,
            activeTab === 'phases' && styles.activeNavLabel,
          ]}
        >
          Kierron vaiheet
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.navButton,
          activeTab === 'wellbeing' && styles.activeNavButton,
        ]}
        onPress={() => setActiveTab('wellbeing')}
      >
        <MaterialCommunityIcons
          name="heart-outline"
          size={24}
          color={activeTab === 'wellbeing' ? '#51483F' : '#85857C'}
        />
        <Text
          style={[
            styles.navLabel,
            activeTab === 'wellbeing' && styles.activeNavLabel,
          ]}
        >
          Hyvinvointi
        </Text>
      </Pressable>
    </View>
  );
}

// Tyylit
const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#F0E5CB',
    borderTopWidth: 1,
    borderTopColor: '#C9BFAE',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 3,
    borderRadius: 12,
    gap: 4,
  },
  activeNavButton: {
    backgroundColor: '#E5D8B8',
  },
  navLabel: {
    fontSize: 11,
    color: '#625E56',
    textAlign: 'center',
  },
  activeNavLabel: {
    color: '#51483F',
    fontWeight: 'bold',
  },
});
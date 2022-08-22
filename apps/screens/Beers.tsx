import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import CustomModal from "../components/Modal";
import { BeersDrawerNavigationProp, beerType } from "../components/types";
import { addBeer, modifyBeer } from "../store/Beerstore";
import { useBeerContext } from "../store/store";

type Props = {
  navigation: BeersDrawerNavigationProp;
};

const Beers = ({ navigation }: Props) => {
  const {
    beers: { beers, logs },
    dispatch,
  } = useBeerContext();
  const [beer, setBeer] = useState<beerType | null>(null);
  const [hideModal, setHideModal] = useState<boolean>(true);

  const addComponet = (
    <TouchableOpacity onPress={() => setHideModal(false)}>
      <Text style={styles.addBtnText}>Add</Text>
    </TouchableOpacity>
  );
  const AddBeer = (be: {}) => {
    setHideModal(true);
    if (beer) {
      dispatch(modifyBeer(be));
      setBeer(null);
      return;
    }
    dispatch(addBeer(be));
  };
  useEffect(() => {
    if (beer) {
      setHideModal(false);
    }
  }, [beer]);
  return (
    <SafeAreaView style={styles.container}>
      <CustomModal
        visible={!hideModal}
        addBeer={AddBeer}
        hideModal={setHideModal}
        beers={beer}
        clearbeer={setBeer}
      />
      <Header
        title="Beers"
        openDrawer={() => navigation.openDrawer()}
        children={addComponet}
      />
      <View style={styles.beersWrapper}>
        <View style={styles.beerHeader}>
          <Text style={styles.headerText}>Name</Text>
          <Text style={styles.headerText}>Stock</Text>
        </View>
        <FlatList
          data={beers}
          keyExtractor={(item, index) => String(item.id)}
          contentContainerStyle={styles.content}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.beerStyle}
              onPress={() => setBeer(item)}
            >
              <Text style={styles.contentText}>{item.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.contentText}>{item.stock}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Beers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  beersWrapper: {
    paddingHorizontal: 10,
    flex: 1,
  },
  beerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    marginTop: 10,
    paddingBottom: 5,
  },
  content: {
    marginVertical: 5,
  },
  beerStyle: {
    padding: 8,
    backgroundColor: "#add8e6",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    color: "#1a1110",
    fontSize: 18,
    fontWeight: "bold",
  },
  contentText: {
    color: "#1a1110",
    fontSize: 14,
  },
  badge: {
    backgroundColor: "#89CFF0",
    borderRadius: 15,
    padding: 3,
  },
  addBtnText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
  },
  ModalPopupView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginHorizontal: 20,
    padding: 10,
  },
  textInputStyle: {
    borderColor: "#0abab5",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    color: "#777777",
  },
  twoColumn: {
    flexDirection: "row",
  },
  dropdownWrapper: {
    position: "relative",
    paddingVertical: 10,
  },
  dropdown: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderColor: "#0ABAB5",
    borderWidth: 0.5,
    borderRadius: 3,
    zIndex: 50,
  },
  dropdownOption: {
    alignItems: "center",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    zIndex: 50,
  },
});

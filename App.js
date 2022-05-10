import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import data from "./data.json";

export default function App() {
  const [detailModal, setDetailModal] = useState(false);
  const [detailData, setDetailData] = useState({});

  const onPress = (item) => {
    setDetailData(item);
    setDetailModal(true);
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          {
            marginTop: index === 0 ? 8 : 0,
          },
          styles.renderItemStyle,
        ]}
        onPress={() => onPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.textContainerStyle}>
          <Text style={styles.textTitleStyle}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.textSubTitleStyle}>
            {item.subTitle}
          </Text>
        </View>

        <Image source={{ uri: item.thumbnailUrl }} style={styles.imageStyle} />
      </TouchableOpacity>
    );
  };

  const onRequestClose = () => {
    setDetailModal(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        visible={detailModal}
        onRequestClose={onRequestClose}
        animationType={"slide"}
      >
        <View style={styles.modalContainerStyle}>
          <View style={styles.modalTopViewStyle}>
            <View style={styles.modalTopTextView}>
              <Text style={styles.modalTitleTextStyle}>{detailData.title}</Text>
              <Text numberOfLines={1} style={styles.modalSubtitleTextStyle}>
                {detailData.subTitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onRequestClose} activeOpacity={0.9}>
              <Image
                source={require("./assets/cancel.png")}
                style={styles.cancelBtnStyle}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: detailData.thumbnailUrl }}
            style={styles.modalImageStyle}
          />
          <Animatable.View animation={"fadeInRightBig"} useNativeDriver={true}>
            <ScrollView horizontal={true}>
              {[
                "#ff0000",
                "#800000",
                "#d2691e",
                "#d2b48c",
                "#ffa500",
                "#00ff00",
                "#0000ff",
              ].map((item, index) => {
                return (
                  <View
                    style={[
                      {
                        marginStart: index === 0 ? 16 : 0,
                        backgroundColor: item,
                      },
                      styles.modalItemColorStyle,
                    ]}
                    key={index}
                  />
                );
              })}
            </ScrollView>
          </Animatable.View>
          <Animatable.View
            animation={"fadeInRightBig"}
            delay={400}
            useNativeDriver={true}
            style={styles.dividerStyle}
          />
          <Animatable.View
            animation={"fadeInRightBig"}
            delay={600}
            useNativeDriver={true}
            style={styles.detailViewStyle}
          >
            <Text style={styles.detailTextStyle}>Get a free service</Text>
            <Image
              source={require("./assets/forward-arrow.png")}
              style={styles.arrowStyle}
            />
          </Animatable.View>
          <Animatable.View
            animation={"fadeInRightBig"}
            delay={800}
            useNativeDriver={true}
            style={styles.dividerStyle}
          />
          <Animatable.View
            animation={"fadeInRightBig"}
            delay={1000}
            useNativeDriver={true}
            style={styles.detailViewStyle}
          >
            <Text style={styles.detailTextStyle}>Save 10% and buy now!</Text>
            <Image
              source={require("./assets/forward-arrow.png")}
              style={styles.arrowStyle}
            />
          </Animatable.View>
          <Animatable.View
            animation={"fadeInRightBig"}
            delay={1200}
            useNativeDriver={true}
            style={styles.dividerStyle}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dcdcdc",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  renderItemStyle: {
    // marginLeft: 8,
    // marginRight: 8,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "#c4c3d0",
    flexDirection: "row",
    // flex: 1,
    overflow: "hidden",
    width: Dimensions.get("window").width * 0.95,
    justifyContent: "space-between",
  },
  textContainerStyle: { width: "50%", padding: 8 },
  textTitleStyle: { fontSize: 18, fontWeight: "bold", color: "black" },
  textSubTitleStyle: { fontSize: 14, color: "#616161" },
  imageStyle: { width: "50%", aspectRatio: 1.5 },
  modalContainerStyle: { backgroundColor: "white" },
  modalTopViewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
    alignItems: "center",
  },
  modalTopTextView: { width: "70%" },
  modalTitleTextStyle: { fontSize: 28, fontWeight: "bold", color: "black" },
  modalSubtitleTextStyle: { color: "#9E9E9E" },
  cancelBtnStyle: { height: 16, width: 16 },
  modalImageStyle: { width: "100%", aspectRatio: 1.8 },
  modalItemColorStyle: {
    height: 50,
    width: 50,
    borderRadius: 10,
    marginTop: 16,
    marginEnd: 16,
    marginBottom: 20,
  },
  dividerStyle: {
    height: 1,
    backgroundColor: "#bdbdbd",
    marginHorizontal: 6,
  },
  detailViewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginStart: 28,
    marginTop: 22,
    marginEnd: 28,
    marginBottom: 22,
  },
  detailTextStyle: { color: "black", fontWeight: "500" },
  arrowStyle: { height: 18, width: 18 },
});

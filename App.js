import { useEffect, useState } from "react";
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
  ToastAndroid,
} from "react-native";
import * as Animatable from "react-native-animatable";
import data from "./data.json";

const password = [
  { code: 0, isSelected: false },
  { code: 0, isSelected: false },
  { code: 0, isSelected: false },
  { code: 0, isSelected: false },
];

export default function App() {
  const [detailModal, setDetailModal] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [btnPressed, setBtnPressed] = useState(false);
  const [pressIndex, setPressIndex] = useState(0);
  const [passCode, setPassCode] = useState(
    JSON.parse(JSON.stringify(password))
  );
  const [confirmPassCode, setConfirmPassCode] = useState(
    JSON.parse(JSON.stringify(password))
  );
  const [passCodeIndex, setPassCodeIndex] = useState(0);
  const [confirmCodeIndex, setConfirmCodeIndex] = useState(0);
  const [isEnterPinVisible, setIsEnterPinVisible] = useState(false);
  const [showFirstUI, setShowFirstUI] = useState(true);

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

  useEffect(() => {
    setIsEnterPinVisible(passCode.every((item) => item.isSelected === true));
    if (confirmPassCode.every((value) => value.isSelected === true)) {
      let final = true;
      for (let i = 0; i < passCode.length; i++) {
        if (passCode[i].code !== confirmPassCode[i].code) {
          final = false;
          break;
        }
      }
      if (final) {
        ToastAndroid.show("Correct Password!!", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Wrong Password!!", ToastAndroid.SHORT);
      }
    }
    return () => {};
  }, [btnPressed]);

  const PasswordView = ({ item, index }) => (
    <View
      style={[
        {
          backgroundColor: item.isSelected ? "#39ff14" : "#1c2841",
        },
        styles.passwordView,
      ]}
      key={index}
    />
  );

  const onDailPress = (item, index) => {
    setBtnPressed(true);
    setPressIndex(index);
    if (passCodeIndex < 4) {
      passCode[passCodeIndex].code = item;
      passCode[passCodeIndex].isSelected = true;
      setPassCode(passCode);
      setPassCodeIndex(passCodeIndex + 1);
    }
    if (isEnterPinVisible) {
      if (confirmCodeIndex < 4) {
        confirmPassCode[confirmCodeIndex].code = item;
        confirmPassCode[confirmCodeIndex].isSelected = true;
        setConfirmPassCode(confirmPassCode);
        setConfirmCodeIndex(confirmCodeIndex + 1);
      }
    }
    setTimeout(() => {
      setBtnPressed(false);
    }, 150);
  };

  const onClearPress = (item, index) => {
    if (!isEnterPinVisible) {
      if (passCodeIndex > 0) {
        let i = passCodeIndex - 1;
        setPassCodeIndex(i);
        passCode[i].code = 0;
        passCode[i].isSelected = false;
      }
    } else {
      if (confirmCodeIndex > 0) {
        let j = confirmCodeIndex - 1;
        setConfirmCodeIndex(j);
        confirmPassCode[j].code = 0;
        confirmPassCode[j].isSelected = false;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showFirstUI ? (
        <View>
          <Text style={styles.headingTextStyle}>
            {isEnterPinVisible ? "Confirm PIN" : "Enter PIN"}
          </Text>
          {!isEnterPinVisible && (
            <Text style={styles.subTextStyle}>
              to keep your information secure
            </Text>
          )}
          <View style={styles.passcodeView}>
            {!isEnterPinVisible
              ? passCode.map((item, index) => {
                  return <PasswordView item={item} index={index} key={index} />;
                })
              : confirmPassCode.map((item, index) => {
                  return <PasswordView item={item} index={index} key={index} />;
                })}
          </View>
          <View style={styles.keyboardView}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor:
                          pressIndex === index && btnPressed
                            ? "#39ff14"
                            : "#1c2841",
                      },
                      styles.btnStyle,
                    ]}
                    onPress={() => onDailPress(item, index)}
                  >
                    <Text style={styles.numberStyle}>{item}</Text>
                  </TouchableOpacity>
                  {item === 0 ? (
                    <TouchableOpacity
                      style={styles.clearBtnStyle}
                      onPress={() => onClearPress(item, index)}
                    >
                      <View style={styles.triangleStyle} />
                      <View style={styles.triangleBoxStyle}>
                        <Image
                          source={require("./assets/cancel_2.png")}
                          style={styles.triangleImageStyle}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
          <Modal
            visible={detailModal}
            onRequestClose={onRequestClose}
            animationType={"none"}
          >
            <Animatable.View
              style={styles.modalContainerStyle}
              animation={"zoomInRight"}
            >
              <View style={styles.modalTopViewStyle}>
                <View style={styles.modalTopTextView}>
                  <Text style={styles.modalTitleTextStyle}>
                    {detailData.title}
                  </Text>
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
              <Animatable.View
                animation={"fadeInRightBig"}
                useNativeDriver={true}
              >
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
                <Text style={styles.detailTextStyle}>
                  Save 10% and buy now!
                </Text>
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
            </Animatable.View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003153",
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
  headingTextStyle: { color: "white", fontSize: 18, fontWeight: "600" },
  subTextStyle: { color: "#abcdef", fontSize: 16, marginTop: 6 },
  passcodeView: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "25%",
    marginTop: 20,
  },
  passwordView: {
    height: 8,
    width: 8,
    borderRadius: 8,
  },
  keyboardView: {
    justifyContent: "center",
    flexDirection: "row",
    width: "60%",
    marginTop: 40,
    flexWrap: "wrap",
  },
  btnStyle: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#abcdef",
    margin: 8,
  },
  numberStyle: { color: "white" },
  clearBtnStyle: {
    position: "absolute",
    right: -60,
    bottom: 15,
    flexDirection: "row",
  },
  triangleStyle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#5d8aa8",
    transform: [{ rotate: "-90deg" }],
  },
  triangleBoxStyle: {
    height: 26.5,
    width: 26.5,
    backgroundColor: "#5d8aa8",
    bottom: 7,
    left: -8,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  triangleImageStyle: { height: 15, width: 15, marginStart: 2 },
});

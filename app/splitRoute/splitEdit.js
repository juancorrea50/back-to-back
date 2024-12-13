import { View, TouchableOpacity, Text, Image, Dimensions } from "react-native";
import Tooltab from "../tooltab";
import styling from "../styling";
import Editmenu from "../editSplit/editMenu";

export default function splitEdit() {
  //User edits their split

  const styles = styling.splitsMenu;
  const windWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {/*Tooltab container */}
      <View style={{ flexDirection: "row" }}>
        <Tooltab />
      </View>

      {/*Edit menu container */}

      <View>
        <View>
          <Text
            style={{
              textAlign: "center",
              color: "#FFF",
              fontWeight: "bold",
              fontSize: 25,
              borderWidth: 2,
              borderColor: "#CCAE48",
              paddingVertical: 5,
            }}
          >
            Edit Your Split
          </Text>
        </View>
        <Editmenu />
      </View>
    </View>
  );
}

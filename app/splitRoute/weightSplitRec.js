import { View, TouchableOpacity,Text, Image } from "react-native"
import { router } from "expo-router"
import Tooltab from "../tooltab"
import styling from "../styling"

export default function weightSplitRec(){
    const styles = styling.splitsMenu

    function handleChoice(){
        router.push('./splitEdit');
    }

    return(
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <Tooltab/>
            </View>
            <View style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20}}>
                {/*1st Recommendation */}
                <View>
                    <TouchableOpacity style={styles.optionContainer} onPress={()=>{handleChoice()}}>
                        <View style={{width: 0, flexGrow: 1, flex: 1}}>
                            <Text style={styles.optionText}>1st Recommendation</Text>
                        </View>
                        <Image source={require("../../assets/Intermediate-Photo 1.png")} style={styles.optionImage}/>
                    </TouchableOpacity>
                </View>
                {/*2nd Recommendation */}
                <View>
                    <TouchableOpacity style={styles.optionContainer}>
                        <View style={{width: 0, flexGrow: 1, flex: 1}}>
                            <Text style={styles.optionText}>2nd Recommendation</Text>
                        </View>
                        <Image source={require("../../assets/Intermediate-Photo 1.png")} style={styles.optionImage}/>
                    </TouchableOpacity>
                </View>
                {/*3rd Recommendation */}
                <View>
                    <TouchableOpacity style={styles.optionContainer}>
                        <View style={{width: 0, flexGrow: 1, flex: 1}}>
                            <Text style={styles.optionText}>3rd Recommendation</Text>
                        </View>
                        <Image source={require("../../assets/Intermediate-Photo 1.png")} style={styles.optionImage}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
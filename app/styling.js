import { AuthError } from "@supabase/supabase-js";
import { StyleSheet, Dimensions, useWindowDimensions } from "react-native";
import editMenu from "./editSplit/editMenu";

//For index component
const index = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    backgroundColor: "#000000",
  },
  headerContainer: {
    paddingTop: 20,
    marginBottom: 20,
    alignItems: "center",
    position: "absolute", // Position header at the top
    top: 0,
    width: "100%",
    backgroundColor: "#000000",
    paddingHorizontal: 20, // Padding on the sides
  },
  subHeaderContainer: {
    alignItems: "center",
    width: "100%", // Full width
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  subTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
  },
  subText: {
    color: "#FFFFFF",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#232323", // Dark grey background for the container
    padding: 20,
    alignItems: "center",
    width: Dimensions.get("window").width, // Container width to be 90% of viewport width
    marginBottom: 20, // Space below the form container
    marginTop: 100, // Space above the form container to avoid overlap with header
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
    alignSelf: "flex-start", // Align labels to the left
    width: "100%", // Full width to align with the inputs
    marginLeft: 55,
  },
  input: {
    width: "70%",
    height: 40, // Smaller input fields
    borderColor: "#FFD95A",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: "#000000",
    backgroundColor: "#FFD95A", // Grey background for the input fields
  },
  forgotPassword: {
    color: "#FFD95A",
    marginTop: 5,
    textDecorationLine: "underline",
    alignSelf: "flex-end", // Align "Forgot Password" to the right
    paddingLeft: 150,
  },
  signUp: {
    color: "#FFD95A",
    paddingTop: 5,
    textDecorationLine: "underline",
  },
  signUpContainer: {
    paddingTop: 5,
  },
  button: {
    backgroundColor: "#FFD95A",
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

//Login success popup
const lis = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  successText: {
    color: "#FFD95A",
    fontSize: 24,
    fontWeight: "bold",
  },
});
//Weight Input Screen
const wis = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Ensure spacing between items (top, center, bottom)
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20,
  },
  headerContainer: {
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD95A",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
    alignSelf: "flex-start", // Align labels to the left
    width: "100%", // Full width to align with the inputs
    marginLeft: 40,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#FFD95A",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: "#000000",
    backgroundColor: "#FFD95A",
  },
  button: {
    backgroundColor: "#FFD95A",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
//Sign Up Screen
const sus = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  headerContainer: {
    paddingTop: 20,
    marginBottom: 20,
    alignItems: "center",
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#000000",
    paddingHorizontal: 20,
  },
  subHeaderContainer: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD95A",
    paddingTop: 10,
  },
  subText: {
    color: "#FFFFFF",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#232323",
    padding: 20,
    alignItems: "center",
    width: Dimensions.get("window").width,
    marginBottom: 20,
    marginTop: 75,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
    width: "100%",
    marginLeft: 55,
  },
  input: {
    width: "70%",
    height: 40,
    borderColor: "#FFD95A",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: "#000000",
    backgroundColor: "#FFD95A",
  },
  button: {
    backgroundColor: "#FFD95A",
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 50,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  //begin askGender special styling
  optionContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    width: Dimensions.get("window").width,
    alignContent: "space-around",
    gap: 15,
    marginBottom: 15,
    marginTop: 50,
  },
  label: {
    color: "white",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "5rem",
  },
  gendButton: {
    border: "1px solid white",
    borderRadius: 100,
    height: 185,
    width: 185,
    alignItems: "center",
    justifyContent: "center",
  },
  gendBtnSelected: {
    border: "1px solid white",
    borderRadius: 100,
    height: 185,
    width: 185,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD95A",
  },
});

//Height input screen
const his = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Ensure spacing between items (top, center, bottom)
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20,
  },
  headerContainer: {
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD95A",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
    alignSelf: "flex-start", // Align labels to the left
    width: "100%", // Full width to align with the inputs
    marginLeft: 40,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#FFD95A",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: "#000000",
    backgroundColor: "#FFD95A",
  },
  button: {
    backgroundColor: "#FFD95A",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
const askGend = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFD95A",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    backgroundColor: "#000000",
  },
  nextBtn: {
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 5,
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

//HomeScreen Styling
const homeScreen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  sideways: {
    flexDirection: "row",
  },
  header: {
    height: 100,
    backgroundColor: "#232323",
    paddingHorizontal: 20,
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD95A",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  subHeaderText: {
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  headerIcons: {
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: "#333333",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconContainerHome: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#232323",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  icon: {
    width: 28,
    height: 28,
  },
  navigationBar: {
    height: 70,
    backgroundColor: "#232323",
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#FFD95A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  navIcon: {
    width: 40,
    height: 40,
  },
  navText: {
    paddingTop: 10,
    fontSize: 14,
    color: "#FAF9F6",
    fontWeight: "600",
  },
  challengeContainer: {
    paddingHorizontal: 0.01 * Dimensions.get("window").width,
    backgroundColor: "#232323",
    marginTop: 10,
    width: 0.8 * Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  cardChallengeContainer: {
    flex: 1,
    backgroundColor: "#232323",
    width: "90%",
    height: "60%",
    flexDirection: "row",
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#FFD95A",
    overflow: "hidden",
  },
  challengeTextContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "50%",
    flexShrink: 1, // Ensures it shrinks to fit within the container if needed
    paddingHorizontal: 10, // Add padding to prevent text from being clipped
  },
  activityHeader: {
    width: "100%",
    backgroundColor: "#232323",
    height: "10%",
    justifyContent: "center",
    paddingLeft: 20,
  },
  myActivityText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  challengeTitle: {
    paddingTop: "50%",
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  startButton: {
    backgroundColor: "#FFD95A",
    padding: 15,
    width: "100%",
    borderRadius: 50,
    marginTop: 20, // Add margin to separate the button from the text
    justifyContent: "center", // Ensure the button text is centered
    alignItems: "center",
    shadowColor: "#FFD95A",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  challengeImage: {
    width: "50%",
    height: "100%",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    justifyContent: "flex-end",
  },
});

const statCard = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  header: {
    height: 90,
    backgroundColor: "#232323",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD95A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // Adds shadow for Android
  },
  backArrow: {
    height: 20,
    width: 20,
  },
  leftBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFD95A",
    marginLeft: 5,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 15,
  },
  shareButton: {
    backgroundColor: "#FFD95A",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 22,
    marginTop: 25,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6, // Adds shadow for Android
  },
  shareButtonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
    textAlign: "center",
  },
  cardContainer: {
    alignItems: "center",
    marginTop: 0,
    flex: 1, // Use flex to adapt height based on content
    overflow: "hidden",
  },
  card: {
    width: "90%",
    height: "100%",
    borderRadius: 25,
    borderWidth: 0,
    backgroundColor: "#FFD95A",
    alignItems: "center",
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 7, // Add shadow for Android
    backgroundColor:
      "linear-gradient(45deg, rgba(255, 217, 90, 0.9), rgba(204, 174, 72, 0.9))",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "100%",
    height: "10%",
    marginBottom: 5,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#CCAE48",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // Adds shadow for Android
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    paddingLeft: 15,
  },
  overall: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    paddingRight: 15,
  },
  image: {
    width: "90%",
    height: "40%",
    resizeMode: "cover",
    marginBottom: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6, // Adds shadow for Android
  },
  stats: {
    width: "100%",
  },
  statBar: {
    flexDirection: "row",
    height: "100%",
    maxWidth: "100%",
    minWidth: "20%",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 22,
    borderColor: "#CCAE48",
    backgroundColor:
      "linear-gradient(45deg, rgba(255, 217, 90, 0.5), rgba(204, 174, 72, 0.5))",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  stat: {
    flexDirection: "row",
    height: "15%",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#CCAE48",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // Adds shadow for Android
  },
  statText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    paddingLeft: 15,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: "85%",
    position: "absolute",
  },
});

//ToolTab
const tooltab = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  header: {
    height: 100,
    backgroundColor: "#232323",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 20,
    paddingTop: 2,
    backgroundColor: "#232323",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  subHeaderText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  homeContainer: {
    display: "flex",
    flexDirection: "row",
    width: "2rem",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
const splitsMenu = StyleSheet.create({
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  optionContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 175,
    width: Dimensions.get("window").width - 25,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#FFD95A",
    marginTop: 10,
  },
  optionText: {
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width * 0.06,
    color: "#FFD95A",
    marginLeft: 10,
  },
  optionImage: {
    height: 170,
    width: 190,
    borderRadius: 25,
    borderColor: "#FFD95A",
    borderLeftWidth: 5,
    overflow: "hidden",
  },
  //Edit Menu
  editOptionContainer: {
    height: "75%",
    alignItems: "center",
    justifyContent: "start",
    gap: 50,
    marginTop: 30,
  },
  editOption: {
    flexDirection: "row",
    width: 500,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  workoutDropdown: {
    height: 30,
    width: "30%",
    borderColor: "#FFD95A",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  repsDropdown: {
    height: 30,
    width: 75,
    borderColor: "#FFD95A",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  setsDropdown: {
    height: 30,
    width: 75,
    borderColor: "#FFD95A",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  weightTextInput: {
    height: 30,
    width: 90,
    borderColor: "#FFD95A",
    color: "#FFD95A",
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 3,
  },
  bodyText: {
    height: 30,
    width: 90,
    borderColor: "#FFD95A",
    color: "#FFD95A",
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 6,
  },
  editMenuButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 100,
    borderWidth: 1,
    borderColor: "#FFD95A",
  },
  editMenuButtonText: {
    fontSize: 20,
    color: "#FFD95A",
  },
});

//GroupScreen Styling
const groupPage = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  header: {
    height: 100,
    backgroundColor: "#232323",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  backArrow: {
    height: 20,
    width: 20,
  },
  leftBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  statBar: {
    flexDirection: "row",
    height: "100%",
    maxWidth: "100%",
    minWidth: "20%",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 22,
    borderColor: "#CCAE48",
    backgroundColor:
      "linear-gradient(45deg, rgba(255, 217, 90, 0.5), rgba(204, 174, 72, 0.5))",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    right: 10,
    position: "absolute",
  },
  memberDisplayImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  statText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    paddingLeft: 15,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "normal",
    color: "#FFD95A",
    marginLeft: 5,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  iconContainer: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: "#232323",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  groupContainer: {
    paddingHorizontal: 20,
  },
  groupHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  membersContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  membersTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  membersStatsContainer: {
    flex: 1,
    paddingTop: 20,
    flexDirection: "colunmn",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 20,
  },
  stat: {
    flexDirection: "row",
    marginTop: "10",
    height: "10%",
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#CCAE48",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // Adds shadow for Android
  },
  displayMember: {
    alignItems: "center",
    marginBottom: 10,
  },
  statTitleText: {
    fontSize: 20,
  },
  memberSlot: {
    alignItems: "center",
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  memberSpecialImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  memberTitle: {
    fontSize: 18,
    fontWeight: "normal",
    marginVertical: 10,
    color: "#FFD95A",
  },
  memberSpecialName: {
    fontSize: 14,
    color: "#FFD95A",
    paddingBottom: 15,
  },
  memberName: {
    fontSize: 14,
    color: "#FFD95A",
  },
  memberDisplayName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FFD95A",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#FFD95A",
  },
  challengeContainer: {
    paddingHorizontal: 20,
    marginVertical: 5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardChallengeContainer: {
    backgroundColor: "#232323",
    width: "100%",
    height: 120,
    flexDirection: "row",
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#FFD95A",
    overflow: "hidden",
  },
  challengeTextContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "50%",
    flexShrink: 10, // Ensures it shrinks to fit within the container if needed
    paddingHorizontal: 10, // Add padding to prevent text from being clipped
  },
  challengeTitle: {
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  startButton: {
    backgroundColor: "#FFD95A",
    padding: 5,
    width: "75%",
    borderRadius: 50,
    marginTop: 10, // Add margin to separate the button from the text
    justifyContent: "center", // Ensure the button text is centered
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  challengeImage: {
    width: "50%",
    height: "100%",
    borderRadius: 25,
    justifyContent: "flex-end",
  },
  editPhotoButton: {
    marginTop: 10,
    backgroundColor: "#FFD95A", // Green color for the button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: "center",
  },
  editPhotoText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },
  editIcon: {
    marginLeft: 5,
    marginTop: 4,
    height: 20, // Set explicit dimensions
    width: 20,
    resizeMode: "contain", // Ensure the image fits nicely within the size
  },
  groupNameContainer: {
    flexDirection: "row", // Vertically align the text and icon
    justifyContent: "flex-start", // Keep text and icon close
  },
  groupsubHeader: {
    fontSize: 14,
    paddingBottom: 15,
    fontWeight: "bold",
    color: "#f2dd99",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  leaveButtonContainer: {
    padding: 20,
    alignItems: "center",
  },
  leaveButton: {
    backgroundColor: "#232323",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFD95A",
    alignItems: "center",
  },
  leaveButtonText: {
    color: "#FFD95A",
    fontWeight: "bold",
    fontSize: 16,
  },
});

//RunningScreen
const runScreen = StyleSheet.create({
  map: {
    flex: 1,
    height: "50%",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  header: {
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  quadrant: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#232323",
  },
  statTitle: {
    fontSize: 18,
    fontWeight: "normal",
  },
  stat: {
    color: "#FFD95A",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FFD95A",
    justifyContent: "center",
  },
  endButton: {
    backgroundColor: "red",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

//UserProfile Styling
const userProf = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
    paddingHorizontal: 20,
  },
  header: {
    height: 100,
    paddingTop: 10,
    justifyContent: "center",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 0,
  },
  backArrow: {
    height: 20,
    width: 20,
  },
  headerText: {
    fontSize: 20,
    color: "#FFD95A",
    marginLeft: 10,
  },
  userContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  userHeader: {
    alignItems: "center",
  },
  userImage: {
    width: 250,
    height: 250,
    borderRadius: 40,
    marginBottom: 10,
  },
  userInfoContainer: {
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD95A",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#FFD95A",
    fontWeight: "600",
    marginTop: 10,
  },
  info: {
    flex: 1,
    fontSize: 18,
    color: "#FFF",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#FFD95A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  deleteAccountButton: {
    backgroundColor: "#FF0000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  editPhotoButton: {
    marginTop: 10,
    backgroundColor: "#FFD95A", // Green color for the button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: "center",
  },
  editPhotoText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  emailContainer: {
    flexDirection: "row", // Vertically align the text and icon
    justifyContent: "flex-start", // Keep text and icon close
  },
  editIcon: {
    marginLeft: 5,
    height: 20, // Set explicit dimensions
    width: 20,
    resizeMode: "contain", // Ensure the image fits nicely within the size
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Adds shadow on Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

//Group Selection Screen
const GroupSelect = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#232323",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#FFD95A",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 14,
    marginVertical: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "#FFD95A",
    borderRadius: 12,
    marginVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    width: "70%",
    padding: 16,
    backgroundColor: "#FFD95A",
    borderRadius: 12,
    marginVertical: 15,
    alignItems: "center",
  },
  AddPhotoButton: {
    width: "90%",
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  addPhotoText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  orDivider: {
    marginVertical: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  orText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#FFD95A",
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
});

const runSum = StyleSheet.create({
  mapDisplay: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#232323",
    paddingHorizontal: 16,
  },
  header: {
    height: 100,
    paddingTop: 40,
    justifyContent: "center",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 10,
  },
  backArrow: {
    height: 20,
    width: 20,
  },
  headerText: {
    fontSize: 25,
    color: "#FFD95A",
    marginLeft: 10,
  },

  runHeader: {
    alignItems: "center",
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  subTitle: {
    fontSize: 16,
    color: "gray",
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  mapPlaceholderText: {
    color: "gray",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  statContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  enduranceContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  progressCirclePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: "#FFD95A",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  enduranceText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  enduranceLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  button: {
    padding: 12,
    backgroundColor: "#FFD95A",
    borderRadius: 8,
  },
  discardButton: {
    backgroundColor: "#FF3333",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const runSum2 = StyleSheet.create({
  statContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  enduranceContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  textContainer: {
    flex: 1,
    marginVertical: 16,
  },
  progressCirclePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    borderColor: "#FFD95A",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  enduranceText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  enduranceLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD95A",
  },
});

//WeightWorkouts
const workoutWeightPre = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD95A",
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  video: {
    width: "100%",
    height: "75%",
    marginBottom: 20,
    paddingTop: 0,
    borderColor: "#FFD95A",
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  timer: {
    fontSize: 16,
    color: "#FFD95A",
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    marginHorizontal: 10,
    minWidth: 100,
    minHeight: 50,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});

const workSum = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 100,
    paddingTop: 20,
    justifyContent: "center",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  workoutHeader: {
    alignItems: "center",
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD95A",
  },
  subTitle: {
    fontSize: 16,
    color: "gray",
  },
  circleContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  statContainer: {
    justifyContent: "space-evenly",
    marginVertical: 20,
    flexDirection: "row",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: "#FFD95A",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  strengthScoreText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#232323",
  },
  strengthLabel: {
    fontSize: 18,
    color: "#FFD95A",
    marginTop: 10,
    fontWeight: "bold",
  },
  workoutList: {
    marginVertical: 10,
  },
  workoutCard: {
    backgroundColor: "#333",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "column",
  },
  workoutText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  workoutTextTitle: {
    fontSize: 20,
    marginBottom: 5,
    color: "#FFD95A",
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  button: {
    padding: 12,
    backgroundColor: "#FFD95A",
    borderRadius: 8,
  },
  discardButton: {
    backgroundColor: "#FF3333",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
});

export default {
  lis,
  wis,
  sus,
  index,
  his,
  askGend,
  GroupSelect,
  homeScreen,
  statCard,
  tooltab,
  splitsMenu,
  groupPage,
  runScreen,
  userProf,
  runSum,
  runSum2,
  workoutWeightPre,
  workSum,
};

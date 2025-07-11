const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createUserAndSaveToFirestore = functions.https.onCall(async (data, context) => {
  try {
    // Optional: Only allow logged in admins to call this
    const callerEmail = context.auth?.token?.email;
    if (callerEmail !== "admin@ori.com") {
      throw new functions.https.HttpsError("permission-denied", "Only admin can create users.");
    }

    const { email, password, name, role } = data;

    // 1. Create Auth account
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // 2. Add to Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    });

    return { success: true, uid: userRecord.uid };
  } catch (err) {
    console.error("Error creating user:", err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});

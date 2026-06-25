import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: cert("yourKey.json"),
  projectId: "yourProjectId",
});

const db = getFirestore();

async function cleanupReactions() {
  console.log("🚀 Starting reactions cleanup...");

  const usersSnap = await db.collection("users").get();
  const existingUserIds = new Set(usersSnap.docs.map((d) => d.id));

  console.log(`👤 Users loaded: ${existingUserIds.size}`);

  const reactionsSnap = await db.collection("reactions").get();

  console.log(`💬 Reactions loaded: ${reactionsSnap.size}`);

  const batch = db.batch();
  let count = 0;
  let deleted = 0;

  for (const doc of reactionsSnap.docs) {
    const data = doc.data();

    const authorId = data.authorId || data.userId;

    if (!existingUserIds.has(authorId)) {
      batch.delete(doc.ref);
      deleted++;
    }

    count++;

    if (count === 500) {
      await batch.commit();
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log(`✅ Done. Deleted reactions: ${deleted}`);
  process.exit(0);
}

cleanupReactions().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});

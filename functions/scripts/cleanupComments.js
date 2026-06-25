import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: cert("yourKey.json"),
  projectId: "yourProjectId",
});

const db = getFirestore();

async function cleanupComments() {
  console.log("🚀 Starting comments cleanup...");

  const usersSnap = await db.collection("users").get();
  const existingUserIds = new Set(usersSnap.docs.map((d) => d.id));

  console.log(`👤 Users loaded: ${existingUserIds.size}`);

  const commentsSnap = await db.collection("comments").get();

  console.log(`💬 Comments loaded: ${commentsSnap.size}`);

  const batch = db.batch();
  let count = 0;
  let deleted = 0;

  for (const doc of commentsSnap.docs) {
    const data = doc.data();

    const authorId = data.authorId;

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

  console.log(`✅ Done. Deleted comments: ${deleted}`);
  process.exit(0);
}

cleanupComments().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});

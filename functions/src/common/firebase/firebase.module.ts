import { Global, Module } from "@nestjs/common";

import { firebaseAppProvider } from "./providers/firebase.app.provider";
import { firestoreProvider } from "./providers/firestore.provider";
import { storageProvider } from "./providers/storage.provider";
import { authProvider } from "./providers/auth.provider";
import { AuthService } from "./auth/auth.service";
import { StorageService } from "./storage/storage.service";
import { FirestoreService } from "./firebase.service";

@Global()
@Module({
  providers: [
    firebaseAppProvider,
    firestoreProvider,
    authProvider,
    storageProvider,

    AuthService,
    StorageService,
    FirestoreService,
  ],
  exports: [
    firebaseAppProvider,
    firestoreProvider,
    authProvider,
    storageProvider,

    AuthService,
    StorageService,
    FirestoreService,
  ],
})
export class FirebaseModule {}

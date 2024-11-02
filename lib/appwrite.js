    import {
      Account,
      Avatars,
      Client,
      Databases,
      ID,
      Query,
      Storage,
    } from "react-native-appwrite";
    import AsyncStorage from "@react-native-async-storage/async-storage";
    // import { GoogleSignin } from '@react-native-google-signin/google-signin';

    export const appwriteConfig = {
      endpoint: "https://cloud.appwrite.io/v1",
      platform: "com.sm.vw",
      projectId: "66ffe26c0025c5738bd4",
      storageId: "6701faaf0037677d9e23",
      databaseId: "66ffe4150005f59598ce",
      userCollectionId: "66ffe43500225a404bba",
      goalsCollectionId: "66ffe4610020e327db57",
      progressCollectionId: "671f2bd40029bf9e907f",
      previousGoalsCollectionId: "671f400d00238a14bd8e"
    };

    // GoogleSignin.configure({
    //   webClientId: '728223927858-bi92vr4rf79om6lvvv2slaon2ibtq2cc.apps.googleusercontent.com', 
    // });

    const client = new Client();

    client
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId)
      .setPlatform(appwriteConfig.platform);

    const account = new Account(client);
    const storage = new Storage(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

    export default account;

    
    export async function createUser(email, password, username) {
      try {
        const newAccount = await account.create(
          ID.unique(),
          email,
          password,
          username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          ID.unique(),
          {
            accountId: newAccount.$id,
            email: email,
            username: username,
            avatar: avatarUrl,
          }
        );

        return newUser;
      } catch (error) {
        throw new Error(error);
      }
    }

    
    export async function signInWithGoogle() {
      try {
        
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.idToken;
    
        
        await account.createOAuth2Session('google', idToken);
    
        console.log('Logged in successfully!');
      } catch (error) {
        console.error('Login failed', error);
      }
    }

    
    export async function signIn(email, password) {
      try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
      } catch (error) {
        throw new Error(error);
      }
    }

    
    export async function getAccount() {
      try {
        const currentAccount = await account.get();

        return currentAccount;
      } catch (error) {
        throw new Error(error);
      }
    }

  
  export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;

        
        console.log("Current Account ID:", currentAccount.$id);

        
        const queryFilter = Query.equal("accountId", currentAccount.$id);
        console.log("Query filter:", queryFilter); 

        
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId
        );
        console.log("All users:", users); 

        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [queryFilter]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
  }



export async function signOut() {
  try {
    await account.deleteSession("current");
    await AsyncStorage.removeItem("authToken"); 

    return true;
  } catch (error) {
    console.error("Error during sign out:", error.message);
    throw new Error(error);
  }
} 

    
    export async function uploadFile(file, type) {
      if (!file) return;
      console.log("Uploading file:", file);
      const { mimeType, ...rest } = file;
      const asset = { type: mimeType, ...rest };

      try {
        const fileId = ID.unique();
        console.log(fileId)
        const uploadedFile = await storage.createFile(
          appwriteConfig.storageId,
          fileId,
          asset
        );
        return uploadedFile.$id;  
      } catch (error) {
        throw new Error(error);
      }
    }

    export async function getFilePreview(fileId, type) {
      let fileUrl;

      try {
        if (type === "image") {
          fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
          );
        } else {
          throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
      } catch (error) {
        throw new Error(error);
      }
    }

    export const createGoal = async ({ title, amount, uniqueID, category,description }) => {
      try {
        const currentUser = await getCurrentUser();
    
        if (!currentUser) {
          throw new Error("No user found. User might not be signed in.");
        }
    
        const accountId = currentUser.accountId || currentUser.$id;
    
        if (!accountId) {
          throw new Error("No account ID found. User might not be signed in.");
        }
    
        const data = {
          title: title,
          amount: parseInt(amount),
          description: description,
          uniqueID: parseInt(uniqueID),
          accountId: accountId, 
          category: category,
        };
    
        const response = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.goalsCollectionId,
          ID.unique(),
          data
        );
    
        console.log("Goal created successfully:", response);
        return response;
      } catch (error) {
        console.error("Error creating goal:", error);
        throw error;
      }
    };
    
    export const fetchProgress = async (goalId) => {
      try {
        const currentUser = await getCurrentUser();
        console.log(`Fetching progress for user: ${currentUser.$id} and goalId: ${goalId}`);
        
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.progressCollectionId,
          [Query.equal("goalId", goalId), Query.equal("accountId", currentUser.$id)]
        );
    
        return response.documents.length > 0 ? response.documents[0].amount : 0;
      } catch (error) {
        console.error("Failed to fetch progress:", error);
        throw error;
      }
    };
    
    
    export const createOrUpdateProgress = async (accountId, goalId, updatedProgress) => {
      try {
        const existingProgressDocuments = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.progressCollectionId,
          [
            Query.equal("accountId", accountId),
            Query.equal("goalId", goalId),
          ]
        );
    
        if (existingProgressDocuments.documents.length > 0) {
          
          const progressId = existingProgressDocuments.documents[0].$id;
          await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.progressCollectionId,
            progressId,
            { value: updatedProgress }
          );
        } else {
          
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.progressCollectionId,
            ID.unique(), 
            {
              accountId: accountId,
              goalId: goalId,
              value: updatedProgress,
            }
          );
        }
      } catch (error) {
        console.error("Failed to create or update progress:", error);
      }
    };
    
import { Client, Databases, ID, Query } from "react-native-appwrite";

// Get the details from env
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// Set up app write client
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

// Setting our database instance belonging to our appwrite client
const database = new Databases(client);

// Track the searches made by the  user
export const updateSearchCount = async (query: string, movie: Movie) => {
  // Check if  record of that search has already been stored
  // if a document is found increment the searchCount field
  // if no document found  ( that means it is a new search term)
     // create a new document is appwrite database -> initialise its count by 1
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);


      // Update the count if document present otherwise create the document
    if (result.documents.length > 0) {

      // Top movie which shows for the search term
      const existingMovie = result.documents[0];

      // Update the count
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        // what do we wanna change
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};


// Returns the trending movie so that we can show on the Home screen
export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      // Only gonna show top 5 movies
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    // This way TS will know exactly what we are returning
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

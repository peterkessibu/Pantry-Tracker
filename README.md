# Shelfsense

Shelfsense is an inventory management application that allows users to add, edit, remove, and sort inventory items. It also provides the ability to search through the inventory list and displays the total count of all items in the inventory.

## Features

- **Add Items:** Users can add items to the inventory with a specified name and quantity.
- **Edit Items:** Users can edit the name and quantity of items already in the inventory.
- **Remove Items:** Users can remove items from the inventory.
- **Sort Items:** Inventory items can be sorted alphabetically by name.
- **Search Items:** Users can search for specific items using the search bar.
- **Real-Time Updates:** The app provides real-time updates using Firebase Firestore.
- **Vercel Analytics:** The app integrates with Vercel Analytics to track user interactions.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Next.js**: React framework used for server-side rendering and routing.
- **Firebase Firestore**: NoSQL database used to store and retrieve inventory data in real-time.
- **Tailwind CSS**: Utility-first CSS framework for styling the UI.
- **Vercel Analytics**: Analytics platform for tracking user interactions.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/shelfsense.git
   cd shelfsense
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up Firebase:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Set up Firestore and configure your security rules.
   - Add your Firebase configuration to a `.env.local` file:
     ```bash
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The app should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

- Use the **Search** bar to filter through the items by name.
- Use the **Add New Item** button to add an item to the inventory.
- Use the **Sort Items** button to sort the items alphabetically.
- Click on the **+** and **-** buttons to adjust item quantities.
- Use the **Edit** button to modify item details.
- Use the **Remove** button to delete an item from the inventory.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```

Make sure to replace the Firebase configuration details with your actual values. Also, adjust the repository link, contributing instructions, and license section as necessary for your project.
```

# Supermarket Billing System (Praba Store)

A modern, real-time supermarket billing and inventory management system built with React and Firebase. This application provides a complete point-of-sale solution with inventory tracking, sales management, and administrative controls.


## ✨ Features

### 🛒 Billing & Sales
- **Real-time Cart Management**: Add, update, and remove items with live stock validation
- **Automatic Tax Calculation**: 18% tax applied to all transactions
- **Stock Validation**: Prevents overselling with real-time stock checks
- **Sale Processing**: Complete transaction processing with inventory updates
- **Receipt Generation**: Digital receipt with transaction details

### 📦 Inventory Management
- **Real-time Inventory**: Live updates across all connected devices
- **Stock Monitoring**: Visual indicators for low stock and out-of-stock items
- **Auto-initialization**: Automatic sample data setup for new installations
- **Product Search**: Quick product lookup and filtering

### 👨‍💼 Admin Panel
- **Product Management**: Add, edit, and delete products
- **Sales History**: View recent transactions and sales analytics
- **Stock Control**: Monitor and update inventory levels
- **Real-time Updates**: All changes sync instantly across devices

### 🔐 Authentication
- **Firebase Authentication**: Secure user login and session management
- **Protected Routes**: Admin features require authentication
- **Session Persistence**: Stay logged in across browser sessions

### 📱 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators and error handling
- **Real-time Updates**: Live data synchronization using Firebase
- **Intuitive Interface**: Clean, modern UI with Lucide React icons

## 🛠️ Technology Stack

- **Frontend**: React 19.2.3
- **Backend**: Firebase (Firestore Database, Authentication)
- **Icons**: Lucide React
- **Styling**: CSS3 with modern flexbox/grid layouts
- **Deployment**: GitHub Pages
- **Testing**: React Testing Library, Jest

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- Firebase project with Firestore and Authentication enabled

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrakashN1234/Supermarket-Billing.git
   cd Supermarket-Billing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Copy your Firebase config and update `src/firebase.js`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── AdminPanel.js    # Admin dashboard
│   ├── BillingTable.js  # Shopping cart and billing
│   ├── Header.js        # Navigation header
│   ├── InventorySidebar.js # Product inventory display
│   ├── Login.js         # Authentication component
│   └── LoadingSpinner.js # Loading indicator
├── contexts/
│   └── AuthContext.js   # Authentication context
├── services/
│   └── firebaseService.js # Firebase operations
├── utils/
│   ├── initializeData.js # Sample data setup
│   ├── setupAuth.js     # Authentication setup
│   └── testAuth.js      # Authentication testing
├── App.js              # Main application component
├── firebase.js         # Firebase configuration
└── index.js           # Application entry point
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run deploy` - Deploy to GitHub Pages

## 🔥 Firebase Setup

1. **Firestore Collections**:
   - `inventory` - Product data (name, price, stock)
   - `sales` - Transaction records
   - `users` - User authentication data

2. **Security Rules**: Configure Firestore rules for authenticated access

3. **Authentication**: Enable Email/Password authentication method

## 💡 Usage

### For Cashiers
1. **Login** with your credentials
2. **Browse Products** in the inventory sidebar
3. **Add Items** to cart by clicking on products
4. **Adjust Quantities** as needed
5. **Process Sale** to complete transaction

### For Administrators
1. **Access Admin Panel** from the header
2. **Manage Inventory**: Add, edit, or delete products
3. **View Sales History**: Monitor recent transactions
4. **Update Stock Levels**: Maintain accurate inventory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Prakash N**
- GitHub: [@PrakashN1234](https://github.com/PrakashN1234)

## 🙏 Acknowledgments

- Firebase for backend services
- Lucide React for beautiful icons
- React community for excellent documentation
- Create React App for project bootstrapping

---

**Built with ❤️ for modern retail management**
# SupermarketBilling
# Store-Billing
# Billing-System



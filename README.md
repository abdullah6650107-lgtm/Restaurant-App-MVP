# Restaurant App MVP

Frontend-only Restaurant Mobile Application developed using React Native and Expo.

## Student Information

Student Name: Muhammad Abdullah
Registration No: 9667
Department: BS Software Engineering (BSSE)
University: Abasyn University Islamabad
Semester: Fall 2026

## Assignment

Assignment No: 1
Assignment Title: Restaurant App MVP (Frontend Only)
Technology: React Native
Framework: Expo
Language: JavaScript

## Project Description

Restaurant App MVP is a frontend-only mobile application for a restaurant.

The application provides customer and restaurant manager functionality using React Native, Expo, React Hooks, Context API, useReducer, AsyncStorage, and local/mock data.

The application does not use a backend server or external API.

## Project Objectives

The main objectives of this project are:

- Build a functional restaurant mobile application.
- Implement Login and Signup screens.
- Display restaurant menu items.
- Implement food search and scrolling.
- Implement authentication and theme using Context API.
- Implement shopping cart functionality.
- Display order summary.
- Implement restaurant reservation.
- Implement order tracking.
- Implement manager dashboard.
- Demonstrate different React Hooks.
- Use local/mock data for the frontend.

## User Roles

The application contains two main user roles.

## Customer

The customer can:

- Login and Signup.
- Browse restaurant menu.
- Search food items.
- Browse food categories.
- Add food items to cart.
- Increase or decrease cart quantity.
- View cart.
- View order summary.
- Make a reservation.
- Track an order.

Restaurant Manager

The manager can:

- Login using manager credentials.
- Access the manager dashboard.
- View mock orders.
- View reservations.
- View restaurant-related information.

## Main Features

Login and Signup

The application provides:

- Email input.
- Password input.
- Full name input during signup.
- Confirm password.
- Customer/Manager role.
- Email validation.
- Password validation.
- Confirm password validation.
- Loading indicator.
- Error messages.
- Mock authentication.

## Restaurant Menu

The menu screen displays restaurant food items using local/mock data.

Each menu item can contain:

- Food name.
- Food category.
- Price.
- Description.
- Image.
- Add to Cart option.

## Search and Scroll

The application provides:

- Search food items.
- Filter menu items.
- Category browsing.
- Scrollable menu.
- FlatList for efficient list rendering.
- useRef for handling references/scrolling.
- useMemo for optimized filtering.
- useCallback for optimized functions.

## Authentication and Theme

The application uses Context API for global application data.

Authentication context is used for:

- Current user.
- Login state.
- Logout.
- User role.

Theme context is used for:

- Light theme.
- Dark theme.
- Theme switching.

## Shopping Cart

The cart functionality provides:

- Add food item.
- Remove food item.
- Increase quantity.
- Decrease quantity.
- Calculate subtotal.
- Display total items.
- Display total price.

The cart state is managed using "useReducer".

## Order Summary

The order summary screen displays:

- Selected food items.
- Item quantities.
- Item prices.
- Subtotal.
- Total amount.
- Order information.

"useMemo" can be used for calculated totals and "useCallback" for optimized action functions.

## Reservation

The reservation feature allows customers to enter reservation information.

The reservation can include:

- Customer name.
- Date.
- Time.
- Number of guests.
- Reservation confirmation.

## Order Tracking

The order tracking screen displays the current order status.

Example order statuses:

- Order Placed
- Preparing
- Ready
- Completed

Mock/local data is used because the application is frontend-only.

## Manager Dashboard

The manager dashboard provides a simple overview of restaurant information.

It can display:

- Total orders.
- Pending orders.
- Reservations.
- Completed orders.
- Restaurant information.

## React Hooks

The assignment demonstrates the following React Hooks:

Hook| Purpose
"useState"| Manage local component state
"useEffect"| Handle side effects
"useRef"| Handle references and scrolling
"useContext"| Access global context data
"useReducer"| Manage cart state
"useMemo"| Optimize calculated values
"useCallback"| Optimize functions
Custom Hooks| Reuse application logic

## Technologies Used

- React Native
- Expo
- JavaScript
- React Navigation
- React Hooks
- Context API
- AsyncStorage
- useReducer
- Local/Mock Data

## Project Structure

RestaurantApp/
│
├── A1/
│   ├── SRS.pdf
│   │
│   └── UML/
│       ├── Use Case Diagram
│       ├── Class Diagram
│       ├── Sequence Diagram
│       ├── Activity Diagram
│       └── Component Diagram
│
├── src/
│   ├── components/
│   │
│   ├── screens/
│   │
│   ├── context/
│   │
│   ├── reducers/
│   │
│   ├── hooks/
│   │
│   ├── data/
│   │
│   └── navigation/
│
├── screenshots/
│
├── App.js
├── package.json
└── README.md

## Installation

First clone the repository:

git clone https://github.com/abdullah6650107-lgtm/Restaurant-App.git

Open the project directory:

cd restaurant-app-mvp

## Install all dependencies:

npm install

Start the Expo development server:

npx expo start

Then open the application using Expo Go or an Android emulator.

Mock Credentials

Customer Login

Email:

customer@example.com

Password:

Customer123

Manager Login

Email:

manager@example.com

Password:

Manager123

## Application Screens

The application includes the following screens:

1. Login Screen
2. Signup Screen
3. Menu Screen
4. Search/Menu Screen
5. Cart Screen
6. Order Summary Screen
7. Reservation Screen
8. Order Tracking Screen
9. Manager Dashboard

## Navigation

React Navigation is used for navigation between application screens.

Main navigation flow:

Login
  |
  ├── Customer
  │     |
  │     ├── Menu
  │     ├── Search
  │     ├── Cart
  │     ├── Order Summary
  │     ├── Reservation
  │     └── Order Tracking
  │
  └── Manager
        |
        └── Manager Dashboard

## Local and Mock Data

The application uses local/mock data for demonstration.

Example mock data includes:

- Users
- Food items
- Categories
- Cart items
- Orders
- Reservations

No real restaurant database is connected.

## AsyncStorage

AsyncStorage is used for local storage where required.

It can be used to store application information such as:

- Login/session information.
- Theme preference.
- Local application data.

## SRS Document

The Software Requirements Specification document is included in:

## A1/SRS.pdf
## UML Diagrams

The project contains five required UML diagrams.

They are stored inside:

A1/UML/

The diagrams are:

1. Use Case Diagram
2. Class Diagram
3. Sequence Diagram
4. Activity Diagram
5. Component Diagram

Screenshots

Application screenshots should be placed inside:

screenshots/

Recommended screenshots:

screenshots/
├── login.png
├── signup.png
├── menu.png
├── search.png
├── cart.png
├── order-summary.png
├── reservation.png
├── order-tracking.png
└── manager-dashboard.png

## Demo Video

Add the project demonstration video link below:

Demo Video: PASTE_YOUR_VIDEO_LINK_HERE

GitHub Repository

## Repository:

git clone https://github.com/abdullah6650107-lgtm/Restaurant-App.git

## Git Commits

Meaningful commits should be created for the assignment tasks.

Example commit messages:

git commit -m "Q3 Implement Login and Signup"

git commit -m "Q4 Implement Restaurant Menu"

git commit -m "Q5 Implement Search and Scroll"

git commit -m "Q6 Implement Context and Theme"

git commit -m "Q7 Implement Shopping Cart"

git commit -m "Q8 Implement Order Summary and Performance"

git commit -m "Q9 Implement Restaurant Reservation"

git commit -m "Q10 Implement Order Tracking and Manager Dashboard"

Testing

The application should be tested for:

- Login validation.
- Signup validation.
- Customer authentication.
- Manager authentication.
- Menu display.
- Search functionality.
- Category scrolling.
- Add to cart.
- Remove from cart.
- Quantity changes.
- Order summary.
- Reservation form.
- Order tracking.
- Manager dashboard.
- Light/Dark theme.
- Navigation between screens.

Frontend Only

This project is strictly frontend-only.

The project does not use:

- Backend server.
- Database server.
- External API.
- Firebase.
- Redux.
- External state-management library.

All required demonstration data is handled using local/mock data and frontend storage.
Assignment Requirements Covered
The project covers the required assignment areas:
Q3  - Login / Signup
Q4  - Restaurant Menu
Q5  - Search / Scroll
Q6  - Authentication / Theme Context
Q7  - Shopping Cart
Q8  - Order Summary / Performance
Q9  - Reservation
Q10 - Order Tracking / Manager Dashboard

## Conclusion
Restaurant App MVP demonstrates a frontend restaurant application developed with React Native and Expo.
The project demonstrates React Hooks, Context API, useReducer, navigation, local/mock data, authentication UI, menu browsing, cart management, reservations, order tracking, and manager dashboard functionality.
## Author
Muhammad Abdullah
Registration No: 9667
BS Software Engineering
Abasyn University Islamabad

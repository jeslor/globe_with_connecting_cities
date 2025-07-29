# Interactive 3D Globe with Animated Flight Paths

A captivating React application that visualizes global connections with an interactive spinning 3D globe. Built with **React Three Fiber** and **Drei**, this project showcases smooth animations of flight paths between various cities around the world.

## Table of Contents

- [Interactive 3D Globe with Animated Flight Paths](#interactive-3d-globe-with-animated-flight-paths)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Demo](#demo)
  - [Technologies Used](#technologies-used)
  - [Setup and Installation](#setup-and-installation)
  - [Usage](#usage)

## Features

- **Interactive 3D Globe:** Spin, zoom, and pan around a high-resolution Earth texture using `OrbitControls` for a seamless user experience.
- **Dynamic Flight Paths:** Curved lines animate between a diverse set of global cities, simulating real-time connections.
- **Flight Lifecycle Management:** Each flight path grows into view, stays visible, and then elegantly fades out, replaced by new, randomly generated routes to maintain a continuous and engaging visual flow.
- **Performance Optimized:** Leverages React Three Fiber's declarative nature and Three.js best practices for efficient rendering and smooth animations, even with multiple concurrent flight path effects.
- **City Markers:** Clearly marked city points on the globe for easy identification and visual anchoring of the flight paths.
- **Responsive Design:** Adapts to different screen sizes, though interaction is best on larger screens.

## Demo

(Once deployed, you can add a link here)
You can view a live demo [here](https://globe-with-connecting-cities.vercel.app/) .

## Technologies Used

- **React**
- **React Three Fiber (`@react-three/fiber`)**: React renderer for Three.js.
- **Drei (`@react-three/drei`)**: A collection of useful helpers and abstractions for React Three Fiber.
- **Three.js**: The underlying 3D graphics library.
- **TypeScript**: For type safety and better code organization.
- **Vite** (or Create React App/Next.js if applicable): For project bundling and development server.

## Setup and Installation

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/jeslor/globe_with_connecting_cities.git
    cd globe_with_connecting_cities
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Prepare assets:**
    Ensure you have an `images/textures/earth.jpg` file in your `public` directory (or wherever your build system serves static assets). The current code expects it at `/images/textures/earth.jpg`. You can use a public domain earth texture or create your own.

    Example path: `public/images/textures/earth.jpg`

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application should now be running in your browser, typically at `http://localhost:5173` (Vite default) or `http://localhost:3000` (Create React App default).

## Usage

- **Spin the Globe:** Click and drag anywhere on the globe to rotate it and explore different regions.
- **Observe Flight Paths:** Watch as animated lines connect various cities, appearing, growing, and fading dynamically.
- **Zoom:** Use your mouse wheel (scroll) to zoom in and out of the globe.

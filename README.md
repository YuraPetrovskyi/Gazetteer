# Gazetteer

Gazetteer is a dynamic web application that provides detailed information about countries, cities, weather, news, and more. It integrates multiple APIs and visualizes data on an interactive map using Leaflet.js. This project is a showcase of web development skills, including frontend and backend integration, API consumption, and responsive UI design.

<p align="center">
  <img src="/images/screenshots/gazetteer2.jpg" alt="Application Screenshot" width="300"/>
  <img src="/images/screenshots/gazetteer3.jpg" alt="Application Screenshot" width="300"/>
  <img src="/images/screenshots/gazetteer4.jpg" alt="Application Screenshot" width="300"/>
  <img src="/images/screenshots/gazetteer5.jpg" alt="Application Screenshot" width="300"/>
  <img src="/images/screenshots/gazetteer6.jpg" alt="Application Screenshot" width="300"/>
</p>

## Features

### Core Functionality
- **Interactive Map**: Displays country borders, airports, administrative cities, and points of interest.
- **Weather Information**: Real-time weather updates and forecasts using OpenWeather API.
- **News Updates**: Fetches top news articles by category and displays them in a modal.
- **Currency Converter**: Provides real-time exchange rates and currency conversion.
- **Wikipedia Integration**: Displays information about the selected country from Wikipedia.
- **Responsive Design**: Ensures usability across different devices, including mobile and desktop.

### User Experience Enhancements
- **Preloader**: Indicates loading status during data retrieval.
- **Custom Icons**: Uses FontAwesome and Leaflet.ExtraMarkers for map markers.
- **Search Functionality**: Enables searching for countries and cities by name.
- **Modals for Details**: Presents additional information in clean, accessible modal windows.

## Technologies Used

### Frontend
- **HTML5**
- **CSS3** (with Bootstrap for styling)
- **JavaScript** (with jQuery for DOM manipulation)
- **Leaflet.js**: Map rendering and layer control.

### Backend
- **PHP**: Handles API requests and processes data.
- **cURL**: Fetches data from external APIs.

### APIs
- **OpenWeather API**: Weather data.
- **GeoNames API**: City and airport information.
- **News API**: Fetches news articles.
- **RestCountries API**: Country details.
- **Wikipedia API**: Fetches country summaries.

### Other Tools
- **Node.js** (for managing dependencies via npm)
- **Composer** (for PHP dependencies)
- **Moment.js**: Time formatting.
- **Numeral.js**: Number formatting.

## Skills Demonstrated
- API integration (RESTful APIs).
- Frontend and backend synchronization.
- Map rendering and clustering.
- Responsive UI design.
- Error handling and user notifications.
- Using environment variables for secure configuration.

## Installation and Setup

### Prerequisites
- **Web Server**: Apache or Nginx.
- **PHP**: Version 7.4 or higher.
- **Composer**: Dependency manager for PHP.
- **Node.js**: For managing frontend dependencies.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/YuraPetrovskyi/Gazetteer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Gazetteer
   ```
3. Install PHP dependencies:
   ```bash
   composer install
   ```
4. Install frontend dependencies:
   ```bash
   npm install
   ```
5. Create a `.env` file in the root directory and configure your environment variables:
   ```env
   ENVIRONMENT=development # development or production   
   OPENWEATHER_API_KEY=your_openweather_api_key
   EXCHANGE_RATES_API_KEY=your_openexchangerates_api_ke
   USERNAME_GEONAMES_API_KEY=your_geonames_username 
   NEWS_API_KEY=your_news_api_key   
   USER_EMAIL=your_email  # for CURLOPT_HTTPHEADER
   ```
6. Start the project:
   - For local development, place the project in your web server's root directory (e.g., `htdocs` for XAMPP).
   - Access the application in your browser at `http://localhost/Gazetteer`.

## Usage

- Select a country from the dropdown to view its details, borders, and cities.
- Click on the weather button to view real-time weather and forecasts.
- Use the news button to fetch and read top news articles.
- Open the Wikipedia modal for more information about the selected country.
- Use the currency converter to calculate exchange rates.

## Environment Variables

The `.env` file stores sensitive information and configuration settings:
- **`ENVIRONMENT`**: Set to `development` or `production`.
- **`OPENWEATHER_API_KEY`**: API key for the [OpenWeather API](https://api.openweathermap.org).
- **`EXCHANGE_RATES_API_KEY`**: API key for the [Openexchangerates API](https://openexchangerates.org/api).
- **`USERNAME_GEONAMES_API_KEY`**: Username for the [GeoNames API](http://api.geonames.org).
- **`NEWS_API_KEY`**: API key for the [News API](https://newsapi.org).
- **`USER_EMAIL`**: Your email.

### Why Use `.env`?
- Keeps sensitive data out of the codebase.
- Facilitates easy configuration for different environments.
- Enhances security by avoiding hardcoding keys in the code.

## Contact
For any questions or feedback, feel free to contact me at [yurakarpaty@gmail.com](mailto:yurakarpaty@gmail.com).

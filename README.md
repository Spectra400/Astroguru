# AstroGuru – Vedic Astrology Web Application

AstroGuru is a modern full-stack Vedic astrology web application that generates Kundli (birth charts) and Mahadasha timelines based on a user’s birth date, time, and location.

The application integrates an astrology calculation API and presents the results through an intuitive and interactive interface including Lagna charts, Nakshatra details, and Mahadasha timelines.

This project demonstrates a complete full-stack architecture with cloud deployment and secure authentication.

---

## Live Project

Live Application

https://astroguru-five.vercel.app

---

## Features

* Secure user authentication (Register / Login)
* Kundli generation using birth details
* Automatic Moon Sign detection
* Sun Sign calculation
* Nakshatra identification
* Lagna (D1) chart visualization
* Navamsha (D9) chart structure
* Mahadasha timeline generation
* Birth profile storage for repeated calculations
* Clean modern UI for astrology insights

---

## API Limitation (Important)

This project uses the Prokerala Astrology API free plan.

The free tier of the Prokerala API allows astrology calculations only for dates on January 01 of any year.

Example valid demo inputs:

```
01 January 1995
01 January 2000
01 January 2010
```

This restriction exists because of the API plan limitation, not because of the application logic.

If the paid Prokerala API plan is used, the application can generate astrology results for any date, month, or year without restriction.

---

## Tech Stack

Frontend

* React
* Vite
* Axios
* Modern CSS UI

Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication

Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Project Structure

```
Astroguru
│
├── backend
│   ├── controllers
│   ├── services
│   ├── routes
│   ├── models
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── context
│   │   └── api
│
└── README.md
```

---

## Environment Variables

Backend (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

PROKERALA_CLIENT_ID=your_client_id
PROKERALA_CLIENT_SECRET=your_client_secret

CORS_ORIGIN=your_frontend_domain
```

Frontend (.env.production)

```
VITE_API_URL=your_backend_api_url
```

---

## Running the Project Locally

Clone repository

```
git clone https://github.com/YOUR_USERNAME/Astroguru.git
cd Astroguru
```

Start Backend

```
cd backend
npm install
npm run dev
```

Start Frontend

```
cd frontend
npm install
npm run dev
```

---

## API Endpoints

Authentication

```
POST /api/v1/auth/register
POST /api/v1/auth/login
```

Kundli Generation

```
POST /api/v1/kundli
```

Mahadasha Calculation

```
POST /api/v1/mahadasha
```

---

## Future Improvements

Possible future enhancements include:

* Complete Navamsha (D9) chart calculation
* Advanced astrology predictions
* AI-based interpretation of Kundli results
* Downloadable PDF astrology reports
* Mobile-optimized UI
* Personalized horoscope dashboard

---

## Author

Dheeraj KB

Computer Science Engineer
Interested in Full-Stack Development, AI Systems, and Cybersecurity

---

## License

This project is open source and available under the MIT License.

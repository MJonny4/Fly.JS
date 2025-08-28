import sequelize from '../config/database'

// Import all models
import User from './User'
import Airline from './Airline'
import Airport from './Airport'
import Aircraft from './Aircraft'
import Flight from './Flight'
import Seat from './Seat'
import Meal from './Meal'
import Hotel from './Hotel'
import HotelRoom from './HotelRoom'
import CarRentalCompany from './CarRentalCompany'
import Car from './Car'
import Booking from './Booking'
import FlightBooking from './FlightBooking'
import MealBooking from './MealBooking'
import HotelBooking from './HotelBooking'
import CarRental from './CarRental'

// Define associations
// User associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' })
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Airline associations
Airline.hasMany(Flight, { foreignKey: 'airlineId', as: 'flights' })
Flight.belongsTo(Airline, { foreignKey: 'airlineId', as: 'airline' })

// Airport associations
Airport.hasMany(Flight, { foreignKey: 'departureAirportId', as: 'departingFlights' })
Airport.hasMany(Flight, { foreignKey: 'arrivalAirportId', as: 'arrivingFlights' })
Flight.belongsTo(Airport, { foreignKey: 'departureAirportId', as: 'departureAirport' })
Flight.belongsTo(Airport, { foreignKey: 'arrivalAirportId', as: 'arrivalAirport' })

// Aircraft associations
Aircraft.hasMany(Flight, { foreignKey: 'aircraftId', as: 'flights' })
Flight.belongsTo(Aircraft, { foreignKey: 'aircraftId', as: 'aircraft' })

// Flight and Seat associations
Flight.hasMany(Seat, { foreignKey: 'flightId', as: 'seats' })
Seat.belongsTo(Flight, { foreignKey: 'flightId', as: 'flight' })

// Hotel associations
Hotel.hasMany(HotelRoom, { foreignKey: 'hotelId', as: 'rooms' })
HotelRoom.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' })

// Car Rental Company associations
CarRentalCompany.hasMany(Car, { foreignKey: 'rentalCompanyId', as: 'cars' })
Car.belongsTo(CarRentalCompany, { foreignKey: 'rentalCompanyId', as: 'rentalCompany' })

// Booking associations
Booking.hasMany(FlightBooking, { foreignKey: 'bookingId', as: 'flightBookings' })
Booking.hasMany(HotelBooking, { foreignKey: 'bookingId', as: 'hotelBookings' })
Booking.hasMany(CarRental, { foreignKey: 'bookingId', as: 'carRentals' })

FlightBooking.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' })
HotelBooking.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' })
CarRental.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' })

// Flight booking associations
FlightBooking.belongsTo(Flight, { foreignKey: 'flightId', as: 'flight' })
FlightBooking.belongsTo(Seat, { foreignKey: 'seatId', as: 'seat' })
FlightBooking.hasMany(MealBooking, { foreignKey: 'flightBookingId', as: 'mealBookings' })

Flight.hasMany(FlightBooking, { foreignKey: 'flightId', as: 'flightBookings' })
Seat.hasMany(FlightBooking, { foreignKey: 'seatId', as: 'flightBookings' })

// Meal booking associations
MealBooking.belongsTo(FlightBooking, { foreignKey: 'flightBookingId', as: 'flightBooking' })
MealBooking.belongsTo(Meal, { foreignKey: 'mealId', as: 'meal' })
Meal.hasMany(MealBooking, { foreignKey: 'mealId', as: 'mealBookings' })

// Hotel booking associations
HotelBooking.belongsTo(HotelRoom, { foreignKey: 'hotelRoomId', as: 'hotelRoom' })
HotelRoom.hasMany(HotelBooking, { foreignKey: 'hotelRoomId', as: 'hotelBookings' })

// Car rental associations
CarRental.belongsTo(Car, { foreignKey: 'carId', as: 'car' })
Car.hasMany(CarRental, { foreignKey: 'carId', as: 'carRentals' })

export {
    sequelize,
    User,
    Airline,
    Airport,
    Aircraft,
    Flight,
    Seat,
    Meal,
    Hotel,
    HotelRoom,
    CarRentalCompany,
    Car,
    Booking,
    FlightBooking,
    MealBooking,
    HotelBooking,
    CarRental
}

export default {
    sequelize,
    User,
    Airline,
    Airport,
    Aircraft,
    Flight,
    Seat,
    Meal,
    Hotel,
    HotelRoom,
    CarRentalCompany,
    Car,
    Booking,
    FlightBooking,
    MealBooking,
    HotelBooking,
    CarRental
}
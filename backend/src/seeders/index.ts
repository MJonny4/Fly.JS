import { connectDatabase } from '../config/database'
import { logger } from '../utils/logger'
import {
    Airline,
    Airport,
    Aircraft,
    Flight,
    Seat,
    Meal,
    Hotel,
    HotelRoom,
    CarRentalCompany,
    Car
} from '../models'
import { v4 as uuidv4 } from 'uuid'

const seedAirlines = async () => {
    const airlines = [
        {
            id: uuidv4(),
            name: 'American Airlines',
            code: 'AA',
            country: 'United States',
            logoUrl: 'https://example.com/logos/aa.png'
        },
        {
            id: uuidv4(),
            name: 'Delta Air Lines',
            code: 'DL',
            country: 'United States',
            logoUrl: 'https://example.com/logos/delta.png'
        },
        {
            id: uuidv4(),
            name: 'United Airlines',
            code: 'UA',
            country: 'United States',
            logoUrl: 'https://example.com/logos/united.png'
        },
        {
            id: uuidv4(),
            name: 'British Airways',
            code: 'BA',
            country: 'United Kingdom',
            logoUrl: 'https://example.com/logos/ba.png'
        }
    ]

    await Airline.bulkCreate(airlines, { ignoreDuplicates: true })
    logger.success(`Seeded ${airlines.length} airlines`)
    return airlines
}

const seedAirports = async () => {
    const airports = [
        {
            id: uuidv4(),
            name: 'John F. Kennedy International Airport',
            code: 'JFK',
            city: 'New York',
            country: 'United States',
            timezone: 'America/New_York',
            latitude: 40.6413,
            longitude: -73.7781
        },
        {
            id: uuidv4(),
            name: 'Los Angeles International Airport',
            code: 'LAX',
            city: 'Los Angeles',
            country: 'United States',
            timezone: 'America/Los_Angeles',
            latitude: 33.9425,
            longitude: -118.4081
        },
        {
            id: uuidv4(),
            name: 'London Heathrow Airport',
            code: 'LHR',
            city: 'London',
            country: 'United Kingdom',
            timezone: 'Europe/London',
            latitude: 51.4700,
            longitude: -0.4543
        },
        {
            id: uuidv4(),
            name: 'Charles de Gaulle Airport',
            code: 'CDG',
            city: 'Paris',
            country: 'France',
            timezone: 'Europe/Paris',
            latitude: 49.0097,
            longitude: 2.5479
        },
        {
            id: uuidv4(),
            name: 'Tokyo Haneda Airport',
            code: 'HND',
            city: 'Tokyo',
            country: 'Japan',
            timezone: 'Asia/Tokyo',
            latitude: 35.5494,
            longitude: 139.7798
        }
    ]

    await Airport.bulkCreate(airports, { ignoreDuplicates: true })
    logger.success(`Seeded ${airports.length} airports`)
    return airports
}

const seedAircrafts = async () => {
    const aircrafts = [
        {
            id: uuidv4(),
            model: '737-800',
            manufacturer: 'Boeing',
            totalSeats: 160,
            firstClassSeats: 12,
            businessClassSeats: 20,
            economyClassSeats: 128
        },
        {
            id: uuidv4(),
            model: 'A320',
            manufacturer: 'Airbus',
            totalSeats: 150,
            firstClassSeats: 8,
            businessClassSeats: 24,
            economyClassSeats: 118
        },
        {
            id: uuidv4(),
            model: '777-300ER',
            manufacturer: 'Boeing',
            totalSeats: 350,
            firstClassSeats: 14,
            businessClassSeats: 42,
            economyClassSeats: 294
        },
        {
            id: uuidv4(),
            model: 'A350-900',
            manufacturer: 'Airbus',
            totalSeats: 325,
            firstClassSeats: 10,
            businessClassSeats: 38,
            economyClassSeats: 277
        }
    ]

    await Aircraft.bulkCreate(aircrafts, { ignoreDuplicates: true })
    logger.success(`Seeded ${aircrafts.length} aircrafts`)
    return aircrafts
}

const seedFlights = async (airlines: any[], airports: any[], aircrafts: any[]) => {
    const flights = []
    
    // Create some sample flights
    const flightData = [
        {
            flightNumber: 'AA101',
            airlineId: airlines[0].id,
            departureAirportId: airports[0].id, // JFK
            arrivalAirportId: airports[1].id, // LAX
            aircraftId: aircrafts[0].id,
            departureTime: new Date('2024-09-15T08:00:00Z'),
            arrivalTime: new Date('2024-09-15T11:30:00Z'),
            duration: 330,
            basePrice: 299.99,
            economyClassPrice: 299.99,
            businessClassPrice: 899.99,
            firstClassPrice: 1599.99,
            availableSeats: 150,
            status: 'scheduled' as 'scheduled',
            gate: 'A12'
        },
        {
            flightNumber: 'DL202',
            airlineId: airlines[1].id,
            departureAirportId: airports[1].id, // LAX
            arrivalAirportId: airports[2].id, // LHR
            aircraftId: aircrafts[2].id,
            departureTime: new Date('2024-09-16T14:00:00Z'),
            arrivalTime: new Date('2024-09-17T08:30:00Z'),
            duration: 650,
            basePrice: 799.99,
            economyClassPrice: 799.99,
            businessClassPrice: 2499.99,
            firstClassPrice: 4999.99,
            availableSeats: 340,
            status: 'scheduled' as 'scheduled',
            gate: 'B7'
        },
        {
            flightNumber: 'UA303',
            airlineId: airlines[2].id,
            departureAirportId: airports[0].id, // JFK
            arrivalAirportId: airports[3].id, // CDG
            aircraftId: aircrafts[1].id,
            departureTime: new Date('2024-09-17T20:15:00Z'),
            arrivalTime: new Date('2024-09-18T07:45:00Z'),
            duration: 450,
            basePrice: 599.99,
            economyClassPrice: 599.99,
            businessClassPrice: 1799.99,
            firstClassPrice: 3299.99,
            availableSeats: 140,
            status: 'scheduled' as 'scheduled',
            gate: 'C15'
        },
        {
            flightNumber: 'BA404',
            airlineId: airlines[3].id,
            departureAirportId: airports[2].id, // LHR
            arrivalAirportId: airports[4].id, // HND
            aircraftId: aircrafts[3].id,
            departureTime: new Date('2024-09-18T11:20:00Z'),
            arrivalTime: new Date('2024-09-19T06:50:00Z'),
            duration: 690,
            basePrice: 1099.99,
            economyClassPrice: 1099.99,
            businessClassPrice: 3599.99,
            firstClassPrice: 6999.99,
            availableSeats: 315,
            status: 'scheduled' as 'scheduled',
            gate: 'D22'
        }
    ]

    for (const flightInfo of flightData) {
        const flight = await Flight.create({
            id: uuidv4(),
            ...flightInfo
        })
        flights.push(flight)
    }

    logger.success(`Seeded ${flights.length} flights`)
    return flights
}

const seedSeats = async (flights: any[], aircrafts: any[]) => {
    const seats = []
    
    for (const flight of flights) {
        const aircraft = aircrafts.find(a => a.id === flight.aircraftId)
        
        // Generate seats for economy class
        for (let row = 1; row <= Math.ceil(aircraft.economyClassSeats / 6); row++) {
            const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F']
            for (let i = 0; i < 6 && seats.length < aircraft.economyClassSeats; i++) {
                seats.push({
                    id: uuidv4(),
                    flightId: flight.id,
                    seatNumber: `${row}${seatLetters[i]}`,
                    seatClass: 'economy' as 'economy',
                    isAvailable: true,
                    isWindowSeat: i === 0 || i === 5,
                    isAisleSeat: i === 2 || i === 3,
                    extraLegroom: row <= 5,
                    price: flight.economyClassPrice
                })
            }
        }
    }

    await Seat.bulkCreate(seats, { ignoreDuplicates: true })
    logger.success(`Seeded ${seats.length} seats`)
    return seats
}

const seedMeals = async () => {
    const meals = [
        {
            id: uuidv4(),
            name: 'Grilled Chicken with Rice',
            description: 'Tender grilled chicken breast served with jasmine rice and seasonal vegetables',
            type: 'regular' as 'regular',
            price: 25.99,
            imageUrl: 'https://example.com/meals/chicken-rice.jpg'
        },
        {
            id: uuidv4(),
            name: 'Vegetarian Pasta Primavera',
            description: 'Fresh pasta with seasonal vegetables in a light herb sauce',
            type: 'vegetarian' as 'vegetarian',
            price: 22.99,
            imageUrl: 'https://example.com/meals/pasta-primavera.jpg'
        },
        {
            id: uuidv4(),
            name: 'Vegan Buddha Bowl',
            description: 'Quinoa bowl with roasted vegetables, chickpeas, and tahini dressing',
            type: 'vegan' as 'vegan',
            price: 24.99,
            imageUrl: 'https://example.com/meals/buddha-bowl.jpg'
        },
        {
            id: uuidv4(),
            name: 'Kosher Beef Brisket',
            description: 'Slow-cooked kosher beef brisket with potato kugel and vegetables',
            type: 'kosher' as 'kosher',
            price: 32.99,
            imageUrl: 'https://example.com/meals/kosher-brisket.jpg'
        },
        {
            id: uuidv4(),
            name: 'Halal Lamb Curry',
            description: 'Traditional lamb curry with basmati rice and naan bread',
            type: 'halal' as 'halal',
            price: 29.99,
            imageUrl: 'https://example.com/meals/lamb-curry.jpg'
        },
        {
            id: uuidv4(),
            name: 'Gluten-Free Salmon',
            description: 'Grilled salmon with quinoa and steamed vegetables',
            type: 'gluten-free' as 'gluten-free',
            price: 34.99,
            imageUrl: 'https://example.com/meals/gf-salmon.jpg'
        }
    ]

    await Meal.bulkCreate(meals, { ignoreDuplicates: true })
    logger.success(`Seeded ${meals.length} meals`)
    return meals
}

const seedHotels = async () => {
    const hotels = [
        {
            id: uuidv4(),
            name: 'The Grand Plaza Hotel',
            description: 'Luxury hotel in the heart of downtown with world-class amenities',
            address: '123 Main Street',
            city: 'New York',
            country: 'United States',
            zipCode: '10001',
            rating: 4.8,
            amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Room Service', 'Concierge'],
            checkInTime: '15:00',
            checkOutTime: '11:00',
            latitude: 40.7589,
            longitude: -73.9851,
            imageUrls: ['https://example.com/hotels/grand-plaza-1.jpg', 'https://example.com/hotels/grand-plaza-2.jpg']
        },
        {
            id: uuidv4(),
            name: 'Seaside Resort & Spa',
            description: 'Beachfront resort with stunning ocean views and relaxation facilities',
            address: '456 Ocean Drive',
            city: 'Los Angeles',
            country: 'United States',
            zipCode: '90210',
            rating: 4.6,
            amenities: ['WiFi', 'Beach Access', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Tennis Court'],
            checkInTime: '16:00',
            checkOutTime: '12:00',
            latitude: 34.0522,
            longitude: -118.2437,
            imageUrls: ['https://example.com/hotels/seaside-1.jpg', 'https://example.com/hotels/seaside-2.jpg']
        },
        {
            id: uuidv4(),
            name: 'London City Hotel',
            description: 'Modern hotel in central London with easy access to major attractions',
            address: '789 Westminster Road',
            city: 'London',
            country: 'United Kingdom',
            zipCode: 'SW1A 1AA',
            rating: 4.4,
            amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Business Center', 'Laundry'],
            checkInTime: '14:00',
            checkOutTime: '11:00',
            latitude: 51.5074,
            longitude: -0.1278,
            imageUrls: ['https://example.com/hotels/london-city-1.jpg']
        },
        {
            id: uuidv4(),
            name: 'Paris Boutique Hotel',
            description: 'Charming boutique hotel near the Eiffel Tower with French elegance',
            address: '321 Rue de la Paix',
            city: 'Paris',
            country: 'France',
            zipCode: '75001',
            rating: 4.7,
            amenities: ['WiFi', 'Restaurant', 'Bar', 'Concierge', 'Room Service'],
            checkInTime: '15:00',
            checkOutTime: '12:00',
            latitude: 48.8566,
            longitude: 2.3522,
            imageUrls: ['https://example.com/hotels/paris-boutique-1.jpg', 'https://example.com/hotels/paris-boutique-2.jpg']
        }
    ]

    await Hotel.bulkCreate(hotels, { ignoreDuplicates: true })
    logger.success(`Seeded ${hotels.length} hotels`)
    return hotels
}

const seedHotelRooms = async (hotels: any[]) => {
    const rooms = []
    
    const roomTypes = [
        { type: 'Standard Room', basePrice: 129, capacity: 2, size: 25, bedType: 'Queen Bed' },
        { type: 'Deluxe Room', basePrice: 189, capacity: 2, size: 35, bedType: 'King Bed' },
        { type: 'Suite', basePrice: 349, capacity: 4, size: 65, bedType: 'King Bed + Sofa Bed' },
        { type: 'Executive Suite', basePrice: 599, capacity: 4, size: 85, bedType: 'King Bed + Living Area' }
    ]

    for (const hotel of hotels) {
        for (let floor = 1; floor <= 5; floor++) {
            for (let roomNum = 1; roomNum <= 10; roomNum++) {
                const roomTypeIndex = Math.floor(Math.random() * roomTypes.length)
                const roomType = roomTypes[roomTypeIndex]!
                
                rooms.push({
                    id: uuidv4(),
                    hotelId: hotel.id,
                    roomType: roomType.type,
                    roomNumber: `${floor}${roomNum.toString().padStart(2, '0')}`,
                    capacity: roomType.capacity,
                    pricePerNight: roomType.basePrice + (Math.random() * 50), // Add some price variation
                    description: `Comfortable ${roomType.type.toLowerCase()} with modern amenities`,
                    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Safe'],
                    size: roomType.size,
                    bedType: roomType.bedType,
                    isAvailable: true,
                    imageUrls: [`https://example.com/rooms/${roomType.type.toLowerCase().replace(' ', '-')}.jpg`]
                })
            }
        }
    }

    await HotelRoom.bulkCreate(rooms, { ignoreDuplicates: true })
    logger.success(`Seeded ${rooms.length} hotel rooms`)
    return rooms
}

const seedCarRentalCompanies = async () => {
    const companies = [
        {
            id: uuidv4(),
            name: 'Enterprise Rent-A-Car',
            description: 'Leading car rental company with locations worldwide',
            logoUrl: 'https://example.com/logos/enterprise.png',
            contactEmail: 'support@enterprise.com',
            contactPhone: '+1-800-RENT-CAR'
        },
        {
            id: uuidv4(),
            name: 'Hertz',
            description: 'Premium car rental services with luxury and economy options',
            logoUrl: 'https://example.com/logos/hertz.png',
            contactEmail: 'help@hertz.com',
            contactPhone: '+1-800-HERTZ-1'
        },
        {
            id: uuidv4(),
            name: 'Budget Car Rental',
            description: 'Affordable car rental solutions for budget-conscious travelers',
            logoUrl: 'https://example.com/logos/budget.png',
            contactEmail: 'service@budget.com',
            contactPhone: '+1-800-BUDGET'
        },
        {
            id: uuidv4(),
            name: 'Avis',
            description: 'Trusted car rental with premium service and wide vehicle selection',
            logoUrl: 'https://example.com/logos/avis.png',
            contactEmail: 'customercare@avis.com',
            contactPhone: '+1-800-AVIS-4U'
        }
    ]

    await CarRentalCompany.bulkCreate(companies, { ignoreDuplicates: true })
    logger.success(`Seeded ${companies.length} car rental companies`)
    return companies
}

const seedCars = async (companies: any[]) => {
    const cars = []
    
    const carData = [
        { make: 'Toyota', model: 'Corolla', category: 'economy' as const, price: 35, transmission: 'automatic' as const, fuelType: 'gasoline' as const, seats: 5, doors: 4 },
        { make: 'Nissan', model: 'Sentra', category: 'compact' as const, price: 42, transmission: 'automatic' as const, fuelType: 'gasoline' as const, seats: 5, doors: 4 },
        { make: 'Honda', model: 'Accord', category: 'intermediate' as const, price: 55, transmission: 'automatic' as const, fuelType: 'gasoline' as const, seats: 5, doors: 4 },
        { make: 'Toyota', model: 'Camry', category: 'standard' as const, price: 65, transmission: 'automatic' as const, fuelType: 'gasoline' as const, seats: 5, doors: 4 },
        { make: 'Chevrolet', model: 'Impala', category: 'full-size' as const, price: 75, transmission: 'automatic' as const, fuelType: 'gasoline' as const, seats: 5, doors: 4 },
        { make: 'BMW', model: '3 Series', category: 'premium' as const, price: 95, transmission: 'automatic' as const, fuelType: 'gasoline' as const, seats: 5, doors: 4 },
        { make: 'Mercedes-Benz', model: 'C-Class', category: 'luxury' as const, price: 120, transmission: 'automatic' as const, fuelType: 'gasoline' as const, seats: 5, doors: 4 },
        { make: 'Ford', model: 'Explorer', category: 'suv' as const, price: 85, transmission: 'automatic' as const, fuelType: 'gasoline' as const, seats: 7, doors: 4 },
        { make: 'BMW', model: 'Z4', category: 'convertible' as const, price: 150, transmission: 'automatic' as const, fuelType: 'gasoline' as const, seats: 2, doors: 2 }
    ]

    const colors = ['White', 'Black', 'Silver', 'Red', 'Blue', 'Gray']

    for (const company of companies) {
        for (const carInfo of carData) {
            for (let i = 0; i < 3; i++) { // 3 cars of each type per company
                cars.push({
                    id: uuidv4(),
                    rentalCompanyId: company.id,
                    make: carInfo.make,
                    model: carInfo.model,
                    year: 2022 + Math.floor(Math.random() * 3), // 2022-2024
                    category: carInfo.category,
                    transmission: carInfo.transmission,
                    fuelType: carInfo.fuelType,
                    seats: carInfo.seats,
                    doors: carInfo.doors,
                    airConditioning: true,
                    pricePerDay: carInfo.price + (Math.random() * 20), // Add price variation
                    mileage: Math.floor(Math.random() * 50000), // Random mileage
                    licensePlate: `${carInfo.make.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    isAvailable: true,
                    imageUrls: [`https://example.com/cars/${carInfo.make.toLowerCase()}-${carInfo.model.toLowerCase().replace(' ', '-')}.jpg`],
                    features: ['GPS', 'Bluetooth', 'USB Charging', 'Backup Camera']
                })
            }
        }
    }

    await Car.bulkCreate(cars, { ignoreDuplicates: true })
    logger.success(`Seeded ${cars.length} cars`)
    return cars
}

export const seedDatabase = async () => {
    try {
        logger.info('Starting database seeding...')
        
        // Seed in proper order due to foreign key constraints
        const airlines = await seedAirlines()
        const airports = await seedAirports()
        const aircrafts = await seedAircrafts()
        const flights = await seedFlights(airlines, airports, aircrafts)
        const seats = await seedSeats(flights, aircrafts)
        const meals = await seedMeals()
        const hotels = await seedHotels()
        const hotelRooms = await seedHotelRooms(hotels)
        const carCompanies = await seedCarRentalCompanies()
        const cars = await seedCars(carCompanies)
        
        logger.success('Database seeding completed successfully!')
        
        return {
            airlines: airlines.length,
            airports: airports.length,
            aircrafts: aircrafts.length,
            flights: flights.length,
            seats: seats.length,
            meals: meals.length,
            hotels: hotels.length,
            hotelRooms: hotelRooms.length,
            carCompanies: carCompanies.length,
            cars: cars.length
        }
    } catch (error) {
        logger.error('Database seeding failed', error as Error)
        throw error
    }
}

// Run seeder if called directly
if (require.main === module) {
    const runSeeder = async () => {
        await connectDatabase()
        await seedDatabase()
        process.exit(0)
    }
    
    runSeeder().catch((error) => {
        logger.error('Seeder execution failed', error)
        process.exit(1)
    })
}
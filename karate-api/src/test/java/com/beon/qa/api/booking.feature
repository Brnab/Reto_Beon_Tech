Feature: Part 1 - API Automation Challenge (Restful-Booker Lifecycle)

  Background:
    * url baseUrl
    * configure headers = { Accept: 'application/json', 'Content-Type': 'application/json' }

  Scenario: Automate the complete lifecycle of a booking by chaining API requests
    # 1. Authentication - Generate an auth token (/auth)
    Given path 'auth'
    And request { username: 'admin', password: 'password123' }
    When method post
    Then status 200
    And match response.token == '#notnull'
    * def authToken = response.token
    * print 'Generated Auth Token:', authToken

    # 2. Create Booking - POST /booking, Validate 200 OK, Extract bookingid
    * def initialBooking =
      """
      {
        "firstname": "Barbara",
        "lastname": "Gordon",
        "totalprice": 150,
        "depositpaid": true,
        "bookingdates": {
          "checkin": "2026-12-01",
          "checkout": "2026-12-05"
        },
        "additionalneeds": "Breakfast"
      }
      """
    Given path 'booking'
    And request initialBooking
    When method post
    Then status 200
    And match response.bookingid == '#number'
    And match response.booking == initialBooking
    * def bookingId = response.bookingid
    * print 'Extracted bookingid:', bookingId

    # 3. Read Booking - GET using extracted ID & Validate response data matches
    Given path 'booking', bookingId
    When method get
    Then status 200
    And match response == initialBooking

    # 4. Update Booking - PUT request (requires Auth Token in header), Update checkout date, Validate update
    * def updatedCheckoutDate = '2026-12-10'
    * def updatedBooking =
      """
      {
        "firstname": "#(initialBooking.firstname)",
        "lastname": "#(initialBooking.lastname)",
        "totalprice": #(initialBooking.totalprice),
        "depositpaid": #(initialBooking.depositpaid),
        "bookingdates": {
          "checkin": "#(initialBooking.bookingdates.checkin)",
          "checkout": "#(updatedCheckoutDate)"
        },
        "additionalneeds": "#(initialBooking.additionalneeds)"
      }
      """
    Given path 'booking', bookingId
    And header Cookie = 'token=' + authToken
    And request updatedBooking
    When method put
    Then status 200
    And match response.bookingdates.checkout == updatedCheckoutDate
    And match response == updatedBooking

    # 5. Delete Booking - DELETE request, Validate 201 Created, Confirm with GET -> 404 Not Found
    Given path 'booking', bookingId
    And header Cookie = 'token=' + authToken
    When method delete
    Then status 201

    Given path 'booking', bookingId
    When method get
    Then status 404
